import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { isCompositeComponent } from 'react-dom/test-utils'

const SearchCountries = (props) => {
  const { allCountries, currentSearch, onSearchBarChange } = props
  return (
  <div>
  <form>
      <input value={currentSearch} onChange={onSearchBarChange}></input>
  </form>
  </div>
  )
}

const DisplaySingleCountry = (props) => {
  const { show, selectedCountries, api_key } = props
  const onlyCountry = selectedCountries[0]
  console.log(onlyCountry)
  const [ capitalObj, setCapitalObj ] = useState({})
  useEffect( () => {
    if (show) {
      console.log('here')
      const capital = onlyCountry.capital[0]
      console.log(capital)
      axios.get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`)
  .then((response) => {
    console.log(response.data)
    setCapitalObj({
      temperature: response.data.current.temperature,
      weather_icon_url: response.data.current.weather_icons[0],
      wind_speed: response.data.current.wind_speed,
      wind_dir: response.data.current.wind_dir
    })
  })}}, [selectedCountries])
  console.log(capitalObj)
  // let capitalObj
  // const setCapitalObj = (obj) => {
  //   capitalObj = obj
  //   // console.log(capitalObj)
  // }
  if (show) {
    const capital = onlyCountry.capital
    console.log(capitalObj)
    return (<div>
      <h1>{onlyCountry.name.common}</h1>
      <div>
        <div>
          capital {onlyCountry.capital[0]}
        </div>
        <div>
          population {onlyCountry.population}
        </div>
      </div>
      <h2>languages</h2>
      <ul>
        {Object.values(onlyCountry.languages).map((eachLang)=>{
          return <li key={eachLang}>{eachLang}</li>
        })}
      </ul>
      <div>
        <img src={onlyCountry.flags.png} />
      </div>
      <h2>Weather in {capital}</h2>
      <div><strong>temperature: </strong>{capitalObj.temperature} Celsius</div>
      <div><img src={capitalObj.weather_icon_url} /></div>
      <div><strong>wind: </strong>{capitalObj.wind_speed} mph direction {capitalObj.wind_dir}</div>
      <div>

      </div>
    </div>) }
  else {return <div></div>}
}

const DisplayMatchingCountries = (props) => {
  // const onButtonClickedShowSingle = () => {
  //   const selectedCountriesList = [eachCountry]
  //   return <DisplaySingleCountry selectedCountries={selectedCountriesList}/>
  // }
  const { currentSearch, selectedCountries, setSingleCountryComponent, singleCountryComponent, api_key } = props
  if (selectedCountries.length > 10) {
    // console.log(currentSearch)
    // console.log(selectedCountries)
    return (<div>Too many matches, specify another filter</div>)
  } else if (selectedCountries.length > 1) {
    // console.log(selectedCountries)
    return (<div>
      {selectedCountries.map((eachCountry) => {return <div key={selectedCountries.indexOf(eachCountry)}>
        <div key={eachCountry.name.common}>{eachCountry.name.common}<button onClick={() => {
          // console.log(eachCountry)
         setSingleCountryComponent(<DisplaySingleCountry show={true} selectedCountries={[eachCountry]} api_key={api_key}/>)
        }}>show</button></div>
      </div>})}
    </div>
    )
  } else if (selectedCountries.length===1){
    return(<DisplaySingleCountry show = {true} selectedCountries={selectedCountries} api_key={api_key}/>)
  } else {
    return <div></div>
  }
}
const App = () => {
  const api_key = process.env.REACT_APP_WEATHER_API_KEY
  console.log("api key is", api_key)
  const [ allCountries, setAllCountries ] = useState([])
  const [ selectedCountries, setSelectedCountries ] = useState([])
  const [ currentSearch, setCurrentSearch ] = useState('')
  const [ singleCountryComponent, setSingleCountryComponent ] = useState(<DisplaySingleCountry show={false} selectedCountries={selectedCountries}/>)
  const onSearchBarChange = (event) => {
    // console.log(event.target.value)
    setSingleCountryComponent(<DisplaySingleCountry show={false} selectedCountries={selectedCountries}/>)
    setCurrentSearch(event.target.value)

    // console.log(currentSearch)
    const applicableCountries = allCountries.filter((eachCountry) => {
      // console.log(eachCountry.name.common.toLowerCase())
      // console.log(eachCountry.name.common.toLowerCase().includes(event.target.value))
      return (eachCountry.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
    })
    setSelectedCountries(applicableCountries)
    // console.log(selectedCountries)
  }
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
    .then((response) => {
      // console.log(response.data)
      setAllCountries(response.data)
    })
  }, [])
  return(<div>
      <div>find countries</div>
      <SearchCountries allCountries={allCountries} currentSearch={currentSearch} onSearchBarChange={onSearchBarChange}/>
      <DisplayMatchingCountries currentSearch={currentSearch} selectedCountries={selectedCountries} setSingleCountryComponent={setSingleCountryComponent} singleCountryComponent={singleCountryComponent}
      api_key={api_key}/>
      <div>{singleCountryComponent}</div>
    </div>)
}

export default App;
