export interface IBetLimitResponse {
  id: string;
  name: string;
  currency: string;
  bp_min: number;
  bp_max: number;
  pair_min: number;
  pair_max: number;
  tie_min: number;
  tie_max: number;
  created_at: string;
  updated_at: string;
}

import { AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export const LIMITS_GET_QUERY = async () => {
  try {
    const response: AxiosResponse = await apiClient.get(
      'api/v1/LIMITS_GET_URI'
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const USER_LIMITS_GET_QUERY = async () => {
  try {
    const response: AxiosResponse = await apiClient.get(
      'api/v1/USER_LIMITS_GET_URI'
    );
    return response;
  } catch (err) {
    return err;
  }
};
