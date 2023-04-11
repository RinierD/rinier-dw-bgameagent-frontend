import React from 'react';

interface IValidationProps {
  isValid: boolean;
  message: string;
}

export const ValidationMessage: React.FC<IValidationProps> = ({
  isValid,
  message,
}) => {
  return (
    <span
      role='alert'
      className={`font-bold ml-2 text-xs mt-1 ${
        isValid ? 'text-blue-400' : 'text-red-400'
      }`}
    >
      {message}
    </span>
  );
};
