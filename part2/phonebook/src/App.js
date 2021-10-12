import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const NumberDisplay = (props) => {
  const { searchTerm, persons, setPersons } = props
  // const [ selectedPersonToDel, setSelectedPersonToDel ] = useState({})
  const listIncl = persons.filter((person)=>{return person.name.toLowerCase().includes(searchTerm)})
  return (
    <div>
      {listIncl.map((each) => {return <div key={each.name}>{each.name} {each.number}<button onClick={() => {
        // setSelectedPersonToDel(each)
        if (window.confirm(`Delete ${each.name} ?`)) {
          axios.delete(`http://localhost:3001/persons/${each.id}`)
          console.log(persons.map(p=>p.id !== each.id))
          setPersons(persons.filter(p=>p.id !== each.id))
        }
      }}>delete</button></div>})}
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
  useEffect(() => {
    personService.getAll().then(personsData => setPersons(personsData))
  }, []
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
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const existingId = persons.filter(eachObj => eachObj.name === newName)[0].id
        const newPerson = { name: newName,
                          number: newNumber}
        axios.put(`http://localhost:3001/persons/${existingId}`, newPerson).then(resp => {
          setPersons(persons.filter(person=>person.id !== resp.data.id).concat(newPerson))
        })
      }
    } else {
    const newPerson = { name: newName,
                        number: newNumber,
                        }
    console.log(newPerson)
    personService.create(newPerson).then(addedPerson => {
      setPersons(persons.concat(addedPerson))
      setNewName('')
      setNewNumber('')
    })
    // axios.post(dbURL, newPerson)
    // .then(response => {setPersons(persons.concat(response.data))
    //   setNewName('')
    //   setNewNumber('')})
}
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter searchTerm={searchTerm} saveSearchInputToNewSearchTerm={saveSearchInputToNewSearchTerm}/>
      <h2>add a new</h2>
      <AddNewPeople newName={newName} newNumber={newNumber} addNewName={addNewName} saveFormInputToNewName={saveFormInputToNewName} saveFormInputToNewNumber={saveFormInputToNewNumber}/>
      <h2>Numbers</h2>
      <NumberDisplay persons={persons} searchTerm={searchTerm} setPersons={setPersons}/>
    </div>
  )
}

export default App