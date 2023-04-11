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
import { dateTimeFormatter } from '../../../common/functions/dateTimeFormatter';

import * as xlsx from 'xlsx';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useTranslation } from 'react-i18next';
import { useReactiveVar } from '@apollo/client';
import { my_user_id, slotGameHistoryData } from '../../../common/apollo';
import { ISlotGameHistoryRes } from '../../../common/api/queries/slot_query';
import { parentIdProcessor } from '../../../common/functions/parentIdProcessor';

export const GameHistoryList = () => {
	const { t } = useTranslation(['page']);

	const [betTotal, setBetTotal] = useState(0);
	const [winlossTotal, setWinlossTotal] = useState(0);
	const [betSubTotal, setBetSubTotal] = useState(0);
	const [winlossSubTotal, setWinlossSubTotal] = useState(0);

	const myUserId = useReactiveVar(my_user_id);
	const data = useReactiveVar(slotGameHistoryData);

	const excelDownload = (data: any) => {
		const ws = xlsx.utils.json_to_sheet(parentIdProcessor(data));
		const wb = xlsx.utils.book_new();

		xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
		xlsx.writeFile(wb, `GameHistory_${Date.now()}.xlsx`);
	};

	const columnHelper = createColumnHelper<ISlotGameHistoryRes>();
	const columns = [
		columnHelper.accessor('user_id', {
			header: String(t('계정')),
		}),
		columnHelper.accessor('nickname', {
			header: String(t('닉네임')),
		}),
		columnHelper.accessor('junketName', {
			header: String(t('정켓이름')),
		}),
		columnHelper.accessor('game_id', {
			header: String(t('게임번호')),
		}),
		columnHelper.accessor('type', {
			header: String(t('게임유형')),
		}),
		columnHelper.accessor('egm_id', {
			header: String(t('테이블번호')),
		}),
		columnHelper.accessor('slot_coin_in', {
			header: String(t('베팅금액')),
		}),
		columnHelper.accessor('slot_coin_out', {
			header: String(t('정산금액')),
		}),
		columnHelper.accessor('slot_datetime', {
			header: String(t('게임시간')),
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const totalCal = () => {
		let betSubCal = 0;
		let winlossSubCal = 0;
		let betCal = 0;
		let winlossCal = 0;

		for (let elem of table.getRowModel().rows) {
			betSubCal += elem.original.slot_coin_in;
			winlossSubCal += elem.original.slot_coin_out;
		}
		for (let elem of data) {
			betCal += elem.slot_coin_in;
			winlossCal += elem.slot_coin_out;
		}

		setBetSubTotal(betSubCal);
		setWinlossSubTotal(winlossSubCal);
		setBetTotal(betCal);
		setWinlossTotal(winlossCal);
	};

	useEffect(() => {}, []);

	useEffect(() => {
		totalCal();
	}, [
		data,
		table.getState().pagination.pageIndex,
		table.getState().pagination.pageSize,
	]);

  return (
    <div>
      <div className="border rounded-md mt-5 shadow-md">
        <div className="flex flex-row justify-between items-center border-b bg-gray-100">
          <div className="w-full flex gap-3 justify-between items-center">
            <div>
              <button
                className="text-gray-600 bg-white border border-gray-400 text-sm ml-3 my-2 px-2 py-1 rounded-sm flex items-center justify-center whitespace-nowrap"
                onClick={() => excelDownload(data)}
              >
                <div className="mr-1 text-base text-green-700 ">
                  <SiMicrosoftexcel />
                </div>
                <div className=" font-bold">{t('다운로드')}</div>
              </button>
            </div>
            <div className="flex items-center mr-3">
              <div className="text-sm mr-3">{t('표시개수')}: </div>
              <div>
                <select
                  className="forminput"
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
                  <option key="all" value={data.length}>
                    all
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col overflow-x-scroll">
          <div className="">
            <table className="w-full">
              <thead className="" style={{ backgroundColor: '#245c81' }}>
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
                            className="text-sm text-left font-bold text-white px-4 py-2 sticky left-0"
                          >
                            <div
                              key={`icon_${header.index}`}
                              className="flex flex-row justify-start items-center text-xs whitespace-nowrap"
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
                        header.column.columnDef.header === t('베팅금액') ||
                        header.column.columnDef.header === t('정산금액')
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
                            className="text-sm text-right font-bold text-white px-4 py-2 sticky left-0"
                          >
                            <div
                              key={`icon_${header.index}`}
                              className="flex flex-row justify-end items-center text-xs whitespace-nowrap"
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
                            className="text-sm text-center font-bold text-white px-4 py-2 whitespace-nowrap"
                          >
                            <div
                              key={`icon_${header.index}`}
                              className="flex flex-row justify-start items-center text-xs"
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
                <tr className="font-semibold bg-sky-700 border-b border-gray-400 bg-opacity-20">
                  <td
                    className="pl-4 py-1 sticky left-0"
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
                  <td>
                    <div className="text-right text-sm px-4">
                      {Number(betTotal / 100).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    {' '}
                    <div className="text-right text-sm px-4">
                      {Number(winlossTotal / 100).toLocaleString()}
                    </div>
                  </td>
                  <td></td>
                </tr>
                <tr className="font-semibold bg-sky-700 border-b border-gray-400 bg-opacity-20">
                  <td
                    className="pl-4 py-1 sticky left-0"
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
                  <td>
                    <div className="text-right text-sm px-4">
                      {Number(betSubTotal / 100).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    {' '}
                    <div className="text-right text-sm px-4">
                      {Number(winlossSubTotal / 100).toLocaleString()}
                    </div>
                  </td>
                  <td></td>
                </tr>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="even:bg-white odd:bg-gray-100 text-sm"
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.columnDef.header === t('게임시간')) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className="px-4 py-2 text-xs text-left text-gray-900 whitespace-nowrap"
                          >
                            {dateTimeFormatter(
                              String(cell.row.original.slot_datetime)
                            )}
                          </td>
                        );
                      } else if (
                        cell.column.columnDef.header === t('베팅금액')
                      ) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className="px-4 py-2 text-xs text-right text-gray-900 whitespace-nowrap"
                          >
                            {(
                              cell.row.original.slot_coin_in / 100
                            ).toLocaleString()}
                          </td>
                        );
                      } else if (cell.column.columnDef.header === t('닉네임')) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className="px-4 py-2 text-xs text-left text-gray-900 whitespace-nowrap"
                          >
                            {cell.row.original.nickname}
                          </td>
                        );
                      } else if (
                        cell.column.columnDef.header === t('정산금액')
                      ) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className="px-4 py-2 text-xs text-right text-gray-900 whitespace-nowrap"
                          >
                            {(
                              cell.row.original.slot_coin_out / 100
                            ).toLocaleString()}
                          </td>
                        );
                      } else if (
                        cell.column.columnDef.header === t('게임유형')
                      ) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className="px-4 py-2 text-xs text-left text-gray-900 whitespace-nowrap"
                          >
                            {row.original.type === 'SG'
                              ? t('슬롯')
                              : row.original.type}
                          </td>
                        );
                      } else if (cell.column.columnDef.header === t('계정')) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className={`px-4 py-2 text-xs text-left text-gray-900 whitespace-nowrap sticky left-0 ${
                              index % 2 === 1 ? 'bg-white' : 'bg-gray-100'
                            } `}
                          >
                            {cell.row.original.user_id}
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={cell.id}
                            className="px-4 py-2 text-xs text-left font-base text-gray-900 whitespace-nowrap"
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
      <div className="flex flex-col justify-center gap-2 sm:flex-row">
        <div className="flex items-center mt-3 gap-2 justify-center">
          <button
            className="border border-gray-300 rounded py-1 px-2 font-medium cursor-pointer"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border border-gray-300 rounded py-1 px-2 font-medium cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="border border-gray-300 rounded py-1 px-2 font-medium cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="border border-gray-300 rounded py-1 px-2 font-medium cursor-pointer"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
        <div className="flex items-center mt-3 gap-2 justify-center">
          <span className="flex items-center gap-1 font-medium">
            <div>{t('페이지')}</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} /{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1 font-medium">
            | {t('페이지')}:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
        </div>
      </div>
    </div>
  );
};
