import { gql } from '@apollo/client';
import { AxiosError, AxiosResponse } from 'axios';
import { apiClient } from '../apiConfig';

// export const LOGIN_MUTATION = gql`
//   fragment LoginPayload on REST {
//     user_id: String
//     password: String
//   }
//   mutation LoginMutation($input: LoginPayload!) {
//     loginMe(input: $input) @rest(type: "data", path: "/login", method: "POST") {
//       data
//     }
//   }
// `;

export interface ILoginPayload {
  user_id: string;
  password: string;
}

export const LOGIN_MUTATION = async (data: ILoginPayload) => {
  try {
    const payload = data;
    const response = await apiClient
      .post('login', payload)
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
