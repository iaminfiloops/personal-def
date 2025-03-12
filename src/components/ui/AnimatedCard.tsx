
import { ReactNode, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: "lift" | "glow" | "none";
  glareEffect?: boolean;
}

const AnimatedCard = ({
  children,
  className,
  hoverEffect = "lift",
  glareEffect = false,
}: AnimatedCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Handle mouse move for the glare effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glareEffect) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    setPosition({ x: rotateY, y: rotateX });
    setOpacity(1);
  };

  // Reset the card position when mouse leaves
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setOpacity(0);
    setIsHovering(false);
  };

  // Update is hovering state
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Ensure card returns to normal position on touch end for mobile
  useEffect(() => {
    const handleTouchEnd = () => {
      handleMouseLeave();
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (card) {
        card.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300 bg-card",
        {
          "transform hover:-translate-y-2": hoverEffect === "lift",
          "shadow-soft hover:shadow-glass": hoverEffect !== "none",
        },
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: glareEffect ? `perspective(1000px) rotateX(${position.y}deg) rotateY(${position.x}deg)` : "",
        transition: "all 0.2s ease",
      }}
    >
      {children}

      {/* Glare effect */}
      {glareEffect && (
        <div
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 rounded-xl pointer-events-none"
          style={{
            opacity,
            transform: `rotate(${position.x * 5}deg)`,
            transition: "opacity 0.2s ease",
          }}
        />
      )}
    </div>
  );
};

export default AnimatedCard;
