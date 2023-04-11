import React from 'react';
import { GameHistoryInfo } from './gameHistory_info';
import { GameHistoryList } from './gameHistory_list';
import { GameHistorySearch } from './gameHistory_search';

export const GameHistory = () => {
  return (
    <div>
      <GameHistorySearch />
      {/* <GameHistoryInfo /> */}
      <GameHistoryList />
    </div>
  );
};
