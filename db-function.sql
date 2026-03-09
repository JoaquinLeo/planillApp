CREATE OR REPLACE FUNCTION public.search_user_by_email(p_email text)
 RETURNS TABLE(id uuid, nombre text, rol text, email text) -- Añadido 'nombre text' aquí
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.nombre,
    u.rol,
    u.email
  FROM
    public.usuarios u
  WHERE
    u.email = p_email;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_user_by_email(text) TO authenticated;

SELECT * FROM public.search_user_by_email('martin@gmail.com');

CREATE OR REPLACE FUNCTION public.get_planilla_abierta_para_chofer(p_chofer_id uuid)
 RETURNS TABLE(id uuid, dueno_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.dueno_id
  FROM
    public.planillas p
  WHERE
    p.chofer_id = p_chofer_id AND p.estado = 'abierta'
  LIMIT 1;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_planilla_abierta_para_chofer(uuid) TO authenticated;
