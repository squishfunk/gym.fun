const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjExMTI3NTksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhhM2ZGYWZiYzc4M0EyYTA4MDM1MzQ5OTQ4MDBiRDBDZjBCNmM4NTg3In0",
    payload: "eyJkb21haW4iOiJneW0tZnVuLnZlcmNlbC5hcHAifQ",
    signature: "K4768ib/vd+5BLnN3BB7EmJWdXbM0oZ0pd8jbOo729ctjZRG+cflfpBaBklYeLxPI+ZAOx9ftbZ04p1CNuMkdxw="
  },
  baseBuilder: {
    allowedAddresses: [],
  },
  miniapp: {
    version: "1",
    name: "gym.fun",
    subtitle: "Just pump it up",
    description: "Gym.fun is a gym game on Base. It is a simple game where you can pump your gym and earn money. You can also buy items to help you pump your gym.",
    screenshotUrls: [
      `${ROOT_URL}/screenshot.png`,
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["example"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
