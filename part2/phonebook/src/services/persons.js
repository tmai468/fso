import axios from 'axios'
const dbURL = `http://localhost:3001/persons`

const getAll = () => {
    const request = axios.get(dbURL)
    return request.then(response => response.data)
}

const create = (newPerson) => {
    const request = axios.post(dbURL, newPerson)
    return request.then(request => request.data)
}

export default { getAll, create }