import './style.css'
import './node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Chart, registerables} from 'chart.js';

// define variables
const url = 'https://api.frankfurter.app'
let rates = []
let dates = []
let currencies = []
let baseCurrency = ''
Chart.register(...registerables);
const ctx = document.getElementById('myChart');
let chart;

/////////////////////////////////
// Api operations
/////////////////////////////////
// get possible currencies list
const fetchCurencies = async () => {
  await fetch(`${url}/currencies`)
  .then(response => response.json())
  .then(data => {
    currencies = data
    mountBaseCurencySelector()
    mountCurencieslist()
  })
}

const mountBaseCurencySelector = () => {
  let listItems = ''
  for(const curency in currencies) { 
    listItems += `
      <li>
        <button class="dropdown-item" data-currency="${curency}">
          ${currencies[curency]} / ${curency}
        </button>
      </li>
    `
  }

  let list = `
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Wybierz walutę bazową
      </button>
      <ul class="dropdown-menu">
      ${listItems}
      </ul>
    </div>
  `
  let dropdownMenu = document.getElementById("base-currency-selector");
  dropdownMenu.innerHTML = list

  const buttons = dropdownMenu.querySelectorAll('.dropdown-item');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      assignBaseCurrency(event.target.getAttribute('data-currency'));
    });
  });
}



// get curencies, and create html
const mountCurencieslist = () => {
  let listItems = ''
  for(const curency in currencies) { 
    listItems += `
      <li class="list-group-item">
        <input class="form-check-input me-1" type="checkbox" value="" id="${currencies[curency]}">
        <label class="form-check-label stretched-link" for="${currencies[curency]}">${curency}</label>
      </li>    
    `
    }
    let list = `
    <p>Wybierz waluty odniesiena</p>
    <ul class="list-group">
      ${listItems}
    </ul>
    `
    document.getElementById("currencies-list").innerHTML = list
}

const assignBaseCurrency = (value = 'PLN') => {
  document.getElementById('base-currency').innerHTML = value
}






/////////////////////////////////
// Generate charts
/////////////////////////////////
const getInitChart = async () => {
  const response = await fetch('https://api.frankfurter.app/1900-01-01..2024-12-31?to=PLN,EUR');
  const data = await response.json();

  const promises = [];
  for (let x in data.rates) {
    promises.push(new Promise(resolve => {
      rates.push(data.rates[x]['PLN']);
      dates.push(x);
      resolve();
    }));
  }

  await Promise.all(promises);
  if (rates.length > 50) {
    document.getElementById('min-range').value = rates.length - 51
    document.getElementById('max-range').value = rates.length - 1
  }
  initialieChart();
}

const initialieChart = () => {
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: `Kursy względem: ${baseCurrency }`,
        data: rates,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
};

const getVals = () => {
  const min = parseFloat(document.getElementById('min-range').value);
  const max = parseFloat(document.getElementById('max-range').value);
  if (min > max) {
    [min, max] = [max, min];
  }
  console.log(min, max)

  const label = dates.slice(min, max);
  const value = rates.slice(min, max);

  chart.data.labels = label;
  chart.data.datasets[0].data = value;
  chart.update();
};

const registerSliderEvents = () => {
  const minSlider = document.getElementById('min-range');
  const maxSlider = document.getElementById('max-range');

  minSlider.max = dates.length - 1;
  maxSlider.max = dates.length - 1;

  minSlider.addEventListener('input', getVals);
  maxSlider.addEventListener('input', getVals);
};




await fetchCurencies()
assignBaseCurrency()
await getInitChart().then(() => {
  registerSliderEvents();
});
  // .then(() => initialieChart())
