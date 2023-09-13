import { FunctionComponent, useEffect, useRef, useState } from "react";

export interface ProfileSVGProps {
  svgString?: string;
  svgPath?: string;
  svg?: SVGElement;
  waterHeight: number;
  waterHeightFactor: number;
}

export const ProfileSVG: FunctionComponent<ProfileSVGProps> = function (
  props: ProfileSVGProps
) {
  const divRef = useRef<HTMLDivElement>(null);

  const setupLayers = (svg: SVGElement | undefined) => {
    if (!svg) return;

    divRef.current?.appendChild(svg);

    changeWaterHeight(props.waterHeight);
  };

  const changeWaterHeight = (height: number) => {
    const factoredHeight = height * props.waterHeightFactor;

    const rect = divRef.current?.querySelector("#Water rect");

    const yPos = rect?.getAttribute("y");
    const curHeight = rect?.getAttribute("height");

    const heightDiff = factoredHeight - parseInt(curHeight || "0");
    const newYPos = parseInt(yPos || "0") - heightDiff;

    rect?.setAttribute("y", newYPos.toString());
    rect?.setAttribute("height", factoredHeight.toString());
  };

  const parseSVG = (str: string): SVGElement | undefined => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "image/svg+xml")?.documentElement;

    if (doc instanceof SVGElement) {
      return doc;
    }
  };

  const handleSVGPath = (svgPath: string) => {
    fetch(svgPath)
      .then((response) => response.text())
      .then((data) => parseSVG(data))
      .then((svg) => setupLayers(svg));
  };

  useEffect(() => {
    try {
      if (props.svg) {
        setupLayers(props.svg);
        return;
      }

      if (props.svgString) {
        const svg = parseSVG(props.svgString);
        setupLayers(svg);
        return;
      }

      if (props.svgPath) {
        handleSVGPath(props.svgPath);
        return;
      }
    } catch {}
  }, []);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
        }}
        ref={divRef}
      />
    </div>
  );
};

export default ProfileSVG;
