import React, { useState, useEffect } from 'react';

import { DatePicker } from 'antd';
import locale from 'antd/lib/locale/ko_KR';

import localeKr from 'antd/lib/locale/ko_KR';
import localeEn from 'antd/lib/locale/en_US';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { Dayjs } from 'dayjs';
import { Button } from '../../../components/button';
import { useReactiveVar } from '@apollo/client';
import { langVar, routeTitleVar } from '../../../common/apollo';
import { useTranslation } from 'react-i18next';
dayjs.locale('ko');

export const CreditSearch = () => {
  const { t } = useTranslation(['page']);
  const { RangePicker } = DatePicker;

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rangePickerLang, setRangePickerLang] = useState(localeKr);

  useReactiveVar(routeTitleVar);
  const selectedLang = useReactiveVar(langVar);

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

  const rangePresets: {
    label: string;
    value: [Dayjs, Dayjs];
  }[] = [
    { label: t('지난 1주'), value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: t('지난 2주'), value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: t('지난 1달'), value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: t('지난 3달'), value: [dayjs().add(-90, 'd'), dayjs()] },
  ];
  useEffect(() => {
    routeTitleVar(String(t('게임금액변경')));
  }, []);
  useEffect(() => {
    routeTitleVar(String(t('게임금액변경')));
    if (selectedLang === 'English') {
      setRangePickerLang(localeEn);
    } else if (selectedLang === t('한국어')) {
      setRangePickerLang(localeKr);
    }
  }, [selectedLang]);
  return (
    <div className='py-3 pr-3 border rounded-lg shadow-md'>
      <div className='flex justify-end gap-3 items-center'>
        <div className=''>
          <ConfigProvider locale={rangePickerLang}>
            <RangePicker
              style={{ height: '38px' }}
              presets={rangePresets}
              showTime
              format='YYYY/MM/DD HH:mm'
              onChange={onRangeChange}
            />
          </ConfigProvider>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-3'>
            <select className='forminput w-40' required>
              <option value=''>{t('화폐')}</option>
              <option value=''>PHP</option>
              <option value=''>CNY</option>
              <option value=''>HKD</option>
              <option value=''>KRW</option>
              <option value=''>USD</option>
            </select>
            <select className='forminput w-40' required>
              <option value=''>{t('크레딧 유형')}</option>
              <option value=''>{t('생성')}</option>
              <option value=''>{t('인출')}</option>
            </select>
            <div>
              <Button canClick={true} actionText={t('검색')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
