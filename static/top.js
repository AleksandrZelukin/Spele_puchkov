let resultsDiv = document.getElementById("rezultati");

      fetch("/api").then((response) => {
        response.json().then((results) => {
          createResultsTable(results);
        });
      });

      function createResultsTable(results) {
        let resultsTable = "<table><tr><th>Vards</th><th>Punkti</th></tr>";
        results.forEach((oneResult) => {
          resultsTable +=
            "<tr><td>" +
            oneResult.vards +
            "</td><td>" +
            oneResult.punkti +
            "</td></tr>";
        });
        resultsTable += "</table>";
        resultsDiv.innerHTML = resultsTable;
      }