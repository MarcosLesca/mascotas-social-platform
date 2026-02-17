import React, { useState } from "react";

// Colores de marca
const COLORS = {
  bg: "#203553",
  bgLight: "#2a4266",
  text: "#ecdbbd",
  muted: "#8b9cb3",
  cream: "#ecdbbd",
  lightBg: "#f8f6f2",
};

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
                color: COLORS.bg,
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
      <div className="leading-relaxed pt-[8px]" style={{ color: COLORS.bg }}>
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
      <div className="leading-relaxed pt-[8px]" style={{ color: COLORS.bg }}>
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
      <div className="leading-relaxed pt-[8px]" style={{ color: COLORS.bg }}>
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
  if (content.includes("Entrá a la sección Donaciones")) {
    return (
      <div className="leading-relaxed pt-[8px]" style={{ color: COLORS.bg }}>
        <p className="mb-3">Es muy fácil:</p>
        {renderCustomList([
          "Entrá a la sección Donaciones",
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
      className="leading-relaxed faq-answer pt-[8px]"
      style={{ color: COLORS.bg }}
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
        "Mascotas SJ es una plataforma comunitaria de San Justo, Santa Fe, donde podés publicar mascotas perdidas, dar en adopción o solicitar ayuda mediante donaciones. Las publicaciones son revisadas por un administrador antes de hacerse visibles.",
      category: "general",
      icon: "pets",
    },
    {
      id: "2",
      question: "¿Es gratis usar la plataforma?",
      answer:
        "Sí. Publicar casos de mascotas perdidas, adopción o pedidos de ayuda es totalmente gratuito.",
      category: "general",
      icon: "savings",
    },
    {
      id: "3",
      question: "¿Necesito registrarme para usar la página?",
      answer:
        "No es necesario crear una cuenta para navegar la plataforma o enviar una publicación. Solo debés completar el formulario correspondiente.",
      category: "general",
      icon: "account_circle",
    },

    // Mascotas Perdidas
    {
      id: "4",
      question: "¿Cómo reporto que perdí mi mascota?",
      answer:
        "Debés ingresar a la sección \"Mascotas Perdidas\" y completar el formulario con los datos solicitados. Una vez aprobado por el administrador, se publicará en la plataforma.",
      category: "perdidas",
      icon: "search",
    },
    {
      id: "5",
      question: "¿Qué información debo incluir en el reporte?",
      answer:
        "Es importante incluir una foto reciente, nombre de la mascota, zona donde fue vista por última vez, fecha aproximada y un medio de contacto.",
      category: "perdidas",
      icon: "description",
    },
    {
      id: "6",
      question: "¿Cómo sé si encontraron a mi mascota?",
      answer:
        "Las personas pueden comunicarse directamente al número de contacto que indiques en la publicación si creen haberla visto.",
      category: "perdidas",
      icon: "notifications",
    },
    {
      id: "7",
      question: "¿Qué hago si veo una mascota perdida?",
      answer:
        "Podés comunicarte directamente con el contacto que figura en la publicación y brindar información sobre la ubicación o situación en la que la viste.",
      category: "perdidas",
      icon: "visibility",
    },

    // Adopción
    {
      id: "8",
      question: "¿Cómo adopto una mascota?",
      answer:
        "Debés comunicarte mediante el botón de contacto que figura en la publicación de la mascota que te interesa para recibir más información.",
      category: "adopcion",
      icon: "favorite",
    },
    {
      id: "9",
      question: "¿Qué necesito para adoptar?",
      answer:
        "Dependerá de cada caso, pero generalmente se solicita compromiso, responsabilidad y condiciones adecuadas para el bienestar de la mascota.",
      category: "adopcion",
      icon: "assignment",
    },
    {
      id: "10",
      question: "¿Tengo que pagar para adoptar?",
      answer:
        "La plataforma no cobra por publicar ni adoptar.",
      category: "adopcion",
      icon: "volunteer_activism",
    },
    {
      id: "11",
      question: "¿Puedo devolver la mascota si no me adapto?",
      answer:
        "La adopción debe ser una decisión responsable. En caso de inconvenientes, se recomienda comunicarse con la persona que realizó la publicación para evaluar la situación.",
      category: "adopcion",
      icon: "home",
    },

    // Donaciones
    {
      id: "12",
      question: "¿Cómo hago una donación?",
      answer:
        "Podés comunicarte directamente con el contacto indicado en la publicación del caso que deseás ayudar.",
      category: "donaciones",
      icon: "payments",
    },
    {
      id: "13",
      question: "¿A dónde va el dinero de las donaciones?",
      answer:
        "Las donaciones se realizan directamente a la persona o responsable que publica el caso. Mascotas SJ no intermedia ni administra el dinero.",
      category: "donaciones",
      icon: "account_balance",
    },
    {
      id: "14",
      question: "¿Puedo donor alimentos o cosas en vez de dinero?",
      answer:
        "Sí. Si el caso lo permite, podés coordinar directamente con el contacto para colaborar con alimentos, insumos o asistencia veterinaria.",
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
    general: "Preguntas generales",
    perdidas: "Mascotas perdidas",
    adopcion: "Adopción",
    donaciones: "Donaciones",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "white" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl md:text-4xl font-black mb-3"
            style={{ color: COLORS.bg }}
          >
            Preguntas frecuentes
          </h1>
          <p className="font-medium text-base" style={{ color: COLORS.muted }}>
            Todo lo que necesitás saber para usar Mascotas SJ
          </p>
        </div>

        {/* FAQ Items por categoría */}
        <div className="space-y-8">
          {Object.entries(groupedFAQs).map(
            ([category, items], categoryIndex) => (
              <div
                id={`category-${category}`}
                key={category}
                className="scroll-mt-8"
              >
                {/* Título de la categoría */}
                <div className="mb-5">
                  <div className="flex items-center gap-3 pb-2">
                    <div
                      className="flex-1 h-px"
                      style={{ backgroundColor: `${COLORS.bg}20` }}
                    />
                    <h2
                      className="text-lg font-bold tracking-wide uppercase"
                      style={{ color: COLORS.bg }}
                    >
                      {categoryTitles[category as keyof typeof categoryTitles]}
                    </h2>
                    <div
                      className="flex-1 h-px"
                      style={{ backgroundColor: `${COLORS.bg}20` }}
                    />
                  </div>
                </div>

                {/* Items de la categoría */}
                <div className="space-y-3">
                  {items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="rounded-xl border overflow-hidden"
                      style={{
                        backgroundColor: COLORS.lightBg,
                        borderColor: `${COLORS.bg}15`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpanded(item.id)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between transition-all duration-200 hover:brightness-98"
                        style={{
                          backgroundColor: expandedItems.has(item.id)
                            ? `${COLORS.bg}08`
                            : `${COLORS.bg}05`,
                        }}
                      >
                        <span
                          className="font-bold flex-1 pr-4 text-base"
                          style={{ color: COLORS.bg }}
                        >
                          {item.question}
                        </span>
                        <span
                          className="text-xl font-bold flex-shrink-0"
                          style={{ color: COLORS.bg }}
                        >
                          {expandedItems.has(item.id) ? "−" : "+"}
                        </span>
                      </button>

                      {expandedItems.has(item.id) && (
                        <div
                          className="px-5 py-4 border-t"
                          style={{ borderColor: `${COLORS.bg}10` }}
                        >
                          <div
                            className="leading-relaxed pt-[8px]"
                            style={{ color: COLORS.bg }}
                          >
                            <FAQAnswer content={item.answer} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>

        {/* Return to Top Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-8 py-3 rounded-xl font-bold transition-all duration-200 inline-flex items-center gap-2 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: COLORS.bg,
              color: COLORS.text,
              boxShadow: "0 4px 14px rgba(32, 53, 83, 0.3)",
            }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
