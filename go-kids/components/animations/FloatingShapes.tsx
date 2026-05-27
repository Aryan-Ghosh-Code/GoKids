"use client";

export default function FloatingShapes() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Large yellow circle - top right */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "-80px",
          right: "-60px",
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "rgba(245, 197, 24, 0.18)",
          filter: "blur(40px)",
          animationDelay: "0s",
        }}
      />
      {/* Teal blob - bottom left */}
      <div
        className="animate-float-delayed"
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-80px",
          width: 280,
          height: 280,
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          background: "rgba(43, 188, 176, 0.14)",
          filter: "blur(36px)",
          animationDelay: "1.5s",
        }}
      />
      {/* Coral blob - top left */}
      <div
        className="animate-float-slow"
        style={{
          position: "absolute",
          top: "30%",
          left: "10%",
          width: 200,
          height: 200,
          borderRadius: "50% 70% 40% 60% / 60% 40% 70% 30%",
          background: "rgba(244, 132, 95, 0.12)",
          filter: "blur(30px)",
          animationDelay: "3s",
        }}
      />
      {/* Small yellow dot - mid right */}
      <div
        className="animate-float"
        style={{
          position: "absolute",
          top: "50%",
          right: "8%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(245, 197, 24, 0.22)",
          filter: "blur(20px)",
          animationDelay: "2s",
        }}
      />
    </div>
  );
}
