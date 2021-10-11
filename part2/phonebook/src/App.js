import React, { useState, useEffect } from 'react'
import axios from 'axios'

const NumberDisplay = (props) => {
  const { searchTerm, persons } = props
  const listIncl = persons.filter((person)=>{return person.name.toLowerCase().includes(searchTerm)})
  return (
    <div>
      {listIncl.map((each) => {return <div key={each.name}>{each.name} {each.number}</div>})}
    </div>
  )
}
const SearchFilter = (props) => {
  // console.log(props)
  const { searchTerm, saveSearchInputToNewSearchTerm } = props
  return (
  <div>
  <form>
      <div>filter shown with <input value={searchTerm} onChange={saveSearchInputToNewSearchTerm}/></div>
  </form></div>)
}
const AddNewPeople = (props) => {
  const { newName, newNumber, addNewName, saveFormInputToNewName, saveFormInputToNewNumber } = props
  return (
    <div>
      <form onSubmit={addNewName}>
        <div>
          name: <input value={newName} onChange={saveFormInputToNewName}/>
        </div>
        <div>number: <input value={newNumber} onChange={saveFormInputToNewNumber}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}
const App = () => {
  const [ persons, setPersons ] = useState([])
    // { name: 'Arto Hellas',
    //   number: '040-1234567' }
  // ]) 
  useEffect(() => {axios.get("http://localhost:3001/persons").then(
    (response) => {
      const personsAtStart = response.data
      setPersons(personsAtStart)
    }
  )}, []
  )
  const [ newName, setNewName ] = useState('')
  const [newNumber, setNewNumber ] = useState('')
  const [searchTerm, setNewSearchTerm] = useState('')
  const saveFormInputToNewName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const saveFormInputToNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const saveSearchInputToNewSearchTerm = (event) => {
    setNewSearchTerm(event.target.value)
  }
  const addNewName = (event) => {
    event.preventDefault()
    if (persons.map((eachObj) => eachObj.name).includes(newName)) {
      alert(newName + " is already added to phonebook")
    } else {
    const newPerson = { name: newName,
                        number: newNumber,
                        id: persons.length + 1}
    console.log(newPerson)
    setPersons(persons.concat(newPerson))}
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter searchTerm={searchTerm} saveSearchInputToNewSearchTerm={saveSearchInputToNewSearchTerm}/>
      <h2>add a new</h2>
      <AddNewPeople newName={newName} newNumber={newNumber} addNewName={addNewName} saveFormInputToNewName={saveFormInputToNewName} saveFormInputToNewNumber={saveFormInputToNewNumber}/>
      <h2>Numbers</h2>
      <NumberDisplay persons={persons} searchTerm={searchTerm}/>
    </div>
  )
}

export default App