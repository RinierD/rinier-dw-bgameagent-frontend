import { useReactiveVar } from '@apollo/client';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React, { useEffect } from 'react';
import { IWinnLossDataRes } from '../../../common/api/queries/winloss_query';
import {
	langVar,
	memberWinlossData,
	routeTitleVar,
	subMemberWinlossData,
} from '../../../common/apollo';
import { SiMicrosoftexcel } from 'react-icons/si';
import * as xlsx from 'xlsx';

import { useTranslation } from 'react-i18next';
import { parentIdProcessor } from '../../../common/functions/parentIdProcessor';

export const WinlossHistoryInfo = () => {
	const { t } = useTranslation(['page']);

	useReactiveVar(routeTitleVar);
	const selectedLang = useReactiveVar(langVar);
	const data = useReactiveVar(memberWinlossData);
	const childData = useReactiveVar(subMemberWinlossData);

	const excelDownload = () => {
		const wp = xlsx.utils.json_to_sheet(parentIdProcessor(data));
		const wc = xlsx.utils.json_to_sheet(parentIdProcessor(childData));
		const wb = xlsx.utils.book_new();

		xlsx.utils.book_append_sheet(wb, wp, 'Sheet1');
		xlsx.utils.book_append_sheet(wb, wc, 'Sheet2');
		xlsx.writeFile(wb, `WinLoss_${Date.now()}.xlsx`);
	};

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
	});

	useEffect(() => {
		routeTitleVar(String(t('윈로스내역')));
	}, []);
	useEffect(() => {
		routeTitleVar(String(t('윈로스내역')));
	}, [selectedLang]);
	return (
		<div className='border rounded-md mt-5 shadow-md'>
			<div className='flex flex-row justify-between items-center border-b bg-gray-100'>
				<div className='w-full flex flex-row justify-start items-center'>
					<button
						className='text-gray-600 bg-white border border-gray-400 text-sm ml-3 my-2 px-2 py-1 rounded-sm flex items-center justify-center'
						onClick={() => excelDownload()}
					>
						<div className='mr-1 text-base text-green-700'>
							<SiMicrosoftexcel />
						</div>
						<div className='font-bold'>{t('다운로드')}</div>
					</button>
				</div>
			</div>

			<div className='flex flex-col overflow-x-scroll' style={{}}>
				<div className='flex flex-row justify-start items-center text-sm whitespace-nowrap'>
					<table className='w-full'>
						<thead
							className=''
							style={{
								backgroundColor: '#245c81',
							}}
						>
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
													className='text-base text-center font-bold text-white px-4 py-2'
												>
													<div
														key={`icon_${header.index}`}
														className='text-center text-xs'
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
														className='flex flex-row justify-start items-center text-xs'
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
										} else if (cell.column.columnDef.header === t('총정산금')) {
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
										} else if (cell.column.columnDef.header === t('실제수익')) {
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
										} else if (cell.column.columnDef.header === t('상부계정')) {
											return (
												<td
													key={`createdAt_${cell.id}`}
													className='px-4 py-2 text-xs text-left sticky left-0 cursor-pointer text-gray-900 bg-gray-100'
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
	);
};
