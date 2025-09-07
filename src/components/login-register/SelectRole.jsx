export default function SelectRole({ value, onChange }) {
  return (
    <fieldset className="flex flex-col gap-2 mb-4">
      <legend className="font-semibold text-gray-700">Rol:</legend>
      <div className="flex gap-6">
        <label
          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition 
            ${value === "dueno" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-100"}`}
        >
          <input
            type="radio"
            name="rol"
            value="dueno"
            checked={value === "dueno"}
            onChange={onChange}
            className="hidden"
          />
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center 
              ${value === "dueno" ? "border-blue-500" : "border-gray-400"}`}
          >
            {value === "dueno" && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </span>
          Dueño
        </label>

        <label
          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition 
            ${value === "chofer" ? "border-blue-500 bg-green-50" : "border-gray-300 hover:bg-gray-100"}`}
        >
          <input
            type="radio"
            name="rol"
            value="chofer"
            checked={value === "chofer"}
            onChange={onChange}
            className="hidden"
          />
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center 
              ${value === "chofer" ? "border-blue-500" : "border-gray-400"}`}
          >
            {value === "chofer" && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </span>
          Chofer
        </label>
      </div>
    </fieldset>
  );
}

