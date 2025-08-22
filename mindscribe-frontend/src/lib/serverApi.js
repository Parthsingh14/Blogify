const axios = require('axios')

const serverInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  // No localStorage or window usage here — safe for server
})

module.exports =  serverInstance
