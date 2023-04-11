import { useReactiveVar } from '@apollo/client';
import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
	ACCOUNT_PASSWORD_UPDATE,
	IAccntPasswordUpdate,
} from '../../../common/api/mutations/accnt_mutation';
import {
	langVar,
	loggedInMemberData,
	routeTitleVar,
} from '../../../common/apollo';
import { FormError } from '../../../components/form-error';

export const PasswordChange = () => {
	const navigate = useNavigate();
	const { t } = useTranslation(['page']);
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<IAccntPasswordUpdate>({ mode: 'onChange' });
	const { isSubmitting } = useFormState({ control });

	const selectedLang = useReactiveVar(langVar);
	const myData = useReactiveVar(loggedInMemberData);

	const onSubmit = () => {
		const registerfail = t('등록 실패');

		const { password_new, passwordConfirm, password_old } = getValues();

		const data = {
			user_id: String(myData?.user_id),
			password_new: password_new,
			passwordConfirm: passwordConfirm,
			password_old: password_old,
		};

		console.log(data);

		ACCOUNT_PASSWORD_UPDATE(data)
			.then((res: AxiosResponse | any) => {
				if (res.data) {
					alert(`${String(myData?.user_id)} updated`);
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
				// console.log(err.response);
			});
	};

	useReactiveVar(routeTitleVar);
	useEffect(() => {
		routeTitleVar(String(t('비밀번호 변경')));
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('비밀번호 변경')));
	}, [selectedLang]);
	return (
		<div className='flex justify-center w-full'>
			<div className='w-3/4 lg:w-1/2 mt-5 rounded-md lg:col-span-2'>
				<div className='text-gray-500 text-lg font-bold border-b w-full my-5'>
					{t('새 비밀번호 설정')}
				</div>
				<div className='py-6 bg-white'>
					<form onSubmit={handleSubmit(onSubmit)}>
						<input
							type='text'
							name='username'
							className='w-0 h-0 border-0 block'
						/>
						<input type='password' className='w-0 h-0 border-0 block' />
						<div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 mb-4'>
							<div className='form-group mb-6'>
								<div className='flex flex-row'>
									<div className='mb-2 text-gray-500'>{t('계정명')}</div>
								</div>
								<input
									type='text'
									disabled
									className='forminput bg-gray-100'
									defaultValue={myData?.user_id}
								/>
							</div>
							<div className='form-group mb-6'>
								<div className='flex flex-row'>
									<div className='mb-2 text-gray-500'>
										{t('현재 비밀번호')}
										<code className='text-red-600'> *</code>
									</div>
								</div>
								<input
									{...register('password_old')}
									minLength={5}
									type='password'
									className='forminput'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									placeholder={String(t('현재 비밀번호 입력'))}
								/>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4'>
							<div className='mb-3'>
								<div className='mb-2 text-gray-500'>
									{t('비밀번호')}
									<code className='text-red-600'> *</code>
								</div>
								<input
									{...register('password_new')}
									required
									minLength={6}
									type='password'
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
												const { password_new } = getValues();
												return password_new === value || 'not match';
											},
										},
									})}
									required
									minLength={6}
									type='password'
									className='forminput'
									pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
									placeholder={String(t('비밀번호 확인'))}
								/>
							</div>
						</div>
						<div className='w-full flex justify-end mt-5'>
							<button
								style={{ backgroundColor: '#393E46' }}
								className='border rounded-md px-5 py-2 text-white text-base font-semibold'
								type='submit'
							>
								{t('비밀번호 등록')}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
