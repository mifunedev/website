import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function ServicesOGImage() {
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
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#4ade80",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Mifune Engineering | Open Harness Cloud
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: "1050px",
            fontSize: "68px",
            lineHeight: 1.05,
            fontWeight: 800,
            color: "#f4f4f5",
          }}
        >
          Adopt Open Harness Cloud with Mifune engineers alongside your team.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "25px",
            color: "#a1a1aa",
            marginTop: "32px",
          }}
        >
          Plan · implement · integrate · troubleshoot · hand off
        </div>
      </div>
    ),
    { ...size },
  );
}
