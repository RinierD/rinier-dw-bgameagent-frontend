import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { AiFillEdit, AiFillLock } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { Button } from '../../../../components/button';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { ITransactionPost } from '../../../../common/api/mutations/transaction_mutation';

interface IModalProps {
  setDepositModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreditDepositModal: React.FC<IModalProps> = ({
  setDepositModal,
}) => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<ITransactionPost>({ mode: 'onChange' });
  const { isSubmitting } = useFormState({ control });

  const [enteredNum, setEnterdNum] = useState<string>('');

  const clickModalClose = () => {
    setDepositModal((current) => !current);
  };

  const changeEnteredNum = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    let removedCommaValue: number = Number(value.replaceAll(',', ''));
    if (removedCommaValue > 9000000000000) {
      removedCommaValue = 9000000000000;
    }
    if (String(removedCommaValue) === 'NaN') {
      removedCommaValue = 0;
    }
    setEnterdNum(removedCommaValue.toLocaleString());
  };

  useEffect(() => {}, []);
  const onSubmit = () => {
    const {} = getValues();

    const data = {
      password: '',
    };
  };
  return (
    <div
      style={{ zIndex: '9999', overflow: 'auto' }}
      className='fixed top-0 right-0 bottom-0 left-0 outline-0'
    >
      <div className='fixed w-full h-full bg-black bg-opacity-40 flex flex-col justify-center items-center'>
        <div className='w-1/4 max-w-5xl top-10 shadow-lg'>
          <div className=''>
            <div className='lg:col-span-2'>
              <div className='border rounded-t-md border-green-600 font-medium text-lg px-6 py-2 border-b flex flex-row justify-center bg-green-600'>
                <div className='text-white text-xl font-bold'>크레딧 생성</div>
              </div>
              <div className='p-6 rounded-b-md shadow-md bg-white'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    type='text'
                    name='username'
                    className='w-0 h-0 border-0 block'
                  />
                  <input type='password' className='w-0 h-0 border-0 block' />
                  <div className='grid grid-cols-2 gap-4 mb-5'>
                    <div className='form-group mb-2 flex'>
                      <div className='flex flex-row items-center'>
                        <div className='text-gray-500 w-16 mr-1'>계정: </div>
                      </div>
                      <input
                        type='text'
                        disabled
                        className='pl-2 bg-white w-36 font-bold'
                        defaultValue='SuperAccnt01'
                      />
                    </div>
                    <div className='form-group mb-2 flex'>
                      <div className='flex flex-row items-center'>
                        <div className='text-gray-500 w-12 mr-1'>잔액: </div>
                      </div>
                      <input
                        type='text'
                        disabled
                        className='bg-white pl-2 w-20 font-bold'
                        defaultValue={Number(30000000).toLocaleString()}
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='mb-6 col-span-2 flex items-center'>
                      <div className='text-gray-500 w-12'>금액:</div>
                      <input
                        required
                        type='text'
                        value={enteredNum}
                        onChange={changeEnteredNum}
                        className='forminput text-right w-full'
                        placeholder='금액 입력'
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div className='mb-6 col-span-2 flex items-center'>
                      <div className='text-gray-500 w-12'>비고:</div>
                      <textarea
                        {...register('remark')}
                        className='border rounded-md border-gray-300 w-full h-20 focus:bg-white focus:border-blue-600 focus:outline-none'
                        style={{ resize: 'none' }}
                      />
                    </div>
                  </div>
                  <div className='w-full flex justify-between'>
                    <div className='w-full flex items-center ml-11 mr-3'>
                      <input
                        required
                        type='text'
                        className='border border-gray-300 rounded-md py-2 pl-2 w-full focus:bg-white focus:border-blue-600 focus:outline-none'
                        placeholder='실행 비밀번호 입력'
                      />
                    </div>
                    <div className='flex gap-3'>
                      <div className=''>
                        <button className='border border-gray-500 rounded-md py-2 px-3 font-bold text-md text-gray-600 flex items-center w-20 bg-gray-100'>
                          <div className='text-xl mr-1 text-green-500'>
                            <AiOutlineCheckCircle />
                          </div>
                          <div className='font-bold '>확인</div>
                        </button>
                      </div>
                      <div className='' onClick={clickModalClose}>
                        <button className='border border-gray-500 rounded-md py-2 px-3 font-bold text-md text-gray-600 flex items-center w-20 bg-gray-100'>
                          <div className='text-xl mr-1 text-red-500'>
                            <AiOutlineCloseCircle />
                          </div>
                          <div className='font-bold text-sm'>취소</div>
                        </button>
                      </div>
                    </div>
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
