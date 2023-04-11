import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { IWinnLossDataRes } from '../../../common/api/queries/winloss_query';
import { useReactiveVar } from '@apollo/client';
import { subMemberWinlossData } from '../../../common/apollo';

export const WinlossHistoryList = () => {
	const { t } = useTranslation(['page']);

	const data = useReactiveVar(subMemberWinlossData);

	const columnHelper = createColumnHelper<IWinnLossDataRes>();
	const columns = [
		columnHelper.accessor('user_id', {
			header: String(t('상부계정')),
		}),
		columnHelper.accessor('nickname', {
			header: String(t('닉네임')),
		}),
		columnHelper.accessor('winloss', {
			header: String(t('윈로스')),
		}),
		columnHelper.accessor('user_total_slot_coin_in', {
			header: String(t('총롤링')),
		}),
		// columnHelper.accessor('user_total_slot_coin_out', {
		// 	header: String(t('총정산금')),
		// }),
		columnHelper.accessor('slot_share', {
			header: String(t('쉐어')),
		}),
		columnHelper.accessor('sharewinloss', {
			header: String(t('쉐어윈로스')),
		}),
		columnHelper.accessor('slot_rolling', {
			header: String(t('롤링')),
		}),
		columnHelper.accessor('rollingCommision', {
			header: String(t('롤링커미션')),
		}),
		columnHelper.accessor('profit', {
			header: String(t('실제수익')),
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	useEffect(() => {
		table.setPageSize(10);
	}, []);
	return (
		<div>
			<div className='border rounded-md mt-5 shadow-md'>
				<div
					className='w-full overflow-x-scroll'
					style={{ backgroundColor: '#245c81' }}
				>
					<div className='flex flex-row justify-start items-center text-sm whitespace-nowrap'>
						<table className='w-full'>
							<thead className='border-b'>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header, index) => {
											if (
												header.column.columnDef.header === t('윈로스') ||
												header.column.columnDef.header === t('총롤링') ||
												header.column.columnDef.header === t('총정산금') ||
												header.column.columnDef.header === t('쉐어윈로스') ||
												header.column.columnDef.header === t('롤링커미션') ||
												header.column.columnDef.header === t('실제수익') ||
												header.column.columnDef.header === t('쉐어') ||
												header.column.columnDef.header === t('롤링')
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
															className='flex flex-row justify-end items-center text-xs'
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
												header.column.columnDef.header === t('상부계정')
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
														className='text-base text-center font-bold text-white px-4 py-2 sticky left-0'
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
															className='flex flex-row justify-start items-center text-xs'
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
											if (cell.column.columnDef.header === t('윈로스')) {
												return (
													<td
														key={cell.id}
														className='px-4 py-2 text-xs text-right font-base text-gray-900'
													>
														{(
															(row.original.user_total_slot_coin_in +
																row.original.sub_total_slot_coin_in -
																row.original.user_total_slot_coin_out -
																row.original.sub_total_slot_coin_out) /
															100
														).toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('총롤링')) {
												return (
													<td
														key={cell.id}
														className='px-4 py-2 text-xs text-right font-base text-gray-900'
													>
														{(
															(row.original.user_total_slot_coin_in +
																row.original.sub_total_slot_coin_in) /
															100
														).toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('총정산금')
											) {
												return (
													<td
														key={cell.id}
														className='px-4 py-2 text-xs text-right font-base text-gray-900'
													>
														{(
															(row.original.user_total_slot_coin_out +
																row.original.sub_total_slot_coin_out) /
															100
														).toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('쉐어윈로스')
											) {
												return (
													<td
														key={cell.id}
														className='px-4 py-2 text-xs text-right font-base text-gray-900'
													>
														{(
															((row.original.user_total_slot_coin_in +
																row.original.sub_total_slot_coin_in -
																row.original.user_total_slot_coin_out -
																row.original.sub_total_slot_coin_out) /
																100) *
															(row.original.slot_share / 100)
														).toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('롤링커미션')
											) {
												return (
													<td
														key={cell.id}
														className='px-4 py-2 text-xs text-right font-base text-gray-900'
													>
														{(
															((row.original.user_total_slot_coin_in +
																row.original.sub_total_slot_coin_in) /
																100) *
															(row.original.slot_rolling / 100)
														).toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('실제수익')
											) {
												return (
													<td
														key={cell.id}
														className='px-4 py-2 text-xs text-right font-base text-gray-900'
													>
														{(
															((row.original.user_total_slot_coin_in +
																row.original.sub_total_slot_coin_in -
																row.original.user_total_slot_coin_out -
																row.original.sub_total_slot_coin_out) /
																100) *
																(row.original.slot_share / 100) -
															((row.original.user_total_slot_coin_in +
																row.original.sub_total_slot_coin_in) /
																100) *
																(row.original.slot_rolling / 100)
														).toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('쉐어')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-right text-gray-900'
													>
														{`${cell.row.original.slot_share} %`}
													</td>
												);
											} else if (cell.column.columnDef.header === t('롤링')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-right text-gray-900'
													>
														{`${cell.row.original.slot_rolling} %`}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('하부계정')
											) {
												return (
													<td
														key={cell.id}
														className={`px-4 py-2 text-xs text-left font-medium sticky left-0  ${
															index % 2 === 1 ? 'bg-white' : 'bg-gray-100'
														} `}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('상부계정')
											) {
												return (
													<td
														key={cell.id}
														className={`px-4 py-2 text-xs text-left font-medium sticky left-0  ${
															index % 2 === 1 ? 'bg-white' : 'bg-gray-100'
														} `}
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
		</div>
	);
};
