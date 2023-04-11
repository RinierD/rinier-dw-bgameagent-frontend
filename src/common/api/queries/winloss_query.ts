import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface IWinnLossRes {
	id: string;
	accountName: string;
	nickName: string;
	winloss: number;
	totalRolling: number;
	tip: number;
	gameShare: number;
	gameRolling: number;
	shareWinloss: number;
	rollingCommission: number;
	profit: number;
	subData: IWinnLossSubRes[];
}

export interface IWinnLossSubRes {
	id: string;
	accountName: string;
	nickName: string;
	winloss: number;
	totalRolling: number;
	tip: number;
	gameShare: number;
	gameRolling: number;
	shareWinloss: number;
	rollingCommission: number;
	profit: number;
}

export interface IWinnLossDataRes {
	user_id: string;
	nickname: string;
	slot_share: number;
	slot_rolling: number;
	sub_total_slot_coin_in: number;
	sub_total_slot_coin_out: number;
	user_total_slot_coin_in: number;
	user_total_slot_coin_out: number;
	winloss: number;
	sharewinloss: number;
	rollingCommision: number;
	tip: number;
	profit: number;
}

export const WINLOSS_QUERY = async (
	user_id: string,
	from: string,
	to: string
) => {
	try {
		const response = await apiClient
			.get(`slot_api/winloss?user_id=${user_id}&from=${from}&to=${to}`)
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

export const SUB_WINLOSS_QUERY = async (
	user_id: string,
	from: string,
	to: string
) => {
	try {
		const response = await apiClient
			.get(`slot_api/winloss_sub?user_id=${user_id}&from=${from}&to=${to}`)
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
