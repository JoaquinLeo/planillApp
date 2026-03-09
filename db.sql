--------------------------------------------------
-- TABLA DE USUARIOS
--------------------------------------------------
CREATE TABLE usuarios (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre text NOT NULL,
    rol text CHECK (rol IN ('dueno','chofer')) NOT NULL,
    created_at timestamp DEFAULT now()
);

--------------------------------------------------
-- TABLA DE CONFIGURACIONES DE DUEÑO
--------------------------------------------------
CREATE TABLE configuraciones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dueno_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
    porcentaje_remisera numeric(5,2) NOT NULL,
    created_at timestamp DEFAULT now()
);

--------------------------------------------------
-- TABLA DE PLANILLAS
-- Se agrega fecha (solo día) y dueno_id sigue NOT NULL
--------------------------------------------------
CREATE TABLE planillas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chofer_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
    dueno_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha date NOT NULL,
    porcentaje_chofer numeric(5,2) NOT NULL,
    porcentaje_remisera numeric(5,2) NOT NULL,
    estado text CHECK (estado IN ('abierta','cerrada')) DEFAULT 'abierta',
    created_at timestamp DEFAULT now()
);

--------------------------------------------------
-- TABLA DE VIAJES
--------------------------------------------------
CREATE TABLE viajes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    planilla_id uuid REFERENCES planillas(id) ON DELETE CASCADE,
    monto numeric(12,2) NOT NULL,
    created_at timestamp DEFAULT now()
);

--------------------------------------------------
-- TABLA DE GASTOS
--------------------------------------------------
CREATE TABLE gastos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    planilla_id uuid REFERENCES planillas(id) ON DELETE CASCADE,
    descripcion text NOT NULL,
    monto numeric(12,2) NOT NULL,
    created_at timestamp DEFAULT now()
);

--------------------------------------------------
-- TABLA NUEVA: RELACIONES DUEÑO-CHOFER
--------------------------------------------------
CREATE TABLE relaciones_dueno_chofer (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dueno_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
    chofer_id uuid REFERENCES usuarios(id) ON DELETE CASCADE,
    estado text CHECK (estado IN ('pendiente','aceptada','rechazada')) DEFAULT 'pendiente',
    quien_envia text CHECK (quien_envia IN ('dueno','chofer')) NOT NULL,
    created_at timestamp DEFAULT now(),
    UNIQUE(dueno_id, chofer_id)
);

--------------------------------------------------
-- HABILITAR RLS
--------------------------------------------------
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE planillas ENABLE ROW LEVEL SECURITY;
ALTER TABLE viajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE relaciones_dueno_chofer ENABLE ROW LEVEL SECURITY;

--------------------------------------------------
-- POLÍTICAS USUARIOS
--------------------------------------------------
CREATE POLICY "cada usuario ve solo su perfil"
ON usuarios
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "cada usuario modifica solo su perfil"
ON usuarios
FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "usuarios pueden insertarse a sí mismos"
ON usuarios
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

--------------------------------------------------
-- POLÍTICAS CONFIGURACIONES
--------------------------------------------------
CREATE POLICY "dueño ve su configuración"
ON configuraciones
FOR SELECT
USING (dueno_id = auth.uid());

CREATE POLICY "dueño modifica su configuración"
ON configuraciones
FOR UPDATE
USING (dueno_id = auth.uid());

CREATE POLICY "dueño crea su configuración"
ON configuraciones
FOR INSERT
WITH CHECK (dueno_id = auth.uid());

--------------------------------------------------
-- POLÍTICAS PLANILLAS
--------------------------------------------------
-- Chofer ve solo sus planillas
CREATE POLICY "chofer ve sus planillas"
ON planillas
FOR SELECT
USING (chofer_id = auth.uid());

-- Dueño ve solo las planillas creadas para él
CREATE POLICY "dueño ve sus planillas"
ON planillas
FOR SELECT
USING (dueno_id = auth.uid());

-- Chofer crea planilla solo para sí mismo (dueno_id se valida en la app)
CREATE POLICY "chofer crea planilla"
ON planillas
FOR INSERT
WITH CHECK (chofer_id = auth.uid());

-- Chofer actualiza solo sus planillas
CREATE POLICY "chofer modifica sus planillas"
ON planillas
FOR UPDATE
USING (chofer_id = auth.uid());

--------------------------------------------------
-- POLÍTICAS VIAJES
--------------------------------------------------
CREATE POLICY "chofer ve viajes de sus planillas"
ON viajes
FOR SELECT
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

