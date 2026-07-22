(function () {
  var GTM_ID = "GTM-N2HBF8W";
  var CONSENT_KEY = "galfranco_cookie_consent";

  function loadGTM() {
    if (window.__gtmLoaded) return;
    window.__gtmLoaded = true;

    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", GTM_ID);

    var ns = document.createElement("noscript");
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.googletagmanager.com/ns.html?id=" + GTM_ID;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    ns.appendChild(iframe);
    document.body.appendChild(ns);
  }

  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {}
    hideBanner();
    if (value === "accepted") loadGTM();
  }

  var banner;

  function showBanner() {
    if (banner) {
      banner.style.display = "flex";
      return;
    }
    banner = document.createElement("div");
    banner.setAttribute("dir", "rtl");
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "הסכמה לשימוש בעוגיות");
    banner.style.cssText =
      "position:fixed;bottom:0;right:0;left:0;z-index:99999;" +
      "background:#2a2220;color:#fff;padding:20px 6%;" +
      "display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;" +
      "font-family:'Heebo',sans-serif;box-shadow:0 -4px 24px rgba(0,0,0,0.15);";
    banner.innerHTML =
      '<div style="flex:1;min-width:240px;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.9)">' +
      "אנחנו משתמשים בעוגיות (Cookies) לצורך ניתוח השימוש באתר והתאמת פרסום, ובכלל זה באמצעות Google Analytics, Meta ו-TikTok. " +
      'ניתן לקרוא עוד ב<a href="privacy.html" style="color:#e0a99a;text-decoration:underline">הצהרת הפרטיות</a>.' +
      "</div>" +
      '<div style="display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap">' +
      '<button type="button" id="cc-reject" style="background:transparent;border:1.5px solid rgba(255,255,255,0.5);color:#fff;padding:10px 20px;border-radius:24px;font-size:14px;font-family:\'Heebo\',sans-serif;cursor:pointer">רק הכרחיים</button>' +
      '<button type="button" id="cc-accept" style="background:#c9938a;border:none;color:#fff;padding:10px 22px;border-radius:24px;font-size:14px;font-weight:600;font-family:\'Heebo\',sans-serif;cursor:pointer">אישור הכל</button>' +
      "</div>";
    document.body.appendChild(banner);
    banner.querySelector("#cc-accept").addEventListener("click", function () {
      setConsent("accepted");
    });
    banner.querySelector("#cc-reject").addEventListener("click", function () {
      setConsent("rejected");
    });
  }

  function hideBanner() {
    if (banner) banner.style.display = "none";
  }

  function init() {
    var consent = getConsent();
    if (consent === "accepted") {
      loadGTM();
    } else if (consent !== "rejected") {
      showBanner();
    }
  }

  // Exposed so a "manage cookies" footer link can reopen the banner at any time.
  window.openCookiePreferences = function () {
    showBanner();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
