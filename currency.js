//defining variables:
let currencies = [];
let rates = {};
let swapBtn = document.querySelector(".btn");
let convertBtn = document.querySelector(".convertBtn");
let fromS = document.querySelector("#from");
let to = document.querySelector("#to");
let Amount = document.querySelector("#amount");
let resultText = document.querySelector(".resultText");
//defining functions:
function getCurrencies(url) {
  return new Promise((resolve, reject) => {
    let currReq = new XMLHttpRequest();
    currReq.open("GET", url, true);
    currReq.onreadystatechange = function () {
      setTimeout(() => {
        if (this.readyState == 4 && this.status == 200) {
          resolve(JSON.parse(currReq.response));
        } else {
          reject(
            Error(
              `Failed with status code: ${this.status} and readystate ${this.readyState}`
            )
          );
        }
      }, 2000);
    };
    currReq.send();
  });
}
function fillingSelect() {
  for (let key in currencies) {
    let val = currencies[key];
    if (val.countryName != "Global") {
      let option = document.createElement("option");
      let option2 = document.createElement("option");
      option.value = key;
      option.text = `${key}-${val.countryName}`;
      option2.value = key;
      option2.text = `${key}-${val.countryName}`;
      fromS.appendChild(option);
      to.appendChild(option2);
    }
  }
}
function getRates(url) {
  return new Promise((resolve, reject) => {
    let ratesReq = new XMLHttpRequest();
    ratesReq.open("GET", url);
    ratesReq.onreadystatechange = function () {
      setTimeout(() => {
        if (this.readyState == 4 && this.status == 200) {
          resolve(JSON.parse(ratesReq.response));
        } else {
          reject(Error(`Failed with status code: ${this.status}`));
        }
      }, 2000);
    };
    ratesReq.send();
  });
}
function swapSelect() {
  let selectedIndex1 = fromS.selectedIndex;
  let selectedIndex2 = to.selectedIndex;
  fromS.selectedIndex = selectedIndex2;
  to.selectedIndex = selectedIndex1;
}
function calculateRate(data) {
  let money = Amount.value;
  let indF = fromS.selectedIndex;
  let indT = to.selectedIndex;
  let currF = fromS.options[indF].value;
  let currT = to.options[indT].value;
  let ratio = parseFloat(data.rates[currT]) / parseFloat(data.rates[currF]);
  let res = money * ratio;
  let div = document.createElement("div");
  div.textContent = `The result of the convertion is: ${money}${currF} = ${res.toFixed(4)}${currT}`;
  resultText.innerHTML = "";
  resultText.appendChild(div);
}

//runtime
getCurrencies("https://api.currencyfreaks.com/v2.0/supported-currencies")
  .then((data) => {
    currencies = data.supportedCurrenciesMap;
    fillingSelect();
  })
  .catch((err) => {
    resultText.innerHTML = "";
    let div = document.createElement("div");
    div.textContent = `Couldn't load data!\n${err}`;
    resultText.appendChild(div);
  });

getRates(
  "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=apikeyy!!!"
)
  .then((data) => {
    rates = data;
  })
  .catch((err) => {
    resultText.innerHTML = "";
    let div = document.createElement("div");
    div.textContent = `Couldn't load data!\n${err}`;
    resultText.appendChild(div);
  });
swapBtn.addEventListener("click", () => {
  swapSelect();
});
convertBtn.addEventListener("click", () => {
  calculateRate(rates);
});
