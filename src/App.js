import React, { useEffect, useState } from 'react';
import logo from './currency.jpg';
import NavBar from './NavBar.js';
import Footer from './Footer.js';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'https://api.exchangeratesapi.io/v1/latest?access_key=569221b651f1e53d14b1d9368384045c';


function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

let toAmount, fromAmount
if (amountInFromCurrency) {
  fromAmount = amount
  toAmount = amount * exchangeRate

} else {
  toAmount = amount
  fromAmount = amount / exchangeRate
}

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
          const firstCurrency = Object.keys(data.rates)[0]
          setCurrencyOptions([data.base, ...Object.keys(data.rates)])
          setFromCurrency(data.base)
          setToCurrency(firstCurrency)
          setExchangeRate(data.rates[firstCurrency])
      })
 }, [])

 useEffect(() => {
  if (fromCurrency != null && toCurrency != null) {
    fetch(`${BASE_URL}?access_key=569221b651f1e53d14b1d9368384045c&base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => {
        if (data.rates && data.rates[toCurrency]) {
          setExchangeRate(data.rates[toCurrency]);
        } else {
          console.error('Invalid API response:', data);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }
}, [fromCurrency, toCurrency]);


 function handleFromAmountChange(e) {
  setAmount(e.target.value)
  setAmountInFromCurrency(true)
 }

 function handleToAmountChange(e) {
  setAmount(e.target.value)
  setAmountInFromCurrency(false)
 }
  return (
     <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a

          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
        <h1 className="text-xl font-bold">Currency Converter</h1>
        <NavBar />

      <h1>Convert</h1>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}

        amount={toAmount}

      />
   <Footer />
      </header>
    </div>
  );
}

export default App;
