"use client";

import DepthBackground from "./DepthBackground";

export default function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="bg-decor">
      <span className="bg-orb orb-a" />
      <span className="bg-orb orb-b" />
      <span className="bg-orb orb-c" />
      <DepthBackground />
    </div>
  );
}
