import { ImageResponse } from "next/og";

import { profile } from "@/content/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#060607",
          backgroundImage: "radial-gradient(60px 60px at 20% 10%, rgba(124,106,247,0.75), transparent 70%)",
          color: "#fafafa",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: -1,
          borderRadius: 14,
          fontFamily: "sans-serif",
        }}
      >
        {profile.initials}
      </div>
    ),
    size,
  );
}
