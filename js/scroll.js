(function () {
  "use strict";

  let track = null;
  let sections = [];
  let current = 0;
  let startX = 0;
  let startY = 0;

  function getViewportWidth() {
    return document.documentElement.clientWidth || window.innerWidth;
  }
  function important(el, prop, value) {
    el.style.setProperty(prop, value, "important");
  }

  function buildMobile() {
    if (getViewportWidth() > 700) return;

    sections = [
      document.querySelector("header"),
      ...document.querySelectorAll("section")
    ].filter(Boolean);

    if (!sections.length) return;

    track = document.querySelector(".aura-mobile-track");

    if (!track) {
      track = document.createElement("div");
      track.className = "aura-mobile-track";

      const first = sections[0];
      first.parentNode.insertBefore(track, first);
    }

    sections.forEach(function (el) {
      track.appendChild(el);
    });

    /* BODY */
    important(document.documentElement, "width", "100%");
    important(document.documentElement, "height", "100%");
    important(document.documentElement, "overflow-x", "hidden");
    important(document.documentElement, "overflow-y", "hidden");

    important(document.body, "width", "100%");
    important(document.body, "height", "100%");
    important(document.body, "overflow-x", "hidden");
    important(document.body, "overflow-y", "hidden");

    /* TRACK */
    important(track, "position", "fixed");
    important(track, "top", "0");
    important(track, "left", "0");
    important(track, "width", "100vw");
    important(track, "height", "100vh");
    important(track, "display", "flex");
    important(track, "flex-direction", "row");
    important(track, "flex-wrap", "nowrap");
    important(track, "overflow", "visible");
    important(track, "margin", "0");
    important(track, "padding", "0");
    important(track, "direction", "ltr");
    important(track, "unicode-bidi", "bidi-override");
    important(track, "z-index", "1");
    important(track, "transition", "transform .45s ease");

    sections.forEach(function (el) {

      important(el, "position", "relative");
      important(el, "flex", "0 0 100vw");
      important(el, "width", "100vw");
      important(el, "min-width", "100vw");
      important(el, "max-width", "100vw");

      important(el, "height", "100vh");
      important(el, "min-height", "100vh");
      important(el, "max-height", "100vh");

      important(el, "box-sizing", "border-box");
      important(el, "margin", "0");

      important(el, "overflow-x", "hidden");
      important(el, "overflow-y", "auto");

      important(el, "direction", "rtl");
      important(el, "scroll-snap-align", "none");
    });

    /* العناصر الخارجية لا تتحكم في حركة الأقسام */
    const nav = document.querySelector("nav");
    if (nav) {
      important(nav, "z-index", "10000");

      const navHeight = nav.getBoundingClientRect().height;
      important(document.documentElement, "--aura-nav-height", navHeight + "px");

      sections.forEach(function (el) {
        important(
          el,
          "padding-top",
          "calc(var(--aura-nav-height) + clamp(16px, 4vw, 30px))"
        );
        important(
          el,
          "scroll-padding-top",
          "var(--aura-nav-height)"
        );
      });
    }
    if (nav) {
      important(nav, "z-index", "10000");
    }

    const footer = document.querySelector("body > footer");
    if (footer) {
      important(footer, "display", "none");
    }

    bindSwipe();
    bindSectionNavigation();
    moveTo(current, false);
  }

  function moveTo(index, animate) {
    if (!track || !sections.length) return;

    current = Math.max(
      0,
      Math.min(index, sections.length - 1)
    );

    important(
      track,
      "transition",
      animate ? "transform .45s ease" : "none"
    );

    important(
      track,
      "transform",
      "translate3d(" + (-current * 100) + "vw,0,0)"
    );
  }

  /* السحب الأفقي */
  function bindSectionNavigation() {
    if (document.documentElement.dataset.auraNavBound === "1") return;

    document.documentElement.dataset.auraNavBound = "1";

    document.addEventListener("click", function (e) {
      if (getViewportWidth() > 700) return;

      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") {
        e.preventDefault();
        moveTo(0, true);
        return;
      }

      const target = document.querySelector(hash);
      if (!target) return;

      const index = sections.indexOf(target);

      if (index >= 0) {
        e.preventDefault();
        moveTo(index, true);
      }
    });
  }
  function bindSwipe() {
    if (!track || track.dataset.swipeBound === "1") return;

    track.dataset.swipeBound = "1";
    important(track, "touch-action", "pan-y");

    track.addEventListener("touchstart", function (e) {
      if (getViewportWidth() > 700 || !e.touches.length) return;

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener("touchend", function (e) {
      if (getViewportWidth() > 700 || !track || !e.changedTouches.length) {
        return;
      }

      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return;

      if (dx < 0) {
        moveTo(current + 1, true);
      } else {
        moveTo(current - 1, true);
      }
    }, { passive: true });
  }

  /* أزرار ↑ ↓ */
  window.pageDown = function () {
    if (getViewportWidth() <= 700 && track) {
      moveTo(current + 1, true);
    } else {
      window.scrollBy({
        top: 300,
        behavior: "smooth"
      });
    }
  };

  window.pageUp = function () {
    if (getViewportWidth() <= 700 && track) {
      moveTo(current - 1, true);
    } else {
      window.scrollBy({
        top: -300,
        behavior: "smooth"
      });
    }
  };

  window.scrollToTop = function () {
    if (getViewportWidth() <= 700 && track) {
      moveTo(0, true);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  window.addEventListener("load", function () {
    setTimeout(buildMobile, 100);
  });

  window.addEventListener("resize", function () {
    if (getViewportWidth() <= 700) {
      buildMobile();
    }
  });

})();
