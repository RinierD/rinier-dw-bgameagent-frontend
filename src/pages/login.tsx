import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import bg from '../common/assets/agentPageagentBG.png';
import loginbg from '../common/assets/agentPage6.png';
import sysLogo from '../common/assets/agentPage1.png';
import userIcon from '../common/assets/agentPage5.png';
import passwordIcon from '../common/assets/agentPage3.png';
import krflag from '../common/assets/agentPagekr.png';
import krflagh from '../common/assets/agentPagekr1.png';
import chflag from '../common/assets/agentPagecn.png';
import chflagh from '../common/assets/agentPagecn1.png';
import jpflag from '../common/assets/agentPagejp.png';
import jpflagh from '../common/assets/agentPagejp1.png';
import enflag from '../common/assets/agentPageen.png';
import enflagh from '../common/assets/agentPageen1.png';
import {
	belongedJunket,
	isLoggedInVar,
	langVar,
	loggedInMemberData,
	my_user_id,
	myAuthority,
} from '../common/apollo';
import companyLogo from '../common/assets/agentPagedwlogo.png';
import { AxiosResponse } from 'axios';
import { useReactiveVar } from '@apollo/client';
import {
	SESSIONSTORAGE_AUTH,
	SESSIONSTORAGE_ID,
	SESSIONSTORAGE_LANGUAGE,
	SESSIONSTORAGE_TOKEN,
} from '../common/constants';
import { LOGIN_MUTATION } from '../common/api/mutations/login_mutation';
import { MEMBER_INFO_GET } from '../common/api/queries/accnt_query';

interface IloginForm {
	user_id: string;
	password: string;
}

