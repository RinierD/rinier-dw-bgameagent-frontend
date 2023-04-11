import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import { routeTitleVar } from '../../../common/apollo';

export const AccntBalHistoryInfo = () => {
  useReactiveVar(routeTitleVar);

  useEffect(() => {
    routeTitleVar('계정금액변경');
  }, []);
  return (
    <div>
      <div>this is AccntBalHistoryInfo component</div>
    </div>
  );
};
