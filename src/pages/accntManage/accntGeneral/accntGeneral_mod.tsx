import { useReactiveVar } from '@apollo/client';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import {
	ACCOUNT_INFO_UPDATE,
	IAccntModPost,
} from '../../../common/api/mutations/accnt_mutation';
import {
	IBetLimitResponse,
	USER_LIMITS_GET_QUERY,
} from '../../../common/api/queries/betlimit_query';
import {
	accntGeneralData,
	langVar,
	limitData,
	loggedInMemberData,
	routeTitleVar,
	subAccountData,
} from '../../../common/apollo';
import { Switch } from 'antd';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { FormError } from '../../../components/form-error';
import { useNavigate } from 'react-router-dom';
import { MEMBER_NICK_VERIFICATION } from '../../../common/api/queries/accnt_query';
import { ValidationMessage } from '../../../components/validation';

export const AccntGeneralMod = () => {
	const { t } = useTranslation(['page']);
	const navigate = useNavigate();

	const {
		register,
		getValues,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm<IAccntModPost>({ mode: 'onChange' });
	const { isSubmitting } = useFormState({ control });

	const columnHelper = createColumnHelper<IBetLimitResponse>();

	useReactiveVar(routeTitleVar);
	const fetchedLimitData = useReactiveVar(limitData);
	const selectedLang = useReactiveVar(langVar);
	const myData = useReactiveVar(loggedInMemberData);
	const parentData = useReactiveVar(accntGeneralData);
	const subAccntData = useReactiveVar(subAccountData);

	const [userType, setUserType] = useState(subAccntData?.account_type);
	const [nickChanged, setNickChanged] = useState(false);
	const [bchecked, setBChecked] = useState(
		subAccntData?.baccarat_permit === 'Y'
	);
	const [schecked, setSChecked] = useState(subAccntData?.slot_permit === 'Y');
	const [limitArr, setLimitArr] = useState<string[] | undefined>(
		subAccntData?.betlimit.split(',')
	);

	const [nickRequested, SetNickRequested] = useState(true);
	const [nickQueryPath, setNickQueryPath] = useState('');
	const [nickValid, setNickValid] = useState('');

	const limitChoiceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (userType === 'U' || userType === '') {
			setLimitArr([String(e.currentTarget.value)]);
		} else {
			if (limitArr?.includes(e.currentTarget.value)) {
				let splicedArr = limitArr?.filter((elem) => {
					return elem !== e.currentTarget.value;
				});
				setLimitArr(splicedArr);
			} else {
				setLimitArr([...(limitArr || []), String(e.currentTarget.value)]);
			}
		}
	};

	const selectAll = () => {
		const checkboxes = document.getElementsByName(
			'limitCheckBox'
		) as NodeListOf<HTMLInputElement>;
		const selectAllElem = document.getElementsByName(
			'limitSelectAll'
		) as NodeListOf<HTMLInputElement>;
		let limitIdArr: string[] = [];
		checkboxes.forEach((checkbox) => {
			if (selectAllElem[0].checked) {
				checkbox.checked = true;
				limitIdArr.push(checkbox.value);
			} else {
				checkbox.checked = false;
				setLimitArr([]);
			}
		});
		if (selectAllElem[0].checked) {
			setLimitArr(limitIdArr);
		}
	};

	const getLimitData = () => {
		USER_LIMITS_GET_QUERY()
			.then((res: AxiosResponse | any) => {
				if (res.data.data[0].code === 1) {
					const rawLimitArr = res.data.data[0].data.list;
					const filteredLimitArr = rawLimitArr.filter(
						(elem: IBetLimitResponse) => {
							// change user's default curreny later on
							return elem.currency === 'PHP';
						}
					);
					limitData(filteredLimitArr);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// member nickname verification logic --------------------------------------------------
	const useNickInputOutside = (ref: React.MutableRefObject<any>) => {
		const handleNickClickOutside = (e: { target: any }) => {
			if (
				!nickRequested &&
				ref.current &&
				!ref.current.contains(e.target) &&
				nickQueryPath.length > 4
			) {
				nickRequestTriggerCode(nickQueryPath);
			}
		};
		useEffect(() => {
			document.addEventListener('mousedown', handleNickClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleNickClickOutside);
			};
		});
	};

	const handleNickOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (nickQueryPath.length > 4) {
			if (e.key === 'Enter' || e.key === 'Tab') {
				nickRequestTriggerCode(nickQueryPath);
			}
		}
	};

	const nickOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNickChanged(true);
		SetNickRequested(false);
		setNickValid('');
		if (e.target.value.length > 4) {
			setNickQueryPath(e.target.value);
		}
	};

	const nickInputRef = useRef(null);
	useNickInputOutside(nickInputRef);

	const nickRequestTriggerCode = (nickQueryPath: string) => {
		if (nickQueryPath) {
			MEMBER_NICK_VERIFICATION(nickQueryPath)
				.then((res: AxiosResponse | any) => {
					if (res.data.data) {
						if (res.data.data) {
							setNickValid(res.data.data);
						}
						SetNickRequested(true);
					}
				})
				.catch((err) => {
					console.log(err);
					SetNickRequested(true);
				});
		}
		SetNickRequested(true);
	};

	// ---------------------------------------------------------------------------------------

	const onSubmit = () => {
		const verifyMessage = t('필수 항목이 채워지지 않았습니다');
		const registerfail = t('등록 실패');

		const {
			new_password,
			passwordConfirm,
			execute_password,
			country_code,
			phone,
			baccarat_share,
			baccarat_rolling,
			slot_share,
			slot_rolling,
		} = getValues();

		// Limit Data setting --------------------------------------------------------------
		const checkboxes = document.getElementsByName(
			'limitCheckBox'
		) as NodeListOf<HTMLInputElement>;
		const selectAllElem = document.getElementsByName(
			'limitSelectAll'
		) as NodeListOf<HTMLInputElement>;

		let limitIdArr: string[] = [];
		let limitChoiceCount = 0;
		let uniqueLimitArr: String[] = [];

		checkboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				limitChoiceCount += 1;
			}
		});

		if (subAccntData?.account_type === 'A') {
			if (!selectAllElem[0].checked && limitChoiceCount === 0) {
				uniqueLimitArr = [];
			} else if (
				selectAllElem[0].checked &&
				limitChoiceCount === fetchedLimitData.length
			) {
				fetchedLimitData.forEach((elem) => {
					limitIdArr.push(elem.id);
				});
				uniqueLimitArr = [...new Set(limitIdArr)];
			} else {
				checkboxes.forEach((elem) => {
					if (elem.checked) {
						limitIdArr.push(elem.value);
					}
				});
				uniqueLimitArr = [...new Set(limitIdArr)];
			}
		} else {
			const checkboxes = document.getElementsByName(
				'limitCheckBox'
			) as NodeListOf<HTMLInputElement>;
			checkboxes.forEach((elem) => {
				if (elem.checked) {
					limitIdArr.push(elem.value);
				}
				uniqueLimitArr = [...new Set(limitIdArr)];
			});
		}

		//----------------------------------------------------------------------------------

		const data = {
			my_user_id: String(myData?.user_id),
			parent_id: String(parentData?.user_id),
			user_id: String(subAccntData?.user_id),
			nickname:
				nickQueryPath === '' && subAccntData?.nickname === null
					? null
					: nickQueryPath === '' &&
					  subAccntData?.nickname !== null &&
					  subAccntData?.nickname !== undefined
					? subAccntData?.nickname
					: nickQueryPath,
			new_password: new_password,
			passwordConfirm: passwordConfirm,
			execute_password: execute_password,
			country_code: country_code,
			phone: phone,
			baccarat_permit: bchecked ? 'Y' : 'N',
			baccarat_share: !bchecked ? 0 : !baccarat_share ? 0 : baccarat_share,
			baccarat_rolling: !bchecked
				? 0
				: !baccarat_rolling
				? 0
				: baccarat_rolling,
			slot_permit: schecked ? 'Y' : 'N',
			slot_share: !schecked ? 0 : !slot_share ? 0 : slot_share,
			slot_rolling: !schecked ? 0 : !slot_rolling ? 0 : slot_rolling,
			betlimit: uniqueLimitArr.join(','),
			isSRMod: '',
		};

		let isValid = true;
		let message = ` ${t('필수항목:')}`;

		if (uniqueLimitArr.length === 0 && bchecked) {
			message += ` ${t('한도설정')}, `;
			isValid = false;
		}

		if (nickValid === 'exist') {
			message += ` ${t('닉네임')}, `;
			isValid = false;
		}

		if (userType === '') {
			message += ` ${t('계정유형')}, `;
			isValid = false;
		}

		if (execute_password === '') {
			message += ` ${t('실행 비밀번호')}, `;
			isValid = false;
		}

		if (!bchecked && !schecked) {
			message += ` ${t('게임유형')}, `;
			isValid = false;
		}

		// Share rolling modification log purpose;
		if (subAccntData?.baccarat_permit !== data.baccarat_permit) {
			data.isSRMod = 'M';
		}
		if (String(subAccntData?.baccarat_share) !== String(data.baccarat_share)) {
			data.isSRMod = 'M';
		}
		if (
			String(subAccntData?.baccarat_rolling) !== String(data.baccarat_rolling)
		) {
			data.isSRMod = 'M';
		}
		if (subAccntData?.slot_permit !== data.slot_permit) {
			data.isSRMod = 'M';
		}
		if (String(subAccntData?.slot_share) !== String(data.slot_share)) {
			data.isSRMod = 'M';
		}
		if (String(subAccntData?.slot_rolling) !== String(data.slot_rolling)) {
			data.isSRMod = 'M';
		}

		if (!isValid) {
			alert(`${verifyMessage} \n${message}`);
		} else {
			ACCOUNT_INFO_UPDATE(data)
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						if (res.data.data === 'OK') {
							alert(`${subAccntData?.user_id} updated`);
							navigate('/accnt-general');
						}
					}
					if (res.response) {
						alert(`${registerfail} \n${res.response.data.error.message}`);
					}
					if (res.request) {
						if (res.request.response === '') {
							alert('Request Failed');
						}
					}
				})
				.catch((err) => {});
		}
	};

	const columns = [
		columnHelper.accessor('bp_min', {
			header: String(t('뱅커/플레이어')),
		}),
		columnHelper.accessor('tie_min', {
			header: String(t('타이')),
		}),
		columnHelper.accessor('pair_min', {
			header: String(t('페어')),
		}),
	];

	const table = useReactTable({
		data: fetchedLimitData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	useEffect(() => {
		getLimitData();
		routeTitleVar(String(t('계정 수정')));
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('계정 수정')));
	}, [selectedLang]);

	return (
		<div className='w-full'>
			<form
				className='w-full flex flex-col justify-center items-center'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='w-11/12 lg:w-1/2'>
					<div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
						{t('개인정보')}
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
								<div className='flex'>
									<div className='mb-2 text-gray-500'>{t('계정명')}</div>
								</div>
								<input
									type='text'
									className='forminput bg-gray-100'
									placeholder={String(t('계정명 입력'))}
									disabled
									defaultValue={subAccntData?.user_id}
								/>
							</div>
							<div className='mb-3'>
								<div className='flex flex-row'>
									<div className='mb-2 text-gray-500'>{t('닉네임')}</div>
									{nickQueryPath && nickValid === 'none' ? (
										<ValidationMessage isValid={true} message={t('사용가능')} />
									) : nickQueryPath && nickValid === 'exist' ? (
										<ValidationMessage
											isValid={false}
											message={t('사용불가')}
										/>
									) : null}
								</div>
								<input
									{...register('nickname')}
									type='text'
									maxLength={20}
									minLength={3}
									className='forminput'
									defaultValue={subAccntData?.nickname}
									onChange={nickOnChange}
									ref={nickInputRef}
									onKeyDown={handleNickOnKeyPress}
								/>
							</div>
							<div className='mb-6'>
								<div className='mb-2 text-gray-500'>
									{t('비밀번호')}
									<code className='text-red-600'> *</code>
								</div>
								<input
									{...register('new_password')}
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									type='password'
									className='forminput'
									placeholder={String(t('비밀번호 입력'))}
								/>
							</div>
							<div className='mb-6'>
								<div className='flex flex-row'>
									<div className='mb-2 text-gray-500'>
										{t('비밀번호 확인')}
										<code className='text-red-600'> *</code>
									</div>
									{errors.passwordConfirm?.message && (
										<FormError errorMessage={errors.passwordConfirm.message} />
									)}
								</div>
								<input
									{...register('passwordConfirm', {
										validate: {
											matchesPreviousePassword: (value) => {
												const { new_password } = getValues();
												return new_password === value || 'not match';
											},
										},
									})}
									type='password'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									className='forminput'
									placeholder={String(t('비밀번호 확인'))}
								/>
							</div>
						</div>
						<div className='grid grid-cols-8 gap-4 mt-4'>
							<div className='mb-3 col-span-3'>
								<div className='mb-2 text-gray-500'>{t('국가번호')}</div>
								<input
									{...register('country_code')}
									type='text'
									className='forminput'
									defaultValue={subAccntData?.country_code}
									placeholder={String(t('국가번호'))}
								/>
							</div>
							<div className='mb-3 col-span-5'>
								<div className='flex flex-row'>
									<div className='mb-2 text-gray-500'>{t('전화번호')}</div>
								</div>
								<input
									{...register('phone')}
									type='text'
									className='forminput'
									defaultValue={subAccntData?.phone}
									placeholder={String(t('전화번호 입력'))}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='w-11/12 lg:w-1/2'>
					<div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
						{t('게임유형')}
					</div>
					<div className='py-3'>
						<div className=''>
							<div className='font-medium text-base align-middle grid grid-cols-8 gap-4 md:gap-0'>
								<div className='sm:col-span-4 md:col-span-3 col-span-8 grid grid-cols-8 md:grid-cols-2 items-center'>
									<div className='col-span-2 md:col-span-1 text-gray-600'>
										{t('바카라')}
									</div>
									<div className='col-span-6 md:col-span-1'>
										<Switch
											style={{ backgroundColor: bchecked ? '#2C74B3' : 'gray' }}
											checked={bchecked}
											disabled={parentData?.baccarat_permit === 'N'}
											onChange={setBChecked}
										/>
									</div>
								</div>
								<div className='sm:col-span-4 md:col-span-5 col-span-8 grid-cols-4 flex flex-auto'>
									<div className='flex items-center'>
										<div className='w-20 text-base'>{t('쉐어') + ':'} </div>
										<input
											{...register('baccarat_share')}
											type='number'
											min={0}
											step='0.01'
											disabled={!bchecked}
											defaultValue={
												subAccntData?.baccarat_share &&
												subAccntData.baccarat_permit === 'Y'
													? subAccntData.baccarat_share
													: 0
											}
											className={`forminput w-full ${
												bchecked ? null : 'bg-gray-100'
											}`}
										/>
										<div className='text-base mr-2 ml-1'> %</div>
									</div>
									<div className='flex items-center'>
										<div className='w-20 text-base'>{t('롤링') + ':'} </div>
										<input
											{...register('baccarat_rolling')}
											type='number'
											min={0}
											step='0.01'
											disabled={!bchecked}
											defaultValue={
												subAccntData?.baccarat_rolling &&
												subAccntData.baccarat_permit === 'Y'
													? subAccntData.baccarat_rolling
													: 0
											}
											className={`forminput w-full ${
												bchecked ? null : 'bg-gray-100'
											}`}
										/>
										<div className='text-base ml-1'> %</div>
									</div>
								</div>
							</div>
						</div>
						<div className='mt-5'>
							<div className='font-medium text-base align-middle grid grid-cols-8 gap-4 md:gap-0'>
								<div className='sm:col-span-4 md:col-span-3 col-span-8 grid grid-cols-8 md:grid-cols-2 items-center'>
									<div className='col-span-2 md:col-span-1 text-gray-600'>
										{t('슬롯')}
									</div>
									<div className='col-span-6 md:col-span-1'>
										<Switch
											style={{ backgroundColor: schecked ? '#2C74B3' : 'gray' }}
											checked={schecked}
											disabled={parentData?.slot_permit === 'N'}
											onChange={setSChecked}
										/>
									</div>
								</div>
								<div className='sm:col-span-4 md:col-span-5 col-span-8 grid-cols-4 flex flex-auto'>
									<div className='flex items-center'>
										<div className='w-20 text-base'>{t('쉐어') + ':'} </div>
										<input
											{...register('slot_share')}
											type='number'
											min={0}
											step='0.01'
											disabled={!schecked}
											defaultValue={
												subAccntData?.slot_share &&
												subAccntData?.slot_permit === 'Y'
													? subAccntData.slot_share
													: 0
											}
											className={`forminput w-full ${
												schecked ? null : 'bg-gray-100'
											}`}
										/>
										<div className='text-base mr-2 ml-1'> %</div>
									</div>
									<div className='flex items-center'>
										<div className='w-20 text-base'>{t('롤링') + ':'} </div>
										<input
											{...register('slot_rolling')}
											type='number'
											min={0}
											step='0.01'
											disabled={!schecked}
											defaultValue={
												subAccntData?.slot_rolling &&
												subAccntData?.slot_permit === 'Y'
													? subAccntData.slot_rolling
													: 0
											}
											className={`forminput w-full ${
												schecked ? null : 'bg-gray-100'
											}`}
										/>
										<div className='text-base ml-1'> %</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='-11/12 lg:w-1/2'>
					<div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
						{t('한도설정')}
					</div>
					<div className='py-3 overflow-x-scroll'>
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
											<label>
												{userType === 'A' ? (
													<input
														type='checkbox'
														name='limitSelectAll'
														disabled={!bchecked}
														onChange={() => selectAll()}
													/>
												) : null}
											</label>
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
													type={userType === 'A' ? 'checkbox' : 'radio'}
													name='limitCheckBox'
													disabled={!bchecked}
													checked={
														limitArr?.includes(row.original.id) ? true : false
													}
													value={row.original.id}
													onChange={(e) => limitChoiceHandler(e)}
												/>
											</label>
										</td>
										{row.getVisibleCells().map((cell) => {
											if (cell.column.columnDef.header === t('뱅커/플레이어')) {
												return (
													<td
														key={`cell_${cell.id}`}
														className='px-2 py-2 text-sm text-left text-gray-900'
													>
														{`${row.original.bp_min.toLocaleString()} ~ ${row.original.bp_max.toLocaleString()}`}
													</td>
												);
											} else if (cell.column.columnDef.header === t('타이')) {
												return (
													<td
														key={`cell_${cell.id}`}
														className='px-2 py-2 text-sm text-left text-gray-900'
													>
														{`${row.original.tie_min.toLocaleString()} ~ ${row.original.tie_max.toLocaleString()}`}
													</td>
												);
											} else if (cell.column.columnDef.header === t('페어')) {
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
				<div className='w-11/12 lg:w-1/2'>
					<div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
						{t('계정등록')}
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
									required
									type='password'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									className='forminput col-span-3'
									placeholder={String(t('실행 비밀번호 입력'))}
								/>
							</div>
							<div className='col-span-2 flex gap-2'>
								<button className='border border-gray-500 rounded-md py-2 px-3 text-center flex justify-center items-center cursor-pointer bg-gray-100 w-full'>
									<div className='text-xl mr-1 text-green-500'>
										<AiOutlineCheckCircle />
									</div>
									<div className='font-bold text-base'>{t('확인')}</div>
								</button>
								<button
									className='border border-gray-500 rounded-md py-2 px-3 text-center flex justify-center items-center cursor-pointer bg-gray-100 w-full'
									onClick={() => navigate('/accnt-general')}
								>
									<div className='text-xl mr-1 text-red-500'>
										<AiOutlineCloseCircle />
									</div>
									<div className='font-bold text-base'>{t('취소')}</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};
