import { useReactiveVar } from '@apollo/client';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { Button } from '../../../components/button';
import { AccntGeneralSetupModal } from './modal/accntGeneralSetup_modal';
import { useNavigate } from 'react-router-dom';
import { AccntGenDepositModal } from './modal/accntGeneralD_modal';
import { AccntGenWithDrawModal } from './modal/accntGeneralW_modal';
import { AccntGeneralBetLimitModal } from './modal/accntGeneralBetlimit_modal';
import { useTranslation } from 'react-i18next';
import {
	IAccntSubAccntRes,
	IAcctInfoRes,
	MEMBER_INFO_GET,
	SUB_MEMBERS_GET,
} from '../../../common/api/queries/accnt_query';
import {
	accntGeneralData,
	limitModal,
	limitModalType,
	loggedInMemberData,
	my_user_id,
	parentIdList,
	sRModal,
	subAccountData,
	subAccountDatalist,
} from '../../../common/apollo';
import { AxiosResponse } from 'axios';
import { AccntGeneralSRModal } from './modal/accntGeneralSR_modal';
import { useForm } from 'react-hook-form';

export const AccntGeneralTable = () => {
	const { t } = useTranslation(['page']);

	const { handleSubmit } = useForm();

	const navigate = useNavigate();

	const [modal, setModal] = useState(false);
	const [depositModal, setDepositModal] = useState(false);
	const [withdrawModal, setWithDrawModal] = useState(false);
	// const [betLimitModal, setBetLimitModal] = useState(false);
	const [accntName, setAccntName] = useState('');
	const [sRModalType, setSRModalType] = useState('');
	const [idQueryPath, setIdQueryPath] = useState('');
	const betLimitModal = useReactiveVar(limitModal);

	const srModal = useReactiveVar(sRModal);
	const myId = useReactiveVar(my_user_id);
	const data = useReactiveVar(subAccountDatalist);
	const myData = useReactiveVar(loggedInMemberData);
	useReactiveVar(parentIdList);
	useReactiveVar(accntGeneralData);
	useReactiveVar(subAccountData);
	useReactiveVar(limitModalType);
	useReactiveVar(subAccountData);

	const onClickAccntReg = () => {
		navigate('/accnt-register');
	};

	const onClickModal = (data: IAccntSubAccntRes) => {
		setAccntName(data.user_id);
		setModal(!modal);
		subAccountData(data);
	};

	const onClickDepositModal = (data: IAccntSubAccntRes) => {
		setDepositModal(!depositModal);
		subAccountData(data);
	};
	const onClickWithDrawModal = (data: IAccntSubAccntRes) => {
		setWithDrawModal(!withdrawModal);
		subAccountData(data);
	};

	const onClickSRModal = (data: IAccntSubAccntRes, sRType: string) => {
		setSRModalType(sRType);
		subAccountData(data);
		sRModal(!srModal);
	};

	const onClickBetLimitModal = (data: IAccntSubAccntRes) => {
		limitModal(!betLimitModal);
		setAccntName(data.user_id);
		limitModalType('T');
		subAccountData(data);
	};

	const idOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdQueryPath(e.target.value);
	};

	const onClickAgentId = (agentId: string) => {
		MEMBER_INFO_GET(agentId).then((res: AxiosResponse | any) => {
			if (res.data) {
				accntGeneralData(res.data.data);
				const parentIdArr: string[] = res.data.data?.parent_id.split('.');
				let filteredIdArr: string[] = [];
				if (parentIdArr.length === 1) {
					filteredIdArr = [];
				} else {
					filteredIdArr = parentIdArr.slice(
						parentIdArr.indexOf(String(myData?.user_id))
					);
				}
				parentIdList([...filteredIdArr, agentId]);
			} else if (res.response) {
				if (
					res.response.data.error.message === 'Have no permit for this request'
				) {
					alert(t('요청권한없음'));
				} else {
					alert('invalid member name');
				}
			} else {
				alert('invalid member name');
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

	const onSearchMember = (agentId: string) => {
		if (agentId === String(myData?.user_id)) {
			onClickAgentId(agentId);
		} else {
			MEMBER_INFO_GET(agentId)
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						accntGeneralData(res.data.data);
						const searchedMemberData: IAcctInfoRes = res.data.data;
						const rawParentArr = searchedMemberData.parent_id.split('.');
						const immediateParentId = rawParentArr[rawParentArr.length - 1];
						subAccountDatalist([searchedMemberData]);
						return immediateParentId;
					} else if (res.response) {
						if (
							res.response.data.error.message ===
							'Have no permit for this request'
						) {
							alert(t('invalid member name'));
						} else {
							alert('invalid member name');
						}
					} else {
						alert('invalid member name');
					}
				})
				.then((res: string | void) => {
					if (typeof res === 'string') {
						const rawParentArr = res.split('.');
						const immediateParentId = rawParentArr[rawParentArr.length - 1];
						MEMBER_INFO_GET(immediateParentId).then(
							(res: AxiosResponse | any) => {
								if (res.data) {
									accntGeneralData(res.data.data);
									const parentIdArr: string[] =
										res.data.data?.parent_id.split('.');
									if (parentIdArr.indexOf(String(myData?.user_id)) === -1) {
										parentIdList([String(immediateParentId)]);
									} else {
										const filteredIdArr = parentIdArr.slice(
											parentIdArr.indexOf(String(myData?.user_id))
										);
										parentIdList([...filteredIdArr, immediateParentId]);
									}
								} else if (res.response) {
									if (
										res.response.data.error.message ===
										'Have no permit for this request'
									) {
										alert(t('invalid member name'));
									} else {
										alert('invalid member name');
									}
								} else {
									alert('invalid member name');
								}
							}
						);
					}
				});
		}
	};

	const onSubmit = (agentId: string) => {
		if (agentId === '') {
			setIdQueryPath('');
			return;
		}
		if (agentId.includes(' ')) {
			setIdQueryPath('');
			return;
		}
		onSearchMember(agentId);
	};

	const dateTimeFormatter = (dateTime: string) => {
		const formattedStr = dateTime.replace('T', ' ');
		return formattedStr;
	};

	const columnHelper = createColumnHelper<IAccntSubAccntRes>();
	const commonColumns01 = [
		columnHelper.accessor('user_id', {
			header: String(t('하부계정')),
		}),
		columnHelper.accessor('nickname', {
			header: String(t('닉네임')),
		}),
		columnHelper.accessor('default_currency', {
			header: String(t('화폐')),
		}),
		columnHelper.accessor('account_type', {
			header: String(t('계정유형')),
		}),
		columnHelper.accessor('account_status', {
			header: String(t('계정상태')),
		}),
		columnHelper.accessor('betlimit', {
			header: String(t('배팅한도')),
		}),
		columnHelper.accessor('baccarat_share', {
			header: String(t('쉐어')),
		}),
		columnHelper.accessor('baccarat_rolling', {
			header: String(t('롤링')),
		}),
		columnHelper.accessor('balance_red', {
			header: String(t('보너스')),
		}),
		columnHelper.accessor('balance_default', {
			header: String(t('잔액')),
		}),
		columnHelper.accessor('created_at', {
			header: String(t('생성일')),
		}),
	];

	const table = useReactTable({
		data,
		columns: commonColumns01,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const getSubMemberList = () => {
		SUB_MEMBERS_GET(String(myId)).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				subAccountDatalist(res.data.data);
			}
		});
	};

	useEffect(() => {
		getSubMemberList();
		table.setPageSize(10);
	}, []);

	return (
		<div>
			<div className='border rounded-md mt-5 shadow-md'>
				<div className='flex flex-row justify-between items-center border-b bg-gray-100'>
					<div className='w-full flex flex-wrap flex-row justify-between gap-3 items-center px-3 my-3'>
						<div className='w-full sm:w-48' onClick={onClickAccntReg}>
							<Button canClick={true} actionText={t('계정 생성')} />
						</div>
						<form onSubmit={handleSubmit(() => onSubmit(idQueryPath))}>
							<div className='flex items-center gap-3'>
								<div className='form-group flex'>
									<input
										type='text'
										className='forminput pr-10 w-full sm:w-full'
										placeholder={String(t('계정명 입력'))}
										onChange={idOnChange}
									/>
									<div className='pl-3'>
										<Button canClick={true} actionText={t('검색')} />
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div
					className='flex flex-col overflow-x-scroll'
					style={{ backgroundColor: '#245c81' }}
				>
					<div className='flex flex-row justify-start items-center text-sm whitespace-nowrap'>
						<table className='w-full'>
							<thead className='border-b sticky'>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header, index) => {
											if (header.column.columnDef.header === t('잔액')) {
												return (
													<th
														key={`sort_${index}`}
														style={{
															cursor: header.column.getCanSort()
																? 'pointer'
																: 'default',
														}}
														onClick={header.column.getToggleSortingHandler()}
														className='text-base text-center font-bold text-white px-3 py-2'
													>
														<div
															key={`icon_${header.index}`}
															className='flex flex-row justify-end items-center text-xs whitespace-nowrap'
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																  )}
															{{
																asc: <FaSortUp />,
																desc: <FaSortDown />,
															}[header.column.getIsSorted() as string] ?? null}
															{header.column.getCanSort() &&
															!header.column.getIsSorted() ? (
																<FaSort />
															) : null}
														</div>
													</th>
												);
											} else if (
												header.column.columnDef.header === t('보너스')
											) {
												return (
													<th
														key={`sort_${index}`}
														style={{
															cursor: header.column.getCanSort()
																? 'pointer'
																: 'default',
														}}
														onClick={header.column.getToggleSortingHandler()}
														className='text-base text-center font-bold text-white px-3 py-2'
													>
														<div
															key={`icon_${header.index}`}
															className='flex flex-row justify-end items-center text-xs whitespace-nowraps'
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																  )}
															{{
																asc: <FaSortUp />,
																desc: <FaSortDown />,
															}[header.column.getIsSorted() as string] ?? null}
															{header.column.getCanSort() &&
															!header.column.getIsSorted() ? (
																<FaSort />
															) : null}
														</div>
													</th>
												);
											} else if (
												header.column.columnDef.header === t('배팅한도')
											) {
												return (
													<th
														key={`sort_${index}`}
														style={{
															cursor: header.column.getCanSort()
																? 'pointer'
																: 'default',
														}}
														onClick={header.column.getToggleSortingHandler()}
														className='text-base text-left font-bold text-white px-4 py-2'
													>
														<div
															key={`icon_${header.index}`}
															className='text-left text-xs whitespace-nowrap'
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																  )}
														</div>
													</th>
												);
											} else if (
												header.column.columnDef.header === t('하부계정')
											) {
												return (
													<th
														key={`sort_${index}`}
														style={{
															cursor: header.column.getCanSort()
																? 'pointer'
																: 'default',
															backgroundColor: '#245c81',
														}}
														onClick={header.column.getToggleSortingHandler()}
														className='text-base text-left font-bold text-white px-4 py-2 sticky left-0'
													>
														<div
															key={`icon_${header.index}`}
															className='text-left text-xs whitespace-nowrap'
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																  )}
														</div>
													</th>
												);
											} else {
												return (
													<th
														key={`sort_${index}`}
														style={{
															cursor: header.column.getCanSort()
																? 'pointer'
																: 'default',
														}}
														onClick={header.column.getToggleSortingHandler()}
														className='text-base text-center font-bold text-white px-4 py-2'
													>
														<div
															key={`icon_${header.index}`}
															className='flex flex-row justify-start items-center text-xs whitespace-nowrap'
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext()
																  )}
															{{
																asc: <FaSortUp />,
																desc: <FaSortDown />,
															}[header.column.getIsSorted() as string] ?? null}
															{header.column.getCanSort() &&
															!header.column.getIsSorted() ? (
																<FaSort />
															) : null}
														</div>
													</th>
												);
											}
										})}
										{/* THIS IS THE CODES FOR THE SORTING AND RESIZING OF */}
										<th
											style={{ cursor: 'default' }}
											className='text-xs font-bold text-white px-1 text-center pb-1 w-28'
										>
											{t('입출금')}
										</th>
										<th
											style={{ cursor: 'default' }}
											className='text-xs font-bold text-white px-1 text-cneter pb-1 w-16'
										>
											{t('설정')}
										</th>
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row, index) => (
									<tr
										key={row.id}
										className='even:bg-white odd:bg-gray-100 text-xs relative'
									>
										{row.getVisibleCells().map((cell) => {
											if (cell.column.columnDef.header === t('계정유형')) {
												return (
													<td
														key={`cell_${cell.id}`}
														className='px-4 py-2 text-xs text-left'
													>
														{
															<div className='text-gray-900'>
																{cell.row.original.account_type === 'A'
																	? t('에이전트')
																	: t('회원')}
															</div>
														}
													</td>
												);
											} else if (cell.column.columnDef.header === t('생성일')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-left text-gray-900 whitespace-nowrap'
													>
														{dateTimeFormatter(
															String(cell.row.original.created_at)
														)}
													</td>
												);
											} else if (cell.column.columnDef.header === t('보너스')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-right text-gray-900'
													>
														{Number(row.original.balance_red).toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('잔액')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-right text-gray-900'
													>
														{Number(
															row.original.balance_default
														).toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('쉐어')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-blue-600 underline'
														onClick={() => onClickSRModal(row.original, 'S')}
													>
														{row.original.baccarat_permit === 'Y'
															? `${row.original.baccarat_share}%`
															: `${row.original.slot_share}%`}
													</td>
												);
											} else if (cell.column.columnDef.header === t('롤링')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-blue-600 underline'
														onClick={() => onClickSRModal(row.original, 'R')}
													>
														{row.original.baccarat_permit === 'Y'
															? `${row.original.baccarat_rolling}%`
															: `${row.original.slot_rolling}%`}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('배팅한도')
											) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-left'
													>
														<div
															className='font-medium text-xs text-blue-600 underline cursor-pointer'
															onClick={() => onClickBetLimitModal(row.original)}
														>
															{t('상세')}
														</div>
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('하부계정')
											) {
												return (
													<td
														key={cell.id}
														className={`px-4 py-2 text-xs text-left font-medium sticky left-0 ${
															row.original.account_type === 'A'
																? 'text-blue-500 underline cursor-pointer'
																: 'text-gray-900'
														} ${index % 2 === 1 ? 'bg-white' : 'bg-gray-100'} `}
														onClick={
															row.original.account_type === 'A'
																? () => onClickAgentId(row.original.user_id)
																: undefined
														}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('계정상태')
											) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-left text-gray-900'
													>
														{
															<div
																className={`font-bold ${
																	cell.row.original.account_status === 'Y'
																		? 'text-green-600'
																		: 'text-red-600'
																}`}
															>
																{cell.row.original.account_status === 'Y' ? (
																	<div className='flex items-center'>
																		<div className='text-lg'>
																			<AiOutlineCheckCircle />
																		</div>
																		<div className='text-xs ml-1'>
																			{t('허용')}
																		</div>
																	</div>
																) : (
																	<div className='flex items-center'>
																		<div className='text-lg'>
																			<AiOutlineCloseCircle />
																		</div>
																		<div className='text-xs ml-1'>
																			{t('정지')}
																		</div>
																	</div>
																)}
															</div>
														}
													</td>
												);
											} else {
												return (
													<td
														key={cell.id}
														className='px-4 py-2 text-xs text-left text-gray-900'
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</td>
												);
											}
										})}
										<td className='px-1 mt-1'>
											<div className='flex justify-center'>
												<div
													className='border rounded text-xs py-1.5 px-2.5 font-semibold text-white cursor-pointer bg-green-600 whitespace-nowrap'
													onClick={() => onClickDepositModal(row.original)}
												>
													{t('입금')}
												</div>
												<div
													className='border rounded text-xs py-1.5 px-2.5 ml-1 font-semibold text-white cursor-pointer bg-red-700 bg-opacity-90 whitespace-nowrap'
													onClick={() => onClickWithDrawModal(row.original)}
												>
													{t('출금')}
												</div>
											</div>
										</td>
										<td className='px-1 mt-1'>
											<div className='flex justify-center'>
												<div
													className='border rounded text-xs py-1.5 px-2.5 font-semibold text-white cursor-pointer bg-orange-500 whitespace-nowrap'
													onClick={() => onClickModal(row.original)}
												>
													{t('설정')}
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className='flex flex-col justify-center gap-2 sm:flex-row'>
				<div className='flex items-center mt-3 gap-2 justify-center'>
					<button
						className='border border-gray-300 rounded py-1 px-2 font-medium cursor-pointer'
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						{'<<'}
					</button>
					<button
						className='border border-gray-300 rounded py-1 px-2 font-medium cursor-pointer'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						{'<'}
					</button>
					<button
						className='border border-gray-300 rounded py-1 px-2 font-medium cursor-pointer'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						{'>'}
					</button>
					<button
						className='border border-gray-300 rounded py-1 px-2 font-medium cursor-pointer'
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						{'>>'}
					</button>
				</div>
				<div className='flex items-center mt-3 gap-2 justify-center'>
					<span className='flex items-center gap-1 font-medium'>
						<div>{t('페이지')}</div>
						<strong>
							{table.getState().pagination.pageIndex + 1} /{' '}
							{table.getPageCount()}
						</strong>
					</span>
					<span className='flex items-center gap-1 font-medium'>
						| {t('페이지')}:
						<input
							type='number'
							defaultValue={table.getState().pagination.pageIndex + 1}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								table.setPageIndex(page);
							}}
							className='border p-1 rounded w-16'
						/>
					</span>
				</div>
			</div>
			{/* This API is under construction */}
			{modal ? (
				<AccntGeneralSetupModal setModal={setModal} accountName={accntName} />
			) : null}
			{depositModal ? (
				<AccntGenDepositModal setDepositModal={setDepositModal} />
			) : null}
			{withdrawModal ? (
				<AccntGenWithDrawModal setWithDrawModal={setWithDrawModal} />
			) : null}
			{betLimitModal ? (
				<AccntGeneralBetLimitModal accountName={accntName} />
			) : null}
			{srModal ? <AccntGeneralSRModal sRModalType={sRModalType} /> : null}
		</div>
	);
};
