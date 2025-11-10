import axios from 'axios'
const api = process.env.VITE_API_URL || 'http://localhost:4000/api'
export default axios.create({ baseURL: api })
