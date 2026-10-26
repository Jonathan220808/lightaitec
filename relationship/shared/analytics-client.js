(function () {
  var endpoint = "/relationship/analytics/collect";
  var storageKey = "relationship.analytics.visitorId";
  var excludedPrefixes = ["/relationship/xiaohongshu-match-tool"];

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "v-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

  function visitorId() {
    try {
      var existing = window.localStorage.getItem(storageKey);
      if (existing) return existing;
      var created = uuid();
      window.localStorage.setItem(storageKey, created);
      return created;
    } catch (error) {
      return uuid();
    }
  }

  function shouldTrack(path) {
    if (!path || path.indexOf("/relationship/") !== 0) return false;
    return !excludedPrefixes.some(function (prefix) {
      return path.indexOf(prefix) === 0;
    });
  }

  function send(payload) {
    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      var blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(endpoint, blob)) return;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      keepalive: true,
      credentials: "omit"
    }).catch(function () {});
  }

  var lastPath = "";
  function trackPage() {
    var path = window.location.pathname;
    if (!shouldTrack(path)) return;
    var params = new URLSearchParams(window.location.search);
    var view = params.get("view");
    var game = params.get("game");
    // Room codes and player content are deliberately excluded from page-view records.
    if (view && game) path += "?view=" + encodeURIComponent(view) + "&game=" + encodeURIComponent(game);
    if (path === lastPath) return;
    lastPath = path;
    send({
      visitorId: visitorId(), path: path, title: document.title || "",
      screen: window.screen ? { width: window.screen.width, height: window.screen.height } : null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
    });
  }
  trackPage();
  window.addEventListener("relationship-route", trackPage);
})();
