import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";


export default function SelectDueños({ selectedDueño, setSelectedDueño, id }) {
  const [dueños, setDueños] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    async function fetchDueños() {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id, nombre")
        .in(
            "id",
            (
            await supabase
                .from("relaciones_dueno_chofer")
                .select("dueno_id", { head: false })
                .eq("chofer_id", user.id)
                .eq("estado", "activa")
            ).data.map(rel => rel.dueno_id)
        );

      if (error) {
        console.log("Error al traer dueños:", error);
      } else {
        setDueños(data);
      }
    }

    fetchDueños();
  }, [user]);

  return (
    <select
        id={id}
        value={selectedDueño}
        onChange={(e) => setSelectedDueño(e.target.value)}
        className="border border-gray-300 shadow-md rounded px-2 py-2"
    >
    <option value="">Selecciona un dueño</option>
        {dueños.map((d) => (
            <option key={d.id} value={d.id}>
            {d.nombre}
            </option>
        ))}
    </select>
  );
}
