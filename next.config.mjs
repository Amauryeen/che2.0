export default async () => {
  /** @type {import("next").NextConfig} */

  const nextConfig = {};

  if (process.env.NODE_ENV !== 'development') {
    const withSerwist = (await import("@serwist/next")).default({
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
      cacheOnNavigation: true,
      register: false,
      reloadOnOnline: true,
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};