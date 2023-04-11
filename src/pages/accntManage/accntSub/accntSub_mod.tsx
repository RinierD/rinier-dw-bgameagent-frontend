import { useReactiveVar } from '@apollo/client';
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import {
	ACCOUNT_INFO_UPDATE,
	IAccntSubPost,
	SUB_USER_REG_POST,
} from '../../../common/api/mutations/accnt_mutation';
import {
	langVar,
	loggedInMemberData,
	roleAccountData,
	routeTitleVar,
	subAccountData,
} from '../../../common/apollo';
import { IBetLimitResponse } from '../../../common/api/queries/betlimit_query';
import {
	MEMBER_ID_VERIFICATION,
	MEMBER_NICK_VERIFICATION,
} from '../../../common/api/queries/accnt_query';
import { ValidationMessage } from '../../../components/validation';
import { FormError } from '../../../components/form-error';

export const SubAccntMod = () => {
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

	const [nickRequested, SetNickRequested] = useState(true);
	const [nickValid, setNickValid] = useState('');
	const [nickQueryPath, setNickQueryPath] = useState('');

	useReactiveVar(routeTitleVar);
	const selectedLang = useReactiveVar(langVar);
	const myData = useReactiveVar(loggedInMemberData);
	const roleAccntData = useReactiveVar(roleAccountData);

	useEffect(() => {
		routeTitleVar(String(t('서브계정 수정')));
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('서브계정 수정')));
	}, [selectedLang]);

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
			execute_password,
			account_role_type,
		} = getValues();

		const data = {
			my_user_id: String(myData?.user_id),
			parent_id: String(myData?.user_id),
			sub_master_id: String(roleAccntData?.sub_master_id),
			user_id: String(roleAccntData?.user_id),
			nickname:
				nickQueryPath === '' && roleAccntData?.nickname === null
					? null
					: nickQueryPath === '' &&
					  roleAccntData?.nickname !== null &&
					  roleAccntData?.nickname !== undefined
					? roleAccntData?.nickname
					: nickQueryPath,
			new_password: password,
			passwordConfirm: passwordConfirm,
			execute_password: execute_password,
			country_code: country_code,
			phone: phone,
			account_type: 'B',
			account_role_type: account_role_type,
			baccarat_permit: 'N',
			baccarat_share: 0,
			baccarat_rolling: 0,
			slot_permit: 'N',
			slot_share: 0,
			slot_rolling: 0,
			betlimit: '',
			isSRMod: '',
		};

		let isValid = true;
		let message = ` ${t('필수항목:')}`;

		if (execute_password === '') {
			message += ` ${t('실행 비밀번호')}, `;
			isValid = false;
		}

		if (nickValid === 'exist') {
			message += ` ${t('서브계정 닉네임')}, `;
			isValid = false;
		}

		if (account_role_type === '') {
			message += ` ${t('계정권한')}, `;
			isValid = false;
		}

		if (!isValid) {
			alert(`${verifyMessage} \n${message}`);
		} else {
			ACCOUNT_INFO_UPDATE(data)
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						alert(`${String(roleAccntData?.user_id)} updated`);
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
					console.log(err.response);
				});
		}
	};

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
									{roleAccntData?.account_role_type === 'E'
										? [
												<option key='E' value='E'>
													{t('편집')}
												</option>,
												<option key='R' value='R'>
													{t('보기')}
												</option>,
										  ]
										: [
												<option key='R' value='R'>
													{t('보기')}
												</option>,
												<option key='E' value='E'>
													{t('편집')}
												</option>,
										  ]}
								</select>
							</div>
							<div className='mb-3'>
								<div className='flex flex-row'>
									<div className='mb-2 text-gray-500'>{t('메인계정')}</div>
								</div>
								<input
									required
									type='text'
									className='forminput bg-gray-100'
									disabled
									defaultValue={myData?.user_id}
								/>
							</div>
							<div className='mb-3'>
								<div className='flex'>
									<div className='mb-2 text-gray-500'>
										{t('서브계정 계정명')}
										<code className='text-red-600'> *</code>
									</div>
								</div>
								<input
									required
									type='text'
									className='forminput bg-gray-100'
									disabled
									defaultValue={roleAccntData?.user_id}
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
									className='forminput'
									placeholder={String(t('닉네임 입력'))}
									defaultValue={roleAccntData?.nickname}
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
									type='password'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									minLength={6}
									className='forminput'
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
									type='password'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									minLength={6}
									className='forminput'
									placeholder={String(t('비밀번호 확인'))}
								/>
							</div>
						</div>
						<div className='flex flex-cols gap-2 sm:gap-4 mt-4'>
							<div className='mb-3'>
								<div className='mr-1 mb-2 text-gray-500'>{t('국가번호')}</div>
								<input
									{...register('country_code')}
									type='text'
									className='forminput'
									placeholder={String(t('국가번호 입력'))}
									defaultValue={roleAccntData?.country_code}
								/>
							</div>
							<div className='mb-3 col-span-5 w-full'>
								<div className='flex flex-row'>
									<div className='mb-2 text-gray-500'>{t('전화번호')}</div>
								</div>
								<input
									{...register('phone')}
									type='text'
									className='forminput'
									placeholder={String(t('전화번호 입력'))}
									defaultValue={roleAccntData?.phone}
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
									pattern='^[a-zA-Z0-9]*$'
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
									type='reset'
									onClick={() => navigate('/accnt-sub')}
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
