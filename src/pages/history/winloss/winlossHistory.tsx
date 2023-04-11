import React from 'react';
import { WinlossHistoryInfo } from './winlossHistory_info';
import { WinlossHistoryList } from './winlossHistory_list';
import { WinlossHistorySearch } from './winlossHistory_search';

export const WinlossHistory = () => {
  return (
    <div>
      <WinlossHistorySearch />
      <WinlossHistoryInfo />
      <WinlossHistoryList />
    </div>
  );
};
