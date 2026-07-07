/**
 * Runs before React — fixes LinkedIn / social in-app browsers that report
 * a desktop-width viewport and cache old layouts.
 */
(function () {
  var ua = navigator.userAgent || "";
  var inApp =
    /LinkedInApp|LinkedIn|FBAN|FBAV|Instagram|Twitter|Line\/|MicroMessenger|WhatsApp/i.test(ua);
  var narrow = window.innerWidth < 768;
  var touchPhone =
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;

  if (!inApp && !narrow && !touchPhone) return;

  var root = document.documentElement;
  root.classList.add("force-mobile");
  if (inApp) root.classList.add("in-app-browser");

  var meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute(
      "content",
      "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
    );
  }

  var style = document.createElement("style");
  style.id = "vf-mobile-shell";
  style.textContent =
    "html.force-mobile .vf-desktop-nav," +
    "html.force-mobile aside.vf-desktop-nav{display:none!important;visibility:hidden!important}" +
    "html.force-mobile aside.fixed.left-0:not(.vf-mobile-drawer):not(.vf-bottom-nav){display:none!important}" +
    "html.force-mobile main{margin-left:0!important;width:100%!important;max-width:100vw!important}" +
    "html.force-mobile .vf-mobile-topbar{display:flex!important}" +
    "html.force-mobile .vf-bottom-nav{display:block!important}" +
    "html.force-mobile .vf-mobile-drawer:not(.is-open){transform:translateX(-100%)!important;visibility:hidden!important;pointer-events:none!important}";
  document.head.appendChild(style);
})();
