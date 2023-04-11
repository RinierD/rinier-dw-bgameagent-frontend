import React, { useState, useEffect } from 'react';

import DatePicker, { registerLocale } from 'react-datepicker';
import kr from 'date-fns/locale/ko';
import en from 'date-fns/locale/en-US';
import ch from 'date-fns/locale/zh-CN';
import { Button } from '../../../components/button';
import { useReactiveVar } from '@apollo/client';
import {
	langVar,
	my_user_id,
	routeTitleVar,
	slotGameHistoryData,
} from '../../../common/apollo';
import { useTranslation } from 'react-i18next';
import { fromToFormatter } from '../../../common/functions/fromToFormatter';
import {
	GAME_HISTORY_SEARCH,
	ISlotGameHistoryRes,
} from '../../../common/api/queries/slot_query';
import { AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';

export const GameHistorySearch = () => {
	const { handleSubmit } = useForm();
	const { t } = useTranslation(['page']);

	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');
	const [startDate, setStartDate] = useState<Date | null>();
	const [endDate, setEndDate] = useState<Date | null>();
	const [user_id, setUser_id] = useState('');

	useReactiveVar(slotGameHistoryData);
	useReactiveVar(routeTitleVar);
	const selectedLang = useReactiveVar(langVar);
	const myId = useReactiveVar(my_user_id);
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

	const getGameHistory = () => {
		let settingDate = new Date();
		const oneDayBeforeSearchDate = settingDate.setDate(
			settingDate.getDate() - 7
		);
		const formattedDate = fromToFormatter(new Date(oneDayBeforeSearchDate));
		GAME_HISTORY_SEARCH(formattedDate, '', '').then(
			(res: AxiosResponse | any) => {
				if (res.data) {
					const fetchedData: ISlotGameHistoryRes[] = res.data.data;
					const processedData = fetchedData.map((elem) => {
						elem.junketName = 'Rizal Park';
						return elem;
					});
					slotGameHistoryData(processedData);
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

		if (!user_id) {
			searchUser = String(myId);
		} else {
			searchUser = String(user_id);
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
			const rawFrom = settingFrom.setDate(settingFrom.getDate());
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
			GAME_HISTORY_SEARCH(searchFrom, searchTo, user_id).then(
				(res: AxiosResponse | any) => {
					if (res.data) {
						const fetchedData: ISlotGameHistoryRes[] = res.data.data;
						const processedData = fetchedData.map((elem) => {
							elem.junketName = 'Rizal Park';
							return elem;
						});
						slotGameHistoryData(processedData);
					}
				}
			);
		}
	};

	useEffect(() => {
		getGameHistory();
		routeTitleVar(String(t('게임기록')));
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('게임기록')));
	}, [selectedLang]);
	return (
		<div className='py-3 pr-3 border rounded-lg shadow-lg'>
			<form
				className='flex flex-wrap justify-end pl-3 gap-3 items-center'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-row gap-3'>
					<div className='flex items-center'>
						<DatePicker
							className=' border border-gray-300 hover:border-blue-400 focus:border-blue-400 rounded-md h-9 pl-1 pr-2.5 w-full text-center sm:text-sm lg:text-base font-normal'
							selected={startDate}
							onChange={(date) => onChangeFrom(date)}
							isClearable
							showTimeSelect
							locale='selectedLocale'
							timeIntervals={60}
							placeholderText={String(t('시작시점'))}
							timeFormat='HH:mm'
							timeCaption={String(t('시간'))}
							dateFormat={'yyyy/MM/dd HH:mm'}
						/>
					</div>
					<div className='flex items-center'>
						<DatePicker
							className=' border border-gray-300 hover:border-blue-400 focus:border-blue-400 rounded-md h-9 pl-1 pr-2.5 sm:pr-3 w-full text-center sm:text-sm lg:text-base font-normal'
							selected={endDate}
							onChange={(date) => onChangeTo(date)}
							isClearable
							showTimeSelect
							timeIntervals={60}
							locale='selectedLocale'
							placeholderText={String(t('종료시점'))}
							timeFormat='HH:mm'
							timeCaption={String(t('시간'))}
							dateFormat={'yyyy/MM/dd HH:mm'}
						/>
					</div>
				</div>
				<div className='flex items-center'>
					<div className='form-group gap-3 flex'>
						<input
							type='text'
							className='forminput pr-10 w-full sm:w-full'
							placeholder={String(t('계정명 입력'))}
							onChange={(e) => setUser_id(e.target.value)}
						/>
					</div>
					<div className='pl-3'>
						<Button canClick={true} actionText={t('검색')} />
					</div>
				</div>
			</form>
		</div>
	);
};
