import { useReactiveVar } from '@apollo/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { IAccntRegPost } from '../../../common/api/mutations/accnt_mutation';
import { IBetLimitResponse } from '../../../common/api/queries/betlimit_query';
import { routeTitleVar } from '../../../common/apollo';
import { FormError } from '../../../components/form-error';
import dummyData from '../../accntManage/dummydata_accntGen.json';
import { Switch } from 'antd';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

export const RootAccntReg = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IAccntRegPost>({ mode: 'onChange' });
  const { isSubmitting } = useFormState({ control });
  const data = dummyData.betLimit;

  const [userType, setUserType] = useState('');
  const [currency, setCurrency] = useState('');
  const [bchecked, setBChecked] = useState(true);
  const [schecked, setSChecked] = useState(false);

  const columnHelper = createColumnHelper<IBetLimitResponse>();

  useReactiveVar(routeTitleVar);
  useEffect(() => {
    routeTitleVar('최상위계정 추가');
  }, []);

  const handleOnClickUserType = (e: React.MouseEvent<HTMLInputElement>) => {
    setUserType(e.currentTarget.value);
  };
  const handleOnClickCurrencyType = (e: React.MouseEvent<HTMLInputElement>) => {
    setCurrency(e.currentTarget.value);
  };

  const selectAll = () => {
    const checkboxes = document.getElementsByName(
      'limitCheckBox'
    ) as NodeListOf<HTMLInputElement>;
    const selectAllElem = document.getElementsByName(
      'limitSelectAll'
    ) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox) => {
      if (selectAllElem[0].checked === true) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
  };

  const onSubmit = () => {
    const { password } = getValues();

    const data = {
      password: password,
    };
  };

  const columns = [
    columnHelper.accessor('bp_min', {
      header: '뱅커/플레이어',
    }),
    columnHelper.accessor('tie_min', {
      header: '타이',
    }),
    columnHelper.accessor('pair_min', {
      header: '페어',
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='w-full'>
      <form
        className='w-full flex flex-col justify-center items-center'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='w-2/5'>
          <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
            개인정보
          </div>
          <div className='py-3'>
            <input
              type='text'
              name='username'
              className='w-0 h-0 border-0 block'
            />
            <input type='password' className='w-0 h-0 border-0 block' />
            <div className='grid grid-cols-2 gap-4'>
              <div className='mb-3'>
                <div className='mb-2 text-gray-500'>
                  계정명<code className='text-red-600'> *</code>
                </div>
                <input
                  {...register('password', {
                    required: 'required',
                  })}
                  required
                  type='text'
                  className='forminput'
                  placeholder='계정명 입력'
                />
              </div>
              <div className='mb-3'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>닉네임</div>
                </div>
                <input
                  required
                  type='text'
                  className='forminput'
                  placeholder='닉네임 입력'
                />
              </div>
              <div className='mb-3'>
                <div className='mb-2 text-gray-500'>
                  비밀번호<code className='text-red-600'> *</code>
                </div>
                <input
                  {...register('password', {
                    required: 'required',
                  })}
                  required
                  type='password'
                  className='forminput'
                  placeholder='비밀번호 입력'
                />
              </div>
              <div className='mb-3'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>
                    비밀번호 확인<code className='text-red-600'> *</code>
                  </div>
                </div>
                <input
                  {...register('password', {
                    validate: {
                      matchesPreviousePassword: (value) => {
                        const { password } = getValues();
                        return password === value || 'password is not the same';
                      },
                    },
                  })}
                  required
                  type='password'
                  className='forminput'
                  placeholder='비밀번호 확인'
                />
              </div>
            </div>
            <div className='grid grid-cols-4 gap-4 mt-4'>
              <div className='mb-3 col-span-1'>
                <div className='mb-2 text-gray-500'>국가번호</div>
                <input
                  {...register('password', {
                    required: 'required',
                  })}
                  required
                  type='text'
                  className='forminput'
                  placeholder='국가번호 입력'
                />
              </div>
              <div className='mb-3 col-span-3'>
                <div className='flex flex-row'>
                  <div className='mb-2 text-gray-500'>전화번호</div>
                </div>
                <input
                  required
                  type='text'
                  className='forminput'
                  placeholder='전화번호 입력'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='w-2/5'>
          <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
            계정유형
          </div>
          <div className='py-3'>
            <input
              type='text'
              name='username'
              className='w-0 h-0 border-0 block'
            />
            <input type='password' className='w-0 h-0 border-0 block' />
            <div className='grid grid-cols-3 gap-4'>
              <div className='mb-2 flex justify-between mr-5'>
                <div className='mb-2 text-gray-500'>
                  <label className='flex flex-row gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='userRoleCheckbox'
                      value='1'
                      onClick={(e) => handleOnClickUserType(e)}
                    />
                    <div className='text-base w-16'>에이전트</div>
                  </label>
                </div>
                <div className='mb-2 text-gray-500'>
                  <label className='flex flex-row gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='userRoleCheckbox'
                      value='0'
                      onClick={(e) => handleOnClickUserType(e)}
                    />
                    <div className='text-base w-8'>회원</div>
                  </label>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div className='w-2/5'>
          <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
            화폐
          </div>
          <div className='py-3'>
            <input
              type='text'
              name='username'
              className='w-0 h-0 border-0 block'
            />
            <input type='password' className='w-0 h-0 border-0 block' />
            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-3 mb-2 flex justify-between mr-5'>
                <div className='mb-2 text-gray-500'>
                  <label className='flex flex-row gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='currencyCheckbox'
                      value='0'
                      onClick={(e) => handleOnClickCurrencyType(e)}
                    />
                    <div className='text-base'>PHP</div>
                  </label>
                </div>
                <div className='mb-2 text-gray-500'>
                  <label className='flex flex-row gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='currencyCheckbox'
                      value='1'
                      onClick={(e) => handleOnClickCurrencyType(e)}
                    />
                    <div className='text-base w-8'>KRW</div>
                  </label>
                </div>
                <div className='mb-2 text-gray-500'>
                  <label className='flex flex-row gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='currencyCheckbox'
                      value='2'
                      onClick={(e) => handleOnClickCurrencyType(e)}
                    />
                    <div className='text-base w-8'>USD</div>
                  </label>
                </div>
                <div className='mb-2 text-gray-500'>
                  <label className='flex flex-row gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='currencyCheckbox'
                      value='3'
                      onClick={(e) => handleOnClickCurrencyType(e)}
                    />
                    <div className='text-base w-8'>CNY</div>
                  </label>
                </div>
                <div className='mb-2 text-gray-500'>
                  <label className='flex flex-row gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='currencyCheckbox'
                      value='4'
                      onClick={(e) => handleOnClickCurrencyType(e)}
                    />
                    <div className='text-base w-8'>HKD</div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-2/5'>
          <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
            게임유형
          </div>
          <div className='py-3'>
            <input
              type='text'
              name='username'
              className='w-0 h-0 border-0 block'
            />
            <input type='password' className='w-0 h-0 border-0 block' />
            <div className=''>
              <div className='font-medium text-base align-middle grid grid-cols-3'>
                <div className='col-span-1 grid grid-cols-2 items-center'>
                  <div className='text-gray-600'>바카라</div>
                  <div className='flex items-center'>
                    <Switch
                      style={{ backgroundColor: bchecked ? '#2C74B3' : 'gray' }}
                      checked={bchecked}
                      onChange={setBChecked}
                    />
                  </div>
                </div>
                <div className='col-span-2 flex'>
                  <div className='flex items-center'>
                    <div className='w-16 text-base'>쉐어: </div>
                    <input
                      pattern='^[a-zA-Z0-9]*$'
                      type='text'
                      disabled={!bchecked}
                      className={`forminput w-full mr-3 ${
                        bchecked ? null : 'bg-gray-100'
                      }`}
                      placeholder='쉐어%'
                    />
                  </div>
                  <div className='flex items-center'>
                    <div className='w-16 mr-2 text-base'>롤링: </div>
                    <input
                      pattern='^[a-zA-Z0-9]*$'
                      type='text'
                      disabled={!bchecked}
                      className={`forminput w-full ${
                        bchecked ? null : 'bg-gray-100'
                      }`}
                      placeholder='롤링%'
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-5'>
              <div className='font-medium text-base align-middle grid grid-cols-3'>
                <div className='col-span-1 grid grid-cols-2 items-center'>
                  <div className='text-gray-600'>슬롯</div>
                  <div className='flex items-center'>
                    <Switch
                      style={{ backgroundColor: schecked ? '#2C74B3' : 'gray' }}
                      checked={schecked}
                      onChange={setSChecked}
                    />
                  </div>
                </div>
                <div className='col-span-2 flex'>
                  <div className='flex items-center'>
                    <div className='w-16 text-base'>쉐어: </div>
                    <input
                      pattern='^[a-zA-Z0-9]*$'
                      type='text'
                      disabled={!schecked}
                      className={`forminput w-full mr-3 ${
                        schecked ? null : 'bg-gray-100'
                      }`}
                      placeholder='쉐어%'
                    />
                  </div>
                  <div className='flex items-center'>
                    <div className='w-16 mr-2 text-base'>롤링: </div>
                    <input
                      pattern='^[a-zA-Z0-9]*$'
                      type='text'
                      disabled={!schecked}
                      className={`forminput w-full ${
                        schecked ? null : 'bg-gray-100'
                      }`}
                      placeholder='롤링%'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-2/5'>
          <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
            한도설정
          </div>
          <div className='py-3'>
            <table className='w-full'>
              <thead
                className='w-full'
                style={{
                  backgroundColor: '#2C74B3',
                  borderColor: '#2C74B3',
                  borderWidth: '1px',
                }}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className=''>
                    <th
                      style={{ cursor: 'default' }}
                      className='text-xs font-bold text-white px-2 pt-3 text-center flex'
                    >
                      {userType === '1' ? (
                        <label>
                          <input
                            type='checkbox'
                            name='limitSelectAll'
                            onChange={() => selectAll()}
                          />
                        </label>
                      ) : null}
                    </th>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className='text-sm text-left font-bold text-white px-2 py-2'
                      >
                        <div className='text-left'>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className='border'>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className='even:bg-white odd:bg-gray-100 text-xs'
                  >
                    <td className='px-2 mt-3 flex justify-start'>
                      <label>
                        <input
                          type={userType === '1' ? 'checkbox' : 'radio'}
                          name='limitCheckBox'
                          value={row.original.id}
                        />
                      </label>
                    </td>
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.columnDef.header === '뱅커/플레이어') {
                        return (
                          <td
                            key={`cell_${cell.id}`}
                            className='px-2 py-2 text-sm text-left text-gray-900'
                          >
                            {`${row.original.bp_min.toLocaleString()} ~ ${row.original.bp_max.toLocaleString()}`}
                          </td>
                        );
                      } else if (cell.column.columnDef.header === '타이') {
                        return (
                          <td
                            key={`cell_${cell.id}`}
                            className='px-2 py-2 text-sm text-left text-gray-900'
                          >
                            {`${row.original.tie_min.toLocaleString()} ~ ${row.original.tie_max.toLocaleString()}`}
                          </td>
                        );
                      } else if (cell.column.columnDef.header === '페어') {
                        return (
                          <td
                            key={`cell_${cell.id}`}
                            className='px-2 py-2 text-sm text-left text-gray-900'
                          >
                            {`${row.original.pair_min.toLocaleString()} ~ ${row.original.pair_max.toLocaleString()}`}
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={cell.id}
                            className='px-2 py-2 text-sm text-left font-medium text-gray-900'
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className='w-2/5'>
          <div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
            계정등록
          </div>
          <div className='py-3'>
            <input
              type='text'
              name='username'
              className='w-0 h-0 border-0 block'
            />
            <input type='password' className='w-0 h-0 border-0 block' />
            <div className='grid grid-cols-4 gap-4'>
              <div className='col-span-2 flex items-center'>
                <input
                  // {...register('game_password', {
                  //   pattern: {
                  //     value: /^[a-zA-Z0-9]*$/,
                  //     message: '영어숫자만 가능',
                  //   },
                  // })}
                  maxLength={5}
                  minLength={5}
                  pattern='^[a-zA-Z0-9]*$'
                  type='text'
                  className='forminput col-span-3'
                  placeholder='실행 비밀번호 입력'
                />
              </div>
              <div className='border border-gray-500 rounded-md text-center flex justify-center items-center cursor-pointer bg-gray-100'>
                <div className='text-xl mr-1 text-green-500'>
                  <AiOutlineCheckCircle />
                </div>
                <button className='font-bold text-base'>확인</button>
              </div>
              <div className='border border-gray-500 rounded-md text-center flex justify-center items-center cursor-pointer bg-gray-100'>
                <div className='text-xl mr-1 text-red-500'>
                  <AiOutlineCloseCircle />
                </div>
                <button className='font-bold text-base'>취소</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
