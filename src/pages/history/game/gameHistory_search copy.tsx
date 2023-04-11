import React, { useState, useEffect } from 'react';

import { DatePicker, DatePickerProps } from 'antd';
import localeKr from 'antd/lib/locale/ko_KR';
import localeEn from 'antd/lib/locale/en_US';
import localeCh from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { Dayjs } from 'dayjs';
import { Button } from '../../../components/button';
import { useReactiveVar } from '@apollo/client';
import { langVar, routeTitleVar } from '../../../common/apollo';
import { useTranslation } from 'react-i18next';
dayjs.locale('ko');

export const GameHistorySearchCopy = () => {
  const { t } = useTranslation(['page']);

  const [from, setFrom] = useState('');
  const [fromJs, setFromJs] = useState<Dayjs | ''>('');
  const [to, setTo] = useState('');
  const [toJs, setToJs] = useState<Dayjs | ''>('');

  useReactiveVar(routeTitleVar);
  const selectedLang = useReactiveVar(langVar);
  const [rangePickerLang, setRangePickerLang] = useState(localeKr);

  const onChangeFrom: DatePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
    setFrom(date.format("'YYYY-MM-DD HH:00:00'"));
    setFromJs(date);
  };
  const onChangeTo: DatePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
    setTo(date.format("'YYYY-MM-DD HH:00:00'"));
    setToJs(date);
  };

  useEffect(() => {
    routeTitleVar(String(t('게임기록')));
  }, []);
  useEffect(() => {
    routeTitleVar(String(t('게임기록')));
    if (selectedLang === 'English') {
      setRangePickerLang(localeEn);
    } else if (selectedLang === t('한국어')) {
      setRangePickerLang(localeKr);
    } else if (selectedLang === '中文') {
      setRangePickerLang(localeCh);
    }
  }, [selectedLang]);
  return (
    <div className="py-3 pr-3 border rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-end pl-3 gap-3 items-center">
        <div className="flex flex-wrap items-center">
          <div className="w-18 text-gray-500 align-middle mr-2">
            {t('게임유형') + ':'}
          </div>
          <div>
            <select className="forminput">
              <option value="ALL">{t('전체')}</option>
              <option value="RP">{t('스피드')}</option>
              <option value="OK">{t('폰베팅')}</option>
              <option value="S">{t('슬롯')}</option>
            </select>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-18 text-gray-500 align-middle mr-2">
            {t('정켓이름') + ':'}
          </div>
          <div>
            <select className="forminput">
              <option value="ALL">{t('전체')}</option>
              <option value="RP">RIZAL PARK</option>
              <option value="OK">OKADA</option>
              <option value="SO">SOLAIR</option>
              <option value="DE">DEHEIGHTS</option>
              <option value="HE">HERITAGE</option>
            </select>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-18 text-gray-500 align-middle mr-2">
            {t('정산상태') + ':'}
          </div>
          <div>
            <select className="forminput">
              <option value="ALL">{t('전체')}</option>
              <option value="RP">{t('정산')}</option>
              <option value="OK">{t('미정산')}</option>
            </select>
          </div>
        </div>
        <div className="flex md:flex-row sm:flex-col items-center gap-3">
          <div className="flex items-center">
            <ConfigProvider locale={rangePickerLang}>
              <DatePicker
                style={{ height: '38px' }}
                allowClear
                showTime
                showNow={false}
                showToday={false}
                value={fromJs === '' ? null : fromJs}
                placeholder={String(t('시작일'))}
                format="YYYY-MM-DD HH:00"
                onSelect={(value) => onChangeFrom(value)}
                onChange={() => setFromJs('')}
              />
            </ConfigProvider>
          </div>
          <div className="flex items-center">
            <ConfigProvider locale={rangePickerLang}>
              <DatePicker
                style={{ height: '38px' }}
                showTime
                showNow={false}
                showToday={false}
                value={toJs === '' ? null : toJs}
                placeholder={String(t('종료일'))}
                format="YYYY-MM-DD HH:00"
                onSelect={(value) => onChangeTo(value)}
                onChange={() => setToJs('')}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className="flex items-center">
          <div className="form-group gap-3 flex">
            <input
              type="text"
              className="forminput pr-10 w-full sm:w-full"
              placeholder={String(t('계정명 입력'))}
            />
          </div>
          <div className="pl-3">
            <Button canClick={true} actionText={t('검색')} />
          </div>
        </div>
      </div>
    </div>
  );
};
