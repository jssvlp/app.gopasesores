
import axios from 'axios'

import config from '../../config';

/**
 * Create an Axios Client with defaults
 */
const api = axios.create({
    baseURL: config.api,
    crossDomain: true,
    headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${localStorage.getItem("token-gop")}`,
    }
});


export default api;
