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
  { id: 1, src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800", className: styles.item1, text: "Amor", direction: "left" },
  { id: 2, src: "https://i.pinimg.com/736x/f5/7a/59/f57a5991b7f1467debd1098bd595b14c.jpg", className: styles.item2, text: "Familia", direction: "left" },
  { id: 3, src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800", className: styles.item3, text: "Lealtad", direction: "left" },
  { id: 4, src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800", className: styles.item4, text: "Hogar", direction: "left" },
  { id: 5, src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=800", className: styles.item5, text: "Amistad", direction: "left" },
  { id: 6, src: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&q=80&w=800", className: styles.item6, text: "Compania", direction: "left" },
  { id: 7, src: "https://i.pinimg.com/1200x/7c/f6/13/7cf6136b463b8370ee26acde9bbffee5.jpg", className: styles.item7, text: "Cuidado", direction: "left" },
  { id: 8, src: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=800", className: styles.item8, text: "Vinculo", direction: "left" },
  { id: 9, src: "https://i.pinimg.com/1200x/40/37/f6/4037f658ef5a78991fcdf2bcd49dcac9.jpg", className: styles.item9, text: "Confianza", direction: "right" },
  { id: 10, src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800", className: styles.item10, text: "Juego", direction: "right" },
  { id: 11, src: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800", className: styles.item11, text: "Ternura", direction: "right" },
  { id: 12, src: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?auto=format&fit=crop&q=80&w=800", className: styles.item12, text: "Alegria", direction: "right" },
  { id: 13, src: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800", className: styles.item13, text: "Fidelidad", direction: "right" },
  { id: 14, src: "https://i.pinimg.com/736x/98/49/d8/9849d862ef6322c1f10abd96406698bf.jpg", className: styles.item14, text: "Paz", direction: "right" },
  { id: 15, src: "https://i.pinimg.com/736x/0e/82/7f/0e827f69ad902260a4be57095744f4e9.jpg", className: styles.item15, text: "Esperanza", direction: "right" },
  { id: 16, src: "https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=800", className: styles.item16, text: "Vida", direction: "right" },
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
        end: "bottom top",
        pin: false,
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
            return direction === "left" ? `-=${100 + randomFactor}%` : `+=${100 + randomFactor}%`;
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
            Mascotas SJ es una plataforma creada para publicar mascotas perdidas, promover la adopción responsable y
            facilitar donaciones para quienes más lo necesitan. Un espacio digital desarrollado por L&M Desarrollo Web,
            pensado para generar un impacto real en San Justo.
          </p>

          {/* Ejemplo de uso configurable del componente */}
          <div className={styles.buttonContainer}>
            <CuteDogButton
              text="Publicar Mascotas"
              mainColor="#ffffff"
              hoverColor="#F0F4F2"
              textColor="#111827"
              borderColor="#374151"
              dogColor="#e1a46e"
              borderWidth="2px"
              hoverTextColor="#7A8F85"
              hoverBorderColor="#7A8F85"
              onClick={() => setCurrentView(View.LOST_PETS)}
            />
            <CuteDogButton
              text="Adoptar una Mascota"
              mainColor="#ffffff"
              hoverColor="#F4F1EC"
              textColor="#111827"
              borderColor="#374151"
              dogColor="#e1a46e"
              borderWidth="2px"
              hoverTextColor="#6B4E3D"
              hoverBorderColor="#6B4E3D"
              onClick={() => setCurrentView(View.ADOPTION)}
            />
            <CuteDogButton
              text="Ayudar / Donar"
              mainColor="#ffffff"
              hoverColor="#FFF0F0"
              textColor="#111827"
              borderColor="#374151"
              dogColor="#e1a46e"
              borderWidth="2px"
              hoverTextColor="#B05E5E"
              hoverBorderColor="#B05E5E"
              onClick={() => setCurrentView(View.DONATIONS)}
            />
          </div>
        </div>

        {zoomItems.map((item) => (
          <div key={item.id} className={`${styles.zoomItem} zoom-item ${item.className}`} data-direction={item.direction}>
            <div className={styles.imageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.text} className="object-cover w-full h-full" />
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
