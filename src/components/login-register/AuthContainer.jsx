export default function AuthContainer({ title, children }) {
  return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-gray-200 p-3 sm:p-6 rounded-2xl shadow-md border border-gray-400 w-9/12 sm:w-1/3">
            <h2 className="text-2xl font-bold mb-2 sm:mb-4">{title}</h2>
              {children}
          </div>
        </div>
  );
}