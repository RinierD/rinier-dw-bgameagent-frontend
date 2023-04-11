import { AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface ITableSearchForm {
  junket_code: string;
  type: string;
  stat: string;
}

export interface ITableWinLossSearchForm {
  junket_code: string;
  table_code: string;
  from: string;
  to: string;
}

export interface ITableResponse {
  id: string;
  category_code: string;
  junket_name: string;
  table_code: string;
  type: string;
  stat: string;
  limit_id: string;
  limit_type: string;
  timer: number;
}

export interface ITableWinLossRes {
  junket_code: string;
  junket_name: string;
  table_num: string;
  winloss: number;
  rolling: number;
  tip: number;
}

export const TABLES_GET_QUERY = async () => {
  try {
    const response: AxiosResponse = await apiClient.get('api/TABLES_GET_URI');
    return response;
  } catch (err) {
    return err;
  }
};
