import { useEffect, useRef } from 'react';

export interface ProfileSVGProps {
  svgString?: string;
  svgPath?: string;
  svg?: SVGElement;
  waterHeight: number;
  waterHeightFactor: number;
}

function ProfileSVG(props: ProfileSVGProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const { svgString, svgPath, svg, waterHeight, waterHeightFactor } = props;

  const changeWaterHeight = (height: number) => {
    const factoredHeight = height * waterHeightFactor;

    const rect = divRef.current?.querySelector('#Water rect');

    const yPos = rect?.getAttribute('y');
    const curHeight = rect?.getAttribute('height');

    const heightDiff = factoredHeight - parseInt(curHeight || '0', 10);
    const newYPos = parseInt(yPos || '0', 10) - heightDiff;

    rect?.setAttribute('y', newYPos.toString());
    rect?.setAttribute('height', factoredHeight.toString());
  };

  const setupLayers = (image: SVGElement | undefined) => {
    if (!image) return;

    divRef.current?.appendChild(image);

    changeWaterHeight(waterHeight);
  };

  const parseSVG = (str: string): SVGElement | undefined => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'image/svg+xml')?.documentElement;

    if (doc instanceof SVGElement) {
      return doc;
    }

    return undefined;
  };

  const handleSVGPath = (_svgPath: string) => {
    fetch(_svgPath)
      .then((response) => response.text())
      .then((data) => parseSVG(data))
      .then((_svg) => setupLayers(_svg));
  };

  useEffect(() => {
    if (svg) {
      setupLayers(svg);

      return;
    }

    if (svgString) {
      setupLayers(parseSVG(svgString));

      return;
    }

    if (svgPath) {
      handleSVGPath(svgPath);
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <div ref={divRef} />
    </div>
  );
}

export default ProfileSVG;
