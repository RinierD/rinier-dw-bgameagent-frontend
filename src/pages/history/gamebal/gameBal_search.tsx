import React, { useState, useEffect } from 'react';

import { Button } from '../../../components/button';
import { useReactiveVar } from '@apollo/client';
import {
	langVar,
	my_user_id,
	routeTitleVar,
	slotEgmHistoryData,
} from '../../../common/apollo';
import { useTranslation } from 'react-i18next';
import DatePicker, { registerLocale } from 'react-datepicker';
import kr from 'date-fns/locale/ko';
import en from 'date-fns/locale/en-US';
import ch from 'date-fns/locale/zh-CN';
import { fromToFormatter } from '../../../common/functions/fromToFormatter';
import {
	EGM_HISTORY_SEARCH,
	ISlotEgmHistoryRes,
} from '../../../common/api/queries/slot_query';
import { AxiosResponse } from 'axios';
import { useForm } from 'react-hook-form';

export const GameBalSearch = () => {
	const { t } = useTranslation(['page']);
	const { handleSubmit } = useForm();

	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');
	const [startDate, setStartDate] = useState<Date | null>();
	const [endDate, setEndDate] = useState<Date | null>();
	const [userValue, setUserValue] = useState('');
	const [transactionId, setTransactionId] = useState('');

	useReactiveVar(routeTitleVar);
	useReactiveVar(slotEgmHistoryData);
	const myId = useReactiveVar(my_user_id);
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

	const getEgmHistory = () => {
		let settingDate = new Date();
		const oneDayBeforeSearchDate = settingDate.setDate(
			settingDate.getDate() - 30
		);
		const formattedDate = fromToFormatter(new Date(oneDayBeforeSearchDate));
		EGM_HISTORY_SEARCH(formattedDate, '', '').then(
			(res: AxiosResponse | any) => {
				if (res.data) {
					const fetchedData: ISlotEgmHistoryRes[] = res.data.data;
					const processedData = fetchedData.map((elem) => {
						elem.junketName = 'Rizal Park';
						return elem;
					});
					slotEgmHistoryData(processedData);
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
		let searchTransactionId = '';

		if (!userValue) {
			searchUser = String(myId);
		} else {
			searchUser = String(userValue);
		}

		if (!transactionId) {
			searchTransactionId = '';
		} else {
			searchTransactionId = transactionId;
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
			EGM_HISTORY_SEARCH(searchFrom, searchTo, searchUser)
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						const fetchedData: ISlotEgmHistoryRes[] = res.data.data;
						const processedData = fetchedData.map((elem) => {
							elem.junketName = 'Rizal Park';
							return elem;
						});
						slotEgmHistoryData(processedData);
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
		}
	};

	useEffect(() => {
		routeTitleVar(String(t('게임금액변경')));
		getEgmHistory();
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('게임금액변경')));
	}, [selectedLang]);
	return (
		<div className='py-3 pr-3 border rounded-lg shadow-lg'>
			<form
				className='flex flex-wrap justify-end ml-3 gap-3 items-center'
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
				<div className='flex flex-col-1 gap-3 sm:flex-row'>
					<div className='form-group flex '>
						<input
							type='text'
							className='forminput w-41'
							placeholder={String(t('계정명 입력'))}
							onChange={(e) => setUserValue(e.target.value)}
						/>
					</div>
				</div>
				<div className='flex items-center'>
					<div className='form-group gap-3 flex'>
						<input
							type='text'
							className='forminput pr-10 w-full sm:w-full'
							placeholder={String(t('제안번호 입력'))}
							onChange={(e) => setTransactionId(e.target.value)}
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
