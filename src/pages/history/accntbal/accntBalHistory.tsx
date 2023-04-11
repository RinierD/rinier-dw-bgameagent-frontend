import React from 'react';
import { AccntBalHistoryInfo } from './accntBalHistory_info';
import { AccntBalHistoryList } from './accntBalHistory_list';
import { AccntBalHistorySearch } from './accntBalHistory_search';

export const AccntBalHistory = () => {
  return (
    <div>
      <AccntBalHistorySearch />
      {/* <AccntBalHistoryInfo /> */}
      <AccntBalHistoryList />
    </div>
  );
};
