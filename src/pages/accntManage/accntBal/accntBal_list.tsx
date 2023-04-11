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
import {
	IAcctInfoRes,
	MEMBER_INFO_GET,
	SUB_MEMBERS_GET_SUM,
} from '../../../common/api/queries/accnt_query';
import {
	accntGeneralData,
	accntGeneralDataBal,
	loggedInMemberData,
	my_user_id,
	parentIdList,
	subAccountDatalist,
} from '../../../common/apollo';
import { Button } from '../../../components/button';
import { useForm } from 'react-hook-form';

export const AccntBalList = () => {
	const { t } = useTranslation(['page']);

	const { handleSubmit } = useForm();

	const [idQueryPath, setIdQueryPath] = useState('');

	const myId = useReactiveVar(my_user_id);
	const data = useReactiveVar(accntGeneralDataBal);
	const myData = useReactiveVar(loggedInMemberData);
	useReactiveVar(accntGeneralData);

	const idOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdQueryPath(e.target.value);
	};

	const getMemberInfo = () => {
		MEMBER_INFO_GET(String(myId)).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				accntGeneralDataBal([res.data.data]);
			}
		});
	};

	const onClickAgentId = (agentId: string) => {
		MEMBER_INFO_GET(agentId).then((res: AxiosResponse | any) => {
			if (res.data) {
				accntGeneralDataBal([res.data.data]);
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
					alert(t('invalid member name'));
				} else {
					alert('invalid member name');
				}
			} else {
				alert('invalid member name');
			}
		});
		SUB_MEMBERS_GET_SUM(agentId)
			.then((res: AxiosResponse | any) => {
				if (res.data.data.length !== 0) {
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
									accntGeneralDataBal([res.data.data]);
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
		if (agentId === '') return;
		if (agentId.includes(' ')) return;
		onSearchMember(agentId);
	};

	const columnHelper = createColumnHelper<IAcctInfoRes>();
	const columns = [
		columnHelper.accessor('user_id', {
			header: String(t('상부계정')),
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

	useEffect(() => {
		getMemberInfo();
		table.setPageSize(20);
	}, []);
	return (
		<div>
			<div className='border rounded-md mt-5 shadow-md'>
				<div className='flex flex-row justify-between items-center border-b bg-gray-100'>
					<div className='w-full flex flex-row justify-end gap-3 mr-3 items-center mx-3 my-3'>
						<form onSubmit={handleSubmit(() => onSubmit(idQueryPath))}>
							<div className='flex items-center'>
								<div className='form-group gap-3 flex'>
									<input
										type='text'
										className='forminput pr-10 w-full sm:w-full'
										placeholder={String(t('계정명 입력'))}
										onChange={idOnChange}
									/>
								</div>
								<div className='pl-3'>
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
					<div className=''>
						<table className='w-full'>
							<thead className='border-b'>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header, index) => {
											if (
												header.column.columnDef.header === t('잔액') ||
												header.column.columnDef.header === t('하부잔액') ||
												header.column.columnDef.header === t('보너스') ||
												header.column.columnDef.header === t('하부 보너스') ||
												header.column.columnDef.header === t('총 보너스') ||
												header.column.columnDef.header === t('총잔액')
											) {
												return (
													<th
														key={`sort_${index}`}
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
														</div>
													</th>
												);
											}
										})}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className='even:bg-white odd:bg-gray-100 text-xs'
									>
										{row.getVisibleCells().map((cell) => {
											if (cell.column.columnDef.header === t('쉐어')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-left text-gray-900'
													>
														{`${cell.row.original.baccarat_share} %`}
													</td>
												);
											} else if (cell.column.columnDef.header === t('롤링')) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-3 text-xs text-left text-gray-900'
													>
														{`${cell.row.original.baccarat_rolling} %`}
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
												cell.column.columnDef.header === t('상부계정')
											) {
												return (
													<td
														key={`createdAt_${cell.id}`}
														className='px-4 py-2 text-xs text-left sticky left-0 text-gray-900 bg-gray-100'
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
		</div>
	);
};
