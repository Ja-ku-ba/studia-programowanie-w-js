import './style.css'
import './node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Chart, registerables} from 'chart.js'

// define variables
const url = 'https://api.frankfurter.app'
let currencies = []
let baseCurrency = 'EUR'
let slectedCurrencies = ['PLN']  

Chart.register(...registerables)
const ctx = document.getElementById('myChart')
let chart

/////////////////////////////////
// Api operations
/////////////////////////////////
const fetchCurencies = async () => {
  await fetch(`${url}/currencies`)
  .then(response => response.json())
  .then(data => {
    currencies = data
    mountBaseCurencySelector()
    mountCurencieslist()
  })
}

const getRates = async () => {
  const today = (new Date).toISOString().slice(0, 10)
  const response = await fetch(`https://api.frankfurter.app/2020-01-01..${today}?from=${baseCurrency}`)
  const data = await response.json()
  return data
}

/////////////////////////////////
// Mount htmls
/////////////////////////////////
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
  let dropdownMenu = document.getElementById("base-currency-selector")
  dropdownMenu.innerHTML = list

  const buttons = dropdownMenu.querySelectorAll('.dropdown-item')
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      assignBaseCurrency(event.target.getAttribute('data-currency'))
    })
  })
}

// get curencies, and create html
const mountCurencieslist = () => {
  let listItems = ''
  for(const curency in currencies) { 
    listItems += `
      <li class="list-group-item">
        <input class="form-check-input me-1 currencies-list-item" type="checkbox" value="" id="${curency}">
        <label class="form-check-label stretched-link" for="${curency}">${currencies[curency]}</label>
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

// const assignBaseCurrency = (value = 'PLN') => {
//   document.getElementById('base-currency').innerHTML = value
// }


/////////////////////////////////
// Generate charts
/////////////////////////////////
const getInitChart = async () => {
  let data = await getRates()
  const dates = []
  const charts = []
  const promises = []

  slectedCurrencies.forEach((currency) => {
    const rates = []

    if (currency ===  baseCurrency) { 
      Object.keys(data.rates).forEach((date) => {
        promises.push(
          new Promise((resolve) => {
            rates.push(1)
            dates.push(date)
            resolve()
          })
        )
      })
    }

    if (dates.length === 0) {
      Object.keys(data.rates).forEach((date) => {
        promises.push(
          new Promise((resolve) => {
            rates.push(data.rates[date][currency])
            dates.push(date)
            resolve()
          })
        )
      })
    } else {
      Object.keys(data.rates).forEach((date) => {
        promises.push(
          new Promise((resolve) => {
            rates.push(data.rates[date][currency])
            resolve()
          })
        )
      })
    }

    promises.push(
      Promise.all(promises).then(() => {
        charts.push({
          label: `${currency}`,
          data: rates,
          type: 'line',
        })
      })
    )
  })

  await Promise.all(promises)
  initialieChart(charts, dates)
}

const initialieChart = (charts, dates) => {
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: charts
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        },
        x: {
          beginAtZero: false
        }
      }
    }
  })
}
const reinitializeChart = () => {
  chart.destroy()
  getInitChart()
}

await fetchCurencies()
// assignBaseCurrency()
await getInitChart()


  
/////////////////////////////////
// Lisen Events
/////////////////////////////////
const baseCurrencyInput = document.getElementById('base-currency-selector').querySelector('.dropdown-menu')
baseCurrencyInput.addEventListener('click', (event) => {
  baseCurrency = event.target.dataset.currency
  reinitializeChart()
})

const curenciesCheckboxes = document.querySelectorAll('.currencies-list-item')
curenciesCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('click', (event) => {
    if (event.target.checked) {
      slectedCurrencies.push(event.target.id)
    } else {
      slectedCurrencies = slectedCurrencies.filter((x) => x !== event.target.id)
    }
    reinitializeChart()
  })
})