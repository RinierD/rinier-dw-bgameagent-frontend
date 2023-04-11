import { useReactiveVar } from '@apollo/client';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	MEMBER_INFO_GET,
	SUBACCNT_MEMBERS_GET,
} from '../../../common/api/queries/accnt_query';
import {
	sidebarVar,
	accntGeneralData,
	langVar,
	loggedInMemberData,
	my_user_id,
	parentIdList,
	roleAccountDatalist,
	routeTitleVar,
	subAccountData,
	sRModal,
  limitModal,
  limitModalType,
} from '../../../common/apollo';

export const AccntSubInfo = () => {
	const { t } = useTranslation(['page']);
	useReactiveVar(routeTitleVar);

	const myData = useReactiveVar(loggedInMemberData);
	const myId = useReactiveVar(my_user_id);
	const selectedLang = useReactiveVar(langVar);
	const memberData = useReactiveVar(accntGeneralData);
	const parentList = useReactiveVar(parentIdList);
	const betLimitModal = useReactiveVar(limitModal);
	const srModal = useReactiveVar(sRModal);
	useReactiveVar(subAccountData);
	useReactiveVar(roleAccountDatalist);
	useReactiveVar(sidebarVar);
	useReactiveVar(limitModalType);

	const getMemberInfo = () => {
		MEMBER_INFO_GET(String(myId)).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				accntGeneralData(res.data.data);
			}
		});
	};

	const onClickSRModal = () => {
		subAccountData(memberData);
		sRModal(!srModal);
	};

  const onClickBetLimitModal = () => {
		limitModal(!betLimitModal);
		limitModalType('I');
	};

	useEffect(() => {
		routeTitleVar(String(t('서브계정')));
		getMemberInfo();
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('서브계정')));
	}, [selectedLang]);
	return (
		<div>
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
					<div className='mx-auto flex flex-wrap items-center gap-3'>
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
