import React, { useEffect, useState } from 'react';

import * as xlsx from 'xlsx';
import { DatePicker } from 'antd';
import locale from 'antd/lib/locale/ko_KR';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { Dayjs } from 'dayjs';
import { SiMicrosoftexcel } from 'react-icons/si';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { dateTimeFormatter } from '../../../common/functions/dateTimeFormatter';
import { ICreditRes } from '../../../common/api/queries/credit_query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

export const CreaditList = () => {
  const [mockData, setMockData] = useState<ICreditRes[]>([]);

  const data = mockData;

  const columnHelper = createColumnHelper<ICreditRes>();
  const columns = [
    columnHelper.accessor('accountName', {
      header: '계정',
    }),
    columnHelper.accessor('creditType', {
      header: '분류',
    }),
    columnHelper.accessor('credited_from', {
      header: '크레딧from',
    }),
    columnHelper.accessor('initialCredit', {
      header: '변경전크레딧',
    }),
    columnHelper.accessor('amount', {
      header: '변경금액',
    }),
    columnHelper.accessor('resultCredit', {
      header: '변경후크레딧',
    }),
    columnHelper.accessor('created_at', {
      header: '실행시간',
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
    for (let i = 0; i < 10; i++) {
      dataGen.push({
        id: String(i),
        accountName: `test${i}`,
        nickName: `testnick${i}`,
        creditType: '생성',
        credited_from: `DW0${i}`,
        created_at: '2023-02-16 18:54:34',
        currency: 'PHP',
        initialCredit: Math.floor(Math.random() * 900000 + 10000),
        amount: Math.floor(Math.random() * 900000 + 1000),
        resultCredit: Math.floor(Math.random() * 900000 + 10000),
      });
    }
    setMockData(dataGen);
  };

  useEffect(() => {
    mockDataGen();
  }, []);
  return (
    <div className='w-full flex justify-center'>
      <div className='border rounded-md mt-5 shadow-md w-full'>
        <div className='flex flex-row justify-between items-center border-b bg-gray-100'>
          <div className='w-full flex gap-3 justify-between items-center my-2'>
            <div className='flex items-center mr-3'>
              <div className='text-sm mx-3'>표시개수: </div>
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
        <div className='flex flex-col'>
          <div className=''>
            <table className='w-full'>
              <thead
                className='border-b'
                style={{ backgroundColor: '#245c81' }}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      if (
                        header.column.columnDef.header === '변경전크레딧' ||
                        header.column.columnDef.header === '변경금액' ||
                        header.column.columnDef.header === '변경후크레딧'
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
                            className='text-xs text-right font-bold text-white px-2 py-2'
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
                            className='text-xs text-center font-bold text-white px-2 py-2'
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
                      if (cell.column.columnDef.header === '계정유형') {
                        return (
                          <td
                            key={`cell_${cell.id}`}
                            className='px-2 py-2 text-xs text-left'
                          >
                            {
                              <div
                                className={`font-extrabold ${
                                  cell.row.original.amount === 1
                                    ? 'text-blue-600'
                                    : 'text-black'
                                }`}
                              >
                                {cell.row.original.amount === 1
                                  ? '에이전트'
                                  : '회원'}
                              </div>
                            }
                          </td>
                        );
                      } else if (
                        cell.column.columnDef.header === '로그인시간'
                      ) {
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
                        cell.column.columnDef.header === '변경전크레딧'
                      ) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className='px-2 py-3 text-xs text-right text-gray-900'
                          >
                            {cell.row.original.initialCredit.toLocaleString()}
                          </td>
                        );
                      } else if (cell.column.columnDef.header === '변경금액') {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className='px-2 py-3 text-xs text-right text-gray-900'
                          >
                            {cell.row.original.amount.toLocaleString()}
                          </td>
                        );
                      } else if (
                        cell.column.columnDef.header === '변경후크레딧'
                      ) {
                        return (
                          <td
                            key={`createdAt_${cell.id}`}
                            className='px-2 py-3 text-xs text-right text-gray-900'
                          >
                            {cell.row.original.resultCredit.toLocaleString()}
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
    </div>
  );
};
