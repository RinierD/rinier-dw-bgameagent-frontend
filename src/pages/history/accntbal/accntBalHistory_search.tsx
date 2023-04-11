import React, { useEffect, useState } from 'react';

import { TreeSelect } from 'antd';
import DatePicker, { registerLocale } from 'react-datepicker';
import kr from 'date-fns/locale/ko';
import en from 'date-fns/locale/en-US';
import ch from 'date-fns/locale/zh-CN';
import 'react-datepicker/dist/react-datepicker.css';

import { Button } from '../../../components/button';
import { useReactiveVar } from '@apollo/client';
import {
	langVar,
	my_user_id,
	routeTitleVar,
	transactionList,
} from '../../../common/apollo';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import {
	ITransactionQuery,
	TRANSACTIONS_GET_AGENT_ID,
	TRANSACTIONS_SEARCH,
} from '../../../common/api/queries/transaction_query';
import { AxiosResponse } from 'axios';
import { fromToFormatter } from '../../../common/functions/fromToFormatter';

const { SHOW_PARENT } = TreeSelect;

export const AccntBalHistorySearch = () => {
	const { t } = useTranslation(['page']);
	const { register, getValues, handleSubmit } = useForm<ITransactionQuery>({
		mode: 'onChange',
	});

	const treeData = [
		{
			title: t('금액유형'),
			value: '0',
			key: '0',
			children: [
				{
					title: t('하부입금'),
					value: 'LD',
					key: 'LD',
				},
				{
					title: t('하부출금'),
					value: 'LW',
					key: 'LW',
				},
				{
					title: t('상부입금'),
					value: 'UD',
					key: 'UD',
				},
				{
					title: t('상부출금'),
					value: 'UW',
					key: 'UW',
				},
				{
					title: t('바카라입금'),
					value: 'BD',
					key: 'BD',
				},
				{
					title: t('바카라출금'),
					value: 'BW',
					key: 'BW',
				},
				{
					title: t('슬롯입금'),
					value: 'SD',
					key: 'SD',
				},
				{
					title: t('슬롯출금'),
					value: 'SW',
					key: 'SW',
				},
			],
		},
	];

	const [typeValues, setTypeValues] = useState<string[]>([]);
	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');
	const [startDate, setStartDate] = useState<Date | null>();
	const [endDate, setEndDate] = useState<Date | null>();

	const selectedLang = useReactiveVar(langVar);
	const myId = useReactiveVar(my_user_id);
	useReactiveVar(transactionList);
	useReactiveVar(routeTitleVar);

	registerLocale(
		'selectedLocale',
		selectedLang === '한국어' ? kr : selectedLang === 'English' ? en : ch
	);

	const onChange = (newValue: string[]) => {
		setTypeValues(newValue);
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
		value: typeValues,
		onChange,
		treeCheckable: true,
		showCheckedStrategy: SHOW_PARENT,
		placeholder: t('금액유형 선택'),
		style: {
			width: '100%',
			height: '38px',
		},
		maxTagCount: clientWidth < 1700 ? 1 : 3,
	};

	const onChangeFrom = (date: Date | null) => {
		setStartDate(date);
		setFrom(fromToFormatter(date));
	};

	const onChangeTo = (date: Date | null) => {
		setEndDate(date);
		setTo(fromToFormatter(date));
	};

	const getTransactionData = () => {
		TRANSACTIONS_GET_AGENT_ID(String(myId))
			.then((res: AxiosResponse | any) => {
				if (res.data.data) {
					transactionList(res.data.data);
				}
				if (res.response) {
					alert(res.response.data.error.message);
				}
				if (res.request) {
					if (res.request.response === '') {
						alert('Request Failed');
					}
				}
			})
			.catch((err) => {
				console.log(err.response);
			});
	};

	const onSubmit = () => {
		const verifyMessage = t('필수 항목이 채워지지 않았습니다');

		const { account_name } = getValues();
		const data = {
			account_name: account_name,
			transaction_types: typeValues.join(','),
			from: from,
			to: to,
		};

		let isValid = true;
		let message = ` ${t('필수항목:')}`;

		if (startDate && endDate && startDate > endDate) {
			message += '시작시점이 종료시점보다 클 수 없습니다.';
			isValid = false;
		}

		if (!isValid) {
			alert(`${verifyMessage} \n${message}`);
		} else {
			TRANSACTIONS_SEARCH(data)
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						transactionList(res.data.data);
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
		routeTitleVar(String(t('계정금액변경')));
		getTransactionData();
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('계정금액변경')));
	}, [selectedLang]);

	return (
		<div className='py-3 pr-3 border rounded-lg shadow-lg'>
			<form
				className='flex flex-wrap justify-end gap-3 pl-3 items-center'
				onSubmit={handleSubmit(() => onSubmit())}
			>
				<div className='w-full sm:w-1/2 md:w-2/4 xl:w-1/3 overflow-hidden'>
					<TreeSelect {...tProps} allowClear treeDefaultExpandAll />
				</div>
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
							{...register('account_name')}
							type='text'
							className='forminput pr-10 w-full sm:w-full'
							placeholder={String(t('계정명 입력'))}
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
