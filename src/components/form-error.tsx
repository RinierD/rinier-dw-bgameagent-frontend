import React from 'react';

interface IFormErrorProps {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => {
  return (
    <span role='alert' className='font-medium ml-2 text-xs text-red-400 mt-1'>
      {errorMessage}
    </span>
  );
};
