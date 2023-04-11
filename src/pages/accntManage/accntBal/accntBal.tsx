import React from 'react';
import { AccntBalSubList } from './accntBalSub_list';
import { AccntBalInfo } from './accntBal_info';
import { AccntBalList } from './accntBal_list';

export const AccntBal = () => {
  return (
    <div>
      <AccntBalInfo />
      <AccntBalList />
      <AccntBalSubList />
    </div>
  );
};
