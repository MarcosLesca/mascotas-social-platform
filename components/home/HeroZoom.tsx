"use client";
import { useRef } from "react";
import { useApp } from "../../context/AppContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./HeroZoom.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ZoomItem {
  id: number;
  src: string;
  className: string;
  text: string;
  direction: "left" | "right" | "up" | "down"; // Direccion de apertura
}

const zoomItems: ZoomItem[] = [
  // Izquierda
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800",
    className: styles.item1,
    text: "Amor",
    direction: "left",
  },
  {
    id: 2,
    src: "https://i.pinimg.com/736x/f5/7a/59/f57a5991b7f1467debd1098bd595b14c.jpg",
    className: styles.item2,
    text: "Familia",
    direction: "left",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
    className: styles.item3,
    text: "Lealtad",
    direction: "left",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
    className: styles.item4,
    text: "Hogar",
    direction: "left",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=800",
    className: styles.item5,
    text: "Amistad",
    direction: "left",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&q=80&w=800",
    className: styles.item6,
    text: "Compania",
    direction: "left",
  },
  {
    id: 7,
    src: "https://i.pinimg.com/1200x/7c/f6/13/7cf6136b463b8370ee26acde9bbffee5.jpg",
    className: styles.item7,
    text: "Cuidado",
    direction: "left",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=800",
    className: styles.item8,
    text: "Vinculo",
    direction: "left",
  },
  // Derecha
  {
    id: 9,
    src: "https://i.pinimg.com/1200x/40/37/f6/4037f658ef5a78991fcdf2bcd49dcac9.jpg",
    className: styles.item9,
    text: "Confianza",
    direction: "right",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800",
    className: styles.item10,
    text: "Juego",
    direction: "right",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800",
    className: styles.item11,
    text: "Ternura",
    direction: "right",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?auto=format&fit=crop&q=80&w=800",
    className: styles.item12,
    text: "Alegria",
    direction: "right",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800",
    className: styles.item13,
    text: "Fidelidad",
    direction: "right",
  },
  {
    id: 14,
    src: "https://i.pinimg.com/736x/98/49/d8/9849d862ef6322c1f10abd96406698bf.jpg",
    className: styles.item14,
    text: "Paz",
    direction: "right",
  },
  {
    id: 15,
    src: "https://i.pinimg.com/736x/0e/82/7f/0e827f69ad902260a4be57095744f4e9.jpg",
    className: styles.item15,
    text: "Esperanza",
    direction: "right",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=800",
    className: styles.item16,
    text: "Vida",
    direction: "right",
  },
];

