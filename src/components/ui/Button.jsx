import { twMerge } from 'tailwind-merge';

export default function Button({
  label,
  loading,
  onClick,
  disabled,
  className,
}) {
  const finalClassName = twMerge(
    'w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500 disabled:opacity-50',
    className
  );

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={finalClassName}
      >
        {loading ? `${label}...` : label}
      </button>
    </>
  );
}
