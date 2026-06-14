/* Rishabh Agrawal — site interactions */
(function () {
  "use strict";

  /* ---- Theme (respects OS pref, remembers choice) ---- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  var prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  function bindTheme() {
    var btn = document.querySelector(".theme");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---- Scroll reveal ---- */
  function bindReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 40, 240) + "ms";
      io.observe(el);
    });
  }

  /* ---- News: show all ---- */
  function bindNews() {
    var btn = document.querySelector(".news-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var hidden = document.querySelectorAll(".timeline .tl.hidden");
      hidden.forEach(function (el) { el.classList.remove("hidden"); });
      btn.remove();
    });
  }

  /* ---- Footer year ---- */
  function bindYear() {
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindTheme(); bindReveal(); bindNews(); bindYear();
    });
  } else { bindTheme(); bindReveal(); bindNews(); bindYear(); }
})();
