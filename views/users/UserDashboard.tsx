import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Tab = "lost-pets" | "adoption" | "donations";

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("lost-pets");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "lost-pets", label: "Mascotas Perdidas", icon: "search" },
    { id: "adoption", label: "En Adopción", icon: "pets" },
    { id: "donations", label: "Donaciones", icon: "favorite" },
  ];

  return (
    <div className="min-h-screen bg-[#f1e4cc]">
      {/* Header */}
      <header className="bg-[#203553] text-[#ecdbbd] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#ecdbbd]/10 hover:bg-[#ecdbbd]/20 text-[#ecdbbd] font-medium text-sm transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver
            </button>
            <div>
              <h1 className="text-xl font-black">Mi Cuenta</h1>
              <p className="text-sm text-[#ecdbbd]/70">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 rounded-lg bg-[#ecdbbd]/10 hover:bg-[#ecdbbd]/20 text-[#ecdbbd] font-medium text-sm transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-[#203553]/95 border-b border-[#ecdbbd]/20">
        <div className="max-w-6xl mx-auto flex overflow-x-auto">
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={`/mi-cuenta/${tab.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#ecdbbd] border-b-2 border-[#ecdbbd] bg-[#ecdbbd]/5"
                    : "text-[#ecdbbd]/60 hover:text-[#ecdbbd] hover:bg-[#ecdbbd]/5"
                }`
              }
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
