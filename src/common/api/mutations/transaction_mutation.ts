import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface ITransactionPost {
  my_user_id: string;
  execute_password: string;
  money_type: string;
  transaction_type: string;
  currency: string;
  amount: number;
  upper_id: string;
  lower_id: string;
  remark: string;
}

export const TRANSACTION_POST = async (data: ITransactionPost) => {
  const payload = data;
  try {
    const response = apiClient
      .post('transaction', payload)
      .then((res: AxiosResponse) => {
        return res;
      })
      .catch((err: AxiosError) => {
        return err;
      });
    return response;
  } catch (err) {
    console.log(err);
  }
};
