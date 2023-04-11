import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface IUserLogRes {
	created_at: string;
	execute_type: string;
	id: number;
	ip: string;
	parent_id: string;
	related_user: string;
	remark: string | null;
	updated_at: string;
	user_id: string;
}

export const USER_LOG_SEARCH = async (
	from: string,
	to: string,
	user_id: string
) => {
	try {
		const response = await apiClient
			.get(`aop/user_log?from=${from}&to=${to}&user_id=${user_id}`)
			.then((res: AxiosResponse) => {
				return res;
			})
			.catch((err: AxiosError) => {
				return err;
			});
		return response;
	} catch (err) {
		return err;
	}
};
