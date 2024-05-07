import axios from 'axios';
import { DEFAULT_API_URL } from '@/_constants/api.ts';
import { getAuth } from '@/_security/auth.ts';

const axiosCreate = axios.create(
	{
		baseURL: DEFAULT_API_URL,
		timeout: 10000,
	},
);

axiosCreate.interceptors.request.use(async (config) => {
	const auth = getAuth();

	if (auth === null) return config;

	config.headers = config.headers || {};
	// config.headers.common = config.headers.common || {};

	if (auth) {
		config.headers['auth_login'] = auth.auth_login;
		config.headers['auth_token'] = auth.auth_token;
	}
	return config;
}, (error) => {
	return Promise.reject(error);
});

export default axiosCreate;