import React from 'react';
import { t } from 'i18next';

interface IButtonProps {
  canClick: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ canClick, actionText }) => {
  return (
    <button
      role="button"
      className={`text-white w-full rounded text-lg px-6 py-1.5 focus:outline-none font-semibold transition-colors ${
        actionText === String(t('검색')) ? 'cursor-zoom-in' : 'cursor-pointer'
      }  whitespace-nowrap ${
        canClick ? 'hover:bg-gray-500' : 'hover:bg-gray-500 pointer-events-none'
      }`}
      style={{ backgroundColor: '#393E46' }}
    >
      {actionText}
    </button>
  );
};
