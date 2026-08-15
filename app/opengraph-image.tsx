import { ImageResponse } from "next/og";

import { profile } from "@/content/site";

export const alt = `${profile.name} — ${profile.roles[0]}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#060607",
          backgroundImage:
            "radial-gradient(900px 520px at 15% -10%, rgba(124,106,247,0.30), transparent 60%), radial-gradient(700px 420px at 95% 110%, rgba(62,216,245,0.16), transparent 60%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#7c6af7",
            }}
          />
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#9a9aa8", textTransform: "uppercase" }}>
            {profile.roles.join("  ·  ")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: -4,
              fontWeight: 600,
              display: "flex",
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.35,
              color: "#b6b6c2",
              maxWidth: 900,
              display: "flex",
            }}
          >
            {profile.headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: 28,
            fontSize: 22,
            color: "#9a9aa8",
          }}
        >
          <div style={{ display: "flex" }}>{profile.location}</div>
          <div style={{ display: "flex" }}>{profile.siteUrl.replace("https://", "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
