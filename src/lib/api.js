import { supabase } from "./supabaseClient";

// --- Funciones para Configuraciones ---

export async function getConfiguracion(duenoId) {
  const { data, error } = await supabase
    .from('configuraciones')
    .select('porcentaje_remisera')
    .eq('dueno_id', duenoId)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener la configuración:', error);
    throw error;
  }
  return data;
}

export async function getPlanillaAbiertaParaChofer(choferId) {
  const { data, error } = await supabase
    .rpc('get_planilla_abierta_para_chofer', { p_chofer_id: choferId });

  if (error) {
    console.error('Error al buscar planilla abierta para chofer:', error);
    throw error;
  }
  // La RPC devuelve un array, incluso si es un solo resultado o ninguno.
  return data.length > 0 ? data[0] : null;
}

export async function upsertConfiguracion(duenoId, porcentaje) {
    const { data: existingConfig, error: selectError } = await supabase
        .from('configuraciones')
        .select('id')
        .eq('dueno_id', duenoId)
        .maybeSingle();

    if (selectError) {
        console.error('Error al buscar configuración existente:', selectError);
        throw selectError;
    }

    const upsertData = {
        dueno_id: duenoId,
        porcentaje_remisera: porcentaje,
    };

    if (existingConfig) {
        upsertData.id = existingConfig.id;
    }

    const { data, error } = await supabase
        .from('configuraciones')
        .upsert(upsertData, { onConflict: 'dueno_id' })
        .select()
        .single();

    if (error) {
        console.error('Error al guardar la configuración:', error);
        throw error;
    }
    return data;
}


// --- Funciones para la creación/edición de Planillas ---

export async function getPlanillaAbierta(choferId, duenoId) {
  const { data, error } = await supabase
    .from("planillas")
    .select("*, viajes(*), gastos(*)")
    .eq("chofer_id", choferId)
    .eq("dueno_id", duenoId)
    .eq("estado", "abierta")
    .order("created_at", { foreignTable: "viajes", ascending: true })
    .order("created_at", { foreignTable: "gastos", ascending: true })
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // PGRST116 es 'no rows found', que es un caso esperado
    console.error("Error al obtener planilla abierta:", error);
    return null;
  }
  return data;
}

