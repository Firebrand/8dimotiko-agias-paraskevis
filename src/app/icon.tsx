import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** "8" monogram favicon matching the header logo. ASCII only, so no font loading. */
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
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 45%, #ff7a11 100%)",
          borderRadius: 16,
          color: "white",
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        8
      </div>
    ),
    size,
  );
}
