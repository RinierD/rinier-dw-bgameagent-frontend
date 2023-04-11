import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface ISlotGameHistoryRes {
	created_at: string;
	currency: string;
	egm_id: string;
	egm_link: string;
	egm_name: string;
	game_id: string;
	jackpot_award: number | null;
	parent_id: string;
	remark: string | null;
	slot_coin_in: number;
	slot_coin_out: number;
	slot_datetime: string;
	type: string;
	updated_at: string;
	user_id: string;
	nickname: string;
	junketName: string;
}

export interface ISlotEgmHistoryRes {
	action: string;
	bonus: number;
	created_at: string;
	currency: string;
	egm_id: string;
	egm_link: string | null;
	egm_name: string;
	gold: number | null;
	nickname: string;
	parent_id: string;
	player_bonus: number;
	player_gold: number;
	remark: string | null;
	slot_egm_datetime: string;
	transaction_id: string;
	updated_at: string;
	user_id: string;
	junketName: string;
}

export const GAME_HISTORY_SEARCH = async (
	from: string,
	to: string,
	user_id: string
) => {
	try {
		const response = await apiClient
			.get(`slot_api/game/search?user_id=${user_id}&from=${from}&to=${to}`)
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

export const EGM_HISTORY_SEARCH = async (
	from: string,
	to: string,
	user_id: string
) => {
	try {
		const response = await apiClient
			.get(`slot_api/egm/search?from=${from}&to=${to}&user_id=${user_id}`)
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
