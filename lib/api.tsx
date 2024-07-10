import axios from "axios"

export const api = axios.create({
    baseURL: 'https://wsdatabase.blucaju.com.br/api/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
})