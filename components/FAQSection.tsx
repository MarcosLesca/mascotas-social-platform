import React, { useState } from "react";

// Componente para renderizar respuestas con HTML
const FAQAnswer: React.FC<{ content: string }> = ({ content }) => {
  // Función para renderizar listas con formato 1) 2) 3)
  const renderCustomList = (items: string[], startNumber: number = 1) => {
    return (
      <ol className="space-y-2" style={{ listStyle: "none", paddingLeft: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              position: "relative",
              paddingLeft: "2rem",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                color: "#13ec5b",
                fontWeight: "bold",
              }}
            >
              {startNumber + index})
            </span>
            {item}
          </li>
        ))}
      </ol>
    );
  };

  // Respuesta específica sobre cómo reportar mascota perdida
  if (content.includes("Reportar Mascota Perdida")) {
    return (
      <div className="text-black leading-relaxed pt-[8px]">
        <p className="mb-3">Es muy fácil:</p>
        {renderCustomList([
          'Hacé clic en el botón "Reportar Mascota Perdida"',
          "Completá los datos de tu mascota",
          "Subí una foto clara",
          "Indicá dónde y cuándo se perdió",
          "Dejá tus datos de contacto",
        ])}
        <p className="mt-3">¡Y listo! Tu publicación quedará activa.</p>
      </div>
    );
  }

  // Respuesta sobre qué hacer si veo una mascota perdida
  if (content.includes("Mascotas Encontradas")) {
    return (
      <div className="text-black leading-relaxed pt-[8px]">
        <p className="mb-3">¡Gracias por ayudar! Podés:</p>
        {renderCustomList([
          "Tomar una foto",
          'Publicar en la sección "Mascotas Encontradas"',
          "Indicar el lugar donde la viste",
          "Dejar contacto",
        ])}
        <p className="mt-3">
          O directamente contactar al dueño si ves un reporte que coincide.
        </p>
      </div>
    );
  }

  // Respuesta sobre cómo adoptar
  if (content.includes("Contactá directamente al refugio")) {
    return (
      <div className="text-black leading-relaxed pt-[8px]">
        {renderCustomList([
          'Buscá en la sección "Adopción"',
          "Contactá directamente al refugio/responsable vía WhatsApp o Email",
          "Visita la mascota",
          "Completá los requisitos del refugio",
          "¡Lleva a tu nuevo amigo a casa!",
        ])}
      </div>
    );
  }

  // Respuesta sobre cómo donar
  if (content.includes("Entrá a la campaña que querés apoyar")) {
    return (
      <div className="text-black leading-relaxed pt-[8px]">
        <p className="mb-3">Es muy fácil:</p>
        {renderCustomList([
          "Entrá a la campaña que querés apoyar",
          "Elegí el monto",
          "Seleccioná el método de pago",
          "Completá tus datos",
        ])}
        <p className="mt-3">
          Podés donate con tarjeta, transferencia, Mercado Pago o incluso
          cripto.
        </p>
      </div>
    );
  }

  // Para otras respuestas, usamos el HTML normal
  return (
    <div
      className="text-black leading-relaxed faq-answer pt-[8px]"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "perdidas" | "adopcion" | "donaciones";
  icon: string;
}

