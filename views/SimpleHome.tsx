import React, { useState } from "react";
import { useApp } from "../context/SimpleAppContext";
import { MOCK_PETS, MOCK_CAMPAIGNS } from "../constants/SimpleConstants";

const Home: React.FC = () => {
  const { dispatch, state } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtro simple
  const filteredPets = MOCK_PETS.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {/* Hero Section simplificado */}
      <div className="bg-gradient-to-br from-primary to-accent-teal p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-4">Mascotas SJ</h1>
          <p className="text-xl">Comunidad de Bienestar Animal</p>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => dispatch({ type: "SET_VIEW", payload: "home" })}
              className="bg-white text-primary px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Inicio
            </button>
            <button
              onClick={() =>
                dispatch({ type: "SET_VIEW", payload: "lost-pets" })
              }
              className="bg-white/80 text-primary px-6 py-3 rounded-full font-bold transition-all"
            >
              Mascotas perdidas
            </button>
            <button
              onClick={() =>
                dispatch({ type: "SET_VIEW", payload: "adoption" })
              }
              className="bg-white/80 text-primary px-6 py-3 rounded-full font-bold transition-all"
            >
              Adopciones
            </button>
            <button
              onClick={() =>
                dispatch({ type: "SET_VIEW", payload: "donations" })
              }
              className="bg-white/80 text-primary px-6 py-3 rounded-full font-bold transition-all"
            >
              Donaciones
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cards de mascotas */}
              {filteredPets.slice(0, 4).map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="aspect-video bg-gray-200 rounded-xl mb-4 overflow-hidden">
                    <img
                      src={pet.image}
                      className="w-full h-full object-cover"
                      alt={pet.name}
                    />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{pet.name}</h3>
                      <p className="text-sm text-gray-600">{pet.breed}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-bold ${
                        pet.status === "lost"
                          ? "bg-red-400 text-white"
                          : pet.status === "found"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                      }`}
                    >
                      {pet.status === "lost"
                        ? "PERDIDO"
                        : pet.status === "found"
                          ? "ENCONTRADO"
                          : "EN ADOPCIÓN"}
                    </span>
                  </div>

                  {pet.description && (
                    <p className="text-gray-600 mb-4 text-sm">
                      {pet.description}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (pet.status === "lost") {
                          dispatch({
                            type: "ADD_NOTIFICATION",
                            payload: {
                              type: "success",
                              message: `Gracias por reportar avistamiento de ${pet.name}.`,
                            },
                          });
                        } else {
                          dispatch({
                            type: "OPEN_MODAL",
                            payload: "petDetails",
                          });
                        }
                      }}
                      className={`flex-1 py-2 rounded-lg font-bold text-center transition-colors text-sm ${
                        pet.status === "lost"
                          ? "bg-red-400 text-white"
                          : pet.status === "found"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                      }`}
                    >
                      {pet.status === "lost"
                        ? "👀 Vi Reportar"
                        : "👁 Ver detalles"}
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      <span className="text-gray-600">🔄</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Botón para agregar mascota */}
              <div className="bg-primary/10 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-bold mb-3">
                  ¿Tienes una mascota que necesita ayuda?
                </h3>
                <button
                  onClick={() =>
                    dispatch({ type: "OPEN_MODAL", payload: "reportLostPet" })
                  }
                  className="bg-primary text-background-dark px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm w-full"
                >
                  🐾 Reportar mascota
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">🎯 Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    {filteredPets.length}
                  </span>
                  <span className="text-sm text-gray-600">
                    mascotas registradas
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-green-500">42</span>
                  <span className="text-sm text-gray-600">casos resueltos</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4">🎯 Enlaces Rápidos</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex justify-between items-center text-gray-600 hover:text-primary transition-colors"
                >
                  <span>📋 Voluntario</span>
                  <span>→</span>
                </a>
                <a
                  href="#"
                  className="flex justify-between items-center text-gray-600 hover:text-primary transition-colors"
                >
                  <span>🗺️ Mapa Veterinarios</span>
                  <span>→</span>
                </a>
                <a
                  href="#"
                  className="flex justify-between items-center text-gray-600 hover:text-primary transition-colors"
                >
                  <span>👥 Grupos Locales</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Home;

