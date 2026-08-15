import type { MetadataRoute } from "next";

import { profile } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} — Portfolio`,
    short_name: profile.shortName,
    description: profile.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#060607",
    theme_color: "#060607",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
