import React from 'react';
import { GrClose } from 'react-icons/gr';

interface IModalProps {
  setImgModal: React.Dispatch<React.SetStateAction<boolean>>;
  imgSrc: string;
}

export const ImgModal: React.FC<IModalProps> = ({ setImgModal, imgSrc }) => {
  const clickModalClose = () => {
    setImgModal((current) => !current);
  };
  return (
    <div className='box-border fixed top-0 right-0 left-0 overflow-auto outline-0'>
      <div className='fixed w-full h-full backdrop-blur-sm'>
        <div className='box-border relative shadow-lg my-24 mx-96 mt-10 bg-white top-0'>
          <div className='font-medium text-lg px-6 py-3 border-b flex flex-row justify-between'>
            <div className='text-blue-500'>여권 사진</div>
            <GrClose
              className='mt-1 cursor-pointer'
              onClick={clickModalClose}
            />
          </div>
          <div className='flex justify-center p-10'>
            <img className='' src={imgSrc} alt='' />
          </div>
        </div>
      </div>
    </div>
  );
};
