import { AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface ITableSetupUpdate {
  id: string;
  category_code: string;
  table_code: string;
  type: string;
  stat: string;
  limit_id: string;
  limit_type: string;
  timer: number;
}

export const TABLE_SETUP_UPDATE = async (data: ITableSetupUpdate) => {
  try {
    const payload = data;
    const response: AxiosResponse = await apiClient.post(
      'api/tablesetup-mutation/TABLE_EDIT_URI',
      payload
    );
    return response;
  } catch (err) {
    return err;
  }
};
