"use client";

import { useEffect } from "react";

/** Re-apply force-mobile after hydration if LinkedIn WebView mis-reports viewport */
export default function InAppBrowserFix() {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const inApp = /LinkedInApp|LinkedIn|FBAN|FBAV|Instagram|Twitter|WhatsApp/i.test(ua);
    const touchPhone =
      ("ontouchstart" in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;

    if (inApp || window.innerWidth < 768 || touchPhone) {
      document.documentElement.classList.add("force-mobile");
      if (inApp) document.documentElement.classList.add("in-app-browser");
    }
  }, []);

  return null;
}
