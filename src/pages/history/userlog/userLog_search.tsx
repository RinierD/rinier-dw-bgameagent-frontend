import React, { useState, useEffect } from 'react';

import { TreeSelect } from 'antd';
import DatePicker, { registerLocale } from 'react-datepicker';
import kr from 'date-fns/locale/ko';
import en from 'date-fns/locale/en-US';
import ch from 'date-fns/locale/zh-CN';
import 'react-datepicker/dist/react-datepicker.css';

import { Button } from '../../../components/button';
import { useReactiveVar } from '@apollo/client';
import { langVar, routeTitleVar, userLogData } from '../../../common/apollo';
import { useTranslation } from 'react-i18next';
import { fromToFormatter } from '../../../common/functions/fromToFormatter';
import { USER_LOG_SEARCH } from '../../../common/api/queries/userLog_query';
import { AxiosResponse } from 'axios';

export const UserLogSearch = () => {
  const { t } = useTranslation(['page']);
  const { SHOW_PARENT } = TreeSelect;

  const treeData = [
    {
      title: t('실행유형'),
      value: '1',
      key: '1',
      children: [
        {
          title: t('관리자로그인'),
          value: '1-0',
          key: '1-0',
        },
        {
          title: t('비밀번호변경'),
          value: '1-1',
          key: '1-1',
        },
        {
          title: t('롤링설정'),
          value: '1-2',
          key: '1-2',
        },
        {
          title: t('정지/허용'),
          value: '1-3',
          key: '1-3',
        },
        {
          title: t('서브계정추가'),
          value: '1-4-0',
          key: '1-4-0',
        },
        {
          title: t('하부계정추가'),
          value: '1-4-1',
          key: '1-4-1',
        },
        {
          title: t('서브계정수정'),
          value: '1-5-0',
          key: '1-5-0',
        },
        {
          title: t('하부계정수정'),
          value: '1-5-1',
          key: '1-5-1',
        },
        {
          title: t('게임로그인'),
          value: '2-0',
          key: '2-0',
        },
        {
          title: t('게임비밀번호변경'),
          value: '2-1',
          key: '2-1',
        },
      ],
    },
  ];

  const [value, setValue] = useState<string[]>([]);

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  const onChange = (newValue: string[]) => {
    console.log('onChange ', value);
    setValue(newValue);
  };

  const [clientWidth, setCilentWidth] = useState(window.innerWidth);
  const getWidth = () => window.innerWidth;
  useEffect(() => {
    const resizeListener = () => {
      setCilentWidth(getWidth());
    };
    window.addEventListener('resize', resizeListener);
  });

  const tProps = {
    treeData,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: t('실행유형 선택'),
    style: {
      width: '100%',
      height: '38px',
    },
    maxTagCount: clientWidth < 1700 ? 1 : 3,
  };

  useReactiveVar(routeTitleVar);
  useReactiveVar(userLogData);
  const selectedLang = useReactiveVar(langVar);

  registerLocale(
    'selectedLocale',
    selectedLang === '한국어' ? kr : selectedLang === 'English' ? en : ch
  );

  const onChangeFrom = (date: Date | null) => {
    setStartDate(date);
    setFrom(fromToFormatter(date));
  };

  const onChangeTo = (date: Date | null) => {
    setEndDate(date);
    setTo(fromToFormatter(date));
  };

  const getUserLog = () => {
    let settingDate = new Date();
    const oneDayBeforeSearchDate = settingDate.setDate(
      settingDate.getDate() - 30
    );
    const formattedDate = fromToFormatter(new Date(oneDayBeforeSearchDate));
    USER_LOG_SEARCH(formattedDate, '', '').then((res: AxiosResponse | any) => {
      if (res.data) {
        userLogData(res.data.data);
      }
    });
  };

  useEffect(() => {
    routeTitleVar(String(t('사용내역')));
    getUserLog();
  }, []);
  useEffect(() => {
    routeTitleVar(String(t('사용내역')));
  }, [selectedLang]);
  return (
    <div className="py-3 pr-3 border rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-end gap-3 pl-3 items-center">
        <div className="w-full sm:w-1/2 md:w-3/5 xl:w-1/3 overflow-hidden">
          <TreeSelect {...tProps} allowClear treeDefaultExpandAll />
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex items-center">
            <DatePicker
              className=" border border-gray-300 hover:border-blue-400 focus:border-blue-400 rounded-md h-9 pl-1 pr-2.5 w-full text-center sm:text-sm lg:text-base font-normal"
              selected={startDate}
              onChange={(date) => onChangeFrom(date)}
              isClearable
              showTimeSelect
              locale="selectedLocale"
              timeIntervals={60}
              placeholderText={String(t('시작시점'))}
              timeFormat="HH:mm"
              timeCaption={String(t('시간'))}
              dateFormat={'yyyy/MM/dd HH:mm'}
            />
          </div>
          <div className="flex items-center">
            <DatePicker
              className=" border border-gray-300 hover:border-blue-400 focus:border-blue-400 rounded-md h-9 pl-1 pr-2.5 sm:pr-3 w-full text-center sm:text-sm lg:text-base font-normal"
              selected={endDate}
              onChange={(date) => onChangeTo(date)}
              isClearable
              showTimeSelect
              timeIntervals={60}
              locale="selectedLocale"
              placeholderText={String(t('종료시점'))}
              timeFormat="HH:mm"
              timeCaption={String(t('시간'))}
              dateFormat={'yyyy/MM/dd HH:mm'}
            />
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
