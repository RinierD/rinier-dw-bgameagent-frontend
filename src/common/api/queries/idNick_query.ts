import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface IIdNickResData {
	user_id: string;
	nickname: string;
}

export const ID_NICK_QUERY = async (user_id: string) => {
	try {
		const response = await apiClient
			.get(`member/id_nick/${user_id}`)
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
