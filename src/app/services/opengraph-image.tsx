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
              fontSize: "72px",
              fontWeight: 800,
              color: "#22c55e",
              letterSpacing: "0.05em",
            }}
          >
            Mifune — AI Workers for Your Business
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              fontWeight: 400,
            }}
          >
            AI automation built and maintained for your business
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
