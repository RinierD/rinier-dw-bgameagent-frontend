import React, { useEffect, useState } from 'react';

import DatePicker, { registerLocale } from 'react-datepicker';
import kr from 'date-fns/locale/ko';
import en from 'date-fns/locale/en-US';
import ch from 'date-fns/locale/zh-CN';
import 'react-datepicker/dist/react-datepicker.css';

import { Button } from '../../../components/button';
import { useReactiveVar } from '@apollo/client';
import {
  langVar,
  memberWinlossData,
  my_user_id,
  subMemberWinlossData,
} from '../../../common/apollo';
import { useTranslation } from 'react-i18next';
import { fromToFormatter } from '../../../common/functions/fromToFormatter';
import {
  SUB_WINLOSS_QUERY,
  WINLOSS_QUERY,
} from '../../../common/api/queries/winloss_query';
import { AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';

export const WinlossHistorySearch = () => {
  const { t } = useTranslation(['page']);
  const { handleSubmit } = useForm();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [userValue, setUserValue] = useState('');

  const myId = useReactiveVar(my_user_id);
  const selectedLang = useReactiveVar(langVar);
  useReactiveVar(memberWinlossData);
  useReactiveVar(subMemberWinlossData);

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

  const getWinLossData = () => {
    const settingFrom = new Date();
    const settingTo = new Date();
    const rawFrom = settingFrom.setDate(settingFrom.getDate() - 30);
    const rawTo = settingTo.setDate(settingTo.getDate());
    const formattedFrom = fromToFormatter(new Date(rawFrom));
    const formattedTo = fromToFormatter(new Date(rawTo));
    WINLOSS_QUERY(String(myId), formattedFrom, formattedTo).then(
      (res: AxiosResponse | any) => {
        if (res.data) {
          memberWinlossData(res.data.data);
        }
      }
    );
    SUB_WINLOSS_QUERY(String(myId), formattedFrom, formattedTo).then(
      (res: AxiosResponse | any) => {
        if (res.data) {
          subMemberWinlossData(res.data.data);
        }
      }
    );
  };

  const onSubmit = () => {
    const searchVerifyMessage = '검색조건오류';

    const settingFrom = new Date();
    const settingTo = new Date();
    const rawFrom = settingFrom.setDate(settingFrom.getDate() - 30);
    const rawTo = settingTo.setDate(settingTo.getDate());
    const formattedFrom = fromToFormatter(new Date(rawFrom));
    const formattedTo = fromToFormatter(new Date(rawTo));

    let searchFrom = '';
    let searchTo = '';
    let searchUser = '';

    if (!userValue) {
      searchUser = String(myId);
    } else {
      searchUser = String(userValue);
    }

    if (!startDate && !endDate) {
      searchFrom = formattedFrom;
      searchTo = formattedTo;
    } else if (!startDate && endDate) {
      const settingFrom = new Date(endDate);
      const rawFrom = settingFrom.setDate(settingFrom.getDate() - 30);
      const formattedFrom = fromToFormatter(new Date(rawFrom));
      searchFrom = formattedFrom;
      searchTo = to;
    } else if (startDate && !endDate) {
      const settingTo = new Date(startDate);
      const rawTo = settingTo.setDate(settingTo.getDate() + 30);
      const formattedTo = fromToFormatter(new Date(rawTo));
      searchTo = formattedTo;
      searchFrom = from;
    } else if (startDate && endDate) {
      const settingFrom = new Date(startDate);
      const settingTo = new Date(endDate);
      const rawFrom = settingFrom.setDate(settingFrom.getDate() - 30);
      const rawTo = settingTo.setDate(settingTo.getDate());
      const formattedFrom = fromToFormatter(new Date(rawFrom));
      const formattedTo = fromToFormatter(new Date(rawTo));
      searchFrom = formattedFrom;
      searchTo = formattedTo;
    }

    let isValid = true;
    let message = ` ${t('필수항목:')}`;

    if (startDate && endDate && startDate > endDate) {
      message += '시작시점이 종료시점보다 클 수 없습니다.';
      isValid = false;
    }

    if (!isValid) {
      alert(`${searchVerifyMessage} \n${message}`);
    } else {
      WINLOSS_QUERY(searchUser, searchFrom, searchTo)
        .then((res: AxiosResponse | any) => {
          if (res.data) {
            memberWinlossData(res.data.data);
          }
          if (res.response) {
            if (
              res.response.data.error.message ===
              'Have no permit for this request'
            ) {
              alert(t('요청권한없음'));
            } else {
              alert(t('요청권한없음'));
            }
          }
          if (res.request) {
            if (res.request.response === '') {
              alert('요청실패');
            }
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
      SUB_WINLOSS_QUERY(searchUser, searchFrom, searchTo).then(
        (res: AxiosResponse | any) => {
          if (res.data) {
            subMemberWinlossData(res.data.data);
          }
        }
      );
    }
  };

  useEffect(() => {}, [selectedLang]);
  useEffect(() => {
    getWinLossData();
  }, []);

  return (
    <div className="py-3 pr-3 border rounded-lg shadow-lg">
      <form
        className="flex flex-wrap justify-end gap-3 pl-3 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* This field below will not use anymore */}
        {/* <div className='flex flex-wrap items-center'>
					<div className='w-18 text-gray-500 align-middle mr-2'>
						{t('정켓이름')}:{' '}
					</div>
					<div>
						<select className='forminput'>
							<option value='ALL'>{t('전체')}</option>
							<option value='RP'>RIZAL PARK</option>
						</select>
					</div>
				</div> */}
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
              onChange={(e) => setUserValue(e.target.value)}
            />
          </div>
          <div className="pl-3">
            <Button canClick={true} actionText={t('검색')} />
          </div>
        </div>
      </form>
    </div>
  );
};
