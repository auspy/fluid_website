import { useState, useEffect } from "react";

export default function useZoomHandler() {
  const [zoomFactor, setZoomFactor] = useState(1.0);
  const [initialDistance, setInitialDistance] = useState(null);

  const calculateDistance = (touches) => {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleZoom = (direction, rate, e) => {
    e.preventDefault();

    let newZoomFactor = zoomFactor + (direction === "in" ? rate : -rate);
    newZoomFactor = Math.max(newZoomFactor, rate);

    const adjustedZoomFactor =
      newZoomFactor >= 1 ? newZoomFactor ** 2 : newZoomFactor ** 0.5;

    setZoomFactor(newZoomFactor);
    const wrapper = document.getElementById("wrapper");
    wrapper.style.transform = `scale(${adjustedZoomFactor})`;
    wrapper.style.width = `${100 / adjustedZoomFactor}%`;
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        handleZoom(e.deltaY < 0 ? "in" : "out", 0.01, e);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        setInitialDistance(calculateDistance(e.touches));
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        const currentDistance = calculateDistance(e.touches);
        handleZoom(currentDistance > initialDistance ? "in" : "out", 0.01, e);
        setInitialDistance(currentDistance);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [zoomFactor, initialDistance]);
  return null;
}
