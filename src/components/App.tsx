import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { isLoggedInVar } from '../common/apollo';
import { LoggedInRouter } from '../routers/logged-in-router';
import { LoggedOutRouter } from '../routers/logged-out-router';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  // const isLoggedIn = false;
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
