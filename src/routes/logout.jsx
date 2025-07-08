import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function LogoutComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch(`${BASE_URL}/logout`, {
          method: "GET",
          credentials: "include", // very important to send cookies
        });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        setTimeout(() => navigate("/login"), 1000); // delay to show spinner
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <style>{`
        .spinner {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .double-bounce1, .double-bounce2 {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #333;
          opacity: 0.6;
          position: absolute;
          top: 0;
          left: 0;
          animation: sk-bounce 2.0s infinite ease-in-out;
        }

        .double-bounce2 {
          animation-delay: -1.0s;
        }

        @keyframes sk-bounce {
          0%, 100% {
            transform: scale(0.0);
          } 50% {
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  );
}
