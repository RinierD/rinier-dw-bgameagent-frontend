import React from 'react';
import { UserLogInfo } from './userLog_info';
import { UserLogList } from './userLog_list';
import { UserLogSearch } from './userLog_search';

export const UserLog = () => {
  return (
    <div>
      <UserLogSearch />
      {/* <UserLogInfo /> */}
      <UserLogList />
    </div>
  );
};
