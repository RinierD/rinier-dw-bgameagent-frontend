import {useReactiveVar} from '@apollo/client';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {DatePicker} from 'antd';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {langVar, routeTitleVar} from '../../../common/apollo';
import dummyData from '../dummydata_accntGen.json';
import {useTranslation} from 'react-i18next';

dayjs.locale('ko');

export const AccntGeneralAInfo = () => {
  const {t} = useTranslation(['page']);

  const {RangePicker} = DatePicker;
  const {register, getValues, handleSubmit} = useForm({
    mode: 'onChange',
  });

  useReactiveVar(routeTitleVar);
  const selectedLang = useReactiveVar(langVar);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    if (dates) {
      setFrom(dateStrings[0]);
      setTo(dateStrings[1]);
    } else {
      setFrom('');
      setTo('');
    }
  };

  const onSubmit = () => {
    const {
      junket_code,
      type,
      currency_code,
      account_code,
      mgt_id,
    } = getValues();

    const data = {
      company_code: '',
      junket_code: junket_code,
      type: type,
      currency_code: currency_code,
      account_code: account_code,
      mgt_id: mgt_id,
      from: from,
      to: to,
    };
  };

  useEffect(() => {
    routeTitleVar(String(t('계정총람')));
  }, []);
  useEffect(() => {
    routeTitleVar(String(t('계정총람')));
  }, [selectedLang]);

  return (
    <div>
      <div className='ml-1 mb-2 text-gray-500 font-semibold'>
        <div className='flex flex-wrap justify-between gap-2'>
          <div className='flex'>
            <div className='mr-2'>{t('에이전트')}:</div>
            <div className='text-blue-500 underline cursor-pointer'>
              {dummyData.acctData.parent_id}
            </div>
          </div>
        </div>
      </div>
      <div className='pt-3 pb-4 pl-3 border rounded-lg shadow-lg'>
        <div>
          <div className='flex flex-row items-center gap-3 mb-3'>
            <div className='flex items-center mr-3'>
              <div className='text-gray-500 font-medium'>{t('계정')}:</div>
              <div className='ml-2 text-gray-700 font-bold text-lg'>
                AdminAccnt01
              </div>
            </div>
            <div className='flex items-center mr-3'>
              <div className='text-gray-500 font-medium'>
                {t('크레딧 잔액')}:{' '}
              </div>
              <div className='ml-2 text-gray-700 font-bold text-lg flex mr-5'>
                <div className='mr-2'>PHP:</div>
                <div>1,000,000,000</div>
              </div>
              <div className='ml-2 text-gray-700 font-bold text-lg flex mr-5'>
                <div className='mr-2'>CNY:</div>
                <div>1,000,000,000</div>
              </div>
              <div className='ml-2 text-gray-700 font-bold text-lg flex mr-5'>
                <div className='mr-2'>HKD:</div>
                <div>1,000,000,000</div>
              </div>
              <div className='ml-2 text-gray-700 font-bold text-lg flex mr-5'>
                <div className='mr-2'>KRW:</div>
                <div>1,000,000,000</div>
              </div>
            </div>
          </div>
          <div className='flex flex-row items-center gap-3'>
            <div className='flex items-center mr-3'>
              <div className='text-gray-500 font-medium'>{t('계정잔액')}:</div>
              <div className='ml-2 text-gray-700  font-bold'>
                {dummyData.acctData.balance.toLocaleString()}
              </div>
            </div>
            <div className='flex items-center mr-3'>
              <div className='text-gray-500 font-medium'>{t('하부잔액')}:</div>
              <div className='ml-2 text-gray-700 font-bold'>
                {dummyData.acctData.childrenBalance.toLocaleString()}
              </div>
            </div>
            <div className='flex items-center mr-3'>
              <div className='text-gray-500 font-medium'>{t('총잔액')}:</div>
              <div className='ml-2 text-gray-700 font-bold'>
                {(
                  dummyData.acctData.balance +
                  dummyData.acctData.childrenBalance
                ).toLocaleString()}
              </div>
            </div>
            <div className='flex items-center mr-3'>
              <div className='text-gray-500 font-medium'>{t('베팅한도')}:</div>
              <div className='ml-2 text-gray-700 font-bold'>{t('상세')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
