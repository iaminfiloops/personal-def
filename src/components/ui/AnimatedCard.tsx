
import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: "lift" | "glow" | "none";
  glareEffect?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const AnimatedCard = ({
  children,
  className,
  hoverEffect = "none",
  glareEffect = false,
  style
}: AnimatedCardProps) => {
  const hoverClasses = {
    lift: "transition-transform duration-300 hover:-translate-y-2",
    glow: "transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/20",
    none: "",
  };

  const glareClass = glareEffect ? "relative overflow-hidden before:absolute before:inset-0 before:z-10 before:opacity-0 before:transition-opacity before:duration-300 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent hover:before:opacity-100" : "";

  return (
    <Card
      className={cn(
        hoverClasses[hoverEffect],
        glareClass,
        className
      )}
      style={style}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;
