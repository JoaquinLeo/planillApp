const styles = {
  error: "bg-red-100 text-red-700 border-red-400",
  success: "bg-green-100 text-green-700 border-green-400",
  info: "bg-blue-100 text-blue-700 border-blue-400",
};

export default function AuthAlert({ type = "info", message }) {
  return (
    <div className={`mb-4 p-3 text-sm border rounded-lg ${styles[type]}`}>
      {message}
    </div>
  );
}