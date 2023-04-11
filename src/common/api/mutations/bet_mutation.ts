export interface IBetPostForm {
  junket_code: string;
  table_code: string;
  proposal_num: string;
  game_num: string;
  gamer_id: string;
  bet_type: string;
  bet_amount: number;
}

export interface IBetUpdateForm {
  game_num: string;
  order_num: string;
  bet_type: string;
  bet_amount: number;
}