const FAQSection: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const faqData: FAQItem[] = [
    // Generales
    {
      id: "1",
      question: "¿Qué es Mascotas SJ y cómo funciona?",
      answer:
        "Mascotas SJ es una plataforma gratuita para ayudar a encontrar mascotas perdidas, facilitar adopciones y apoyar a refugios. Funciona como una red comunitaria donde cualquiera puede publicar, buscar y colaborar. Es como tener un cartel virtual en toda la ciudad.",
      category: "general",
      icon: "pets",
    },
    {
      id: "2",
      question: "¿Es gratis usar la plataforma?",
      answer:
        "Sí, es 100% GRATIS. Publicar mascotas perdidas, buscar, adoptar y compartir no cuesta nada. Solo las donaciones a campañas son opcionales y van directamente a los refugios.",
      category: "general",
      icon: "savings",
    },
    {
      id: "3",
      question: "¿Necesito registrarme para usar la página?",
      answer:
        "No, puedes buscar y ver todas las publicaciones sin registrarte. Solo necesitas registrarte si quieres publicar una mascota perdida, solicitar una adopción o hacer una donación.",
      category: "general",
      icon: "account_circle",
    },

    // Mascotas Perdidas
    {
      id: "4",
      question: "¿Cómo reporto que perdí mi mascota?",
      answer:
        '<p>Es muy fácil:</p><ol><li>Hacé clic en el botón "Reportar Mascota Perdida"</li><li>Completá los datos de tu mascota</li><li>Subí una foto clara</li><li>Indicá dónde y cuándo se perdió</li><li>Dejá tus datos de contacto</li></ol><p>¡Y listo! Tu publicación quedará activa.</p>',
      category: "perdidas",
      icon: "search",
    },
    {
      id: "5",
      question: "¿Qué información debo incluir en el reporte?",
      answer:
        "Incluí: Nombre, raza, color/tamaño, características especiales (cicatrices, manchas), si tiene collar/chip, fecha y lugar aproximado de pérdida. ¡Mientras más datos, mejor!",
      category: "perdidas",
      icon: "description",
    },
    {
      id: "6",
      question: "¿Cómo sé si encontraron a mi mascota?",
      answer:
        'Recibirás notificaciones por email o WhatsApp si alguien reporta una vista o contacto. También podés revisar las publicaciones de "mascotas encontradas" periódicamente.',
      category: "perdidas",
      icon: "notifications",
    },
    {
      id: "7",
      question: "¿Qué hago si veo una mascota perdida?",
      answer:
        '<p>¡Gracias por ayudar! Podés:</p><ol><li>Tomar una foto</li><li>Publicar en la sección "Mascotas Encontradas"</li><li>Indicar el lugar donde la viste</li><li>Dejar contacto</li></ol><p>O directamente contactar al dueño si ves un reporte que coincide.</p>',
      category: "perdidas",
      icon: "visibility",
    },

    // Adopción
    {
      id: "8",
      question: "¿Cómo adopto una mascota?",
      answer:
        '<ol><li>Buscá en la sección "Adopción"</li><li>Contactá directamente al refugio/responsable vía WhatsApp o Email</li><li>Visita la mascota</li><li>Completá los requisitos del refugio</li><li>¡Lleva a tu nuevo amigo a casa!</li></ol>',
      category: "adopcion",
      icon: "favorite",
    },
    {
      id: "9",
      question: "¿Qué necesito para adoptar?",
      answer:
        "Generalmente te pedirán: DNI, comprobante de domicilio, prueba de ingresos (algunos refugios), y estar dispuesto a una visita posterior. Cada refugio tiene sus propios requisitos.",
      category: "adopcion",
      icon: "assignment",
    },
    {
      id: "10",
      question: "¿Tengo que pagar para adoptar?",
      answer:
        'La mayoría de los refugios cobran una "donación de adopción" que cubre vacunas, desparasitación y castración. No es un "precio" sino un aporte para mantener el refugio ayudando a otros animales.',
      category: "adopcion",
      icon: "volunteer_activism",
    },
    {
      id: "11",
      question: "¿Puedo devolver la mascota si no me adapto?",
      answer:
        "Sí, los refugios prefieren que devuelvas la mascota antes de abandonarla. Es importante hablar con ellos si tenés dificultades, hay apoyo y soluciones.",
      category: "adopcion",
      icon: "home",
    },

    // Donaciones
    {
      id: "12",
      question: "¿Cómo hago una donación?",
      answer:
        "<p>Es muy fácil:</p><ol><li>Entrá a la campaña que querés apoyar</li><li>Elegí el monto</li><li>Seleccioná el método de pago</li><li>Completá tus datos</li></ol><p>Podés donar con tarjeta, transferencia, Mercado Pago o incluso cripto.</p>",
      category: "donaciones",
      icon: "payments",
    },
    {
      id: "13",
      question: "¿A dónde va el dinero de las donaciones?",
      answer:
        'El 100% va directamente a los refugios y organizaciones. Podés ver exactamente para qué es cada campaña (ej: "cirugía de Max", "alimento para 15 cachorros"). Todo es transparente.',
      category: "donaciones",
      icon: "account_balance",
    },
    {
      id: "14",
      question: "¿Puedo donar alimentos o cosas en vez de dinero?",
      answer:
        "¡Claro que sí! Muchos refugios necesitan alimento, mantas, medicamentos. Contactalos directamente por WhatsApp para coordinar la entrega.",
      category: "donaciones",
      icon: "inventory_2",
    },
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Agrupar FAQs por categoría
  const groupedFAQs = faqData.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, FAQItem[]>,
  );

  // Títulos de las categorías
  const categoryTitles = {
    general: "Preguntas Generales",
    perdidas: "Mascotas Perdidas",
    adopcion: "Adopción",
    donaciones: "Donaciones",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-black">
          Preguntas <span className="text-primary">Frecuentes</span>
        </h1>
        <p className="text-lg text-accent-teal max-w-2xl mx-auto">
          Todo lo que necesitás saber para usar Mascotas SJ.
        </p>
      </div>

      {/* FAQ Items por categoría */}
      <div className="space-y-10">
        {Object.entries(groupedFAQs).map(([category, items], categoryIndex) => (
          <div
            id={`category-${category}`}
            key={category}
            className="scroll-mt-8"
          >
            {/* Título de la categoría */}
            <div className="mb-6">
              <div className="pb-4 border-b-4 border-primary">
                <h2 className="text-2xl md:text-3xl font-bold text-black">
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </h2>
              </div>
            </div>

            {/* Items de la categoría */}
            <div className="space-y-3">
              {items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-white/5 rounded-2xl border border-accent-teal/5 overflow-hidden stagger-item"
                  style={{
                    animationDelay: `${categoryIndex * 0.2 + itemIndex * 0.1}s`,
                  }}
                >
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full px-6 py-5 text-left flex items-center gap-4 hover:bg-accent-teal/5 transition-colors"
                  >
                    <div className="flex-1 pt-4">
                      <h3 className="font-bold text-lg text-black">
                        {item.question}
                      </h3>
                    </div>
                    <span
                      className={`text-accent-teal transition-transform text-xl font-bold ${
                        expandedItems.has(item.id) ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {expandedItems.has(item.id) && (
                    <div className="px-6 pb-5 pl-[60px] animate-fade-in">
                      <FAQAnswer content={item.answer} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Return to Top Button */}
      <div className="mt-16 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold mx-auto hover:opacity-90 transition-all inline-flex items-center gap-2"
        >
          <span>↑</span> Volver al principio
        </button>
      </div>
    </div>
  );
};

export default FAQSection;
