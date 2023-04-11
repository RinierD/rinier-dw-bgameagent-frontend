import { AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface IBetLimitPost {
  id: string | undefined;
  name: string;
  currency: string;
  bp_min: number;
  bp_max: number;
  pair_min: number;
  pair_max: number;
  tie_min: number;
  tie_max: number;
}

export const USER_BETLIMIT_POST = async (data: IBetLimitPost) => {
  try {
    const payload = data;
    const response: AxiosResponse = await apiClient.post(
      'api/betlimit-mutation/USER_LIMIT_ADD_URI',
      payload
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const USER_BETLIMIT_MOD = async (data: IBetLimitPost) => {
  try {
    const payload = data;
    const response: AxiosResponse = await apiClient.post(
      'api/betlimit-mutation/USER_LIMIT_EDIT_URI',
      payload
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const TABLE_BETLIMIT_POST = async (data: IBetLimitPost) => {
  try {
    const payload = data;
    const response: AxiosResponse = await apiClient.post(
      'api/betlimit-mutation/LIMIT_ADD_URI',
      payload
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const TABLE_BETLIMIT_MOD = async (data: IBetLimitPost) => {
  try {
    const payload = data;
    const response: AxiosResponse = await apiClient.post(
      'api/betlimit-mutation/LIMIT_EDIT_URI',
      payload
    );
    return response;
  } catch (err) {
    return err;
  }
};