export async function createPlanilla(choferId, duenoId, fecha) {
  // Fetch porcentaje_remisera
  const { data: configuracionesData, error: configuracionesError } = await supabase
    .from("configuraciones")
    .select("porcentaje_remisera")
    .eq("dueno_id", duenoId)
    .single();

  if (configuracionesError && configuracionesError.code !== "PGRST116") {
    console.error("Error al obtener configuración de remisería:", configuracionesError);
    throw configuracionesError; // Propagar el error para que el llamador lo maneje
  }

  const porcentajeRemiseria = configuracionesData?.porcentaje_remisera ?? 20; // Default a 20 si no se encuentra

  const { data, error } = await supabase
    .from("planillas")
    .insert({
      chofer_id: choferId,
      dueno_id: duenoId,
      fecha: fecha,
      porcentaje_chofer: 0, // Valor inicial
      porcentaje_remisera: porcentajeRemiseria, // Añadido
      estado: "abierta",
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear planilla:", error);
    return null;
  }
  return data;
}

export async function updatePlanilla(planillaId, data) {
  let { viajes, gastos, porcentaje_chofer } = data;

  // Actualizar la planilla principal
  if (porcentaje_chofer === '' || isNaN(parseFloat(porcentaje_chofer))) {
    porcentaje_chofer = 0;
  }
  const { error: planillaError } = await supabase
    .from("planillas")
    .update({ porcentaje_chofer: porcentaje_chofer })
    .eq("id", planillaId);

  if (planillaError) {
    console.error("Error al actualizar planilla principal:", planillaError);
    return false;
  }

  // Sincronizar viajes
  const { data: existingViajes, error: fetchViajesError } = await supabase
    .from("viajes")
    .select("id")
    .eq("planilla_id", planillaId);

  if (fetchViajesError) {
    console.error("Error al obtener viajes existentes:", fetchViajesError);
    return false;
  }

  const existingViajeIds = existingViajes.map((v) => v.id);
  const currentViajeIds = viajes.filter((v) => v.id).map((v) => v.id);

  const toDeleteViajeIds = existingViajeIds.filter(
    (id) => !currentViajeIds.includes(id)
  );
  if (toDeleteViajeIds.length > 0) {
    const { error: deleteViajesError } = await supabase
      .from("viajes")
      .delete()
      .in("id", toDeleteViajeIds);
    if (deleteViajesError) {
      console.error("Error al eliminar viajes:", deleteViajesError);
      return false;
    }
  }

  const newViajes = viajes.filter(v => !v.id);
  const existingViajesToUpsert = viajes.filter(v => v.id).map((v) => ({
    planilla_id: planillaId,
    monto: (v.monto === '' || isNaN(parseFloat(v.monto))) ? 0 : parseFloat(v.monto),
    id: v.id
  }));

  if (newViajes.length > 0) {
    const { error: insertNewViajesError } = await supabase
      .from("viajes")
      .insert(newViajes.map(v => ({
        planilla_id: planillaId,
        monto: (v.monto === '' || isNaN(parseFloat(v.monto))) ? 0 : parseFloat(v.monto)
      })));

    if (insertNewViajesError) {
      console.error("Error al insertar nuevos viajes:", insertNewViajesError);
      return false;
    }
  }

  if (existingViajesToUpsert.length > 0) {
    const { error: upsertExistingViajesError } = await supabase
      .from("viajes")
      .upsert(existingViajesToUpsert, { onConflict: "id" });

    if (upsertExistingViajesError) {
      console.error("Error al actualizar viajes existentes:", upsertExistingViajesError);
      return false;
    }
  }

  // Sincronizar gastos (con la nueva lógica)
  const { data: existingGastos, error: fetchGastosError } = await supabase
    .from("gastos")
    .select("id")
    .eq("planilla_id", planillaId);

  if (fetchGastosError) {
    console.error("Error al obtener gastos existentes:", fetchGastosError);
    return false;
  }

  const existingGastoIds = existingGastos.map((g) => g.id);
  const currentGastoIds = gastos.filter((g) => g.id).map((g) => g.id);

  const toDeleteGastoIds = existingGastoIds.filter(
    (id) => !currentGastoIds.includes(id)
  );
  if (toDeleteGastoIds.length > 0) {
    const { error: deleteGastosError } = await supabase
      .from("gastos")
      .delete()
      .in("id", toDeleteGastoIds);
    if (deleteGastosError) {
      console.error("Error al eliminar gastos:", deleteGastosError);
      return false;
    }
  }

  const gastosProcessor = (g) => {
    const montoFinal = (g.monto === '' || isNaN(parseFloat(g.monto))) ? 0 : parseFloat(g.monto);
    return {
      ...g,
      planilla_id: planillaId,
      monto: montoFinal,
      descripcion: montoFinal === 0 ? 'sin gasto' : g.descripcion,
    };
  };

  const newGastosToInsert = gastos.filter(g => !g.id).map(gastosProcessor);
  const existingGastosToUpsert = gastos.filter(g => g.id).map(gastosProcessor);

  if (newGastosToInsert.length > 0) {
    const { error: insertNewGastosError } = await supabase
      .from("gastos")
      .insert(newGastosToInsert.map(({ id, ...rest }) => rest)); // Exclude client-side id

    if (insertNewGastosError) {
      console.error("Error al insertar nuevos gastos:", insertNewGastosError);
      return false;
    }
  }

  if (existingGastosToUpsert.length > 0) {
    const { error: upsertExistingGastosError } = await supabase
      .from("gastos")
      .upsert(existingGastosToUpsert, { onConflict: "id" });

    if (upsertExistingGastosError) {
      console.error("Error al insertar/actualizar gastos:", upsertExistingGastosError);
      return false;
    }
  }

  return true;
}

export async function closePlanilla(planillaId) {
  const { error } = await supabase
    .from("planillas")
    .update({ estado: "cerrada" })
    .eq("id", planillaId);

  if (error) {
    console.error("Error al cerrar planilla:", error);
    return false;
  }
  return true;
}

export async function archivePlanilla(planillaId) {
  const { error } = await supabase
    .from("planillas")
    .update({ estado: "borrada" })
    .eq("id", planillaId);

  if (error) {
    console.error("Error al archivar planilla:", error);
    return false;
  }
  return true;
}

// --- Funciones para el Historial de Planillas ---

export async function getPlanillasCerradasPorFecha(choferId, startDate, endDate) {
  const { data, error } = await supabase
    .from("planillas")
    .select("id, fecha, viajes(monto), gastos(descripcion, monto), porcentaje_chofer, dueno:dueno_id(nombre)")
    .eq("chofer_id", choferId)
    .eq("estado", "cerrada")
    .gte("fecha", startDate)
    .lte("fecha", endDate)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al obtener planillas cerradas:", error);
    return null;
  }
  return data;
}

export async function getPlanillasCerradasParaDueno(duenoId, choferId, startDate, endDate) {
  let query = supabase
    .from("planillas")
    .select(`
      id, fecha, porcentaje_remisera, porcentaje_chofer,
      chofer:chofer_id(id, nombre),
      dueno:dueno_id(id, nombre),
      viajes(*),
      gastos(*)
    `)
    .eq("dueno_id", duenoId)
    .eq("estado", "cerrada")
    .gte("fecha", startDate)
    .lte("fecha", endDate)
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });

  if (choferId && choferId !== 'Todos') {
    query = query.eq('chofer_id', choferId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener planillas cerradas para el dueño:", error);
    throw error;
  }
  return data;
}

