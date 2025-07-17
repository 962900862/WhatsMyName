import { Pathnames } from "next-intl/routing";

// 10 developed countries and their languages including 9 new non-English languages
export const locales = ["en"];

// Localized display names
export const localeNames: any = {
  en: "English"
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "false";

export const pathnames = {
  '/privacy-policy': '/privacy-policy',
  '/terms-of-service': '/terms-of-service', 
  '/cookie-policy': '/cookie-policy',
} satisfies Pathnames<typeof locales>;
