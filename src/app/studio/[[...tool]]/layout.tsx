/** The Studio owns the full viewport, so it opts out of the public site chrome. */
export default function StudioLayout({ children }: LayoutProps<"/studio/[[...tool]]">) {
  return (
    <div
      id="sanity"
      style={{
        height: "100vh",
        maxHeight: "100dvh",
        overflow: "auto",
        overscrollBehavior: "none",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {children}
    </div>
  );
}
