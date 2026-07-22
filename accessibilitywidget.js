/*
  תוסף נגישות - גל פרנקו | ספורטתרפיסטית שיקומית
  בנוי בהתאם לתקן הישראלי ת"י 5568 (מבוסס WCAG 2.0 רמה AA).
  כפתור צף, קבוע במסך (סטיקי), בפינה השמאלית התחתונה.
  ההגדרות נשמרות בין דפים ובין ביקורים (localStorage).
*/
(function () {
  "use strict";

  var STORAGE_KEY = "galA11yPrefs";
  var ROOT_ID = "gal-a11y-root";
  var STYLE_ID = "gal-a11y-styles";

  var FONT_STEPS = [100, 110, 125, 140, 155];

  var DEFAULT_PREFS = {
    fontStep: 0,
    contrast: false,
    grayscale: false,
    underlineLinks: false,
    readableFont: false,
    letterSpacing: false,
    stopAnimations: false,
    bigCursor: false,
    highlightTitles: false
  };

  var TOGGLE_DEFS = [
    { key: "contrast", cls: "a11y-contrast", label: "ניגודיות גבוהה", icon: iconContrast },
    { key: "grayscale", cls: "a11y-grayscale", label: "גווני אפור", icon: iconGrayscale },
    { key: "underlineLinks", cls: "a11y-underline-links", label: "הדגשת קישורים", icon: iconLink },
    { key: "readableFont", cls: "a11y-readable-font", label: "פונט קריא", icon: iconFont },
    { key: "letterSpacing", cls: "a11y-letter-spacing", label: "ריווח טקסט מוגדל", icon: iconSpacing },
    { key: "stopAnimations", cls: "a11y-stop-animations", label: "עצירת אנימציות", icon: iconStop },
    { key: "bigCursor", cls: "a11y-big-cursor", label: "סמן מוגדל", icon: iconCursor },
    { key: "highlightTitles", cls: "a11y-highlight-titles", label: "הדגשת כותרות", icon: iconTitle }
  ];

  function loadPrefs() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_PREFS);
      var parsed = JSON.parse(raw);
      var prefs = clone(DEFAULT_PREFS);
      for (var k in prefs) {
        if (Object.prototype.hasOwnProperty.call(parsed, k)) prefs[k] = parsed[k];
      }
      return prefs;
    } catch (e) {
      return clone(DEFAULT_PREFS);
    }
  }

  function savePrefs(prefs) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) { /* localStorage unavailable - degrade silently */ }
  }

  function clone(obj) {
    var out = {};
    for (var k in obj) out[k] = obj[k];
    return out;
  }

  function applyPrefs(prefs) {
    var html = document.documentElement;
    FONT_STEPS.forEach(function (_, i) {
      html.classList.remove("a11y-zoom-" + i);
    });
    if (prefs.fontStep > 0) html.classList.add("a11y-zoom-" + prefs.fontStep);

    TOGGLE_DEFS.forEach(function (def) {
      html.classList.toggle(def.cls, !!prefs[def.key]);
    });
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = "" +
      "#" + ROOT_ID + " *{box-sizing:border-box;}" +
      "#" + ROOT_ID + "{position:fixed;bottom:24px;left:24px;z-index:999999;font-family:Heebo,Arial,sans-serif;direction:rtl;}" +
      "#" + ROOT_ID + " .gal-a11y-btn{width:56px;height:56px;border-radius:50%;background:#c9938a;border:none;box-shadow:0 4px 16px rgba(42,34,32,0.35);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s ease,background .15s ease;}" +
      "#" + ROOT_ID + " .gal-a11y-btn:hover{background:#a06860;transform:scale(1.06);}" +
      "#" + ROOT_ID + " .gal-a11y-btn:focus-visible{outline:3px solid #2f6fed;outline-offset:3px;}" +
      "#" + ROOT_ID + " .gal-a11y-btn svg{width:30px;height:30px;}" +
      "#" + ROOT_ID + " .gal-a11y-panel{position:absolute;bottom:68px;left:0;width:min(320px,88vw);max-height:70vh;overflow-y:auto;background:#fff;border:1px solid #f0e0dc;border-radius:16px;box-shadow:0 12px 40px rgba(42,34,32,0.25);padding:18px;display:none;}" +
      "#" + ROOT_ID + " .gal-a11y-panel.open{display:block;}" +
      "#" + ROOT_ID + " .gal-a11y-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}" +
      "#" + ROOT_ID + " .gal-a11y-head h2{font-size:16px;font-weight:800;color:#2a2220;margin:0;}" +
      "#" + ROOT_ID + " .gal-a11y-close{background:none;border:none;cursor:pointer;font-size:20px;line-height:1;color:#746c60;padding:4px;border-radius:6px;}" +
      "#" + ROOT_ID + " .gal-a11y-close:hover{color:#2a2220;}" +
      "#" + ROOT_ID + " .gal-a11y-close:focus-visible{outline:3px solid #2f6fed;outline-offset:2px;}" +
      "#" + ROOT_ID + " .gal-a11y-fontrow{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#f8f0ee;border-radius:10px;padding:8px 10px;margin-bottom:10px;}" +
      "#" + ROOT_ID + " .gal-a11y-fontrow span{font-size:12.5px;color:#4a3e38;font-weight:600;}" +
      "#" + ROOT_ID + " .gal-a11y-fontbtn{width:32px;height:32px;border-radius:8px;border:1px solid #e1ddd5;background:#fff;cursor:pointer;font-weight:800;font-size:15px;color:#2a2220;}" +
      "#" + ROOT_ID + " .gal-a11y-fontbtn:hover{background:#f0e0dc;}" +
      "#" + ROOT_ID + " .gal-a11y-fontbtn:focus-visible, #" + ROOT_ID + " .gal-a11y-toggle:focus-visible{outline:3px solid #2f6fed;outline-offset:2px;}" +
      "#" + ROOT_ID + " .gal-a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}" +
      "#" + ROOT_ID + " .gal-a11y-toggle{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 6px;border-radius:10px;border:1px solid #e1ddd5;background:#fff;cursor:pointer;font-size:11.5px;color:#2a2220;text-align:center;line-height:1.3;}" +
      "#" + ROOT_ID + " .gal-a11y-toggle:hover{background:#f8f0ee;}" +
      "#" + ROOT_ID + " .gal-a11y-toggle[aria-pressed='true']{background:#c9938a;border-color:#c9938a;color:#fff;}" +
      "#" + ROOT_ID + " .gal-a11y-toggle svg{width:20px;height:20px;}" +
      "#" + ROOT_ID + " .gal-a11y-foot{border-top:1px solid #f0e0dc;padding-top:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;}" +
      "#" + ROOT_ID + " .gal-a11y-reset{font-size:12.5px;color:#a06860;background:none;border:none;cursor:pointer;font-weight:600;text-decoration:underline;padding:4px;}" +
      "#" + ROOT_ID + " .gal-a11y-statement{font-size:12.5px;color:#746c60;text-decoration:underline;}" +

      /* --- global effects applied to the whole page --- */
      "html.a11y-zoom-1{zoom:" + (FONT_STEPS[1] / 100) + ";}" +
      "html.a11y-zoom-2{zoom:" + (FONT_STEPS[2] / 100) + ";}" +
      "html.a11y-zoom-3{zoom:" + (FONT_STEPS[3] / 100) + ";}" +
      "html.a11y-zoom-4{zoom:" + (FONT_STEPS[4] / 100) + ";}" +
      "html.a11y-grayscale{filter:grayscale(1);}" +
      "html.a11y-contrast *:not(#" + ROOT_ID + "):not(#" + ROOT_ID + " *){background-color:#000000 !important;color:#ffff00 !important;border-color:#ffff00 !important;box-shadow:none !important;}" +
      "html.a11y-contrast img:not(#" + ROOT_ID + " img){filter:grayscale(1) contrast(1.4);}" +
      "html.a11y-underline-links a{text-decoration:underline !important;}" +
      "html.a11y-readable-font, html.a11y-readable-font *{font-family:Arial,Helvetica,sans-serif !important;}" +
      "html.a11y-letter-spacing *{letter-spacing:0.06em !important;line-height:1.8 !important;word-spacing:0.15em !important;}" +
      "html.a11y-stop-animations *, html.a11y-stop-animations *::before, html.a11y-stop-animations *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important;}" +
      "html.a11y-big-cursor, html.a11y-big-cursor *{cursor:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 24 24\"><path d=\"M3 2 L3 20 L8 16 L11 22 L14 21 L11 15 L18 15 Z\" fill=\"black\" stroke=\"white\" stroke-width=\"1.5\"/></svg>') 4 4, auto !important;}" +
      "html.a11y-highlight-titles h1:not(#" + ROOT_ID + " h1), html.a11y-highlight-titles h2:not(#" + ROOT_ID + " h2), html.a11y-highlight-titles h3:not(#" + ROOT_ID + " h3){background:#fff200 !important;color:#111 !important;outline:2px solid #111;}" +
      "@media (max-width:480px){#" + ROOT_ID + "{bottom:16px;left:16px;}#" + ROOT_ID + " .gal-a11y-panel{bottom:64px;}}";

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function svg(paths, viewBox) {
    return '<svg viewBox="' + (viewBox || "0 0 24 24") + '" fill="currentColor" aria-hidden="true">' + paths + "</svg>";
  }

  function iconAccess() {
    return svg(
      '<circle cx="12" cy="4.5" r="2.2"/>' +
      '<rect x="4" y="8" width="16" height="3" rx="1.5"/>' +
      '<rect x="10.3" y="8" width="3.4" height="10" rx="1.5"/>' +
      '<rect x="4.5" y="16.5" width="4.6" height="3" rx="1.3" transform="rotate(20 4.5 16.5)"/>' +
      '<rect x="14.9" y="16.5" width="4.6" height="3" rx="1.3" transform="rotate(-20 19.5 16.5)"/>'
    );
  }
  function iconContrast() {
    return svg('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 000 18z"/>');
  }
  function iconGrayscale() {
    return svg('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 6a6 6 0 010 12z"/>');
  }
  function iconLink() {
    return svg('<path d="M9 15l6-6M9 8H6a4 4 0 000 8h2m6-8h2a4 4 0 010 8h-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
  }
  function iconFont() {
    return svg('<path d="M6 18L10 6h2l4 12M7.2 14h7.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');
  }
  function iconSpacing() {
    return svg('<path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
  }
  function iconStop() {
    return svg('<rect x="6" y="6" width="5" height="12" rx="1"/><rect x="13" y="6" width="5" height="12" rx="1"/>');
  }
  function iconCursor() {
    return svg('<path d="M5 3l4 16 2.2-6.2L17 11z" fill="currentColor" stroke="currentColor" stroke-width="1"/>');
  }
  function iconTitle() {
    return svg('<path d="M5 5h14M5 5v14M5 12h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>');
  }
  function iconReset() {
    return svg('<path d="M4 4v6h6M20 20v-6h-6M4.6 15A8 8 0 0019 9M19.4 9A8 8 0 005 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');
  }

  function buildUI(prefs) {
    var root = document.createElement("div");
    root.id = ROOT_ID;

    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "gal-a11y-btn";
    toggleBtn.setAttribute("aria-label", "פתיחת תפריט נגישות");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-controls", "gal-a11y-panel");
    toggleBtn.innerHTML = iconAccess();

    var panel = document.createElement("div");
    panel.className = "gal-a11y-panel";
    panel.id = "gal-a11y-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "אפשרויות נגישות");

    var head = document.createElement("div");
    head.className = "gal-a11y-head";
    head.innerHTML = '<h2>אפשרויות נגישות</h2>';
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "gal-a11y-close";
    closeBtn.setAttribute("aria-label", "סגירת תפריט נגישות");
    closeBtn.innerHTML = "&#10005;";
    head.appendChild(closeBtn);
    panel.appendChild(head);

    var fontRow = document.createElement("div");
    fontRow.className = "gal-a11y-fontrow";
    var minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "gal-a11y-fontbtn";
    minusBtn.setAttribute("aria-label", "הקטנת גופן");
    minusBtn.textContent = "א-";
    var fontLabel = document.createElement("span");
    fontLabel.textContent = "גודל טקסט: " + FONT_STEPS[prefs.fontStep] + "%";
    var plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "gal-a11y-fontbtn";
    plusBtn.setAttribute("aria-label", "הגדלת גופן");
    plusBtn.textContent = "א+";
    fontRow.appendChild(plusBtn);
    fontRow.appendChild(fontLabel);
    fontRow.appendChild(minusBtn);
    panel.appendChild(fontRow);

    var grid = document.createElement("div");
    grid.className = "gal-a11y-grid";
    var toggleButtons = {};
    TOGGLE_DEFS.forEach(function (def) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gal-a11y-toggle";
      btn.setAttribute("aria-pressed", prefs[def.key] ? "true" : "false");
      btn.innerHTML = def.icon() + "<span>" + def.label + "</span>";
      grid.appendChild(btn);
      toggleButtons[def.key] = btn;

      btn.addEventListener("click", function () {
        prefs[def.key] = !prefs[def.key];
        btn.setAttribute("aria-pressed", prefs[def.key] ? "true" : "false");
        applyPrefs(prefs);
        savePrefs(prefs);
      });
    });
    panel.appendChild(grid);

    var foot = document.createElement("div");
    foot.className = "gal-a11y-foot";
    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "gal-a11y-reset";
    resetBtn.innerHTML = iconReset() + " איפוס הגדרות";
    resetBtn.style.display = "flex";
    resetBtn.style.alignItems = "center";
    resetBtn.style.gap = "4px";
    resetBtn.querySelector("svg").style.width = "14px";
    resetBtn.querySelector("svg").style.height = "14px";

    var statementLink = document.createElement("a");
    statementLink.className = "gal-a11y-statement";
    statementLink.href = "accessibility.html";
    statementLink.textContent = "הצהרת נגישות";

    foot.appendChild(resetBtn);
    foot.appendChild(statementLink);
    panel.appendChild(foot);

    root.appendChild(toggleBtn);
    root.appendChild(panel);
    document.body.appendChild(root);

    function setFontStep(step) {
      prefs.fontStep = Math.max(0, Math.min(FONT_STEPS.length - 1, step));
      fontLabel.textContent = "גודל טקסט: " + FONT_STEPS[prefs.fontStep] + "%";
      applyPrefs(prefs);
      savePrefs(prefs);
    }
    plusBtn.addEventListener("click", function () { setFontStep(prefs.fontStep + 1); });
    minusBtn.addEventListener("click", function () { setFontStep(prefs.fontStep - 1); });

    function openPanel() {
      panel.classList.add("open");
      toggleBtn.setAttribute("aria-expanded", "true");
      closeBtn.focus();
    }
    function closePanel(returnFocus) {
      panel.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
      if (returnFocus) toggleBtn.focus();
    }

    toggleBtn.addEventListener("click", function () {
      if (panel.classList.contains("open")) closePanel(false);
      else openPanel();
    });
    closeBtn.addEventListener("click", function () { closePanel(true); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) closePanel(true);
    });
    document.addEventListener("click", function (e) {
      if (!panel.classList.contains("open")) return;
      if (root.contains(e.target)) return;
      closePanel(false);
    });

    resetBtn.addEventListener("click", function () {
      prefs = clone(DEFAULT_PREFS);
      savePrefs(prefs);
      applyPrefs(prefs);
      fontLabel.textContent = "גודל טקסט: " + FONT_STEPS[prefs.fontStep] + "%";
      TOGGLE_DEFS.forEach(function (def) {
        toggleButtons[def.key].setAttribute("aria-pressed", "false");
      });
    });
  }

  function init() {
    injectStyles();
    var prefs = loadPrefs();
    applyPrefs(prefs);
    buildUI(prefs);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
