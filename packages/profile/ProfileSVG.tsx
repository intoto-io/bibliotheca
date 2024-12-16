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

    const heightDiff = factoredHeight - parseFloat(curHeight || '0');
    const newYPos = parseFloat(yPos || '0') - heightDiff;

    rect?.setAttribute('y', newYPos.toString());
    rect?.setAttribute('height', factoredHeight.toString());
  };

  const setupLayers = (image: SVGElement | undefined) => {
    if (!image) return;

    if (divRef.current) {
      divRef.current.innerHTML = '';
      divRef.current.appendChild(image);
    }

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
    changeWaterHeight(waterHeight);
    // eslint-disable-next-line
  }, [waterHeight]);

  useEffect(() => {
    const div = divRef.current;

    if (svg) {
      setupLayers(svg);
    } else if (svgString) {
      setupLayers(parseSVG(svgString));
    } else if (svgPath) {
      handleSVGPath(svgPath);
    }

    return () => {
      if (div) {
        div.innerHTML = '';
      }
    };
    // eslint-disable-next-line
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
