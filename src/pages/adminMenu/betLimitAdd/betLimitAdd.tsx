import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { GrClose } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { IBetLimitPost } from '../../../common/api/mutations/betlimit_mutation';
import { routeTitleVar } from '../../../common/apollo';
import { Button } from '../../../components/button';
import { FormError } from '../../../components/form-error';

export const BetLimitAdd = () => {
  const navigate = useNavigate();

  const onClickAccntReg = () => {
    navigate('/betlimit');
  };
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IBetLimitPost>({ mode: 'onChange' });
  const { isSubmitting } = useFormState({ control });

  const [selectedCurrency, setSelectedCurrency] = useState('');

  useReactiveVar(routeTitleVar);

  const handleCurrencyChoice = (e: React.SyntheticEvent<HTMLOptionElement>) => {
    setSelectedCurrency(e.currentTarget.value);
  };

  const onSubmit = () => {
    const { name, bp_min, bp_max, pair_min, pair_max, tie_min, tie_max } =
      getValues();

    const data = {
      id: '',
      name: name,
      currency: selectedCurrency,
      bp_min: bp_min,
      bp_max: bp_max,
      pair_min: pair_min,
      pair_max: pair_max,
      tie_min: tie_min,
      tie_max: tie_max,
    };
  };

  useEffect(() => {
    routeTitleVar('베팅한도추가');
  }, []);
  return (
    <div className='flex justify-center w-full'>
      <div className='w-1/2 mt-5 rounded-md lg:col-span-2'>
        <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
          한도정보
        </div>
        <div className='py-6 bg-white'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type='text'
              name='username'
              className='w-0 h-0 border-0 block'
            />
            <input type='password' className='w-0 h-0 border-0 block' />
            <div className='grid grid-cols-2 gap-4'>
              <div className='form-group mb-6'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>한도 이름</div>
                </div>
                <input
                  {...register('name')}
                  minLength={5}
                  maxLength={15}
                  type='text'
                  className='forminput'
                  placeholder='계정 입력'
                />
              </div>
              <div className='mb-4'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>화폐</div>
                  {errors.currency?.message && (
                    <FormError errorMessage={errors.currency.message} />
                  )}
                </div>
                <select
                  className='forminput'
                  required
                  {...register('currency', {
                    onChange: (e) => handleCurrencyChoice(e),
                  })}
                >
                  <option value=''>선택</option>
                  <option value='PHP'>PHP</option>
                  <option value='KRW'>KRW</option>
                  <option value='CNY'>CNY</option>
                  <option value='HKD'>HKD</option>
                  <option value='USD'>USD</option>
                </select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='form-group mb-6'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>B.P 최소</div>
                </div>
                <input
                  {...register('bp_min')}
                  type='number'
                  className='forminput'
                  placeholder='BP 최소 입력'
                />
              </div>
              <div className='form-group mb-6'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>B.P 최대</div>
                </div>
                <input
                  {...register('bp_max')}
                  type='number'
                  className='forminput'
                  placeholder='BP 최대 입력'
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='form-group mb-6'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>페어 최소</div>
                </div>
                <input
                  {...register('pair_min')}
                  type='number'
                  className='forminput'
                  placeholder='페어 최소 입력'
                />
              </div>
              <div className='form-group mb-6'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>페어 최대</div>
                </div>
                <input
                  {...register('pair_max')}
                  type='number'
                  className='forminput'
                  placeholder='페어 최대 입력'
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='form-group mb-6'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>타이 최소</div>
                </div>
                <input
                  {...register('tie_min')}
                  type='number'
                  className='forminput'
                  placeholder='타이 최소 입력'
                />
              </div>
              <div className='form-group mb-6'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>타이 최대</div>
                </div>
                <input
                  {...register('tie_max')}
                  type='number'
                  className='forminput'
                  placeholder='타이 최대 입력'
                />
              </div>
            </div>
            <div className='w-full flex justify-end mt-5'>
              <button
                style={{ backgroundColor: '#393E46' }}
                className='border rounded-md px-3 py-1 text-white text-base font-semibold'
                onClick={() => onClickAccntReg()}
              >
                한도 등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
