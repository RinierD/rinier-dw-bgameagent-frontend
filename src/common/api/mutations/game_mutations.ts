import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface ISlotGameHistoryReq {
	startTime: string;
	endTime: string;
	playerId: string;
	egmId: string;
	page: number;
	pageSize: number;
}

export interface ISlotEgmTransaction {
	startTime: string;
	endTime: string;
	playerId: string;
	egmId: string;
	page: number;
	pageSize: number;
}

export interface IGameHistoryRes {
	Code: string;
	List: IGameHistoryResData[];
	Msg: string;
	Page: number;
	PageSize: number;
	Total: number;
	TotalPage: number;
}

export interface IGameHistoryResData {
	CoinIn: number;
	CoinOut: number;
	DateTime: string;
	EgmId: string;
	EgmName: string;
	junketName: string;
	nickname: string;
	GameId: string;
	PlayerId: string;
}

export interface IEgmTransactionHistoryRes {
	Code: string;
	List: IEgmTransactionHistoryResData[];
	Msg: string;
	Page: number;
	PageSize: number;
	Total: number;
	TotalPage: number;
}

export interface IEgmTransactionHistoryResData {
	Action: string;
	Bonus: number;
	DateTime: string;
	EgmId: string;
	EgmLink: string;
	EgmName: string;
	junketName: string;
	nickname: string;
	Gold: number;
	Id: number;
	PlayerBonus: number;
	PlayerGold: number;
	PlayerId: string;
	TransactionId: string;
}

export const SLOT_GAME_HISTORY = async (data: ISlotGameHistoryReq) => {
	const payload = data;
	try {
		const response = await apiClient
			.post('slot_api/game_history', payload)
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

export const SLOT_EGM_TRANSACTION_HISTORY = async (
	data: ISlotEgmTransaction
) => {
	const payload = data;
	try {
		const response = await apiClient
			.post('slot_api/egm_transaction_history', payload)
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
