import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { useReactiveVar } from '@apollo/client';
import {
	accntGeneralData,
	langVar,
	loggedInMemberData,
	subAccountData,
	subAccountDatalist,
} from '../../../../common/apollo';
import {
	ITransactionPost,
	TRANSACTION_POST,
} from '../../../../common/api/mutations/transaction_mutation';
import {
	MEMBER_INFO_GET,
	SUB_MEMBERS_GET,
} from '../../../../common/api/queries/accnt_query';
import { AxiosResponse } from 'axios';
interface IModalProps {
	setDepositModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccntGenDepositModal: React.FC<IModalProps> = ({
	setDepositModal,
}) => {
	const { t } = useTranslation(['page']);

	const {
		register,
		getValues,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm<ITransactionPost>({ mode: 'onChange' });

	const { isSubmitting } = useFormState({ control });
	const selectedLang = useReactiveVar(langVar);
	const agentData = useReactiveVar(accntGeneralData);
	const subAccntData = useReactiveVar(subAccountData);
	const myData = useReactiveVar(loggedInMemberData);
	useReactiveVar(subAccountDatalist);

	const [enteredNum, setEnterdNum] = useState<string>('');
	const [amount, setAmount] = useState<Number>(0);

	const clickModalClose = () => {
		setDepositModal((current) => !current);
	};

	const changeEnteredNum = (e: ChangeEvent<HTMLInputElement>) => {
		const value: string = e.target.value;
		let removedCommaValue: number = Number(value.replaceAll(',', ''));
		setAmount(removedCommaValue);
		if (removedCommaValue > 9000000000000) {
			removedCommaValue = 9000000000000;
		}
		if (String(removedCommaValue) === 'NaN') {
			removedCommaValue = 0;
		}
		setEnterdNum(removedCommaValue.toLocaleString());
	};

	useEffect(() => {}, []);

	const getMemberInfo = () => {
		MEMBER_INFO_GET(String(agentData?.user_id)).then(
			(res: AxiosResponse | any) => {
				if (res.data) {
					accntGeneralData(res.data.data);
				}
				if (res.response) {
					alert(res.response.data.error.message);
				}
			}
		);
	};

	const subAccountRequest = () => {
		SUB_MEMBERS_GET(String(agentData?.user_id))
			.then((res: AxiosResponse | any) => {
				if (res.data) {
					subAccountDatalist(res.data.data);
				}
				if (res.response) {
					alert(res.response.data.error.message);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onSubmit = () => {
		const registerfail = t('등록 실패');
		const { execute_password, remark } = getValues();

		const data = {
			my_user_id: String(myData?.user_id),
			execute_password: execute_password,
			money_type: 'N',
			transaction_type: 'UD',
			currency: 'PHP',
			amount: Number(amount),
			upper_id: String(agentData?.user_id),
			lower_id: String(subAccntData?.user_id),
			remark: remark,
		};

		TRANSACTION_POST(data)
			.then((res: AxiosResponse | any) => {
				if (res.data) {
					subAccountRequest();
					getMemberInfo();
					alert(`transaction registered`);
					setDepositModal((current) => !current);
				}
				if (res.response) {
					if (res.response.data.error.message === 'Amount cannot be zero') {
						alert('금액은 0 이 될 수 없습니다.');
					} else {
						alert(res.response.data.error.message);
					}
				}
			})
			.catch((err) => {
				alert(registerfail);
				// console.log(err.response);
			});
	};
	return (
		<div className='fixed top-0 right-0 bottom-0 left-0 z-1000 overflow-auto outline-0'>
			<div className='fixed w-full h-full bg-black bg-opacity-40 flex flex-col justify-center items-center'>
				<div className='w-11/12 md:w-1/2 2xl:w-1/3 top-10 shadow-lg'>
					<div className=''>
						<div className='lg:col-span-2'>
							<div className='border rounded-t-md border-green-600 font-medium text-lg px-6 py-2 border-b flex flex-row justify-center bg-green-600'>
								<div className='text-white text-xl font-bold'>{t('입금')}</div>
							</div>
							<div className='p-6 rounded-b-md shadow-md bg-white'>
								<form onSubmit={handleSubmit(onSubmit)}>
									<input
										type='text'
										name='username'
										className='w-0 h-0 border-0 block'
									/>
									{/* I make some change over here for the overflow text and got hidden in mobile/tablet/desktop size*/}
									<input type='password' className='w-0 h-0 border-0 block' />
									<div className='grid grid-cols-2'>
										<div className='form-group mb-2 flex'>
											<div className='flex flex-row items-center'>
												<div
													className={`text-gray-500 text-xs md:text-sm ${
														selectedLang === 'English' ? 'w-16' : 'w-16'
													}`}
												>
													{t('상부계정')}:
												</div>
											</div>
											<input
												type='text'
												disabled
												className=' bg-white w-36 font-bold text-xs md:text-sm'
												defaultValue={agentData?.user_id}
											/>
										</div>
										<div className='form-group mb-2 flex'>
											<div className='flex flex-row items-center'>
												<div className='text-gray-500 w-13 text-xs md:text-sm whitespace-nowrap'>
													{t('잔액')}:
												</div>
											</div>
											<input
												type='text'
												disabled
												className='bg-white pl-2 w-5/6 font-bold text-xs md:text-sm'
												defaultValue={agentData?.balance_default.toLocaleString()}
											/>
										</div>
									</div>
									<div className='grid grid-cols-2'>
										<div className='form-group mb-6 flex'>
											<div className='flex flex-row items-center'>
												<div
													className={`text-gray-500 text-xs md:text-sm ${
														selectedLang === 'English' ? 'w-16' : 'w-16'
													}`}
												>
													{t('입금계정')}:
												</div>
											</div>
											<input
												type='text'
												disabled
												className='bg-white w-36 font-bold text-xs md:text-sm'
												defaultValue={subAccntData?.user_id}
											/>
										</div>
										<div className='form-group mb-6 flex'>
											<div className='flex flex-row items-center'>
												<div className='text-gray-500 w-13 text-xs md:text-sm whitespace-nowrap'>
													{t('잔액')}:
												</div>
											</div>
											<input
												type='text'
												disabled
												className='bg-white pl-2 w-5/6 font-bold text-xs md:text-sm'
												defaultValue={subAccntData?.balance_default.toLocaleString()}
											/>
										</div>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div className='mb-6 col-span-2 flex items-center'>
											<div
												className={`text-gray-500 ${
													selectedLang === 'English' ? 'w-16' : 'w-12'
												}`}
											>
												{t('금액')}:
											</div>
											<input
												required
												type='text'
												value={enteredNum}
												max={agentData?.balance_default}
												min={0}
												onChange={changeEnteredNum}
												className='forminput text-right w-full ml-1'
												placeholder={String(t('금액 입력'))}
											/>
										</div>
									</div>
									<div className='grid lg:grid-cols-2 gap-4 mb-6 '>
										<div className='mb-6 col-span-2 flex items-center'>
											<div
												className={`text-gray-500 ${
													selectedLang === 'English' ? 'w-16' : 'w-12'
												}`}
											>
												{/* End of change */}
												{t('비고')}:
											</div>
											<textarea
												{...register('remark')}
												className='border rounded-md border-gray-300 w-full h-20 focus:bg-white focus:border-blue-600 focus:outline-none ml-1'
												style={{ resize: 'none' }}
											/>
										</div>
									</div>
									<div
										className={`w-full sm:full grid grid-cols-2 gap-2 ${
											selectedLang === 'English' ? 'pl-14' : 'pl-11'
										}`}
									>
										{/* I add margin over here so the text and the button gap has the same in desktop and tablet */}
										<div className='lg:col-span-1 col-span-2 mr-1'>
											{/* End of change */}
											<input
												{...register('execute_password')}
												required
												type='password'
												pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
												className='border border-gray-300 rounded-md py-2 pl-2 w-full focus:bg-white focus:border-blue-600 focus:outline-none'
												placeholder={String(t('실행 비밀번호 입력'))}
											/>
										</div>
										<div className='lg:col-span-1 flex col-span-2 justify-between'>
											<div className='w-full flex gap-3'>
												<div className='w-full'>
													<button
														className='border border-gray-500 rounded-md py-2 px-3 font-bold text-md text-gray-600 flex items-center justify-center w-full bg-gray-100'
														type='submit'
													>
														<div className='text-xl mr-1 text-green-500'>
															<AiOutlineCheckCircle />
														</div>
														<div className='font-bold '>{t('확인')}</div>
													</button>
												</div>
												<div className='w-full' onClick={clickModalClose}>
													<button
														className='border border-gray-500 rounded-md py-2 px-3 font-bold text-md text-gray-600 flex items-center justify-center w-full bg-gray-100'
														type='reset'
													>
														<div className='text-xl mr-1 text-red-500'>
															<AiOutlineCloseCircle />
														</div>
														<div className='font-bold text-sm'>{t('취소')}</div>
													</button>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
