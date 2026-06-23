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

  /* ---- News: fade out the bottom gradient + hint when scrolled to the end ---- */
  function bindNewsScroll() {
    var wrap = document.querySelector(".news-wrap");
    var scroller = wrap && wrap.querySelector(".news-scroll");
    if (!wrap || !scroller) return;
    function update() {
      var atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 6;
      wrap.classList.toggle("at-end", atEnd);
    }
    scroller.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---- Email: click to copy address ---- */
  function bindCopy() {
    document.querySelectorAll(".email-copy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var done = function () {
          btn.classList.add("copied");
          var hint = btn.querySelector(".copy-hint");
          var prev = hint ? hint.textContent : "";
          if (hint) hint.textContent = "Copied";
          setTimeout(function () {
            btn.classList.remove("copied");
            if (hint) hint.textContent = prev || "Copy";
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {});
        } else {
          var ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });
  }

  /* ---- Visitor counter ----
     Uses a free, no-signup counter API. To swap providers (e.g. GoatCounter),
     change NAMESPACE/KEY/ENDPOINT below; the element hides itself if the
     service is unreachable so nothing ever looks broken. */
  function bindCounter() {
    var el = document.querySelector("[data-visits]");
    if (!el) return;
    var wrap = el.closest(".visits");
    var NAMESPACE = "rishabh-1086";
    var KEY = "portfolio";
    var base = "https://api.counterapi.dev/v1/" + NAMESPACE + "/" + KEY;

    var counted = false;
    try { counted = sessionStorage.getItem("rv_counted") === "1"; } catch (e) {}
    var url = counted ? base + "/" : base + "/up";

    fetch(url, { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var n = d && (d.count != null ? d.count : d.value);
        if (n == null || isNaN(n)) throw new Error("bad payload");
        el.textContent = Number(n).toLocaleString();
        if (wrap) wrap.classList.add("is-ready");
        try { sessionStorage.setItem("rv_counted", "1"); } catch (e) {}
      })
      .catch(function () { /* leave hidden — never show a broken widget */ });
  }


  /* ---- In-page section nav: highlight current section ---- */
  function bindSecnav() {
    var nav = document.querySelector(".secnav");
    if (!nav) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
    var map = {}; var targets = [];
    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) { map[el.id] = a; targets.push(el); }
    });
    if (!("IntersectionObserver" in window) || !targets.length) return;
    if (links[0]) links[0].classList.add("is-active");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          if (map[e.target.id]) map[e.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-18% 0px -72% 0px", threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---- Footer year ---- */
  function bindYear() {
    document.querySelectorAll("[data-year]").forEach(function (y) {
      y.textContent = new Date().getFullYear();
    });
  }

  function init() {
    bindTheme(); bindReveal(); bindNewsScroll();
    bindCopy(); bindSecnav(); bindYear();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
