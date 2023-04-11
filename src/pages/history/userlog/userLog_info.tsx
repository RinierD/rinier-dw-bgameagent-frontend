import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import { routeTitleVar } from '../../../common/apollo';

export const UserLogInfo = () => {
  useReactiveVar(routeTitleVar);

  useEffect(() => {
    routeTitleVar('사용내역');
  }, []);
  return (
    <div>
      <div>this is UserLogInfo component</div>
    </div>
  );
};
