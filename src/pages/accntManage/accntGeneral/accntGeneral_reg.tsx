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
	IAccntRegPost,
	USER_REGISTER_POST,
} from '../../../common/api/mutations/accnt_mutation';
import {
	IBetLimitResponse,
	USER_LIMITS_GET_QUERY,
} from '../../../common/api/queries/betlimit_query';
import {
	accntGeneralData,
	limitData,
	loggedInMemberData,
	routeTitleVar,
} from '../../../common/apollo';
import { Switch } from 'antd';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import {
	MEMBER_ID_VERIFICATION,
	MEMBER_NICK_VERIFICATION,
} from '../../../common/api/queries/accnt_query';
import { AxiosResponse } from 'axios';
import { ValidationMessage } from '../../../components/validation';
import { FormError } from '../../../components/form-error';
import { useNavigate } from 'react-router-dom';

export const AccntGeneralReg = () => {
	const { t } = useTranslation(['page']);
	const navigate = useNavigate();

	const {
		register,
		getValues,
		formState: { errors },
		control,
		handleSubmit,
	} = useForm<IAccntRegPost>({ mode: 'onChange' });
	const { isSubmitting } = useFormState({ control });

	useReactiveVar(routeTitleVar);
	const limitDataArr = useReactiveVar(limitData);
	const myData = useReactiveVar(loggedInMemberData);
	const parentData = useReactiveVar(accntGeneralData);

	const [userType, setUserType] = useState('');
	const [bchecked, setBChecked] = useState(false);
	const [schecked, setSChecked] = useState(
		parentData?.slot_permit === 'Y' ? true : false
	);
	const [requested, SetRequested] = useState(true);
	const [nickRequested, SetNickRequested] = useState(true);
	const [idValid, setIdValid] = useState('');
	const [nickQueryPath, setNickQueryPath] = useState('');
	const [nickValid, setNickValid] = useState('');
	const [idQueryPath, setIdQueryPath] = useState('');
	const [limitAll, setLimitAll] = useState(false);
	const [limitArr, setLimitArr] = useState<string[]>([]);

	const columnHelper = createColumnHelper<IBetLimitResponse>();

	useEffect(() => {
		routeTitleVar(String(t('계정 생성')));
	}, []);

	const handleOnClickUserType = (e: React.MouseEvent<HTMLInputElement>) => {
		setUserType(e.currentTarget.value);
		setLimitArr([]);
	};

	const limitChoiceHandler = (e: React.MouseEvent<HTMLInputElement>) => {
		if (userType === 'U' || userType === '') {
			setLimitArr([String(e.currentTarget.value)]);
		} else {
			setLimitArr([...limitArr, String(e.currentTarget.value)]);
		}
	};

	const selectAll = () => {
		const checkboxes = document.getElementsByName(
			'limitCheckBox'
		) as NodeListOf<HTMLInputElement>;
		const selectAllElem = document.getElementsByName(
			'limitSelectAll'
		) as NodeListOf<HTMLInputElement>;
		checkboxes.forEach((checkbox) => {
			if (selectAllElem[0].checked === true) {
				checkbox.checked = true;
			} else {
				checkbox.checked = false;
			}
		});
		setLimitAll(!limitAll);
	};

	const getLimitData = () => {
		USER_LIMITS_GET_QUERY()
			.then((res: AxiosResponse | any) => {
				if (res.data.data[0].code === 1) {
					const rawLimitArr = res.data.data[0].data.list;
					const filteredLimitArr = rawLimitArr.filter(
						(elem: IBetLimitResponse) => {
							// change user's default currency later on
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

	// member user_id verification logic ------------------------------------------------------
	const useIdInputOutside = (ref: React.MutableRefObject<any>) => {
		const handleClickOutside = (e: { target: any }) => {
			if (
				!requested &&
				ref.current &&
				!ref.current.contains(e.target) &&
				idQueryPath.length > 3
			) {
				requestTriggerCode(idQueryPath);
			}
		};

		useEffect(() => {
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		});
	};

	const idOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		SetRequested(false);
		setIdValid('');
		if (e.target.value.length > 2) {
			setIdQueryPath(e.target.value);
		}
	};

	const handleIdOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (idQueryPath.length > 2) {
			if (e.key === 'Enter' || e.key === 'Tab') {
				requestTriggerCode(idQueryPath);
			}
		}
	};

	const idInputRef = useRef(null);
	useIdInputOutside(idInputRef);

	const requestTriggerCode = (idQueryPath: string) => {
		if (idQueryPath) {
			MEMBER_ID_VERIFICATION(idQueryPath)
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						if (res.data.data) {
							setIdValid(res.data.data);
						}
						SetRequested(true);
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
					console.log(err);
					SetRequested(true);
				});
		}
		SetRequested(true);
	};
	//----------------------------------------------------------------------------------------------

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
			password,
			passwordConfirm,
			country_code,
			phone,
			baccarat_share,
			baccarat_rolling,
			slot_share,
			slot_rolling,
			execute_password,
		} = getValues();

		const uniqueLimitArr = [...new Set(limitArr)];
		if (limitAll) {
			for (let elem of limitDataArr) {
				uniqueLimitArr.push(elem.id);
			}
		}
		const data = {
			my_user_id: String(myData?.user_id),
			parent_id: String(parentData?.user_id),
			sub_master_id: '',
			user_id: idQueryPath,
			nickname: nickQueryPath === '' ? null : nickQueryPath,
			password: password,
			passwordConfirm: passwordConfirm,
			execute_password: execute_password,
			country_code: country_code,
			phone: phone,
			account_type: userType,
			baccarat_permit: bchecked ? 'Y' : 'N',
			baccarat_share:
				!bchecked || baccarat_share === undefined ? 0 : baccarat_share,
			baccarat_rolling:
				!bchecked || baccarat_rolling === undefined ? 0 : baccarat_rolling,
			default_currency: 'PHP',
			slot_permit: schecked ? 'Y' : 'N',
			slot_share: !schecked || slot_share === undefined ? 0 : slot_share,
			slot_rolling: !schecked || slot_rolling === undefined ? 0 : slot_rolling,
			betlimit: uniqueLimitArr.join(','),
		};

		let isValid = true;
		let message = ` ${t('필수항목:')}`;

		if (uniqueLimitArr.length === 0 && bchecked) {
			message += ` ${t('한도설정')}, `;
			isValid = false;
		}

		if (idValid === 'exist' || idValid === '') {
			message += ` ${t('계정명')}, `;
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
		if (!isValid) {
			alert(`${verifyMessage} \n${message}`);
		} else {
			USER_REGISTER_POST(data)
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						alert(`${res.data.data.user_id} registered`);
						navigate('/accnt-general');
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
					alert(registerfail);
					console.log(err);
				});
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
		data: limitDataArr,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	useEffect(() => {
		getLimitData();
	}, []);

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
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='mb-3'>
								<div className='flex'>
									<div className='mb-2 text-gray-500'>
										{t('계정명')}
										<code className='text-red-600'> *</code>
									</div>
									{idQueryPath && idValid === 'none' ? (
										<ValidationMessage isValid={true} message={t('사용가능')} />
									) : idQueryPath && idValid === 'exist' ? (
										<ValidationMessage
											isValid={false}
											message={t('사용불가')}
										/>
									) : null}
								</div>
								<input
									{...register('user_id')}
									required
									pattern='^[a-zA-Z0-9]*$'
									type='text'
									className='forminput'
									maxLength={20}
									minLength={5}
									placeholder={String(t('계정명 입력'))}
									onChange={idOnChange}
									ref={idInputRef}
									onKeyDown={handleIdOnKeyPress}
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
									placeholder={String(t('닉네임 입력'))}
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
									{...register('password')}
									required
									type='password'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									maxLength={25}
									minLength={6}
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
												const { password } = getValues();
												return password === value || 'not match';
											},
										},
									})}
									required
									type='password'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									maxLength={25}
									minLength={6}
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
									pattern='[0-9]+'
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
									pattern='[0-9]+'
									placeholder={String(t('전화번호 입력'))}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='w-11/12 lg:w-1/2'>
					<div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
						{t('계정유형')}
					</div>
					<div className='py-3'>
						<div className='grid grid-cols-3 gap-4'>
							<div className='mb-2 flex justify-between mr-5'>
								<div className='mb-2 text-gray-500'>
									<label className='flex flex-row gap-2 cursor-pointer'>
										<input
											type='radio'
											name='userRoleCheckbox'
											value='A'
											onClick={(e) => handleOnClickUserType(e)}
										/>
										<div className='text-base w-16'>{t('에이전트')}</div>
									</label>
								</div>
								<div className='mb-2 text-gray-500'>
									<label className='flex flex-row gap-2 cursor-pointer'>
										<input
											type='radio'
											name='userRoleCheckbox'
											value='U'
											onClick={(e) => handleOnClickUserType(e)}
										/>
										<div className='text-base w-8'>{t('회원')}</div>
									</label>
								</div>
							</div>
							<div></div>
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
											className={`forminput w-full ${
												bchecked ? null : 'bg-gray-100'
											}`}
											defaultValue={0}
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
											className={`forminput w-full ${
												bchecked ? null : 'bg-gray-100'
											}`}
											defaultValue={0}
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
											className={`forminput w-full ${
												schecked ? null : 'bg-gray-100'
											}`}
											defaultValue={0}
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
											className={`forminput w-full ${
												schecked ? null : 'bg-gray-100'
											}`}
											defaultValue={0}
										/>
										<div className='text-base ml-1'> %</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='w-11/12 lg:w-1/2'>
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
													value={row.original.id}
													onClick={(e) => limitChoiceHandler(e)}
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
									type='password'
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
