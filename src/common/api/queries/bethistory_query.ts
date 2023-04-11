export interface IBetHistorySearchForm {
  junket_code: string;
  table_code: string;
  gamer_id: string;
  ava_id: string;
  currency_code: string;
  proposal_num: string;
  game_num: string;
  date_type: string;
  from: string;
  to: string;
}

export interface IBetHistoryResponse {
  junket_code: string;
  junket_name: string;
  bet_id: string;
  ava_id: string;
  currency_code: string;
  game_num: string;
  table_code: string;
  gamer_id: string;
  proposal_num: string;
  order_num: string;
  created_at: string;
  bet_at: string;
  end_at: string;
  bet_type: string;
  bet_amount: number;
  winloss_amount: number;
  rolling: number;
  game_result: string;
}
