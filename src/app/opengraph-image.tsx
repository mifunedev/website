import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "linear-gradient(#22c55e14 1px, transparent 1px), linear-gradient(90deg, #22c55e14 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          fontFamily: "sans-serif",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              color: "#4ade80",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Open Harness · Maintained by Mifune
          </div>
          <div
            style={{
              fontSize: "72px",
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#f4f4f5",
              maxWidth: "1000px",
            }}
          >
            Run coding agents in a sandbox, not on your machine.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              marginTop: "32px",
            }}
          >
            Open Harness Cloud · Apache-2.0 licensed open source · Mifune
            engineering
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
