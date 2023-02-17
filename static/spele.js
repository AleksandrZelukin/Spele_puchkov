let vardaId;
      let atbildes = [
        "OZOLS",
        "LIEPA",
        "BĒRZS",
        "KĻAVA",
        "EGLE",
        "PRIEDE",
        "KASTAŅA",
        "VĪTOLS",
        "PĪLĀDZIS",
        "ĀBELE",
      ];

      let vardaBlok = document.getElementById("burti"); //atrodam bloku, kurs satures sajaukto vardu
      let ievadLauks = document.getElementById("ievadlauks");
      let laikaLauks = document.getElementById("laiks");
      let resultsDiv = document.getElementById("rezultati");
      let pareizoAtbilzuSkaitsLauks = document.getElementById(
        "pareizoAtbilzuSkaits"
      );
      let nePareizoAtbilzuSkaitsLauks = document.getElementById(
        "nePareizoAtbilzuSkaits"
      );
      let pareizoSkaits = 0;
      let nePareizoSkaits = 0;
      pareizoAtbilzuSkaitsLauks.innerHTML = pareizoSkaits;
      nePareizoAtbilzuSkaitsLauks.innerHTML = nePareizoSkaits;

      nejausaisVards();
      fetch("/api").then((response) => {
        response.json().then((results) => {
          createResultsTable(results);
        });
      });
      let pateretasSekundes = 0;
      let pateretasMinutes = 0;
      laikaLauks.innerHTML = "00:00";
      let intervalIndex = setInterval(atjaunotLaiku, 1000);
      let punkti = 0;
      function parbaudit() {
        let ievaditaisVards = ievadLauks.value.toUpperCase();
        if (ievaditaisVards == atbildes[vardaId]) {
          pareizoSkaits = pareizoSkaits + 1;
          pareizoAtbilzuSkaitsLauks.innerHTML = pareizoSkaits;
          punkti += atbildes[vardaId].length;
          document.getElementById("punkti").innerHTML = punkti;
          alert("Pareizi!");
        } else {
          nePareizoSkaits = nePareizoSkaits + 1;
          nePareizoAtbilzuSkaitsLauks.innerHTML = nePareizoSkaits;
          alert("Nepareizi, pareiza atbilde ir: " + atbildes[vardaId]);
        }
        nejausaisVards();
        ievadLauks.value = "";
      }

      function atjaunotLaiku() {
        pateretasSekundes = pateretasSekundes + 1;
        if (pateretasSekundes == 60) {
          pateretasSekundes = 0;
          pateretasMinutes = pateretasMinutes + 1;
        }
        let papildusNullePirmsMinutem;
        if (pateretasMinutes < 10) {
          papildusNullePirmsMinutem = "0";
        } else {
          papildusNullePirmsMinutem = "";
        }
        let papildusNullePirmsSekundem = pateretasSekundes < 10 ? "0" : "";
        laikaLauks.innerHTML =
          papildusNullePirmsMinutem +
          pateretasMinutes +
          ":" +
          papildusNullePirmsSekundem +
          pateretasSekundes;
        if (pateretasMinutes == 1) {
          document.getElementById("parbauditBtn").disabled = true;
          sumbit();
          clearInterval(intervalIndex);
        }
      }

      function sumbit() {
        if (!confirm("Gribi saglabāt rezultātu?")) return;
        vards = prompt("Ievadi savu vārdu!");
        if (!vards) return;
        let dataForPost = {
          vards: vards,
          punkti: punkti,
        };
        fetch("/api", {
          method: "POST",
          body: JSON.stringify(dataForPost),
        }).then((response) => {
          response.json().then((results) => {
            createResultsTable(results);
          });
        });
      }

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

      function nejausaisVards() {
        vardaId = getRandomInt(atbildes.length);
        vardaBlok.innerHTML = sajauktVardu(atbildes[vardaId]);
        //vardaBlok.innerHTML = sajaukti[vardaId];
        //vardaBlok.innerHTML = "KVISTĒ";
      }

      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }

      function sajauktVardu(vards) {
        //vards = 'ABOLS'
        //console.log('sajauktVardu() palaists')
        //console.log('sajaukšanai='+vards)

        let vardsIzjauksanai = vards.split(""); //vardsIzjauksanai = ['A', 'B', 'O', 'L', 'S']
        //                                                  indexes:   0 ,  1 ,  2 ,  3 ,  4
        let vardaGarums = vards.length; // vardaGarums = 5
        let loopIndex = 0;
        let sajauktsVards = [];

        while (loopIndex != vardaGarums) {
          // 0 != 5 => true {}
          // 1 != 5 => true
          // 2 != 5 => true
          // 3 != 5 => true
          // 4 != 5 => true
          // 5 != 5 => !!!false!!! // izejam no cikla!
          //console.log( vards[loopIndex] )

          let randomIndex = Math.floor(Math.random() * vardsIzjauksanai.length); //random skaitlis no 0 lidz 4

          sajauktsVards.push(vardsIzjauksanai[randomIndex]); // vardsIzjauksanai[3] = 'L' sajauktsVards=['L']
          vardsIzjauksanai.splice(randomIndex, 1); //Delete burtu no sakuma varda. vardsIzjauksanai = ['A', 'B', 'O', 'S']

          //console.log(vardsIzjauksanai)

          loopIndex++; //0++ = 1; 1++ = 2 ....
        }

        //console.log(sajauktsVards)

        sajauktsVards = sajauktsVards.join(""); // ['A', 'B', 'O', 'L', 'S']  = 'ABOLS'

        return sajauktsVards;
      }