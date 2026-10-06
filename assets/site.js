(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var year = document.getElementById("year");
    if (year) {
      year.textContent = new Date().getFullYear();
    }
    var updatedEls = document.querySelectorAll(".js-updated");
    if (updatedEls.length) {
      var updatedText = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
      }).format(new Date());
      updatedEls.forEach(function (el) {
        el.textContent = updatedText;
      });
    }
  });
})();
