(function () {
  var scriptUrl = document.currentScript && document.currentScript.src;
  var dataUrl = scriptUrl
    ? new URL("../assets/updated.json", scriptUrl).href
    : "../assets/updated.json";

  function toDate(value) {
    if (typeof value !== "string" || value === "") {
      return null;
    }
    var date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  function setDate(id, value, options) {
    var date = toDate(value);
    var el = document.getElementById(id);
    if (el && date) {
      el.textContent = new Intl.DateTimeFormat("en", options).format(date);
    }
  }

  // The dates in assets/updated.json are generated at deploy time by
  // .github/workflows/deploy.yml, so visitors never call the GitHub API.
  // If the file is missing or invalid, the dates hardcoded in the HTML remain.
  fetch(dataUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Request failed: " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      setDate("cv-updated", data.cv, { month: "long", year: "numeric" });
      setDate("site-updated", data.site, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    })
    .catch(function () {});
})();
