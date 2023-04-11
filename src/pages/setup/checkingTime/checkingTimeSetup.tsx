import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import {
	langVar,
	loggedInMemberData,
	my_user_id,
	parentIdList,
	routeTitleVar,
} from '../../../common/apollo';
import { TimePicker, TimePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import { useTranslation } from 'react-i18next';
import {
	ACCOUNT_CHECKTIME_UPDATE,
	IAccntCheckTimeUpdate,
} from '../../../common/api/mutations/accnt_mutation';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { MEMBER_INFO_GET } from '../../../common/api/queries/accnt_query';

dayjs.locale('ko');

export const CheckingTimeSetup = () => {
	const { t } = useTranslation(['page']);

	const format = 'HH:mm';

	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<IAccntCheckTimeUpdate>({ mode: 'onChange' });
	const { isSubmitting } = useFormState({ control });

	const myData = useReactiveVar(loggedInMemberData);
	const selectedLang = useReactiveVar(langVar);
	const myId = useReactiveVar(my_user_id);
	useReactiveVar(routeTitleVar);
	useReactiveVar(parentIdList);

	const [winlossS, setWinlossS] = useState(
		myData?.winloss_time.substring(0, 5)
	);
	const [winlossSJs, setWinlossSJs] = useState<Dayjs | ''>(
		dayjs(myData?.winloss_time.substring(0, 5), format)
	);
	const [winlossE, setWinlossE] = useState(myData?.winloss_time.substring(5));
	const [winlossEJs, setWinnlossEJs] = useState<Dayjs | ''>(
		dayjs(myData?.winloss_time.substring(5), format)
	);
	const [gameS, setGameS] = useState(myData?.game_time.substring(0, 5));
	const [gameSJs, setGameSJs] = useState<Dayjs | ''>(
		dayjs(myData?.game_time.substring(0, 5), format)
	);
	const [gameE, setGameE] = useState(myData?.game_time.substring(5));
	const [gameEJs, setGameEJs] = useState<Dayjs | ''>(
		dayjs(myData?.game_time.substring(5), format)
	);
	const [accntBalS, setAccntBalS] = useState(
		myData?.account_bal_time.substring(0, 5)
	);
	const [accntBalSJs, setAccntBalSJs] = useState<Dayjs | ''>(
		dayjs(myData?.account_bal_time.substring(0, 5), format)
	);
	const [accntBalE, setAccntBalE] = useState(
		myData?.account_bal_time.substring(5)
	);
	const [accntBalEJs, setAccntBalEJs] = useState<Dayjs | ''>(
		dayjs(myData?.account_bal_time.substring(5), format)
	);
	const [gameBalS, setGameBalS] = useState(
		myData?.game_bal_time.substring(0, 5)
	);
	const [gameBalSJs, setGameBalSJs] = useState<Dayjs | ''>(
		dayjs(myData?.game_bal_time.substring(0, 5), format)
	);
	const [gameBalE, setGameBalE] = useState(myData?.game_bal_time.substring(5));
	const [gameBalEJs, setGameBalEJs] = useState<Dayjs | ''>(
		dayjs(myData?.game_bal_time.substring(5), format)
	);
	const [userLogS, setUserLogS] = useState(
		myData?.user_log_time.substring(0, 5)
	);
	const [userLogSJs, setUserLogSJs] = useState<Dayjs | ''>(
		dayjs(myData?.user_log_time.substring(0, 5), format)
	);
	const [userLogE, setUserLogE] = useState(myData?.user_log_time.substring(5));
	const [userLogEJs, setUserLogEJs] = useState<Dayjs | ''>(
		dayjs(myData?.user_log_time.substring(5), format)
	);

	const onChangeWinlossS: TimePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
		setWinlossS(date.format(format));
		setWinlossSJs(date);
	};
	const onChangeWinlossE: TimePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
		setWinlossE(date.format(format));
		setWinnlossEJs(date);
	};
	const onChangeGameS: TimePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
		setGameS(date.format(format));
		setGameSJs(date);
	};
	const onChangeGameE: TimePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
		setGameE(date.format(format));
		setGameEJs(date);
	};
	const onChangeAccntBalS: TimePickerProps['onSelect'] = (
		date: dayjs.Dayjs
	) => {
		setAccntBalS(date.format(format));
		setAccntBalSJs(date);
	};
	const onChangeAccntBalE: TimePickerProps['onSelect'] = (
		date: dayjs.Dayjs
	) => {
		setAccntBalE(date.format(format));
		setAccntBalEJs(date);
	};
	const onChangeGameBalS: TimePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
		setGameBalS(date.format(format));
		setGameBalSJs(date);
	};
	const onChangeGameBalE: TimePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
		setGameBalE(date.format(format));
		setGameBalEJs(date);
	};
	const onChangeUserLogS: TimePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
		setUserLogS(date.format(format));
		setUserLogSJs(date);
	};
	const onChangeUserLogE: TimePickerProps['onSelect'] = (date: dayjs.Dayjs) => {
		setUserLogE(date.format(format));
		setUserLogEJs(date);
	};

	const onSubmit = () => {
		const registerfail = t('등록 실패');

		const { execute_password } = getValues();

		const data = {
			user_id: String(myData?.user_id),
			winloss_time: String(winlossS) + String(winlossE),
			game_time: String(gameS) + String(gameE),
			account_bal_time: String(accntBalS) + String(accntBalE),
			game_bal_time: String(gameBalS) + String(gameBalE),
			user_log_time: String(userLogS) + String(userLogE),
			execute_password: execute_password,
		};

		ACCOUNT_CHECKTIME_UPDATE(data)
			.then((res: AxiosResponse | any) => {
				if (res.data) {
					MEMBER_INFO_GET(String(myId)).then((res: AxiosResponse | any) => {
						if (res.data.data) {
							loggedInMemberData(res.data.data);
							alert(`${myData?.user_id} updated`);
						}
					});
				}
				if (res.response) {
					alert(res.response.data.error.message);
				}
			})
			.catch((err) => {
				alert(registerfail);
			});
	};

	useReactiveVar(routeTitleVar);
	useEffect(() => {
		routeTitleVar(String(t('조회시간 설정')));
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('조회시간 설정')));
	}, [selectedLang]);

	return (
		<div className='flex justify-center w-full'>
			<div className='w-3/4 lg:w-1/2 mt-5 rounded-md lg:col-span-2'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
							{t('조회 기준시간 설정')}
						</div>
						<div className='pb-6 bg-white'>
							<input
								type='text'
								name='username'
								className='w-0 h-0 border-0 block'
							/>
							<input type='password' className='w-0 h-0 border-0 block' />
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 border-b mt-5'>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-600 text-base font-semibold'>
											{t('윈로스내역')}
										</div>
									</div>
									<div>
										<div className='text-xs text-gray-500'>
											{t('윈로스 내역 검색 시 사용할')}
										</div>
										<div className='text-xs text-gray-500'>
											{t('기준 시간을 설정 합니다.')}
										</div>
									</div>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 시작 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										format={format}
										value={
											winlossSJs === '' ? dayjs('00:00', format) : winlossSJs
										}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeWinlossS(value)}
										onChange={(e) =>
											e === null ? setWinlossSJs('') : onChangeWinlossS(e)
										}
									/>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 종료 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={
											winlossEJs === '' ? dayjs('00:00', format) : winlossEJs
										}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeWinlossE(value)}
										onChange={(e) =>
											e === null ? setWinnlossEJs('') : onChangeWinlossE(e)
										}
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 border-b mt-5'>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-600 text-base font-semibold'>
											{t('게임기록')}
										</div>
									</div>
									<div>
										<div className='text-xs text-gray-500'>
											{t('게임기록 내역 검색 시 사용할')}
										</div>
										<div className='text-xs text-gray-500'>
											{t('기준 시간을 설정 합니다.')}
										</div>
									</div>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 시작 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={gameSJs === '' ? dayjs('00:00', format) : gameSJs}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeGameS(value)}
										onChange={(e) =>
											e === null ? setGameSJs('') : onChangeGameS(e)
										}
									/>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 종료 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={gameEJs === '' ? dayjs('00:00', format) : gameEJs}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeGameE(value)}
										onChange={(e) =>
											e === null ? setGameEJs('') : onChangeGameE(e)
										}
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 border-b mt-5'>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-600 text-base font-semibold'>
											{t('계정 금액변경')}
										</div>
									</div>
									<div>
										<div className='text-xs text-gray-500'>
											{t('계정 금액변경 내역 검색 시 사용할')}
										</div>
										<div className='text-xs text-gray-500'>
											{t('기준 시간을 설정 합니다.')}
										</div>
									</div>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 시작 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={
											accntBalSJs === '' ? dayjs('00:00', format) : accntBalSJs
										}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeAccntBalS(value)}
										onChange={(e) =>
											e === null ? setAccntBalSJs('') : onChangeAccntBalS(e)
										}
									/>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 종료 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={
											accntBalEJs === '' ? dayjs('00:00', format) : accntBalEJs
										}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeAccntBalE(value)}
										onChange={(e) =>
											e === null ? setAccntBalEJs('') : onChangeAccntBalE(e)
										}
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 border-b mt-5'>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-600 text-base font-semibold'>
											{t('게임 금액변경')}
										</div>
									</div>
									<div>
										<div className='text-xs text-gray-500'>
											{t('게임 금액변경 내역 검색 시 사용할')}
										</div>
										<div className='text-xs text-gray-500'>
											{t('기준 시간을 설정 합니다.')}
										</div>
									</div>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 시작 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={
											gameBalSJs === '' ? dayjs('00:00', format) : gameBalSJs
										}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeGameBalS(value)}
										onChange={(e) =>
											e === null ? setGameBalSJs('') : onChangeGameBalS(e)
										}
									/>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 종료 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={
											gameBalEJs === '' ? dayjs('00:00', format) : gameBalEJs
										}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeGameBalE(value)}
										onChange={(e) =>
											e === null ? setGameBalEJs('') : onChangeGameBalE(e)
										}
									/>
								</div>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4 border-b mt-5'>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-600 text-base font-semibold'>
											{t('사용내역')}
										</div>
									</div>
									<div>
										<div className='text-xs text-gray-500'>
											{t('사용 내역 검색 시 사용할')}
										</div>
										<div className='text-xs text-gray-500'>
											{t('기준 시간을 설정 합니다.')}
										</div>
									</div>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 시작 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={
											userLogSJs === '' ? dayjs('00:00', format) : userLogSJs
										}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeUserLogS(value)}
										onChange={(e) =>
											e === null ? setUserLogSJs('') : onChangeUserLogS(e)
										}
									/>
								</div>
								<div className='form-group mb-6'>
									<div className='flex flex-row'>
										<div className='mb-2 text-gray-500'>
											{t('조회 종료 시간')}
										</div>
									</div>
									<TimePicker
										allowClear
										value={
											userLogEJs === '' ? dayjs('00:00', format) : userLogEJs
										}
										format={format}
										style={{ width: '100%' }}
										onSelect={(value) => onChangeUserLogE(value)}
										onChange={(e) =>
											e === null ? setUserLogEJs('') : onChangeUserLogE(e)
										}
									/>
								</div>
							</div>
							<div className='w-full'>
								<div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
									{t('조회시간 등록')}
								</div>
								<div className='py-3'>
									<input
										type='text'
										name='username'
										className='w-0 h-0 border-0 block'
									/>
									<input type='password' className='w-0 h-0 border-0 block' />
									<div className='grid sm:grid-cols-4 grid-cols-2 gap-4'>
										<div className='col-span-2 flex items-center'>
											<input
												{...register('execute_password')}
												type='password'
												pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
												required
												className='forminput col-span-3'
												placeholder={String(t('실행 비밀번호 입력'))}
											/>
										</div>
										<div className='col-span-2 flex gap-2'>
											<button
												className='border border-gray-500 rounded-md py-2 px-3 text-center flex justify-center items-center cursor-pointer bg-gray-100 w-full'
												type='submit'
											>
												<div className='text-xl mr-1 text-green-500'>
													<AiOutlineCheckCircle />
												</div>
												<div className='font-bold text-base'>{t('확인')}</div>
											</button>
											<button className='border border-gray-500 rounded-md py-2 px-3 text-center flex justify-center items-center cursor-pointer bg-gray-100 w-full'>
												<div className='text-xl mr-1 text-red-500'>
													<AiOutlineCloseCircle />
												</div>
												<div className='font-bold text-base'>{t('취소')}</div>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};
