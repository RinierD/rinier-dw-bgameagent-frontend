import React, { useEffect, useState } from 'react';

import * as xlsx from 'xlsx';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { dateTimeFormatter } from '../../../common/functions/dateTimeFormatter';
import { IUserLogRes } from '../../../common/api/queries/userLog_query';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { useReactiveVar } from '@apollo/client';
import { userLogData } from '../../../common/apollo';

export const UserLogList = () => {
	const { t } = useTranslation(['page']);

	const data = useReactiveVar(userLogData);

	const excelDownload = (data: any) => {
		const ws = xlsx.utils.json_to_sheet(data);
		const wb = xlsx.utils.book_new();

		xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
		xlsx.writeFile(wb, `UserLog_${Date.now()}.xlsx`);
	};

	const columnHelper = createColumnHelper<IUserLogRes>();
	const columns = [
		columnHelper.accessor('user_id', {
			header: String(t('실행계정')),
		}),
		columnHelper.accessor('execute_type', {
			header: String(t('실행유형')),
		}),
		columnHelper.accessor('related_user', {
			header: String(t('연관계정')),
		}),
		columnHelper.accessor('created_at', {
			header: String(t('시간')),
		}),
		columnHelper.accessor('ip', {
			header: String(t('IP')),
		}),
		columnHelper.accessor('remark', {
			header: String(t('비고')),
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	useEffect(() => {}, []);

	return (
		<div>
			<div className='border rounded-md mt-5 shadow-md'>
				<div className='flex flex-row justify-between items-center border-b bg-gray-100'>
					<div className='w-full flex gap-3 justify-between items-center'>
						<div>
							<button
								className='text-gray-600 bg-white border border-gray-400 text-sm ml-3 my-2 px-2 py-1 rounded-sm flex items-center justify-center whitespace-nowrap'
								onClick={() => excelDownload(data)}
							>
								<div className='mr-1 text-base text-green-700'>
									<SiMicrosoftexcel />
								</div>
								<div className='mx-auto font-bold'>{t('다운로드')}</div>
							</button>
						</div>
						<div className='flex items-center mr-3'>
							<div className='text-sm mr-3'>{t('표시개수')}: </div>
							<div>
								<select
									className='forminput'
									value={table.getState().pagination.pageSize}
									onChange={(e) => {
										table.setPageSize(Number(e.target.value));
									}}
								>
									{[10, 20, 50].map((pageSize) => (
										<option key={pageSize} value={pageSize}>
											{pageSize}
										</option>
									))}
									<option key='all' value={data.length}>
										all
									</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div className='flex flex-col overflow-x-scroll'>
					<div className='flex flex-row justify-start items-center text-sm whitespace-nowrap'>
						<table className='w-full highlight'>
							<thead
								className='border-b'
								style={{ backgroundColor: '#245c81' }}
							>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header, index) => {
											if (
												header.column.columnDef.header === '베팅금액' ||
												header.column.columnDef.header === '윈로스' ||
												header.column.columnDef.header === '롤링'
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
														className='text-sm text-left font-bold text-white px-4 py-2'
													>
														<div
															key={`icon_${header.index}`}
															className='flex flex-row justify-start items-center text-sm whitespace-nowrap'
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
												header.column.columnDef.header === t('실행계정')
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
														className='text-sm text-center font-bold text-white px-4 py-2'
													>
														<div
															key={`icon_${header.index}`}
															className='flex flex-row justify-start items-center text-xs whitespace-nowraps'
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
										className='even:bg-scroll odd:bg-scroll even:bg-white odd:bg-gray-100 text-xs hover:bg-opacity-20 hover:bg-black hover:table-fixed'
									>
										{row.getVisibleCells().map((cell) => {
											if (cell.column.columnDef.header === '시간') {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-2 py-3 text-xs text-left text-gray-900'
													>
														{dateTimeFormatter(
															String(cell.row.original.created_at)
														)}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('실행계정')
											) {
												return (
													<td
														key={cell.id}
														className={`px-4 py-2 text-xs text-left font-medium sticky left-0 ${
															row.original.execute_type === 'A'
																? 'text-blue-500 underline cursor-pointer'
																: 'text-gray-900'
														}  `}
													>
														{row.original.user_id}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('실행유형')
											) {
												return (
													<td
														key={cell.id}
														className={`px-4 py-2 text-xs text-left font-medium ${
															row.original.execute_type === 'A'
																? 'text-blue-500 underline cursor-pointer'
																: 'text-gray-900'
														} ${
															index % 2 === 1
																? 'even:bg-gray-10'
																: 'odd:bg-gray-10'
														} `}
													>
														{row.original.execute_type === 'SL'
															? t('관리자로그인')
															: row.original.execute_type === 'PC'
															? t('페스워드수정')
															: row.original.execute_type === 'RS'
															? t('롤링/쉐어 수정')
															: row.original.execute_type === 'VI'
															? t('계정상태수정')
															: row.original.execute_type === 'RA'
															? t('서브계정 추가')
															: row.original.execute_type === 'SA'
															? t('하부계정 추가')
															: row.original.execute_type === 'RM'
															? t('서브계정 수정')
															: row.original.execute_type === 'SM'
															? t('하부계정 수정')
															: row.original.execute_type === 'GL'
															? t('게임로그인')
															: row.original.execute_type === 'GP'
															? t('게임비밀번호 수정')
															: 'n/a'}
													</td>
												);
											} else {
												return (
													<td
														key={cell.id}
														className='px-2 py-2 text-xs text-left font-base text-gray-900'
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
