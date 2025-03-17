// src/api/axiosConfig.js
import axios from 'axios';

// ✅ Set withCredentials globally
axios.defaults.withCredentials = true;

// ✅ Set default base URL (optional, for consistency)
axios.defaults.baseURL = 'http://localhost:5555/api';

// ✅ Set default headers (optional)
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