export default function HeroZoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentView } = useApp();

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Detectar viewport para ajustar animacion
      const isMobile = window.innerWidth < 640;

      // Configuracion especial para mobile
      const mobileConfig = {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        pin: false, // Sin pin en mobile para evitar problemas
        scrub: 1,
        pinSpacing: false,
      };

      const desktopConfig = {
        trigger: containerRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 1,
        pinSpacing: false,
      };

      const tl = gsap.timeline({
        scrollTrigger: isMobile ? mobileConfig : desktopConfig,
      });

      // Animacion de apertura: imagenes se mueven hacia los lados
      tl.to(
        ".zoom-item",
        {
          x: (i, target) => {
            const direction = target.getAttribute("data-direction");
            // Desplazamiento lateral fuerte basado en la direccion base
            // Agregamos algo de aleatoriedad para que no sea tan uniforme
            const randomFactor = 50 + Math.random() * 50;
            return direction === "left"
              ? `-=${100 + randomFactor}%`
              : `+=${100 + randomFactor}%`;
          },
          y: (i) => {
            // Pequeno desplazamiento vertical aleatorio para dar dinamismo
            return (i % 2 === 0 ? -1 : 1) * (Math.random() * 50 + 20);
          },
          rotation: (i) => {
            // Rotacion leve al abrirse
            return (i % 2 === 0 ? -1 : 1) * (Math.random() * 15 + 5);
          },
          opacity: 0, // Desvanecerse al final del recorrido
          scale: 0.8, // Reducirse ligeramente al alejarse
          ease: "power2.inOut",
          stagger: {
            amount: 0.5,
            from: "center",
          },
        },
        0,
      )
        // El titulo aparece (scale up y fade in) mientras las imagenes se abren
        .to(
          ".hero-heading",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          0.2,
        ) // Empezar un poco despues de que inicie la apertura

        // Animacion de las huellas - desaparecen con el scroll
        .to(
          ".paw-container",
          {
            opacity: 0,
            ease: "power1.out",
          },
          0,
        );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={styles.scrollContainer}>
      <div className={styles.zoomContainer}>
        {/* SVG Sprite */}
        <svg id="svg-sprite" style={{ display: "none" }}>
          <symbol id="paw" viewBox="0 0 249 209.32">
            <ellipse
              cx="27.917"
              cy="106.333"
              strokeWidth="0"
              rx="27.917"
              ry="35.833"
            />
            <ellipse
              cx="84.75"
              cy="47.749"
              strokeWidth="0"
              rx="34.75"
              ry="47.751"
            />
            <ellipse
              cx="162"
              cy="47.749"
              strokeWidth="0"
              rx="34.75"
              ry="47.751"
            />
            <ellipse
              cx="221.083"
              cy="106.333"
              strokeWidth="0"
              rx="27.917"
              ry="35.833"
            />
            <path
              strokeWidth="0"
              d="M43.98 165.39s9.76-63.072 76.838-64.574c0 0 71.082-6.758 83.096 70.33 0 0 2.586 19.855-12.54 31.855 0 0-15.75 17.75-43.75-6.25 0 0-7.124-8.374-24.624-7.874 0 0-12.75-.125-21.5 6.625 0 0-16.375 18.376-37.75 12.75 0 0-28.29-7.72-19.77-42.86z"
            />
          </symbol>
        </svg>

        {/* Paw Prints Animation - Behind images */}
        <div className={`${styles.pawContainer} paw-container`}>
          {/* Row 1 - Top */}
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          {/* Row 2 */}
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          {/* Row 3 */}
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          {/* Row 4 */}
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          {/* Row 5 */}
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          {/* Row 6 - Bottom */}
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          {/* Extra scattered */}
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
          <div className={styles.paw}>
            <svg className="icon" style={{ fill: "#4c9a66" }}>
              <use href="#paw" />
            </svg>
          </div>
        </div>

        {/* Titulo animado - inicialmente oculto/pequeno */}
        <div className={`${styles.headingContainer} hero-heading`}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleText}>Porque volver a casa</span>
            <br />
            <span className={styles.titleText}>también es un </span>
            <span className={styles.titleHighlight}>derecho</span>
          </h1>
          <p className={styles.heroDescription}>
            Mascotas SJ es una plataforma creada para publicar mascotas perdidas, promover la adopción responsable y facilitar donaciones para quienes más lo necesitan. Un espacio digital desarrollado por L&M Desarrollo Web, pensado para generar un impacto real en la comunidad y ayudar a que cada historia tenga una segunda oportunidad.
          </p>

          {/* Botones de accion estilo moderno */}
          <div className={styles.buttonContainer}>
            <button
              onClick={() => setCurrentView("lost_pets")}
              className={styles.actionButton + " " + styles.lostPetButton}
            >
              <span className={styles.toe + " " + styles.toe1}></span>
              <span className={styles.toe + " " + styles.toe2}></span>
              <span className={styles.toe + " " + styles.toe3}></span>
              <span className={styles.toe + " " + styles.toe4}></span>
              <span className={styles.pad}>
                <span className={styles.buttonText}>
                  Publicar Mascota Perdida
                </span>
              </span>
            </button>
            <button
              onClick={() => setCurrentView("adoption")}
              className={styles.actionButton + " " + styles.adoptionButton}
            >
              <span className={styles.toe + " " + styles.toe1}></span>
              <span className={styles.toe + " " + styles.toe2}></span>
              <span className={styles.toe + " " + styles.toe3}></span>
              <span className={styles.toe + " " + styles.toe4}></span>
              <span className={styles.pad}>
                <span className={styles.buttonText}>Adoptar una Mascota</span>
              </span>
            </button>
            <button
              onClick={() => setCurrentView("donations")}
              className={styles.actionButton + " " + styles.donationButton}
            >
              <span className={styles.toe + " " + styles.toe1}></span>
              <span className={styles.toe + " " + styles.toe2}></span>
              <span className={styles.toe + " " + styles.toe3}></span>
              <span className={styles.toe + " " + styles.toe4}></span>
              <span className={styles.pad}>
                <span className={styles.buttonText}>Ayudar/Donar</span>
              </span>
            </button>
          </div>
        </div>

        {/* Imagenes */}
        {zoomItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.zoomItem} zoom-item ${item.className}`}
            data-direction={item.direction}
          >
            <div className={styles.imageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.text}
                className="object-cover w-full h-full"
              />
              <div className={styles.overlay}>
                <span className={styles.imageText}>{item.text}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
