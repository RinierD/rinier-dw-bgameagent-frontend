import React from 'react';
import { GameBalInfo } from './gameBal_info';
import { GameBalList } from './gameBal_list';
import { GameBalSearch } from './gameBal_search';

export const GameBal = () => {
  return (
    <div>
      <GameBalSearch />
      {/* <GameBalInfo /> */}
      <GameBalList />
    </div>
  );
};
