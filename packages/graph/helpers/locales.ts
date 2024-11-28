import { TimeLocaleDefinition } from 'd3-time-format';

import enUS from 'd3-time-format/locale/en-US.json';
import nbNO from 'd3-time-format/locale/nb-NO.json';
import svSE from 'd3-time-format/locale/sv-SE.json';
import daDK from 'd3-time-format/locale/da-DK.json';
import fiFI from 'd3-time-format/locale/fi-FI.json';

const locales: Record<'nb' | 'en' | 'sv' | 'da' | 'fi', TimeLocaleDefinition> = {
  en: enUS as TimeLocaleDefinition,
  nb: nbNO as TimeLocaleDefinition,
  sv: svSE as TimeLocaleDefinition,
  da: daDK as TimeLocaleDefinition,
  fi: fiFI as TimeLocaleDefinition,
};

export default locales;
