document.addEventListener("DOMContentLoaded", function() {
    const headerRows = document.querySelectorAll('.header-row');
    const resultDiv = document.getElementById('resultado');

    const headerNames = [];
    const values = []; 

    headerRows.forEach(row => {
      const headerInput = row.querySelector('input[type="text"]');
      const valueInput = row.querySelector('input[type="text"][id^="header-value"]');

      headerInput.addEventListener('input', () => {
        const headerNumber = headerInput.id.split('-')[1];

        headerNames[headerNumber - 1] = headerInput.value;
        values[headerNumber - 1] = { header: headerInput.value, value: '' };
        console.log(values);
      });

      valueInput.addEventListener('input', () => {
        const headerNumber = valueInput.id.split('-')[2]; 

        if (values[headerNumber - 1]) {
          values[headerNumber - 1].value = valueInput.value;
          console.log(values);
        }
      }); });

    const sendRequestButton = document.getElementById("btnRequest");
    sendRequestButton.addEventListener('click', () => {
      const urlInput = document.getElementById("urlInput").value;
      const methodInput = document.getElementById("methodInput").value.toUpperCase();
      const jsonInput = document.getElementById("jsonInput").value.trim(); 
      var body;

      const body = parseJSONInput(jsonInput);

      const headers = new Headers();
      headers.append('Content-Type', 'application/json')

      values.forEach(pair => {
        if (pair.header && pair.value) {
          headers.append(pair.header, pair.value);
        }
      });

      const requestOptions = {
        method: methodInput,
        headers: headers,
        body: body
      };

      log(requestOptions)

      fazerRequisicao(urlInput, requestOptions, resultDiv);
    });
});

function fazerRequisicao(url, options, resultDiv) {
  fetch(url, options)
    .then(response => {
      if (!response.ok) {
        console.log(response);
        throw new Error('Erro na requisição.');
      }
      return response.json(); 
    })
    .then(resultado => {
      console.log(resultado); 
      const resultHtml = JSON.stringify(resultado, null, 2);
      resultDiv.innerHTML = `<pre>${resultHtml}</pre>`;
      resultDiv.style.display = "block";
    })
    .catch(error => {
      console.error(error); 
      resultDiv.innerHTML = 'Ocorreu um erro na requisição.';
    });
}

function parseJSONInput(jsonInput) {
  if (jsonInput != null && jsonInput !== "") {
    try {
      const body = JSON.parse(jsonInput);
      console.log("JSON capturado:", body);
      return JSON.stringify(body);
    } catch (error) {
      console.error("Erro ao analisar JSON:", error);
      return null;
    }
  }
  return null;
}

function log(options) {
  console.log(options)
  options.headers.forEach((value, key) => {
        console.log(key + ": " + value);
  });
}
//  {"email": "luis@test.com","senha": "senha"}
//  http://localhost:8080/auth/login