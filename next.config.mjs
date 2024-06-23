import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  disable: process.env.NODE_ENV === "development",
  aggressiveFrontEndNavCaching: true,
  cacheOnFrontEndNav: true,
  register: false
});

export default withPWA({});