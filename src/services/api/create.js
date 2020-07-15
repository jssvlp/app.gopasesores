
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


    api.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.response.status === 401) {
            window.location.href = '/#/auth/login-page';
            localStorage.removeItem('token-gop');
        }
        return error;
    });
export default api;
