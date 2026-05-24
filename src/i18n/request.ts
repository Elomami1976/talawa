import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ar", "fr", "tr", "ur", "de", "ru", "id"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (locales as readonly string[]).includes(requested)
      ? requested
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "UTC",
    now: new Date(),
  };
});
