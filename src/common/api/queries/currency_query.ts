import { gql } from "@apollo/client";

export interface ICurrencyRes {
  currency_code: string;
  currency_name: string;
}

export const CURRENCIES_GET_QUERY = gql`
  query CurrenciesGetQuery {
    currenciesGet @rest(type: "data", path: "/account/currency") {
      data
    }
  }
`;
