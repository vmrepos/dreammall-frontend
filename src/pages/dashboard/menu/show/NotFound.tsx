import { Link } from "react-router-dom";

export const MenuNotFound = () => (
  <div className="mx-auto max-w-3xl text-center">
    <h1 className="text-2xl font-bold text-gray-900">Menú no encontrado</h1>
    <Link to="/menu" className="mt-4 inline-block text-brand hover:underline">
      Volver a menús
    </Link>
  </div>
)