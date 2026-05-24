"use client";

import { useEffect, useState } from "react";

/**
 * Professional initial loading screen.
 * Shows a dark background with the Arabic letter "ق" glowing in green.
 * Fades out smoothly once the page is ready (or after a short max delay).
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Prevent scrolling while loader is visible
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const hide = () => {
      setFadeOut(true);
      // Remove from DOM after the fade transition completes
      window.setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = previousOverflow;
      }, 500);
    };

    // Minimum display time so the animation is perceivable, then hide
    // as soon as the window is fully loaded. Hard cap at 1.8s.
    const minDelay = 600;
    const hardCap = 1800;

    const start = performance.now();
    let hidden = false;

    const tryHide = () => {
      if (hidden) return;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, minDelay - elapsed);
      hidden = true;
      window.setTimeout(hide, wait);
    };

    if (document.readyState === "complete") {
      tryHide();
    } else {
      window.addEventListener("load", tryHide, { once: true });
    }

    const capTimer = window.setTimeout(tryHide, hardCap);

    return () => {
      window.removeEventListener("load", tryHide);
      window.clearTimeout(capTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={`loading-screen ${fadeOut ? "loading-screen--hidden" : ""}`}
    >
      <div className="loading-screen__glow" />
      <div className="loading-screen__logo">
        <span className="loading-screen__letter">ق</span>
        <span className="loading-screen__ring" />
      </div>
    </div>
  );
}
