import { useReactiveVar } from '@apollo/client';
import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import 'dayjs/locale/ko';
import {
	accntGeneralData,
	langVar,
	limitModal,
	limitModalType,
	loggedInMemberData,
	my_user_id,
	parentIdList,
	routeTitleVar,
	sidebarVar,
	sRModal,
	subAccountData,
	subAccountDatalist,
} from '../../../common/apollo';
import { useTranslation } from 'react-i18next';
import {
	MEMBER_INFO_GET,
	SUB_MEMBERS_GET,
} from '../../../common/api/queries/accnt_query';

export const AccntGeneralInfo = () => {
	const { t } = useTranslation(['page']);

	const selectedLang = useReactiveVar(langVar);
	const myId = useReactiveVar(my_user_id);
	const myData = useReactiveVar(loggedInMemberData);
	const memberData = useReactiveVar(accntGeneralData);
	const parentList = useReactiveVar(parentIdList);
	const betLimitModal = useReactiveVar(limitModal);
	const srModal = useReactiveVar(sRModal);
	useReactiveVar(routeTitleVar);
	useReactiveVar(subAccountData);
	useReactiveVar(subAccountDatalist);
	useReactiveVar(limitModalType);
	useReactiveVar(sidebarVar);

	const getMemberInfo = () => {
		MEMBER_INFO_GET(String(myId)).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				accntGeneralData(res.data.data);
			}
		});
	};

	const onClickBetLimitModal = () => {
		limitModal(!betLimitModal);
		limitModalType('I');
	};

	const onClickSRModal = () => {
		subAccountData(memberData);
		sRModal(!srModal);
	};

	const onClickAgentId = (agentId: string) => {
		MEMBER_INFO_GET(agentId).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				accntGeneralData(res.data.data);
				const parentIdArr: string[] = res.data.data?.parent_id.split('.');
				if (parentIdArr.indexOf(String(myData?.user_id)) === -1) {
					parentIdList([String(myId)]);
				} else {
					const filteredIdArr = parentIdArr.slice(
						parentIdArr.indexOf(String(myData?.user_id))
					);
					parentIdList([...filteredIdArr, agentId]);
				}
			}
		});
		SUB_MEMBERS_GET(agentId)
			.then((res: AxiosResponse | any) => {
				if (res.data) {
					subAccountDatalist(res.data.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		routeTitleVar(String(t('계정총람')));
		getMemberInfo();
		onClickAgentId(String(myId));
	}, []);

	useEffect(() => {
		routeTitleVar(String(t('계정총람')));
	}, [selectedLang]);

	return (
		<div>
			<div className='ml-1 mb-2 text-gray-500 font-semibold'>
				<div className='flex flex-wrap justify-between gap-2'>
					<div className='flex'>
						<div className='mr-2'>{t('에이전트')}:</div>
						<div className='text-blue-500 underline cursor-pointer flex'>
							{parentList.map((elem, index) => {
								if (index === 0) {
									return (
										<div
											className='font-semibold text-blue-500 ml-1 cursor-pointer'
											key={elem}
											onClick={() => -onClickAgentId(elem)}
										>{`${String(elem)}`}</div>
									);
								} else {
									return (
										<div
											className='font-semibold text-blue-500 ml-1 cursor-pointer'
											key={elem}
											onClick={() => onClickAgentId(elem)}
										>{`/${String(elem)}`}</div>
									);
								}
							})}
						</div>
					</div>
				</div>
			</div>
			<div className='pt-3 pb-4 pl-3 border rounded-lg shadow-lg'>
				<div>
					<div className='mx-auto flex flex-wrap items-center gap-3 mb-3'>
						<div className='flex items-center mr-3'>
							<div className='text-gray-500 font-medium'>{t('계정')}:</div>
							<div className='ml-2 text-gray-700 font-bold text-lg'>
								{memberData?.user_id}
							</div>
						</div>
						<div className='flex items-center mr-3'>
							<div className='text-gray-500 font-medium'>{t('화폐')}:</div>
							<div className='ml-2 text-gray-700 font-bold text-lg'>
								{memberData?.default_currency}
							</div>
						</div>
						<div className='flex items-start'>
							<div className='flex items-center mr-3'>
								<div className='text-gray-500 font-medium'>{t('쉐어')}:</div>
								<div
									className='ml-2 text-blue-500 font-bold text-lg underline cursor-pointer'
									onClick={() => onClickSRModal()}
								>
									{memberData?.baccarat_permit === 'Y'
										? memberData.baccarat_share
										: memberData?.slot_share}{' '}
									%
								</div>
							</div>
							<div className='flex items-center mr-3'>
								<div className='text-gray-500 font-medium'>{t('롤링')}:</div>
								<div
									className='ml-2 text-blue-500 font-bold text-lg underline cursor-pointer'
									onClick={() => onClickSRModal()}
								>
									{memberData?.baccarat_permit === 'Y'
										? memberData.baccarat_rolling
										: memberData?.slot_rolling}{' '}
									%
								</div>
							</div>
						</div>
					</div>

					<div className='mx-auto flex flex-wrap items-center gap-3'>
						<div className='flex items-center mr-3'>
							<div className='text-gray-500 font-medium'>
								{t('보너스잔액')}:
							</div>
							<div className='ml-2 text-gray-700 font-bold'>
								{memberData?.balance_red.toLocaleString()}
							</div>
						</div>
						<div className='flex items-center mr-3'>
							<div className='text-gray-500 font-medium'>{t('계정잔액')}:</div>
							<div className='ml-2 text-gray-700  font-bold'>
								{memberData?.balance_default.toLocaleString()}
							</div>
						</div>
						<div className='flex items-center mr-3'>
							<div className='text-gray-500 font-medium'>{t('하부잔액')}:</div>
							<div className='ml-2 text-gray-700 font-bold'>
								{memberData?.sub_total_balance.toLocaleString()}
							</div>
						</div>
						<div className='flex items-center mr-3'>
							<div className='text-gray-500 font-medium'>{t('총잔액')}:</div>
							<div className='ml-2 text-gray-700 font-bold'>
								{(
									Number(memberData?.balance_default) +
									Number(memberData?.sub_total_balance)
								).toLocaleString()}
							</div>
						</div>
						<div className='flex items-center mr-3'>
							<div className='text-gray-500 font-medium'>{t('베팅한도')}:</div>
							<div
								className='ml-2 text-blue-500 font-bold underline cursor-pointer'
								onClick={() => onClickBetLimitModal()}
							>
								{t('상세')}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
