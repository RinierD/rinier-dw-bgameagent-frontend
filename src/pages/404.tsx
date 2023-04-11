import React from 'react';
import { Link } from 'react-router-dom';

export const PageNotFound = () => {
  return (
    <div className='h-4/5 flex flex-col items-center justify-center'>
      <h2 className='font-bold text-2xl mb-3'>Page Not Found.</h2>
      <h4 className='font-medium mb-3'>where can we find her... Page..</h4>
      <Link to='/' className='hover:underline text-blue-500'>
        Go back home &rarr;
      </Link>
    </div>
  );
};
