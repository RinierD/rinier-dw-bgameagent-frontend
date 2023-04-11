import { AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface IGameSearchForm {
  junket_code: string;
  table_code: string;
  mod_type: string;
  proposal_num: string;
  game_num: string;
  date_type: string;
  from: string;
  to: string;
}

export interface IGameResponse {
  junket_code: string;
  junket_name: string;
  table_code: string;
  game_type: string;
  game_num: string;
  currency_code: string;
  proposal_num: string;
  created_at: string;
  end_at: string;
  mod_type: string;
  game_result: string;
}

export interface IGameResultRes {
  category_code: string;
  table_code: string;
  proposal_num: string;
  game_group: string;
  game_type: string;
  start_date: string;
  end_date: string;
  stat: string;
  bet: string;
  shoe_no: string;
  game_seq: number;
}

export interface IGameHistoryRes {
  id: string;
  accountName: string;
  nickName: string;
  started_at: string;
  shoeNum: string;
  junket_code: string;
  game_type: string;
  table_num: string;
  // order_num: string;
  bet_type: string;
  bet_amount: number;
  game_result: string;
  winloss: number;
  settlement_status: string;
  settled_at: string;
  // rolling: number;
}

export interface IGameBalChangeRes {
  id: string;
  accountName: string;
  nickName: string;
  created_at: string;
  type: string;
  initialBal: number;
  amount: number;
  resultBal: number;
  shoeNum: string;
  orderNum: string;
  remark: string;
}

export const GAME_RESULT_GET_QUERY = async () => {
  try {
    const response: AxiosResponse = await apiClient.get('api/GET_GAME_RESULT');
    return response;
  } catch (err) {
    return err;
  }
};
