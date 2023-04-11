import { useReactiveVar } from '@apollo/client';
import axios, { AxiosInstance } from 'axios';
import { appConfig } from '../appConfig';
import { useNavigate } from 'react-router-dom';
import { isLoggedInVar } from '../apollo';

const env = 'development';
const { apiUrl } = appConfig[env];

export const apiClient: AxiosInstance = axios.create({
	baseURL: apiUrl,
});

apiClient.defaults.headers.common['X-CSRF-TOKEN'];

// apiClient.interceptors.request.use(
//   (response) => {
//     console.log(response);
//     return response;
//   },
//   (error) => {
//     console.log('REQUEST ERROR OCCURED');
//     console.log(error);
//     return error;
//   }
// );

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (
			error.response.status === 408 ||
			error.response.data.message === 'Unauthorized'
		) {
			sessionStorage.clear();
			window.location.href = '/';
		}
		return error;
	}
);

apiClient.defaults.withCredentials = true;
apiClient.defaults.xsrfCookieName = 'Cookie';
apiClient.defaults.headers.common['Cookie'];
