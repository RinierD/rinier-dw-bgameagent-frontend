import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageNotFound } from '../pages/404';
import { Login } from '../pages/login';

export const LoggedOutRouter = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </div>
  );
};
