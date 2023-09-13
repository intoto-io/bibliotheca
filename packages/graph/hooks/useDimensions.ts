import { MutableRefObject, useEffect, useRef, useState } from "react";

interface Dimensions {
  width: number;
  height: number;
}

function useDimensions(): [MutableRefObject<HTMLDivElement | null>, Dimensions] {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>();

  useEffect(() => {
    function handleResize() {
      if (ref.current) {
        const { width, height } = ref.current.getClientRects()[0];
        setDimensions({ width, height });
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [ref, dimensions || { width: 0, height: 0 }];
}

export default useDimensions;
