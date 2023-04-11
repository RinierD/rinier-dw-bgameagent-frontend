import { useReactiveVar } from '@apollo/client';
import React, { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import {
	AiFillEdit,
	AiFillLock,
	AiFillUnlock,
	AiOutlineCloseCircle,
} from 'react-icons/ai';
import { AccntGenRDepositModal } from './accntGeneralRD_modal';
import { AccntGenRWithDrawModal } from './accntGeneralRW_modal';
import { useTranslation } from 'react-i18next';
import {
	accntGeneralData,
	langVar,
	loggedInMemberData,
	subAccountData,
	subAccountDatalist,
} from '../../../../common/apollo';
import { useNavigate } from 'react-router-dom';
import { Popconfirm } from 'antd';
import { ACCOUNT_STATUS_UPDATE } from '../../../../common/api/mutations/accnt_mutation';
import { AxiosResponse } from 'axios';
import { SUB_MEMBERS_GET } from '../../../../common/api/queries/accnt_query';

interface IModalProps {
	setModal: React.Dispatch<React.SetStateAction<boolean>>;
	accountName: string;
}

export const AccntGeneralSetupModal: React.FC<IModalProps> = ({
	setModal,
	accountName,
}) => {
	const { t } = useTranslation(['page']);
	const navigate = useNavigate();

	const selectedLang = useReactiveVar(langVar);
	const myData = useReactiveVar(loggedInMemberData);
	const agentData = useReactiveVar(accntGeneralData);
	const subAccntData = useReactiveVar(subAccountData);
	useReactiveVar(subAccountDatalist);
	const [rDepositModal, setRDepositModal] = useState(false);
	const [rWithdrawModal, setRWithDrawModal] = useState(false);
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [execute_password, setExecute_password] = useState('');
	const [accntStatus, setAccntStatus] = useState(
		String(subAccntData?.account_status)
	);

	const clickModalClose = () => {
		setModal((current) => !current);
	};

	const clickAccntMod = () => {
		navigate('/accnt-mod');
	};

	const exPassOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setExecute_password(e.target.value);
	};

	const onClickDepositModal = () => {
		setRDepositModal(!rDepositModal);
	};
	const onClickWithDrawModal = () => {
		setRWithDrawModal(!rWithdrawModal);
	};

	const showPopconfirm = () => {
		setOpen(true);
	};

	const handleMemberLockClick = () => {
		setConfirmLoading(true);

		setTimeout(() => {
			setOpen(false);
			setConfirmLoading(false);
			onSubmit();
		}, 1000);
	};

	const handleMemberLockCancel = () => {
		setOpen(false);
	};

	const onSubmit = () => {
		const registerfail = t('등록 실패');

		const data = {
			my_user_id: String(myData?.user_id),
			user_id: String(subAccntData?.user_id),
			state: subAccntData?.account_status === 'Y' ? 'N' : 'Y',
			execute_password: execute_password,
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
					if (res.request) {
						if (res.request.response === '') {
							alert('Request Failed');
						}
					}
				})
				.catch((err) => {
					console.log(err);
				});
		};

		ACCOUNT_STATUS_UPDATE(data)
			.then((res: AxiosResponse | any) => {
				if (res.data) {
					alert(`${subAccntData?.user_id} updated`);
					setAccntStatus(accntStatus === 'Y' ? 'N' : 'Y');
					subAccountRequest();
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

	return (
		<div className='fixed top-0 right-0 bottom-0 left-0 z-1000 overflow-auto outline-0'>
			<div className='fixed w-full h-full bg-black bg-opacity-40 flex flex-col justify-center items-center'>
				<div className='w-11/12 md:w-1/2 2xl:w-1/3 top-12 shadow-lg'>
					<div className='border rounded-t-md  font-medium text-lg px-6 py-3 border-b flex flex-row justify-between bg-gray-100'>
						<div className='text-gray-500 font-bold'>{t('설정')}</div>
						<GrClose
							className='mt-1 cursor-pointer'
							onClick={clickModalClose}
						/>
					</div>
					<div className='p-6 rounded-b-md shadow-md bg-white'>
						<form className='grid justify-center'>
							<input
								type='text'
								name='username'
								className='w-0 h-0 border-0 block'
							/>
							<input type='password' className='w-0 h-0 border-0 block' />
							<div className='grid grid-cols-2 gap-4'>
								<div className='form-group mb-8 flex'>
									<div className='flex flex-row items-center'>
										<div
											className={`text-gray-500 mr-1 ${
												selectedLang === 'English' ? 'w-24' : 'w-12'
											}`}
										>
											{t('계정명')}:{' '}
										</div>
									</div>
									<div className='pl-2 w-40'>{accountName}</div>
								</div>
							</div>
							<div className='grid justify-center items-center grid-cols-2 gap-8 mb-10 px-4'>
								<div
									className='cursor-pointer rounded-md py-4 text-center font-bold text-xl text-white'
									style={{ backgroundColor: '#2C74B3' }}
									onClick={() => clickAccntMod()}
								>
									<div className='flex justify-center items-center'>
										<div className='text-xl mr-1'>
											<AiFillEdit />
										</div>
										<div>{t('수정')}</div>
									</div>
								</div>
								<Popconfirm
									title={
										<input
											className='forminput'
											pattern='^[a-zA-Z\\d`~!@#$%^&*()-_=+]*$'
											type='password'
											placeholder={String(t('실행 비밀번호'))}
											onChange={exPassOnChange}
										/>
									}
									description={t('하위계정을 잠금/해제 합니다')}
									open={open}
									onConfirm={handleMemberLockClick}
									okButtonProps={{ loading: confirmLoading }}
									onCancel={handleMemberLockCancel}
									arrowContent
									okText={t('등록')}
									cancelText={t('취소')}
								>
									<div
										className='cursor-pointer rounded-md py-4 text-center font-bold text-xl text-white'
										style={{ backgroundColor: '#2C74B3' }}
										onClick={showPopconfirm}
									>
										<div className='flex  justify-center items-center'>
											<div className='text-xl mr-1'>
												{subAccntData?.account_status === 'Y' ? (
													<AiFillLock />
												) : (
													<AiFillUnlock />
												)}
											</div>
											<div>{accntStatus === 'Y' ? t('잠금') : t('해제')}</div>
										</div>
									</div>
								</Popconfirm>
							</div>
							<div className='grid justify-center items-center grid-cols-2 gap-8 mb-10 px-4'>
								<div
									className='cursor-pointer rounded-md py-4 text-center font-bold text-sm text-white'
									style={{ backgroundColor: '#2C74B3' }}
									onClick={() => onClickDepositModal()}
								>
									<div className='flex flex-col justify-center items-center'>
										<div className='text-xl'>{t('보너스입금')}</div>
									</div>
								</div>
								<div
									className='cursor-pointer rounded-md py-4 text-center font-bold text-sm text-white'
									style={{ backgroundColor: '#2C74B3' }}
									onClick={() => onClickWithDrawModal()}
								>
									<div className='flex flex-col justify-center items-center'>
										<div className='text-xl'>{t('보너스출금')}</div>
									</div>
								</div>
							</div>
							<div className='w-full flex justify-center '>
								<div className='' onClick={clickModalClose}>
									<button className='border border-gray-500 rounded-md py-2 px-7 font-bold text-md text-gray-600 flex items-center bg-gray-100'>
										<div className='text-xl mr-1 text-red-500'>
											<AiOutlineCloseCircle />
										</div>
										<div className='font-bold text-base'>{t('닫기')}</div>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			{rDepositModal ? (
				<AccntGenRDepositModal setRDepositModal={setRDepositModal} />
			) : null}
			{rWithdrawModal ? (
				<AccntGenRWithDrawModal setRWithDrawModal={setRWithDrawModal} />
			) : null}
		</div>
	);
};
