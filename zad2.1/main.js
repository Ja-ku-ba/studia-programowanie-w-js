import './style.css'
import './node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Chart, registerables} from 'chart.js';

// define variables
const url = 'https://api.frankfurter.app'
let rates = []
let dates = []

/////////////////////////////////
// Api operations
/////////////////////////////////
// get possible currencies list
let currencies = []
const fetchCurencies = async () => {
  fetch(`${url}/currencies`)
  .then(response => response.json())
  .then(data => {
    currencies = data
    mountBaseCurencySelector()
    mountCurencieslist()
  });
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
  console.log(value)
}

const getInitChart = () => {
  fetch('https://api.frankfurter.app/2000-01-01..2024-12-31?to=PLN,EUR')
    .then(response => response.json())
    .then(data => {
      // rates = Object.keys(data.rates).map(key => (console.log(key)));
      
      for (let x in data.rates) {
        rates.push(data.rates[x]['PLN'])
        dates.push(x)
      }
      console.log(dates)
      console.log(rates)
    });
}

await fetchCurencies()
assignBaseCurrency()
getInitChart()



/////////////////////////////////
// Generate charts
/////////////////////////////////
Chart.register(...registerables);
const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: dates,
    datasets: [{
      label: '# of Votes',
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
  },
    zoom: {
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'xy'
      }
    }
});
  
