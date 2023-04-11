import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface ISubAccntRes {
  user_id: string;
  nickname: string;
  account_role_type: string;
  nickName: string;
  sub_master_id: string;
  phone: string;
  created_at: string;
}

export interface IAccntBalChangeRes {
  id: string;
  accountName: string;
  nickName: string;
  type: string;
  destinationAccnt: string;
  created_at: string;
  currency: string;
  initialBal: number;
  amount: number;
  resultBal: number;
  remark: string;
}

// interface for share
export interface IAcctInfoRes {
  user_id: string;
  parent_id: string;
  nickname: string;
  default_currency: string;
  account_type: string;
  account_status: string;
  account_role_type: string;
  sub_master_id: string;
  country_code: string;
  phone: string;
  baccarat_permit: string;
  baccarat_share: number;
  baccarat_rolling: number;
  slot_permit: string;
  slot_share: number;
  slot_rolling: number;
  balance_red: number;
  balance_default: number;
  winloss_time: string;
  game_time: string;
  account_bal_time: string;
  game_bal_time: string;
  user_log_time: string;
  sub_total_balance: number;
  sub_total_balance_red: number;
  betlimit: string;
  created_at: string;
  sub_account: IAccntSubAccntRes[];
}

export interface IAccntSubAccntRes {
  user_id: string;
  nickname: string;
  parent_id: string;
  default_currency: string;
  account_type: string;
  account_status: string;
  account_role_type: string;
  sub_master_id: string;
  country_code: string;
  phone: string;
  betlimit: string;
  baccarat_permit: string;
  baccarat_share: number;
  baccarat_rolling: number;
  slot_permit: string;
  slot_share: number;
  slot_rolling: number;
  balance_red: number;
  balance_default: number;
  sub_total_balance: number;
  sub_total_balance_red: number;
  created_at: string;
}

export interface IAccntBalRes {
  user_id: string;
  nickname: string;
  baccarat_permit: string;
  baccarat_share: number;
  baccarat_rolling: number;
  slot_permit: string;
  slot_share: number;
  slot_rolling: number;
  balance_red: number;
  balance_red_sub: number;
  balance_default: number;
  balance_default_sub: number;
  sub_accounts: IAccntBalRes[];
}

export const MEMBER_ID_VERIFICATION = async (user_id: string) => {
  try {
    const response = await apiClient
      .get(`member/verify/${user_id}`)
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

export const MEMBER_NICK_VERIFICATION = async (user_id: string) => {
  try {
    const response = await apiClient
      .get(`member/verify-nick/${user_id}`)
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

export const MASTERID_VERIFICATION = async (
  user_id: string,
  master_id: string
) => {
  try {
    const response = await apiClient
      .get(`member/verify-masterid?user_id=${user_id}&master_id=${master_id}`)
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

export const MEMBER_INFO_GET = async (user_id: string) => {
  try {
    const response = await apiClient
      .get(`member/accnt_info_sum/${user_id}`)
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

export const SUB_MEMBERS_GET = async (user_id: string) => {
  try {
    const response = await apiClient
      .get(`member/accnt_lst/${user_id}`)
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

export const SUBACCNT_MEMBERS_GET = async (user_id: string) => {
  try {
    const response = await apiClient
      .get(`member/accnt_lst_role/${user_id}`)
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

export const SUB_MEMBERS_GET_SUM = async (user_id: string) => {
  try {
    const response = await apiClient
      .get(`member/accnt_lst_sum/${user_id}`)
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

export const SUB_MEMBER_SEARCH = async (
  search_id: string,
  parent_id: string
) => {};
