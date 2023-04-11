import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { IOnlineUserRes } from '../../../common/api/queries/onlineUser_query';
import { dateTimeFormatter } from '../../../common/functions/dateTimeFormatter';
import { Button } from '../../../components/button';
import dummyData from '../dummydata_accntGen.json';

export const AccntOnlineList = () => {
  const { t } = useTranslation(['page']);
  const data = dummyData.onlineUser;

  const columnHelper = createColumnHelper<IOnlineUserRes>();
  const columns = [
    columnHelper.accessor('accountName', {
      header: String(t('계정')),
    }),
    columnHelper.accessor('nickname', {
      header: String(t('닉네임')),
    }),
    columnHelper.accessor('parentAccnts', {
      header: String(t('상부에이전트')),
    }),
    columnHelper.accessor('gameType', {
      header: String(t('게임유형')),
    }),
    columnHelper.accessor('loginTime', {
      header: String(t('로그인시간')),
    }),
    columnHelper.accessor('loginIp', {
      header: String(t('로그인IP')),
    }),
    columnHelper.accessor('gameBalance', {
      header: String(t('게임잔액')),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="border rounded-md mt-5 shadow-md">
        <div className="flex flex-row justify-between items-center border-b bg-gray-100">
          <div className="w-full flex flex-wrap flex-row justify-end gap-3 items-center mx-3 my-3">
            {/* <div className="flex opacity-0">
              <div>{t("표시개수")}</div>
              <div>
                <select
                  className="forminput"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  <option value={20}> 20 </option>
                  {[10, 5, 2].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}
            <div className="text-base font-medium">{t('게임유형')} :</div>
            <div className="">
              <select className="forminput">
                <option value="">{t('전체')}</option>
                <option value="B">{t('바카라')}</option>
                <option value="S">{t('슬롯')}</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <div className="form-group flex">
                <input
                  type="text"
                  className="forminput pr-10 w-full sm:w-full"
                  placeholder={String(t('계정명 입력'))}
                />
              </div>
              <div>
                <Button canClick={true} actionText={t('검색')} />
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col overflow-x-scroll"
          style={{ backgroundColor: '#245c81' }}
        >
          <div className="flex flex-row justify-start items-center text-sm whitespace-nowrap">
            <table className="w-full">
              <thead className="border-b">
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
                            className="text-base text-center font-bold text-white px-4 py-2"
                          >
                            <div
                              key={`icon_${header.index}`}
                              className="flex flex-row justify-end items-center text-xs"
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
                        header.column.columnDef.header === t('로그인IP')
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
                            className="text-base text-left font-bold text-white px-4 py-2"
                          >
                            <div
                              key={`icon_${header.index}`}
                              className="text-left text-xs"
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
                            className="text-base text-center font-bold text-white px-4 py-2"
                          >
                            <div
                              key={`icon_${header.index}`}
                              className="text-center text-xs"
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
                            className="text-base text-center font-bold text-white px-4 py-2 sticky left-0"
                          >
                            <div
                              key={`icon_${header.index}`}
                              className="text-left text-xs whitespace-nowrap"
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
                            className="text-base text-center font-bold text-white px-4 py-2"
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
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="even:bg-white odd:bg-gray-100 text-xs"
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.columnDef.header === t('계정유형')) {
                        return (
                          <td
                            key={`cell_${cell.id}`}
                            className="px-4 py-2 text-xs text-left"
                          >
                            {
                              <div
                                className={`font-extrabold ${
                                  cell.row.original.gameBalance === 1
                                    ? 'text-blue-600'
                                    : 'text-black'
                                }`}
                              >
                                {cell.row.original.gameBalance === 1
                                  ? t('에이전트')
                                  : t('회원')}
                              </div>
                            }
                          </td>
                        );
                      } else if (
                        cell.column.columnDef.header === t('로그인시간')
                      ) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className="px-4 py-3 text-xs text-left text-gray-900"
                          >
                            {dateTimeFormatter(
                              String(cell.row.original.loginTime)
                            )}
                          </td>
                        );
                      } else if (
                        cell.column.columnDef.header === t('게임잔액')
                      ) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className="px-4 py-3 text-xs text-left text-gray-900"
                          >
                            {cell.row.original.gameBalance.toLocaleString()}
                          </td>
                        );
                      } else if (
                        cell.column.columnDef.header === t('게임유형')
                      ) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className="px-4 py-3 text-xs text-left text-gray-900"
                          >
                            {row.original.gameType === 'B'
                              ? t('바카라')
                              : t('슬롯')}
                          </td>
                        );
                      } else if (cell.column.columnDef.header === t('계정')) {
                        return (
                          <td
                            key={cell.id}
                            className={`px-4 py-2 text-xs text-left cursor-pointer sticky left-0 ${
                              row.original.gameBalance === 1
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
                            className="px-4 py-2 text-xs text-left font-base text-gray-900"
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
