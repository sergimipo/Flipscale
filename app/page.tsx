import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 text-white">
      <h1 className="text-6xl font-extrabold mb-4 tracking-tight">Flipscale</h1>
      <p className="text-xl mb-10 text-purple-100">
        Potencia tus ventas en Vinted
      </p>

      <div className="flex gap-6">
        <Link
          href="/login"
          className="bg-white text-purple-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/register"
          className="bg-purple-900 text-white border border-purple-400 px-8 py-3 rounded-lg font-bold hover:bg-purple-800 transition shadow-lg"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
