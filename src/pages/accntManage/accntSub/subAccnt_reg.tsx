import { useReactiveVar } from '@apollo/client';
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import {
	IAccntSubPost,
	SUB_USER_REG_POST,
} from '../../../common/api/mutations/accnt_mutation';
import { IBetLimitResponse } from '../../../common/api/queries/betlimit_query';
import {
	langVar,
	loggedInMemberData,
	routeTitleVar,
} from '../../../common/apollo';
import dummyData from '../dummydata_accntGen.json';
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

export const SubAccntReg = () => {
	const { t } = useTranslation(['page']);
	const navigate = useNavigate();

	const {
		register,
		getValues,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm<IAccntSubPost>({ mode: 'onChange' });
	const { isSubmitting } = useFormState({ control });
	const data = dummyData.betLimit;

	const [idRequested, SetIdRequested] = useState(true);
	const [nickRequested, SetNickRequested] = useState(true);
	const [masterIdRequested, setMasterIdRequested] = useState(true);
	const [idValid, setIdValid] = useState('');
	const [nickValid, setNickValid] = useState('');
	const [masterIdValid, setMasterIdValid] = useState('');
	const [idQueryPath, setIdQueryPath] = useState('');
	const [nickQueryPath, setNickQueryPath] = useState('');
	const [masterQueryPath, setMasterQueryPath] = useState('');

	useReactiveVar(routeTitleVar);
	const selectedLang = useReactiveVar(langVar);
	const myData = useReactiveVar(loggedInMemberData);

	const columnHelper = createColumnHelper<IBetLimitResponse>();

	useEffect(() => {
		routeTitleVar(String(t('서브계정 추가')));
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('서브계정 추가')));
	}, [selectedLang]);

	// member user_id verification logic ------------------------------------------------------

	const useIdInputOutside = (ref: React.MutableRefObject<any>) => {
		const handleIdClickOutside = (e: { target: any }) => {
			if (
				!idRequested &&
				ref.current &&
				!ref.current.contains(e.target) &&
				idQueryPath.length > 4
			) {
				idRequestTriggerCode(idQueryPath);
			}
		};

		useEffect(() => {
			document.addEventListener('mousedown', handleIdClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleIdClickOutside);
			};
		});
	};

	const handleIdOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (idQueryPath.length > 4) {
			if (e.key === 'Enter' || e.key === 'Tab') {
				idRequestTriggerCode(idQueryPath);
			}
		}
	};

	const idOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		SetIdRequested(false);
		setIdValid('');
		if (e.target.value.length > 4) {
			setIdQueryPath(e.target.value);
		}
	};

	const idInputRef = useRef(null);
	useIdInputOutside(idInputRef);

	const idRequestTriggerCode = (idQueryPath: string) => {
		if (idQueryPath) {
			MEMBER_ID_VERIFICATION(idQueryPath)
				.then((res: AxiosResponse | any) => {
					if (res.data.data) {
						if (res.data.data) {
							setIdValid(res.data.data);
						}
						SetIdRequested(true);
					}
				})
				.catch((err) => {
					console.log(err);
					SetIdRequested(true);
				});
		}
		SetIdRequested(true);
	};

	// -------------------------------------------------------------------------------------

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
	// member Master Id verification logic --------------------------------------------------

	const useMasterInputOutside = (ref: React.MutableRefObject<any>) => {
		const handleMasterClickOutside = (e: { target: any }) => {
			if (
				!nickRequested &&
				ref.current &&
				!ref.current.contains(e.target) &&
				masterQueryPath.length > 4
			) {
				masterRequestTriggerCode(masterQueryPath);
			}
		};

		useEffect(() => {
			document.addEventListener('mousedown', handleMasterClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleMasterClickOutside);
			};
		});
	};

	const handleMasterOnKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (masterQueryPath.length > 4) {
			if (e.key === 'Enter' || e.key === 'Tab') {
				masterRequestTriggerCode(masterQueryPath);
			}
		}
	};

	const masterOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMasterIdRequested(false);
		setMasterIdValid('');
		if (e.target.value.length > 4) {
			setMasterQueryPath(e.target.value);
		}
	};

	const masterInputRef = useRef(null);
	useNickInputOutside(masterInputRef);

	const masterRequestTriggerCode = (nickQueryPath: string) => {
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
			sub_master_id,
			country_code,
			phone,
			execute_password,
			account_role_type,
		} = getValues();

		const data = {
			my_user_id: String(myData?.user_id),
			parent_id: String(myData?.user_id),
			sub_master_id: sub_master_id,
			user_id: idQueryPath,
			nickname: nickQueryPath,
			password: password,
			passwordConfirm: passwordConfirm,
			execute_password: execute_password,
			country_code: country_code,
			phone: phone,
			account_type: 'B',
			account_role_type: account_role_type,
			baccarat_permit: 'N',
			slot_permit: 'N',
		};

		let isValid = true;
		let message = ` ${t('필수항목:')}`;

		if (idQueryPath === '' || idValid === 'exist') {
			message += ` ${t('서브계정 계정명')}, `;
			isValid = false;
		}

		if (nickValid === 'exist') {
			message += ` ${t('서브계정 닉네임')}, `;
			isValid = false;
		}

		if (execute_password === '') {
			message += ` ${t('실행 비밀번호')}, `;
			isValid = false;
		}

		if (account_role_type === '') {
			message += ` ${t('계정권한')}, `;
			isValid = false;
		}

		if (account_role_type === '') {
			message += ` ${t('계정권한')}, `;
			isValid = false;
		}

		if (!isValid) {
			alert(`${verifyMessage} \n${message}`);
		} else {
			SUB_USER_REG_POST(data)
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						alert(`${res.data.data.user_id} registered`);
						navigate('/accnt-sub');
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
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

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
								<div className='mb-2 text-gray-500'>
									{t('계정권한')}
									<code className='text-red-600'> *</code>
								</div>
								<select
									{...register('account_role_type')}
									className='forminput'
									required
								>
									<option value=''>{t('선택')}</option>
									<option value='E'>{t('편집')}</option>
									<option value='R'>{t('보기')}</option>
								</select>
							</div>
							<div className='mb-3'>
								<div className='flex flex-row'>
									<div className='mb-2 text-gray-500'>{t('메인계정')}</div>
								</div>
								<input
									{...register('sub_master_id')}
									required
									type='text'
									className='forminput'
									defaultValue={myData?.user_id}
								/>
							</div>
							<div className='mb-3'>
								<div className='flex'>
									<div className='mb-2 text-gray-500'>
										{t('서브계정 계정명')}
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
									<div className='mb-2 text-gray-500'>
										{t('서브계정 닉네임')}
									</div>
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
									minLength={5}
									className='forminput'
									placeholder={String(t('닉네임 입력'))}
									onChange={nickOnChange}
									ref={nickInputRef}
									onKeyDown={handleNickOnKeyPress}
								/>
							</div>
							<div className='mb-3'>
								<div className='mb-2 text-gray-500'>
									{t('비밀번호')}
									<code className='text-red-600'> *</code>
								</div>
								<input
									{...register('password')}
									required
									type='password'
									minLength={6}
									className='forminput'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									placeholder={String(t('비밀번호 입력'))}
								/>
							</div>
							<div className='mb-3'>
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
									minLength={6}
									className='forminput'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
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
									placeholder={String(t('국가번호 입력'))}
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
									placeholder={String(t('전화번호 입력'))}
								/>
							</div>
						</div>
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
									minLength={6}
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									type='password'
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
									onClick={() => navigate('/accnt-sub')}
									type='reset'
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
