"use client";
import { useRef } from "react";
import { useApp } from "../../context/AppContext";
import { View } from "../../types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CuteDogButton from "./CuteDogButton";
import styles from "./HeroZoom.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ZoomItem {
  id: number;
  src: string;
  className: string;
  text: string;
  direction: "left" | "right" | "up" | "down";
}

const zoomItems: ZoomItem[] = [
  {
    id: 1,
    src: "../../public/assets/hero/perro-5.jpg",
    className: styles.item1,
    text: "Amor",
    direction: "left",
  },
  {
    id: 2,
    src: "../../public/assets/hero/tortuga-hero.jpg",
    className: styles.item2,
    text: "Familia",
    direction: "left",
  },
  {
    id: 3,
    src: "../../public/assets/hero/perro-2-hero.jpg",
    className: styles.item3,
    text: "Lealtad",
    direction: "left",
  },
  {
    id: 4,
    src: "../../public/assets/hero/perro-gato-2.jpg",
    className: styles.item4,
    text: "Hogar",
    direction: "left",
  },
  {
    id: 5,
    src: "../../public/assets/hero/gato-2-hero.jpg",
    className: styles.item5,
    text: "Amistad",
    direction: "left",
  },
  {
    id: 6,
    src: "../../public/assets/hero/conejo-hero.jpg",
    className: styles.item6,
    text: "Compania",
    direction: "left",
  },
  {
    id: 7,
    src: "../../public/assets/hero/loro-hero.jpg",
    className: styles.item7,
    text: "Cuidado",
    direction: "left",
  },
  {
    id: 8,
    src: "../../public/assets/hero/perro-hum-hero.jpg",
    className: styles.item8,
    text: "Vinculo",
    direction: "left",
  },
  {
    id: 9,
    src: "../../public/assets/hero/hamster-hero.jpg",
    className: styles.item9,
    text: "Confianza",
    direction: "right",
  },
  {
    id: 10,
    src: "../../public/assets/hero/perro-3-hero.jpg",
    className: styles.item10,
    text: "Juego",
    direction: "right",
  },
  {
    id: 11,
    src: "../../public/assets/hero/perro-gato-1-hero.jpg",
    className: styles.item11,
    text: "Ternura",
    direction: "right",
  },
  {
    id: 12,
    src: "../../public/assets/hero/gato- - hero-1.jpg",
    className: styles.item12,
    text: "Alegria",
    direction: "right",
  },
  {
    id: 13,
    src: "../../public/assets/hero/perro-1-hero.jpg",
    className: styles.item13,
    text: "Fidelidad",
    direction: "right",
  },
  {
    id: 14,
    src: "../../public/assets/hero/perro-hero-7.jpg",
    className: styles.item14,
    text: "Paz",
    direction: "right",
  },
  {
    id: 15,
    src: "../../public/assets/hero/gato-hero.jpg",
    className: styles.item15,
    text: "Esperanza",
    direction: "right",
  },
  {
    id: 16,
    src: "../../public/assets/hero/gato--hero.jpg",
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

      const isMobile = window.innerWidth < 640;
      const mobileConfig = {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
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

      tl.to(
        ".zoom-item",
        {
          x: (i, target) => {
            const direction = target.getAttribute("data-direction");
            const randomFactor = 50 + Math.random() * 50;
            return direction === "left"
              ? `-=${100 + randomFactor}%`
              : `+=${100 + randomFactor}%`;
          },
          y: (i) => (i % 2 === 0 ? -1 : 1) * (Math.random() * 50 + 20),
          rotation: (i) => (i % 2 === 0 ? -1 : 1) * (Math.random() * 15 + 5),
          opacity: 0,
          scale: 0.8,
          ease: "power2.inOut",
          stagger: {
            amount: 0.5,
            from: "center",
          },
        },
        0,
      ).to(
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
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={styles.scrollContainer}>
      <div className={styles.zoomContainer}>
        <div className={`${styles.headingContainer} hero-heading`}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleText}>Porque volver a casa</span>
            <br />
            <span className={styles.titleText}>también es un </span>
            <span className={styles.titleHighlight}>derecho</span>
          </h1>
          <p className={styles.heroDescription}>
            Mascotas SJ es una plataforma creada para publicar mascotas
            perdidas, promover la adopción responsable y facilitar donaciones
            para quienes más lo necesitan. Un espacio digital desarrollado por
            L&M Desarrollo Web, pensado para generar un impacto real en San
            Justo.
          </p>

          {/* Ejemplo de uso configurable del componente */}
          <div className={styles.buttonContainer}>
            <CuteDogButton
              text="Publicar Mascota"
              mainColor="#ffffff"
              hoverColor="#FEE2E2"
              textColor="#111827"
              borderColor="#374151"
              dogColor="#e1a46e"
              borderWidth="2px"
              hoverTextColor="#DC2626"
              hoverBorderColor="#DC2626"
              onClick={() => setCurrentView(View.LOST_PETS)}
            />
            <CuteDogButton
              text="Adoptar una Mascota"
              mainColor="#ffffff"
              hoverColor="#DCFCE7"
              textColor="#111827"
              borderColor="#374151"
              dogColor="#e1a46e"
              borderWidth="2px"
              hoverTextColor="#16A34A"
              hoverBorderColor="#16A34A"
              onClick={() => setCurrentView(View.ADOPTION)}
            />
            <CuteDogButton
              text="Donar a una mascota"
              mainColor="#ffffff"
              hoverColor="#E0F2FE"
              textColor="#111827"
              borderColor="#374151"
              dogColor="#e1a46e"
              borderWidth="2px"
              hoverTextColor="#0EA5E9"
              hoverBorderColor="#0EA5E9"
              onClick={() => setCurrentView(View.DONATIONS)}
            />
          </div>
        </div>

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
