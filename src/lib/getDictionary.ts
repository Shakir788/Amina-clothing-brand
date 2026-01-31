import 'server-only';

// Dictionary mapping
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default),
  ar: () => import('@/dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  // Agar locale valid hai (en/fr/ar) toh load karo, nahi toh default 'en'
  // @ts-ignore
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries['en']();
};