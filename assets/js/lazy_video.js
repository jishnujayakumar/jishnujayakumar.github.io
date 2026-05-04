// Defer publication-preview video downloads until the element scrolls
// into view. Each <video.lazy-video> carries the real URL on data-src;
// we attach a <source> and call load() only on intersect, then start
// playback once the metadata is ready.
(function () {
  function hydrate(video) {
    if (video.dataset.hydrated) return;
    video.dataset.hydrated = "1";
    var src = video.getAttribute("data-src");
    if (!src) return;
    var s = document.createElement("source");
    s.src = src;
    s.type = "video/mp4";
    video.appendChild(s);
    video.load();
    var play = function () {
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    };
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });
  }

  function init() {
    var videos = document.querySelectorAll("video.lazy-video");
    if (!videos.length) return;
    if (!("IntersectionObserver" in window)) {
      videos.forEach(hydrate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          hydrate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "200px 0px" });
    videos.forEach(function (v) { io.observe(v); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