CREATE POLICY "chofer agrega viajes"
ON viajes
FOR INSERT
WITH CHECK (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

CREATE POLICY "chofer modifica viajes"
ON viajes
FOR UPDATE
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

CREATE POLICY "chofer elimina viajes"
ON viajes
FOR DELETE
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

--------------------------------------------------
-- POLÍTICAS GASTOS
--------------------------------------------------
CREATE POLICY "chofer ve gastos de sus planillas"
ON gastos
FOR SELECT
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

CREATE POLICY "chofer agrega gastos"
ON gastos
FOR INSERT
WITH CHECK (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

CREATE POLICY "chofer modifica gastos"
ON gastos
FOR UPDATE
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

CREATE POLICY "chofer elimina gastos"
ON gastos
FOR DELETE
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

--------------------------------------------------
-- POLÍTICAS GASTOS
--------------------------------------------------
CREATE POLICY "chofer ve gastos de sus planillas"
ON gastos
FOR SELECT
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

CREATE POLICY "chofer agrega gastos"
ON gastos
FOR INSERT
WITH CHECK (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

CREATE POLICY "chofer modifica gastos"
ON gastos
FOR UPDATE
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

--------------------------------------------------
-- POLÍTICAS RELACIONES DUEÑO-CHOFER
--------------------------------------------------
-- Ver sus relaciones (chofer o dueño)
CREATE POLICY "usuario ve sus relaciones"
ON relaciones_dueno_chofer
FOR SELECT
USING (dueno_id = auth.uid() OR chofer_id = auth.uid());

-- Insertar solicitud solo para sí mismo como remitente
CREATE POLICY "usuario crea solicitud de relación"
ON relaciones_dueno_chofer
FOR INSERT
WITH CHECK ( (dueno_id = auth.uid() AND quien_envia = 'dueno') OR 
             (chofer_id = auth.uid() AND quien_envia = 'chofer') );

-- Actualizar estado solo si eres el receptor
CREATE POLICY "usuario actualiza solicitud recibida"
ON relaciones_dueno_chofer
FOR UPDATE
USING ( (dueno_id = auth.uid() AND quien_envia = 'chofer') OR 
        (chofer_id = auth.uid() AND quien_envia = 'dueno') )
WITH CHECK (estado IN ('aceptada','rechazada'));


-- Chofer puede ver los datos de sus dueños
CREATE POLICY "chofer ve datos de su dueño"
ON usuarios
FOR SELECT
USING (
  id IN (
    SELECT dueno_id
    FROM relaciones_dueno_chofer
    WHERE chofer_id = auth.uid() AND estado = 'aceptada'
  )
);

-- Chofer puede ver los datos de sus dueños
CREATE POLICY "chofer ve configuraciones de su dueño"
ON configuraciones
FOR SELECT
USING (
  dueno_id IN (
    SELECT dueno_id
    FROM relaciones_dueno_chofer
    WHERE chofer_id = auth.uid() AND estado = 'aceptada'
  )
);

-- Chofer elimina viajes
CREATE POLICY "chofer elimina viajes"
ON viajes
FOR DELETE
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);

-- Chofer elimina gastos
CREATE POLICY "chofer elimina gastos"
ON gastos
FOR DELETE
USING (
  planilla_id IN (
    SELECT id FROM planillas WHERE chofer_id = auth.uid()
  )
);


-- Agregando un estado en la tabla planillas
ALTER TABLE planillas
DROP CONSTRAINT planillas_estado_check,
ADD CONSTRAINT planillas_estado_check CHECK (estado IN ('abierta', 'cerrada', 'borrada'));

-- Agregando un estado en la tabla relaciones_dueno_chofer
ALTER TABLE relaciones_dueno_chofer
DROP CONSTRAINT relaciones_dueno_chofer_estado_check,
ADD CONSTRAINT relaciones_dueno_chofer_estado_check CHECK (estado IN ('pendiente', 'activa', 'rechazada', 'eliminada'));


-- Eliminar las políticas de seguridad antiguas que dependen de la columna 'quien_envia'
DROP POLICY IF EXISTS "usuario crea solicitud de relación" ON public.relaciones_dueno_chofer;
DROP POLICY IF EXISTS "usuario actualiza solicitud recibida" ON public.relaciones_dueno_chofer;

-- Eliminar columna quien_envia
ALTER TABLE public.relaciones_dueno_chofer
DROP COLUMN IF EXISTS quien_envia;

-- Agregar columna usuario_accion_id
ALTER TABLE public.relaciones_dueno_chofer
ADD COLUMN IF NOT EXISTS usuario_accion_id UUID REFERENCES public.usuarios(id);

-- Volver a crear las políticas de seguridad
CREATE POLICY "usuario crea solicitud de relación"
ON public.relaciones_dueno_chofer
FOR INSERT
WITH CHECK ( dueno_id = auth.uid() OR chofer_id = auth.uid() );

CREATE POLICY "usuario actualiza solicitud recibida"
ON public.relaciones_dueno_chofer
FOR UPDATE
USING ( usuario_accion_id = auth.uid() );

-- Eliminar la política antigua que usa 'aceptada'
DROP POLICY "chofer ve datos de su dueño" ON public.usuarios;

-- Volver a crear la política con el estado 'activa'
CREATE POLICY "chofer ve datos de su dueño"
ON public.usuarios
FOR SELECT
USING (
  id IN (
    SELECT dueno_id
    FROM public.relaciones_dueno_chofer
    WHERE chofer_id = auth.uid() AND estado = 'activa'
  )
);

-- dueño ve datos de sus choferes
CREATE POLICY "dueño ve datos de sus choferes"
ON public.usuarios
FOR SELECT
USING (
  id IN (
    SELECT chofer_id
    FROM public.relaciones_dueno_chofer
    WHERE dueno_id = auth.uid() AND estado = 'activa'
  )
);

-- Agregar columna email
ALTER TABLE public.usuarios
ADD COLUMN IF NOT EXISTS email text;

ALTER TABLE public.usuarios
ALTER COLUMN email SET NOT NULL;

-- Ambos roles pueden cambiar el estado de una relacion a eliminada
CREATE POLICY "participante puede eliminar relacion activa"
ON public.relaciones_dueno_chofer
FOR UPDATE
USING ( chofer_id = auth.uid() OR dueno_id = auth.uid() )
WITH CHECK ( estado = 'eliminada' );

-- Eliminar la política chofer ve datos de su dueño para mejorarla
DROP POLICY "chofer ve datos de su dueño" ON public.usuarios;

-- Crear la nueva política que permite ver dueños de relaciones activas O eliminadas
CREATE POLICY "chofer ve datos de su dueño"
ON public.usuarios
FOR SELECT
USING (
  id IN (
    SELECT dueno_id
    FROM public.relaciones_dueno_chofer
    WHERE chofer_id = auth.uid() AND estado IN ('activa', 'eliminada', 'pendiente','rechazada')
  )
);

-- Eliminar la política dueño ve datos de sus choferes para mejorarla
DROP POLICY "dueño ve datos de sus choferes" ON public.usuarios;

CREATE POLICY "dueño ve datos de sus choferes"
ON public.usuarios
FOR SELECT
USING (
  id IN (
    SELECT chofer_id
    FROM public.relaciones_dueno_chofer
    WHERE dueno_id = auth.uid() AND estado IN ('activa', 'eliminada', 'pendiente','rechazada')
  )
);

-- Eliminando para mejorar participante puede eliminar relacion activa
DROP POLICY "participante puede eliminar relacion activa" ON public.relaciones_dueno_chofer;

-- Creando nuevamente participante puede eliminar relacion activa
CREATE POLICY "participante puede eliminar relacion activa"
ON public.relaciones_dueno_chofer
FOR UPDATE
USING ( (chofer_id = auth.uid() OR dueno_id = auth.uid()) AND estado = 'activa' )
WITH CHECK ( estado = 'eliminada' );


-- Eliminando para mejorar usuario actualiza solicitud recibida
DROP POLICY "usuario actualiza solicitud recibida" ON public.relaciones_dueno_chofer;

--  Creando nuevamente usuario actualiza solicitud recibida
CREATE POLICY "usuario actualiza solicitud recibida"
ON public.relaciones_dueno_chofer
FOR UPDATE
USING ( usuario_accion_id = auth.uid() )
WITH CHECK ( estado IN ('activa', 'rechazada') );

-- participante puede cancelar invitacion pendiente
CREATE POLICY "participante puede cancelar invitacion pendiente"
ON public.relaciones_dueno_chofer
FOR UPDATE
USING ( (chofer_id = auth.uid() OR dueno_id = auth.uid()) AND estado = 'pendiente' )
WITH CHECK ( estado = 'eliminada' );

-- Cambiando configuracion para que cada dueño solo pueda tener una configuracion
ALTER TABLE configuraciones
ADD CONSTRAINT configuraciones_dueno_id_key UNIQUE (dueno_id);


-- Agregar politica dueño ve viajes de sus choferes
CREATE POLICY "Dueño ve viajes de sus choferes"
ON public.viajes
FOR SELECT
USING (
  auth.uid() IN (
    SELECT dueno_id
    FROM planillas
    WHERE id = viajes.planilla_id
  )
);

-- Agregar politica dueño ve gastos de sus choferes
CREATE POLICY "Dueño ve gastos de sus choferes"
ON public.gastos
FOR SELECT
USING (
  auth.uid() IN (
    SELECT dueno_id
    FROM planillas
    WHERE id = gastos.planilla_id
  )
);

-- Permitir a los nuevos usuarios realizar insert
CREATE POLICY "Permitir a los nuevos usuarios realizar insert"
ON public.usuarios
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Permitir a usuarios anónimos insertar en usuarios
CREATE POLICY "Permitir a usuarios anónimos insertar en usuarios"
ON public.usuarios
FOR INSERT
TO anon
WITH CHECK (true);