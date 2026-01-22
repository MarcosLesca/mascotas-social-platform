import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { PublicationForm } from "@/components/forms/PublicationForm";

export default function PublicarPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nueva Publicación
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Publica sobre una mascota perdida, en adopción o solicita donaciones
          </p>
        </div>

        <PublicationForm />
      </main>

      <Footer />
    </div>
  );
}