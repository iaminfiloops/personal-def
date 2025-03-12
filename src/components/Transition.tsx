
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type TransitionProps = {
  children: ReactNode;
};

const Transition = ({ children }: TransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut");
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 300); // Match this with your CSS transition duration
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        transitionStage === "fadeIn" ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default Transition;
