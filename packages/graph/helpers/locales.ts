import { TimeLocaleDefinition } from 'd3-time-format';

import enUS from 'd3-time-format/locale/en-US.json';
import nbNO from 'd3-time-format/locale/nb-NO.json';

const locales: Record<'nb' | 'en', TimeLocaleDefinition> = {
  en: enUS as TimeLocaleDefinition,
  nb: nbNO as TimeLocaleDefinition,
};

export default locales;
