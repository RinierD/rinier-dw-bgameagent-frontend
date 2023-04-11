import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface ITransactionRes {
  transaction_id: number;
  money_type: string;
  transaction_type: string;
  account_role_name: string;
  account_name: string;
  account_target: string;
  currency: string;
  balance_before: number;
  balance_after: number;
  balance_change: number;
  remark: string;
  created_at: string;
  updated_at: string;
}

export interface ITransactionQuery {
  account_name: string | undefined;
  transaction_types: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

export const TRANSACTIONS_GET = async () => {
  try {
    const response = await apiClient
      .get('transaction')
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

export const TRANSACTIONS_SEARCH = async (data: ITransactionQuery) => {
  try {
    const response = await apiClient
      .get(`transaction/search?account_name=${data.account_name}&transaction_types=${data.transaction_types}&from=${data.from}&to=${data.to}`)
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

export const TRANSACTIONS_GET_AGENT_ID = async (user_id: string) => {
  try {
    const response = await apiClient
      .get(`transaction/agent-transaction/${user_id}`)
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

