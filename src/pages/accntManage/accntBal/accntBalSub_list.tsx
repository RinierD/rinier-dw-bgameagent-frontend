import { useReactiveVar } from '@apollo/client';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import {
	IAccntSubAccntRes,
	MEMBER_INFO_GET,
	SUB_MEMBERS_GET_SUM,
} from '../../../common/api/queries/accnt_query';
import {
	accntGeneralDataBal,
	loggedInMemberData,
	my_user_id,
	parentIdList,
	subAccountData,
	subAccountDatalist,
} from '../../../common/apollo';
import { AccntGeneralSRModal } from './modal/accntGeneralSR_modal';

export const AccntBalSubList = () => {
	const { t } = useTranslation(['page']);

	const [sRModalType, setSRModalType] = useState('');
	const [srModal, setSRModal] = useState(false);

	const myId = useReactiveVar(my_user_id);
	const data = useReactiveVar(subAccountDatalist);
	const myData = useReactiveVar(loggedInMemberData);
	useReactiveVar(subAccountData);
	useReactiveVar(accntGeneralDataBal);
	useReactiveVar(parentIdList);

	const onClickSRModal = (data: IAccntSubAccntRes, sRType: string) => {
		setSRModalType(sRType);
		subAccountData(data);
		setSRModal(!srModal);
	};

	const onClickAgentId = (agentId: string) => {
		SUB_MEMBERS_GET_SUM(agentId)
			.then((res: AxiosResponse | any) => {
				if (res.data.data) {
					subAccountDatalist(res.data.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
		MEMBER_INFO_GET(agentId).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				accntGeneralDataBal([res.data.data]);
				const parentIdArr: string[] = res.data.data?.parent_id.split('.');
				const filteredIdArr = parentIdArr.slice(
					parentIdArr.indexOf(String(myData?.user_id))
				);
				parentIdList([...filteredIdArr, agentId]);
			}
		});
	};

	const columnHelper = createColumnHelper<IAccntSubAccntRes>();
	const columns = [
		columnHelper.accessor('user_id', {
			header: String(t('하부계정')),
		}),
		columnHelper.accessor('nickname', {
			header: String(t('닉네임')),
		}),
		columnHelper.accessor('slot_share', {
			header: String(t('쉐어')),
		}),
		columnHelper.accessor('slot_rolling', {
			header: String(t('롤링')),
		}),
		columnHelper.accessor('balance_red', {
			header: String(t('보너스')),
		}),
		columnHelper.accessor('sub_total_balance_red', {
			header: String(t('하부 보너스')),
		}),
		columnHelper.accessor('baccarat_permit', {
			header: String(t('총 보너스')),
		}),
		columnHelper.accessor('balance_default', {
			header: String(t('잔액')),
		}),
		columnHelper.accessor('sub_total_balance', {
			header: String(t('하부잔액')),
		}),
		columnHelper.accessor('slot_permit', {
			header: String(t('총잔액')),
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const getSubMemberList = () => {
		SUB_MEMBERS_GET_SUM(String(myId)).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				subAccountDatalist(res.data.data);
			}
		});
	};

	useEffect(() => {
		getSubMemberList();
	}, []);

	return (
		<div>
			<div className='border rounded-md mt-5 shadow-md'>
				<div
					className='flex flex-col overflow-x-scroll'
					style={{ backgroundColor: '#245c81' }}
				>
					<div className=''>
						<table className='w-full'>
							<thead className='border-b'>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header, index) => {
											if (
												header.column.columnDef.header === t('잔액') ||
												header.column.columnDef.header === t('보너스') ||
												header.column.columnDef.header === t('하부 보너스') ||
												header.column.columnDef.header === t('총 보너스') ||
												header.column.columnDef.header === t('총잔액') ||
												header.column.columnDef.header === t('하부잔액')
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
														className='text-base text-right font-bold text-white px-4 py-2'
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
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row, index) => (
									<tr
										key={row.id}
										className='even:bg-white odd:bg-gray-100 text-xs'
									>
										{row.getVisibleCells().map((cell) => {
											if (cell.column.columnDef.header === t('쉐어')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-gray-900 underline'
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
														className='px-4 py-3 text-xs text-gray-900 underline'
														onClick={() => onClickSRModal(row.original, 'R')}
													>
														{row.original.baccarat_permit === 'Y'
															? `${row.original.baccarat_rolling}%`
															: `${row.original.slot_rolling}%`}
													</td>
												);
											} else if (cell.column.columnDef.header === t('보너스')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-right text-gray-900'
													>
														{cell.row.original.balance_red.toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('하부 보너스')
											) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-right text-gray-900'
													>
														{cell.row.original.sub_total_balance_red.toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('총 보너스')
											) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-right text-gray-900'
													>
														{(
															cell.row.original.sub_total_balance_red +
															cell.row.original.balance_red
														).toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('잔액')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-right text-gray-900'
													>
														{cell.row.original.balance_default.toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('하부잔액')
											) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-right text-gray-900'
													>
														{cell.row.original.sub_total_balance.toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('총잔액')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-right text-gray-900'
													>
														{(
															cell.row.original.sub_total_balance +
															cell.row.original.balance_default
														).toLocaleString()}
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
											} else {
												return (
													<td
														key={cell.id}
														className='px-4 py-2 text-xs text-left font-base text-gray-900'
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
			{srModal ? (
				<AccntGeneralSRModal
					setSRModal={setSRModal}
					sRModalType={sRModalType}
				/>
			) : null}
		</div>
	);
};