export async function getRelaciones(usuarioId, estado){
  const { data, error } = await supabase
    .from("relaciones_dueno_chofer")
    // 1. El SELECT corregido:
    //    - con '*' traemos todos los campos de la relación (id, estado, etc.)
    //    - con 'chofer:chofer_id(nombre)' traemos el nombre del usuario en la columna chofer_id y lo ponemos en un objeto llamado 'chofer'
    //    - con 'dueno:dueno_id(nombre)' hacemos lo mismo para el dueño
    .select(`
        *,
        chofer:chofer_id(id, nombre, rol, email),
        dueno:dueno_id(id, nombre, rol, email)
    `)
    // 2. El FILTRO corregido:
    //    Usamos .or() para buscar en ambas columnas
    .or(`chofer_id.eq.${usuarioId},dueno_id.eq.${usuarioId}`)
    // 3. Y además, filtramos por el estado
    .eq("estado", estado);
    if (error) {
        console.error("Error al obtener relaciones:", error);
        throw error;
    }

    return data;
}

export async function updateRelacion(idRelacion, estado) {
  let updateData = { estado: estado };

  // Cuando una relación se acepta, rechaza o elimina, la acción específica sobre la relación ha terminado.
  if (estado === 'activa' || estado === 'rechazada' || estado === 'eliminada') {
    updateData.usuario_accion_id = null;
  }

  const { error } = await supabase
    .from("relaciones_dueno_chofer")
    .update(updateData)
    .eq("id", idRelacion);

  if (error) {
      console.error(`Error al actualizar relacion a ${estado}:`, error);
      throw error;
  }

  return true;
}

export async function deleteRelacion(idRelacion) {
  return updateRelacion(idRelacion, 'eliminada');
}

export async function createRelacion(solicitanteId, invitadoEmail, rolSolicitante) {
  // 1. Buscar al usuario invitado por su email
  const { data, error: errorInvitado } = await supabase
    .rpc('search_user_by_email', { p_email: invitadoEmail }); // Call the RPC

  // The RPC returns an array, so we need to get the first element if it exists
  const invitado = data && data.length > 0 ? data[0] : null;

  if (errorInvitado) { // Handle actual errors from RPC call
    console.error('Error al buscar usuario invitado:', errorInvitado);
    throw new Error('Error al buscar el usuario invitado.');
  }

  if (!invitado) { // Handle case where no user is found by RPC
    throw new Error('No se encontró ningún usuario con ese email.');
  }

  if (invitado.id === solicitanteId) {
    throw new Error('No podés invitarte a vos mismo.');
  }
  
  if (invitado.rol === rolSolicitante) {
    throw new Error(`No podés invitar a otro ${rolSolicitante}.`);
  }

  const choferId = rolSolicitante === 'chofer' ? solicitanteId : invitado.id;
  const duenoId = rolSolicitante === 'dueno' ? solicitanteId : invitado.id;

  // 2. Verificar si ya existe una relación (cualquier estado)
  const { data: relacionExistente, error: errorExistente } = await supabase
    .from('relaciones_dueno_chofer')
    .select('*') // Select all columns to check its state
    .or(`or(and(chofer_id.eq.${choferId},dueno_id.eq.${duenoId}),and(chofer_id.eq.${duenoId},dueno_id.eq.${choferId}))`)
    .maybeSingle();

  if (errorExistente) {
    console.error('Error al verificar relación existente:', errorExistente);
    throw new Error('Error al verificar si la relación ya existe.');
  }

  if (relacionExistente) {
    // Si la relación ya existe
    if (relacionExistente.estado === 'activa' || relacionExistente.estado === 'pendiente') {
      throw new Error('Ya existe una relación activa o pendiente con este usuario.');
    } else if (relacionExistente.estado === 'rechazada' || relacionExistente.estado === 'eliminada') {
      // Si la relación estaba rechazada o eliminada, la reactivamos
      const { data: updatedRelacion, error: updateError } = await supabase
        .from('relaciones_dueno_chofer')
        .update({
          estado: 'pendiente',
          usuario_accion_id: invitado.id // El invitado es quien debe actuar ahora
        })
        .eq('id', relacionExistente.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error al reactivar relación existente:', updateError);
        throw new Error('No se pudo reactivar la relación existente.');
      }
      return updatedRelacion;
    }
  }

  // 3. Si no existe ninguna relación, crear una nueva
  const { data: nuevaRelacion, error: errorCreacion } = await supabase
    .from('relaciones_dueno_chofer')
    .insert({
      chofer_id: choferId,
      dueno_id: duenoId,
      usuario_accion_id: invitado.id,
      estado: 'pendiente',
    })
    .select()
    .single();

  if (errorCreacion) {
    console.error('Error al crear la relación:', errorCreacion);
    throw new Error('No se pudo crear la invitación.');
  }

  return nuevaRelacion;
}