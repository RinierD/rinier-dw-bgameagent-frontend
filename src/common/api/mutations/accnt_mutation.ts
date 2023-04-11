import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

export interface IAccntRegPost {
  my_user_id: string;
  parent_id: string;
  sub_master_id: string;
  user_id: string;
  nickname: string | null;
  password: string;
  passwordConfirm: string;
  execute_password: string;
  country_code: string;
  phone: string;
  account_type: string;
  default_currency: string;
  baccarat_permit: string;
  baccarat_share: number;
  baccarat_rolling: number;
  slot_permit: string;
  slot_share: number;
  slot_rolling: number;
  betlimit: string;
}

export interface IAccntSubPost {
  my_user_id: string;
  parent_id: string;
  sub_master_id: string;
  user_id: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  execute_password: string;
  country_code: string;
  phone: string;
  account_type: string;
  account_role_type: string;
  baccarat_permit: string;
  slot_permit: string;
}

export interface IAccntModPost {
  my_user_id: string;
  parent_id: string;
  user_id: string;
  nickname: string | null;
  new_password: string;
  passwordConfirm: string;
  execute_password: string;
  country_code: string;
  phone: string;
  baccarat_permit: string;
  baccarat_share: number;
  baccarat_rolling: number;
  slot_permit: string;
  slot_share: number;
  slot_rolling: number;
  betlimit: string;
  isSRMod: string;
}

export interface IAccntPasswordUpdate {
  user_id: string;
  password_old: string;
  password_new: string;
  passwordConfirm: string;
}

export interface IPasswordVerify {
  my_user_id: string;
  execute_password: string;
}

export interface IAccountStatusUpdate {
  my_user_id: string;
  user_id: string;
  state: string;
  execute_password: string;
}

export interface IAccntCheckTimeUpdate {
  user_id: string;
  winloss_time: string;
  game_time: string;
  account_bal_time: string;
  game_bal_time: string;
  user_log_time: string;
  execute_password: string;
}

export const USER_REGISTER_POST = async (data: IAccntRegPost) => {
  const payload = data;
  try {
    const response = await apiClient
      .post('member/accnt_regist', payload)
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

export const SUB_USER_REG_POST = async (data: IAccntSubPost) => {
  const payload = data;
  try {
    const response = await apiClient
      .post('member/accnt_regist', payload)
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

export const ACCOUNT_INFO_UPDATE = async (data: IAccntModPost) => {
  const payload = data;
  try {
    const response = await apiClient
      .post('member/accnt_update_info', payload)
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

export const PASSWORD_VERIFICATION = async (data: IPasswordVerify) => {
  const payload = data;
  try {
    const response = await apiClient
      .post('member/', payload)
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

export const ACCOUNT_PASSWORD_UPDATE = async (data: IAccntPasswordUpdate) => {
  const payload = data;
  try {
    const response = apiClient
      .post('member/accnt_update_passwd', payload)
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

export const ACCOUNT_STATUS_UPDATE = async (data: IAccountStatusUpdate) => {
  const payload = data;
  try {
    const response = apiClient
      .post('member/accnt_update_state', payload)
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

export const ACCOUNT_CHECKTIME_UPDATE = async (data: IAccntCheckTimeUpdate) => {
  const payload = data;
  try {
    const response = apiClient
      .post('member/accnt_update_searchtime', payload)
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
