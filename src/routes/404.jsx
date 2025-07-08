import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-purple-700 p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Page Not Found</p>
      <button
        onClick={() => navigate("/")}
        className="bg-purple-700 text-white px-6 py-3 rounded-2xl text-lg hover:bg-purple-800 transition"
      >
        Go Home
      </button>
    </div>
  );
}
