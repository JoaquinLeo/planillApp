export default function InputFecha({ label, value, onChange, id }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="date"
        id={id}
        value={value}
        onChange={handleChange}
        className="border border-gray-300 shadow-md rounded px-2 py-2"
      />
    </div>
  );
}