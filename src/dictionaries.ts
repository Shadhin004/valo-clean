const dictionaries: Record<string, () => Promise<any>> = {
  fi: () => import('./dictionaries/fi.json').then((module) => module.default),
  sv: () => import('./dictionaries/sv.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale]?.() ?? dictionaries.fi();
};
