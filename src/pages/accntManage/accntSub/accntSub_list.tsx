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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
	IAccntSubAccntRes,
	SUBACCNT_MEMBERS_GET,
} from '../../../common/api/queries/accnt_query';
import {
	limitModal,
	my_user_id,
	roleAccountData,
	roleAccountDatalist,
	sRModal,
} from '../../../common/apollo';
import { dateTimeFormatter } from '../../../common/functions/dateTimeFormatter';
import { Button } from '../../../components/button';
import { AccntSubBetLimitModal } from './modal/accntSubBetlimit_modal';
import { AccntSubSRModal } from './modal/accntSubSR_modal';

export const AccntSubList = () => {
	const { t } = useTranslation(['page']);
	const { handleSubmit } = useForm();
	const navigate = useNavigate();
	const onClickAccntReg = () => {
		navigate('/subAccnt-register');
	};

	const [idQueryPath, setIdQueryPath] = useState('');

	const data = useReactiveVar(roleAccountDatalist);
	const myId = useReactiveVar(my_user_id);
	const betLimitModal = useReactiveVar(limitModal);
	const srModal = useReactiveVar(sRModal);
	useReactiveVar(roleAccountData);

	const columnHelper = createColumnHelper<IAccntSubAccntRes>();

	const onClickRoleAccntModModal = (data: IAccntSubAccntRes) => {
		roleAccountData(data);
		navigate('/subAccnt-mod');
	};

	const idOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdQueryPath(e.target.value);
	};

	const getRoleAccntList = () => {
		SUBACCNT_MEMBERS_GET(String(myId))
			.then((res: AxiosResponse | any) => {
				if (res.data.data) {
					roleAccountDatalist(res.data.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onSearchClick = () => {
		if (idQueryPath === '') {
			getRoleAccntList();
		} else {
			SUBACCNT_MEMBERS_GET(String(myId))
				.then((res: AxiosResponse | any) => {
					if (res.data) {
						const fetchedroleAccountDatalist = res.data.data;
						roleAccountDatalist(fetchedroleAccountDatalist);
						return fetchedroleAccountDatalist;
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
				.then((res: IAccntSubAccntRes[] | void) => {
					if (res) {
						const roleAccntArr: IAccntSubAccntRes[] = res.filter((elem) => {
							return elem.user_id === idQueryPath;
						});

						if (roleAccntArr.length === 0) {
							alert('유효하지 않는 계정명');
						} else {
							roleAccountDatalist(roleAccntArr);
						}
					}
				});
		}
	};

	const columns = [
		columnHelper.accessor('user_id', {
			header: String(t('계정명')),
		}),
		columnHelper.accessor('nickname', {
			header: String(t('닉네임')),
		}),
		columnHelper.accessor('account_role_type', {
			header: String(t('권한')),
		}),
		columnHelper.accessor('sub_master_id', {
			header: String(t('메인계정')),
		}),
		columnHelper.accessor('phone', {
			header: String(t('전화번호')),
		}),
		columnHelper.accessor('created_at', {
			header: String(t('생성일')),
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
		table.setPageSize(Number(10));
		getRoleAccntList();
	}, []);
	return (
		<div>
			<div className='border rounded-md mt-5 shadow-md'>
				<div className='flex flex-row justify-between items-center border-b bg-gray-100'>
					<div className='w-full flex flex-wrap flex-row justify-between gap-3 items-center px-3 my-3'>
						<div className='w-full sm:w-48' onClick={onClickAccntReg}>
							<Button canClick={true} actionText={t('계정 생성')} />
						</div>
						<form
							className='flex items-center'
							onSubmit={handleSubmit(() => onSearchClick())}
						>
							<div className='form-group gap-3 flex'>
								<input
									type='text'
									className='forminput pr-10 w-full sm:w-full'
									placeholder={String(t('계정명 입력'))}
									onChange={idOnChange}
								/>
								<div>
									<Button canClick={true} actionText={t('검색')} />
								</div>
							</div>
						</form>
					</div>
				</div>
				<div
					className='flex flex-col overflow-x-scroll'
					style={{ backgroundColor: '#245c81' }}
				>
					<div className='whitespace-nowrap'>
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
														className='text-sm text-left font-bold text-white px-4 py-2'
													>
														<div
															key={`icon_${header.index}`}
															className='flex flex-row justify-start items-center text-sm'
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
												// MY CODES
											} else if (
												header.column.columnDef.header === t('계정명')
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
														className='text-sm text-left font-bold text-white px-4 py-2'
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
										<th
											style={{ cursor: 'default' }}
											className='text-xs text-center font-bold text-white px-4 py-2 w-16'
										>
											{t('수정')}
										</th>
									</tr>
								))}
								{/* DONT TOUCH BELOW IF THIS ONE */}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row, index) => (
									<tr
										key={row.id}
										className='even:bg-white odd:bg-gray-100 text-xs relative'
									>
										{row.getVisibleCells().map((cell) => {
											if (cell.column.columnDef.header === '생성일') {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-left'
													>
														{dateTimeFormatter(
															String(cell.row.original.created_at)
														)}
													</td>
												);
											} else if (cell.column.columnDef.header === '권한') {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-left font-semibold text-gray-900 whitespace-nowrap'
													>
														{row.original.account_role_type === 'E'
															? '편집'
															: '보기'}
													</td>
												);
											} else if (cell.column.columnDef.header === t('계정명')) {
												return (
													<td
														key={cell.id}
														className={`px-4 py-2 text-xs text-left font-medium cursor-pointer sticky left-0 ${
															row.original.account_type === 'A'
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
														className='px-4 py-2 text-xs text-left font-medium text-gray-900 whitespace-nowrap'
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
											<div className='flex justify-center py-1'>
												<div
													className='border rounded text-sm py-1 px-2.5 font-semibold text-white cursor-pointer bg-orange-500 whitespace-nowrap'
													onClick={() => onClickRoleAccntModModal(row.original)}
												>
													{t('수정')}
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
			{betLimitModal ? <AccntSubBetLimitModal /> : null}
			{srModal ? <AccntSubSRModal /> : null}
		</div>
	);
};
