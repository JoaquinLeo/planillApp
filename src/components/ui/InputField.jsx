export default function InputField({ label, type, id, value, onChange, ...props }) {
  return (
    <div className="mb-2 sm:mb-4">
      <label htmlFor={id} className="block mb-1 sm:mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id} 
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 p-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        {...props} 
      />
    </div>
  );
}
