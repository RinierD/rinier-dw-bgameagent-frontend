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
import {
	IGameHistoryRes,
	IGameResponse,
} from '../../../common/api/queries/game_query';
import { dateTimeFormatter } from '../../../common/functions/dateTimeFormatter';
import { Button } from '../../../components/button';

import * as xlsx from 'xlsx';
import { DatePicker } from 'antd';
import locale from 'antd/lib/locale/ko_KR';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { Dayjs } from 'dayjs';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import {
	IGameHistoryResData,
	SLOT_GAME_HISTORY,
} from '../../../common/api/mutations/game_mutations';
import { AxiosResponse } from 'axios';
dayjs.locale('ko');

export const GameHistoryListCopy = () => {
	const { t } = useTranslation(['page']);
	// const data = dummyData.gameHistoryData;
	const [mockData, setMockData] = useState<IGameHistoryRes[]>([]);
	const [data, setData] = useState<IGameHistoryResData[]>([]);

	const [betTotal, setBetTotal] = useState(0);
	const [winlossTotal, setWinlossTotal] = useState(0);
	const [rollingTotal, setRollingTotal] = useState(0);
	const [betSubTotal, setBetSubTotal] = useState(0);
	const [winlossSubTotal, setWinlossSubTotal] = useState(0);
	const [rollingSubTotal, setRollingSubTotal] = useState(0);

	const excelDownload = (data: any) => {
		const ws = xlsx.utils.json_to_sheet(data);
		const wb = xlsx.utils.book_new();

		xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
		xlsx.writeFile(wb, `winloss_${Date.now()}.xlsx`);
	};

	const columnHelper = createColumnHelper<IGameHistoryRes>();
	const columns = [
		columnHelper.accessor('accountName', {
			header: String(t('계정')),
		}),
		columnHelper.accessor('nickName', {
			header: String(t('닉네임')),
		}),
		columnHelper.accessor('started_at', {
			header: String(t('시작시간')),
		}),
		columnHelper.accessor('shoeNum', {
			header: String(t('게임번호')),
		}),
		columnHelper.accessor('junket_code', {
			header: String(t('정켓')),
		}),
		columnHelper.accessor('game_type', {
			header: String(t('게임유형')),
		}),
		columnHelper.accessor('table_num', {
			header: String(t('테이블')),
		}),
		columnHelper.accessor('bet_type', {
			header: String(t('베팅유형')),
		}),
		columnHelper.accessor('bet_amount', {
			header: String(t('베팅금액')),
		}),
		columnHelper.accessor('game_result', {
			header: String(t('게임결과')),
		}),
		columnHelper.accessor('winloss', {
			header: String(t('윈로스')),
		}),
		columnHelper.accessor('settlement_status', {
			header: String(t('정산상태')),
		}),
		columnHelper.accessor('settled_at', {
			header: String(t('정산시간')),
		}),
	];

	const table = useReactTable({
		data: mockData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const mockDataGen = () => {
		const dataGen = [];
		for (let i = 0; i < 100; i++) {
			dataGen.push({
				id: String(i),
				accountName: `test${i}`,
				nickName: `testnick${i}`,
				started_at: '2023-02-16 18:54:34',
				shoeNum: 'shoe12312343',
				junket_code: 'RIZAL PARK',
				game_type: `${
					Math.floor(Math.random() * 3 + 1) === 1
						? t('폰벳')
						: Math.floor(Math.random() * 3 + 1) === 2
						? t('스피드')
						: t('슬롯')
				}`,
				table_num: 'RP001',
				bet_type: t('플레이어'),
				bet_amount: Math.floor(Math.random() * 900000 + 10000),
				game_result: t('뱅커 승'),
				winloss: Math.floor(Math.random() * 900000 + 10000),
				settlement_status: t('정산'),
				settled_at: '2023-02-16 18:54:34',
			});
		}

		let betCal = 0;
		let winlossCal = 0;
		let rollingCal = 0;

		for (let elem of dataGen) {
			betCal += elem.bet_amount;
			winlossCal += elem.winloss;
			// rollingCal += elem.rolling;
		}

		setBetTotal(betCal);
		setWinlossTotal(winlossCal);
		setRollingTotal(rollingCal);
		setMockData(dataGen);
	};

	const subtotalCal = () => {
		let betCal = 0;
		let winlossCal = 0;
		let rollingCal = 0;

		for (let elem of table.getRowModel().rows) {
			betCal += elem.original.bet_amount;
			winlossCal += elem.original.winloss;
			// rollingCal += elem.original.rolling;
		}

		setBetSubTotal(betCal);
		setWinlossSubTotal(winlossCal);
		setRollingSubTotal(rollingCal);
	};

	const getGameHistory = () => {
		const data = {
			startTime: '2023-03-20 00:00:00',
			endTime: '',
			playerId: 'dwtest007',
			egmId: '',
			page: 0,
			pageSize: 100000,
		};

		SLOT_GAME_HISTORY(data)
			.then((res: AxiosResponse | any) => {
				if (res.data) {
					alert(`${res.data.data.user_id} registered`);
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

	useEffect(() => {
		mockDataGen();
	}, []);

	useEffect(() => {
		subtotalCal();
	}, [
		mockData,
		table.getState().pagination.pageIndex,
		table.getState().pagination.pageSize,
	]);

	return (
		<div>
			<div className='border rounded-md mt-5 shadow-md'>
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
					<div className=''>
						<table className='w-full'>
							<thead className='' style={{ backgroundColor: '#245c81' }}>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header, index) => {
											if (
												header.column.columnDef.header === t('계정') ||
												header.column.columnDef.header === t('롤링')
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
														className='text-sm text-left font-bold text-white px-4 py-2 sticky left-0'
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
														className='text-sm text-center font-bold text-white px-4 py-2 whitespace-nowrap'
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
								<tr className='font-semibold bg-sky-700 border-b border-gray-400 bg-opacity-20'>
									<td
										className='pl-4 py-1 sticky left-0'
										style={{
											backgroundColor: '#CDE1EC',
										}}
									>
										{t('총계')}
									</td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td>
										<div className='text-right text-sm px-4'>
											{Number(betTotal).toLocaleString()}
										</div>
									</td>
									<td></td>
									<td>
										{' '}
										<div className='text-right text-sm px-4'>
											{Number(winlossTotal).toLocaleString()}
										</div>
									</td>
									<td></td>
									<td></td>
									{/* <td>
                    {' '}
                    <div className='text-right text-sm px-4'>
                      {Number(rollingTotal).toLocaleString()}
                    </div>
                  </td> */}
								</tr>
								<tr className='font-semibold bg-sky-700 border-b border-gray-400 bg-opacity-20'>
									<td
										className='pl-4 py-1 sticky left-0'
										style={{
											backgroundColor: '#CDE1EC',
										}}
									>
										{t('소계')}
									</td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td>
										<div className='text-right text-sm px-4'>
											{Number(betSubTotal).toLocaleString()}
										</div>
									</td>
									<td></td>
									<td>
										{' '}
										<div className='text-right text-sm px-4'>
											{Number(winlossSubTotal).toLocaleString()}
										</div>
									</td>
									<td></td>
									<td></td>
									{/* <td>
                    {' '}
                    <div className='text-right text-sm px-4'>
                      {Number(rollingSubTotal).toLocaleString()}
                    </div>
                  </td> */}
								</tr>
								{table.getRowModel().rows.map((row, index) => (
									<tr
										key={row.id}
										className='even:bg-white odd:bg-gray-100 text-sm'
									>
										{row.getVisibleCells().map((cell) => {
											if (cell.column.columnDef.header === t('시작시간')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-left text-gray-900 whitespace-nowrap'
													>
														{dateTimeFormatter(
															String(cell.row.original.started_at)
														)}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('베팅금액')
											) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-right text-gray-900 whitespace-nowrap'
													>
														{cell.row.original.bet_amount.toLocaleString()}
													</td>
												);
											} else if (cell.column.columnDef.header === t('윈로스')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-sm text-right text-gray-900 whitespace-nowrap'
													>
														{cell.row.original.winloss.toLocaleString()}
													</td>
												);
											} else if (
												cell.column.columnDef.header === t('계정') ||
												cell.column.columnDef.header === t('롤링')
											) {
												return (
													<td
														key={cell.id}
														className={`px-4 py-2 text-xs text-left font-base text-gray-900 whitespace-nowrap sticky left-0 ${
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
														className='px-4 py-2 text-xs text-left font-base text-gray-900 whitespace-nowrap'
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
