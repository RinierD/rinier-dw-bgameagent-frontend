import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ICreditPost } from '../../../common/api/mutations/credit_mutation';
import { langVar, routeTitleVar } from '../../../common/apollo';
import { FormError } from '../../../components/form-error';
import { CreditDepositModal } from './modal/creditD_modal';
import { CreditWithDrawModal } from './modal/creditW_modal';

export const CreditAdd = () => {
  const { t } = useTranslation(['page']);
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ICreditPost>({ mode: 'onChange' });
  const { isSubmitting } = useFormState({ control });

  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithDrawModal] = useState(false);

  useReactiveVar(routeTitleVar);
  const selectedLang = useReactiveVar(langVar);

  const onClickDepositModal = () => {
    setDepositModal(!depositModal);
  };
  const onClickWithDrawModal = () => {
    setWithDrawModal(!withdrawModal);
  };

  const handleCurrencyChoice = (e: React.SyntheticEvent<HTMLOptionElement>) => {
    setSelectedCurrency(e.currentTarget.value);
  };

  const onSubmit = () => {
    const { amount, accountName, currency } = getValues();

    const data = {
      id: '',
      currency: selectedCurrency,
    };
  };

  useReactiveVar(routeTitleVar);
  useEffect(() => {
    routeTitleVar(String(t('크레딧 관리')));
  }, []);
  useEffect(() => {
    routeTitleVar(String(t('크레딧 관리')));
  }, [selectedLang]);

  return (
    <div className='flex justify-center w-full'>
      {/* <div className='w-1/2 mt-5 rounded-md lg:col-span-2'>
        <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
          크레딧 보유 현황
        </div>
        <div className='py-2 bg-white'>
          <input
            type='text'
            name='username'
            className='w-0 h-0 border-0 block'
          />
          <input type='password' className='w-0 h-0 border-0 block' />
          <div className='grid grid-cols-5 mb-2'>
            <div className='flex items-center'>
              <div className='text-gray-500 mr-2'>화폐: </div>
              <div>PHP</div>
            </div>
            <div className='flex items-center'>
              <div className='text-gray-500 mr-2'>금액: </div>
              <div>{(1000000000).toLocaleString()}</div>
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className='grid grid-cols-5 mb-2'>
            <div className='flex items-center'>
              <div className='text-gray-500 mr-2'>화폐: </div>
              <div>KRW</div>
            </div>
            <div className='flex items-center'>
              <div className='text-gray-500 mr-2'>금액: </div>
              <div>{(100000000000).toLocaleString()}</div>
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className='grid grid-cols-5 mb-2'>
            <div className='flex items-center'>
              <div className='text-gray-500 mr-2'>화폐: </div>
              <div>USD</div>
            </div>
            <div className='flex items-center'>
              <div className='text-gray-500 mr-2'>금액: </div>
              <div>{(100000000).toLocaleString()}</div>
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
          크레딧 생성 및 인출
        </div>
        <div className='py-2 bg-white'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type='text'
              name='username'
              className='w-0 h-0 border-0 block'
            />
            <input type='password' className='w-0 h-0 border-0 block' />
            <div className='grid grid-cols-3 gap-4'>
              <div className='mb-2'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>화폐</div>
                </div>
                <select className='forminput' required>
                  <option value=''>선택</option>
                  <option value='PHP'>PHP</option>
                  <option value='KRW'>KRW</option>
                  <option value='CNY'>CNY</option>
                  <option value='HKD'>HKD</option>
                  <option value='USD'>USD</option>
                </select>
              </div>
              <div className='mb-2'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>작업분류</div>
                </div>
                <select className='forminput' required>
                  <option value=''>선택</option>
                  <option value='PHP'>생성</option>
                  <option value='KRW'>인출</option>
                </select>
              </div>
              <div className='form-group mb-6'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>금액</div>
                </div>
                <input
                  {...register('amount')}
                  type='number'
                  min={0}
                  className='forminput'
                  placeholder='금액 입력'
                />
              </div>
            </div>
            <div className='w-full flex justify-end mt-3'>
              <button
                style={{ backgroundColor: '#393E46' }}
                className='border rounded-md px-3 py-1 text-white text-base font-semibold'
              >
                크레딧 등록
              </button>
            </div>
          </form>
        </div>
      </div> */}
      <div className='w-full grid grid-cols-5 mx-10 my-10 gap-16'>
        <div className='border shadow-md rounded-md h-36'>
          <div className='text-2xl font-bold text-gray-600 mt-3 ml-5'>PHP</div>
          <div className='text-xl font-bold text-gray-500 mt-2 ml-5'>
            1,000,000,000
          </div>
          <div className='w-full flex justify-end mt-5'>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickDepositModal()}
            >
              {t('생성')}
            </button>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickWithDrawModal()}
            >
              {t('인출')}
            </button>
          </div>
        </div>
        <div className='border shadow-md rounded-md h-36'>
          <div className='text-2xl font-bold text-gray-600 mt-3 ml-5'>CNY</div>
          <div className='text-xl font-bold text-gray-500 mt-2 ml-5'>
            1,000,000,000
          </div>
          <div className='w-full flex justify-end mt-5'>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickDepositModal()}
            >
              {t('생성')}
            </button>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickWithDrawModal()}
            >
              {t('인출')}
            </button>
          </div>
        </div>
        <div className='border shadow-md rounded-md h-36'>
          <div className='text-2xl font-bold text-gray-600 mt-3 ml-5'>HKD</div>
          <div className='text-xl font-bold text-gray-500 mt-2 ml-5'>
            1,000,000,000
          </div>
          <div className='w-full flex justify-end mt-5'>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickDepositModal()}
            >
              {t('생성')}
            </button>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickWithDrawModal()}
            >
              {t('인출')}
            </button>
          </div>
        </div>
        <div className='border shadow-md rounded-md h-36'>
          <div className='text-2xl font-bold text-gray-600 mt-3 ml-5'>KRW</div>
          <div className='text-xl font-bold text-gray-500 mt-2 ml-5'>
            1,000,000,000
          </div>
          <div className='w-full flex justify-end mt-5'>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickDepositModal()}
            >
              {t('생성')}
            </button>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickWithDrawModal()}
            >
              {t('인출')}
            </button>
          </div>
        </div>
        <div className='border shadow-md rounded-md h-36'>
          <div className='text-2xl font-bold text-gray-600 mt-3 ml-5'>USD</div>
          <div className='text-xl font-bold text-gray-500 mt-2 ml-5'>
            1,000,000,000
          </div>
          <div className='w-full flex justify-end mt-5'>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickDepositModal()}
            >
              {t('생성')}
            </button>
            <button
              className='mr-5 text-base font-bold text-blue-700 underline'
              onClick={() => onClickWithDrawModal()}
            >
              {t('인출')}
            </button>
          </div>
        </div>
      </div>
      {depositModal ? (
        <CreditDepositModal setDepositModal={setDepositModal} />
      ) : null}
      {withdrawModal ? (
        <CreditWithDrawModal setWithDrawModal={setWithDrawModal} />
      ) : null}
    </div>
  );
};
