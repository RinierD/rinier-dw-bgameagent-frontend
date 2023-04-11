import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GrClose } from 'react-icons/gr';
import { langVar, subAccountData } from '../../../../common/apollo';

interface IModalProps {
  setSRModal: React.Dispatch<React.SetStateAction<boolean>>;
  sRModalType: string;
}

export const AccntGeneralSRModal: React.FC<IModalProps> = ({
  setSRModal,
  sRModalType,
}) => {
  const { t } = useTranslation(['page']);

  const selectedLang = useReactiveVar(langVar);
  const subAccntData = useReactiveVar(subAccountData);

  const clickModalClose = () => {
    setSRModal((current) => !current);
  };

  useEffect(() => {}, []);
  const onSubmit = () => {
    const data = {};
  };

  return (
    <div className='fixed top-0 right-0 bottom-0 left-0 z-1000 overflow-auto outline-0'>
      <div className='fixed w-full h-full bg-black bg-opacity-40 flex flex-col justify-center items-center'>
        <div className='border rounded-md xl:w-1/4 md:w-1/2 w-11/12 top-10 shadow-lg bg-white'>
          <div className=''>
            <div className='lg:col-span-2'>
              <div className='font-medium text-lg px-6 py-3 border-b flex flex-row justify-between bg-gray-100'>
                <div className='text-gray-500 font-bold'>
                  {sRModalType === 'S' ? t('쉐어') : t('롤링')}
                </div>
                <GrClose
                  className='mt-1 cursor-pointer'
                  onClick={clickModalClose}
                />
              </div>
              <div className='p-6 rounded-lg shadow-md bg-white'>
                <form>
                  <input
                    type='text'
                    name='username'
                    className='w-0 h-0 border-0 block'
                  />
                  <input type='password' className='w-0 h-0 border-0 block' />
                  <div className=''>
                    <div className='form-group mb-6 flex'>
                      <div className='flex flex-row items-center'>
                        <div
                          className={`text-gray-500 mr-1 ${
                            selectedLang === 'English' ? 'w-24' : 'w-12'
                          }`}
                        >
                          {t('계정명')}:{' '}
                        </div>
                      </div>
                      <input
                        type='text'
                        disabled
                        className='pl-2 w-40'
                        defaultValue={subAccntData?.user_id}
                      />
                    </div>
                    {subAccntData?.baccarat_permit === 'Y' ? (
                      <div className='form-group mb-6 flex'>
                        <div className='flex flex-row items-center'>
                          <div
                            className={`text-gray-500 mr-1 ${
                              selectedLang === 'English' ? 'w-24' : 'w-12'
                            }`}
                          >
                            {t('바카라')}:{' '}
                          </div>
                        </div>
                        <input
                          type='text'
                          disabled
                          className='pl-2 w-40'
                          defaultValue={
                            sRModalType === 'S'
                              ? `${subAccntData?.baccarat_share} %`
                              : `${subAccntData?.baccarat_rolling} %`
                          }
                        />
                      </div>
                    ) : null}
                    {subAccntData?.slot_permit === 'Y' ? (
                      <div className='form-group mb-6 flex'>
                        <div className='flex flex-row items-center'>
                          <div
                            className={`text-gray-500 mr-1 ${
                              selectedLang === 'English' ? 'w-24' : 'w-12'
                            }`}
                          >
                            {t('슬롯')}:{' '}
                          </div>
                        </div>
                        <input
                          type='text'
                          disabled
                          className='pl-2 w-40'
                          defaultValue={
                            sRModalType === 'S'
                              ? `${subAccntData?.slot_share} %`
                              : `${subAccntData?.slot_rolling} %`
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
