export default function Titulo({ texto }) {
  return (
    <h2 className="text-2xl text-center font-bold text-black mb-4 border-b-2 border-gray-300 pb-2">
      {texto}
    </h2>
  );
}
