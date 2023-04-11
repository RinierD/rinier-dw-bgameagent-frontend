import React from 'react';
import { CreaditList } from './creaditList';
import { CreditAdd } from './creditAdd';
import { CreditHistory } from './creditHistory';
import { CreditSearch } from './creditSearch';

export const CreditManage = () => {
  return (
    <div>
      <CreditAdd />
      <CreditSearch />
      <CreditHistory />
    </div>
  );
};
