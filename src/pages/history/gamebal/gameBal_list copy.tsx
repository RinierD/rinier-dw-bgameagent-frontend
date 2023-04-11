import React, { useEffect, useState } from 'react';
import { IGameBalChangeRes } from '../../../common/api/queries/game_query';
import * as xlsx from 'xlsx';
import { DatePicker } from 'antd';
import locale from 'antd/lib/locale/ko_KR';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { Dayjs } from 'dayjs';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Button } from '../../../components/button';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { dateTimeFormatter } from '../../../common/functions/dateTimeFormatter';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
dayjs.locale('ko');

export const GameBalListCopy = () => {
	const { t } = useTranslation(['page']);
	const [mockData, setMockData] = useState<IGameBalChangeRes[]>([]);

	const data = mockData;

	const excelDownload = (data: any) => {
		const ws = xlsx.utils.json_to_sheet(data);
		const wb = xlsx.utils.book_new();

		xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
		xlsx.writeFile(wb, `winloss_${Date.now()}.xlsx`);
	};

	const columnHelper = createColumnHelper<IGameBalChangeRes>();
	const columns = [
		columnHelper.accessor('accountName', {
			header: String(t('계정')),
		}),
		columnHelper.accessor('nickName', {
			header: String(t('닉네임')),
		}),
		columnHelper.accessor('shoeNum', {
			header: String(t('게임번호')),
		}),
		columnHelper.accessor('type', {
			header: String(t('금액유형')),
		}),
		columnHelper.accessor('initialBal', {
			header: String(t('변경전')),
		}),
		columnHelper.accessor('amount', {
			header: String(t('변경금액')),
		}),
		columnHelper.accessor('resultBal', {
			header: String(t('변경후')),
		}),
		columnHelper.accessor('created_at', {
			header: String(t('시간')),
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

	const mockDataGen = () => {
		const dataGen = [];
		for (let i = 0; i < 1000; i++) {
			dataGen.push({
				id: String(i),
				accountName: `test${i}`,
				nickName: `testnick${i}`,
				created_at: '2023-02-16 18:54:34',
				type: '베팅',
				initialBal: Math.floor(Math.random() * 900000 + 10000),
				amount: Math.floor(Math.random() * 900000 + 1000),
				resultBal: Math.floor(Math.random() * 900000 + 10000),
				shoeNum: 'shoe123123321',
				orderNum: 'order12356987',
				remark: `${
					Math.floor(Math.random() * 4 + 1) === 1
						? '테이블:RP001, 베팅: 50,000'
						: Math.floor(Math.random() * 4 + 1) === 2
						? '테이블:RP001, 지급: 45,000'
						: Math.floor(Math.random() * 4 + 1) === 3
						? '베팅취소, 리턴: 50,000'
						: '게임취소, 리턴: 50,000'
				}`,
			});
		}
		setMockData(dataGen);
	};

	useEffect(() => {
		mockDataGen();
	}, []);
	return (
		<div>
			<div className='flex flex-col border rounded-md mt-5 shadow-md '>
				<div className='flex flex-row justify-between items-center border-b bg-gray-100'>
					<div className='w-full flex gap-3 justify-between items-center'>
						<div>
							<button
								className='text-gray-600 bg-white border border-gray-400 text-sm ml-3 my-2 px-2 py-1 rounded-sm flex items-center justify-center'
								onClick={() => excelDownload(data)}
							>
								<div className='mr-1 text-base text-green-700'>
									<SiMicrosoftexcel />
								</div>
								<div className=' font-bold'>{t('다운로드')}</div>
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
						<table className='w-full'>
							<thead
								className='border-b'
								style={{ backgroundColor: '#245c81' }}
							>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header, index) => {
											if (
												header.column.columnDef.header === t('변경전') ||
												header.column.columnDef.header === t('변경금액') ||
												header.column.columnDef.header === t('변경후')
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
											} else if (header.column.columnDef.header === t('계정')) {
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
															className='text-center text-xs whitespace-nowrap'
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
										className='even:bg-white odd:bg-gray-100 text-xs'
									>
										{row.getVisibleCells().map((cell) => {
											if (cell.column.columnDef.header === t('변경전')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-2 py-3 text-xs text-right text-gray-900'
													>
														{cell.row.original.initialBal.toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('변경금액')
											) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-2 py-3 text-xs text-right text-gray-900'
													>
														{cell.row.original.amount.toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('변경후')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-2 py-3 text-xs text-right text-gray-900'
													>
														{cell.row.original.resultBal.toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('계정')) {
												return (
													<td
														key={cell.id}
														className={`px-4 py-2 text-xs text-left font-medium sticky left-0 ${
															row.original.accountName === 'A'
																? 'text-blue-500 underline cursor-pointer'
																: 'text-gray-900'
														} ${index % 2 === 1 ? 'bg-white' : 'bg-gray-100'} `}
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
