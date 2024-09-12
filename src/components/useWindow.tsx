"use window";
import { useEffect, useState } from "react";

interface Dimension {
  width: number;
  height: number;
}

export default function useWindow() {
  const [dimension, setDimension] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  const resize = () => {
    setDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return { dimension };
}
