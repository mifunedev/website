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
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              color: "#22c55e",
              letterSpacing: "0.1em",
            }}
          >
            Mifune
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#a1a1aa",
              fontWeight: 400,
            }}
          >
            Managed AI Workers for Your Business
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
