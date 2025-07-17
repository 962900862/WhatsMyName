import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  if (!routing.locales.includes(locale as any)) {
    locale = "en";
  }

  try {
    const landingMessages = (await import(`./pages/landing/${locale.toLowerCase()}.json`))
      .default;
    return {
      locale: locale,
      messages: {
        landing: landingMessages
      },
    };
  } catch (e) {
    const landingMessages = (await import(`./pages/landing/en.json`)).default;
    return {
      locale: "en",
      messages: {
        landing: landingMessages
      },
    };
  }
});
