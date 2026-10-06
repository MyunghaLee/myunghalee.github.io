(function () {
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

  // CV: latest release or GitHub Pages deployment of myunghalee/cv
  latestOf([
    latestRelease("myunghalee/cv"),
    latestPagesDeployment("myunghalee/cv"),
  ])
    .then(function (date) {
      setDate("cv-updated", date, { month: "long", year: "numeric" });
    })
    .catch(function () {});

  // Website: latest GitHub Pages deployment of myunghalee/myunghalee.github.io
  latestPagesDeployment("myunghalee/myunghalee.github.io")
    .then(function (date) {
      setDate("site-updated", date, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    })
    .catch(function () {});
})();
