// Locale is resolved via cookie/header inside src/i18n/request.ts.
// The app does not use [locale] URL segments, so no routing middleware is needed.
export const config = {
  matcher: [],
};
