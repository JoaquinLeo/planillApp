export default function AuthMoveLoginReg({
  label,
  linkText,
  linkHref,
}) {
  return (
    <>
      <p className="text-center text-sm text-gray-600 mt-4">
        {label}{" "}
        <a href={linkHref} className="font-medium text-blue-600 hover:underline">
          {linkText}
        </a>
      </p>
    </>
  );
}