export const Login = () => {
	const [requested, SetRequested] = useState(true);
	const [loginId, setLoginId] = useState('');
	const [isValid, setIsValid] = useState(true);
	const [krh, setKrh] = useState(false);
	const [chh, setChh] = useState(false);
	const [jph, setJph] = useState(false);
	const [enh, setEnh] = useState(false);
	const [selectedLan, setSelectedLan] = useState('');

	useReactiveVar(isLoggedInVar);
	useReactiveVar(loggedInMemberData);
	useReactiveVar(myAuthority);
	useReactiveVar(belongedJunket);
	useReactiveVar(langVar);
	useReactiveVar(my_user_id);

	const { register, getValues, handleSubmit } = useForm<IloginForm>({
		mode: 'onChange',
	});

	const loginIdOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		SetRequested(false);
		setIsValid(true);
		setLoginId(e.target.value);
	};

	const onClickLanguage = (lan: string) => {
		setSelectedLan(lan);
	};

	const getLoggedInMemberData = (myId: string) => {
		MEMBER_INFO_GET(String(myId)).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				loggedInMemberData(res.data.data);
			}
		});
	};

	const onSubmit = () => {
		const { user_id, password } = getValues();

		const data = {
			user_id: user_id,
			password: password,
		};

		if (selectedLan === '') {
			sessionStorage.setItem(SESSIONSTORAGE_LANGUAGE, String('한국어'));
			langVar('한국어');
		} else {
			sessionStorage.setItem(SESSIONSTORAGE_LANGUAGE, String(selectedLan));
			langVar(selectedLan);
		}

		LOGIN_MUTATION(data)
			.then((res: AxiosResponse | any) => {
				SetRequested(true);
				if (res.data) {
					if (res.data.user_id === 'superadmin001') {
						sessionStorage.setItem(SESSIONSTORAGE_TOKEN, 'dwtokenIsHere!');
						sessionStorage.setItem(SESSIONSTORAGE_AUTH, String('ADMIN'));
						sessionStorage.setItem(SESSIONSTORAGE_ID, res.data.user_id);
						myAuthority(String('ADMIN'));
						getLoggedInMemberData(user_id);
						belongedJunket(String(res.data.junket_code));
						setIsValid(true);
						my_user_id(res.data.user_id);
						loggedInMemberData();
						isLoggedInVar(true);
					} else {
						sessionStorage.setItem(SESSIONSTORAGE_TOKEN, 'dwtokenIsHere!');
						sessionStorage.setItem(SESSIONSTORAGE_AUTH, String('USER'));
						sessionStorage.setItem(SESSIONSTORAGE_ID, res.data.user_id);
						myAuthority(String('USER'));
						belongedJunket(String(res.data.junket_code));
						setIsValid(true);
						my_user_id(res.data.user_id);
						isLoggedInVar(true);
					}
				}
				if (res.response) {
					if (res.response.status === 401) {
						alert('Invalid Id or Password');
						SetRequested(true);
						setIsValid(false);
					} else {
						alert('login request failed');
						SetRequested(true);
						setIsValid(false);
					}
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
				setIsValid(false);
			});
	};

	return (
		<div
			className='h-screen w-full min-h-fit bg-no-repeat bg-cover bg-center'
			style={{ backgroundImage: `url(${bg})` }}
		>
			<Helmet>
				<title>Login | DW AGENT</title>
			</Helmet>
			<div className='h-screen flex flex-col justify-center items-center overflow-hidden'>
				<div className='w-full flex flex-col justify-center items-center'>
					<div
						className='mt-30 flex flex-col items-center bg-no-repeat bg-center m-5 px-2'
						style={{ backgroundImage: `url(${loginbg})` }}
					>
						<div className='2xl:py-10'>
							<div className=''>
								<img
									src={companyLogo}
									alt={companyLogo}
									className='ml-6 p-5 2xl:ml-15 mt-5 mb-5 2xl:mb-10 w-35 2xl:w-26'
								/>
							</div>
							<div className='flex flex-row justify-center'>
								<img
									src={sysLogo}
									alt={sysLogo}
									className='mt-5 w-56 2xl:w-80'
								/>
							</div>
							<div className='px-8 xl:px-20 lg:px-20'>
								<form
									onSubmit={handleSubmit(onSubmit)}
									className='grid gap-3 mt-5 w-full mb-5'
								>
									<input
										type='text'
										name='username'
										className='w-0 h-0 border-0 block'
									/>
									<input type='password' className='w-0 h-0 border-0 block' />
									<div className=' flex flex-row items-center bg-white bg-opacity-30 rounded-full px-5 mb-5'>
										<img className='h-5' src={String(userIcon)} />
										<input
											{...register('user_id')}
											required
											placeholder='Username'
											pattern='^[a-zA-Z0-9]*$'
											className='block w-full input bg-transparent border-none text-white placeholder:text-white placeholder:italic focus:placeholder:opacity-0'
											onChange={loginIdOnChange}
											autoFocus
										></input>
									</div>
									<div className='flex flex-row items-center bg-white bg-opacity-30 rounded-full px-5 mb-5 2xl:mb-10'>
										<img className='h-5' src={String(passwordIcon)} />
										<input
											{...register('password', {
												required: 'password is required',
											})}
											required
											type='password'
											pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
											minLength={6}
											placeholder='Password'
											className='block w-full input bg-transparent border-none text-white placeholder:text-white placeholder:italic focus:placeholder:opacity-0'
										></input>
									</div>
									<div className='mb-5 flex flex-row justify-center'>
										<div className='bg-black bg-opacity-40 w-full rounded-full px-5 2xl:mb-5 hover:bg-opacity-30'>
											<button
												role='button'
												className={`text-white w-full rounded text-2xl px-6 py-3 focus:outline-none font-semibold transition-colors`}
											>
												LOGIN
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className='flex flex-row gap-4'>
						<img
							onMouseEnter={() => setKrh(true)}
							onMouseLeave={() => setKrh(false)}
							onClick={() => onClickLanguage('한국어')}
							className='h-10 2xl:h-16 cursor-pointer'
							src={
								krh || selectedLan === '한국어'
									? String(krflagh)
									: String(krflag)
							}
						></img>
						<img
							onMouseEnter={() => setChh(true)}
							onMouseLeave={() => setChh(false)}
							onClick={() => onClickLanguage('中文')}
							className='h-10 2xl:h-16 cursor-pointer'
							src={
								chh || selectedLan === '中文' ? String(chflagh) : String(chflag)
							}
						></img>
						<img
							onMouseEnter={() => setJph(true)}
							onMouseLeave={() => setJph(false)}
							onClick={() => onClickLanguage('English')}
							className='h-10 2xl:h-16 cursor-pointer'
							src={
								jph || selectedLan === 'English'
									? String(jpflagh)
									: String(jpflag)
							}
						></img>
						<img
							onMouseEnter={() => setEnh(true)}
							onMouseLeave={() => setEnh(false)}
							onClick={() => onClickLanguage('English')}
							className='h-10 2xl:h-16 cursor-pointer'
							src={
								enh || selectedLan === 'English'
									? String(enflagh)
									: String(enflag)
							}
						></img>
					</div>
					<div className='2xl:mt-4 text-white text-lg'>Version 0.0.2</div>
				</div>
			</div>
		</div>
	);
};
