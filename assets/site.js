(function () {
  // GitHub's API allows only 60 unauthenticated requests per hour per IP, so
  // results are cached in localStorage for six hours. When a request fails
  // (offline or rate limited), the last cached values are shown instead, and
  // if there is no cache either, the dates hardcoded in the HTML remain.
  var CACHE_KEY = "myunghalee-dates-v1";
  var CACHE_TTL_MS = 6 * 60 * 60 * 1000;
  var GITHUB_API = "https://api.github.com/repos/";

  function getJSON(url) {
    return fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("Request failed: " + response.status);
      }
      return response.json();
    });
  }

  function latestPagesDeployment(repo) {
    return getJSON(
      GITHUB_API + repo + "/deployments?environment=github-pages&per_page=5"
    ).then(function (deployments) {
      if (!deployments.length) {
        throw new Error("No deployments");
      }
      return deployments.reduce(function (latest, deployment) {
        var date = new Date(deployment.created_at);
        return !latest || date > latest ? date : latest;
      }, null);
    });
  }

  function latestRelease(repo) {
    return getJSON(GITHUB_API + repo + "/releases/latest").then(function (
      release
    ) {
      return new Date(release.published_at || release.created_at);
    });
  }

  function latestOf(promises) {
    return Promise.allSettled(promises).then(function (results) {
      var dates = results
        .filter(function (result) {
          return (
            result.status === "fulfilled" &&
            result.value instanceof Date &&
            !isNaN(result.value)
          );
        })
        .map(function (result) {
          return result.value;
        });
      if (!dates.length) {
        throw new Error("No dates available");
      }
      return new Date(Math.max.apply(null, dates));
    });
  }

  function setDate(id, date, options) {
    var el = document.getElementById(id);
    if (el && date) {
      el.textContent = new Intl.DateTimeFormat("en", options).format(date);
    }
  }

  function toDate(value) {
    if (typeof value !== "string" || value === "") {
      return null;
    }
    var date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  function readCache() {
    try {
      var data = JSON.parse(window.localStorage.getItem(CACHE_KEY));
      if (!data || typeof data.savedAt !== "number") {
        return null;
      }
      return {
        savedAt: data.savedAt,
        cv: toDate(data.cv),
        site: toDate(data.site),
      };
    } catch (err) {
      return null;
    }
  }

  function writeCache(cv, site) {
    try {
      window.localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          savedAt: Date.now(),
          cv: cv ? cv.toISOString() : null,
          site: site ? site.toISOString() : null,
        })
      );
    } catch (err) {}
  }

  function isFreshCache(cache) {
    return !!cache && Date.now() - cache.savedAt < CACHE_TTL_MS;
  }

  function renderDates(cv, site) {
    setDate("cv-updated", cv, { month: "long", year: "numeric" });
    setDate("site-updated", site, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function fetchCV() {
    // Latest release or GitHub Pages deployment of myunghalee/cv.
    return latestOf([
      latestRelease("myunghalee/cv"),
      latestPagesDeployment("myunghalee/cv"),
    ]).catch(function () {
      return null;
    });
  }

  function fetchSite() {
    // Latest GitHub Pages deployment of myunghalee/myunghalee.github.io.
    return latestPagesDeployment("myunghalee/myunghalee.github.io").catch(
      function () {
        return null;
      }
    );
  }

  var cache = readCache();

  if (cache) {
    renderDates(cache.cv, cache.site);
  }

  if (!isFreshCache(cache)) {
    Promise.all([fetchCV(), fetchSite()]).then(function (dates) {
      if (!dates[0] && !dates[1]) {
        // Both requests failed; keep whatever is already displayed.
        return;
      }
      var cv = dates[0] || (cache && cache.cv) || null;
      var site = dates[1] || (cache && cache.site) || null;
      writeCache(cv, site);
      renderDates(cv, site);
    });
  }
})();
