import { useReactiveVar } from '@apollo/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { ICreditRes } from '../../../common/api/queries/credit_query';
import { routeTitleVar } from '../../../common/apollo';

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

export const CreditHistory = () => {
  const [mockData, setMockData] = useState<ICreditRes[]>([]);

  const data = mockData;

  const { RangePicker } = DatePicker;

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [betTotal, setBetTotal] = useState(0);
  const [winlossTotal, setWinlossTotal] = useState(0);
  const [rollingTotal, setRollingTotal] = useState(0);
  const [value, setValue] = useState<string[]>([]);

  useReactiveVar(routeTitleVar);

  const onChange = (newValue: string[]) => {
    setValue(newValue);
  };

  const rangePresets: {
    label: string;
    value: [Dayjs, Dayjs];
  }[] = [
    { label: '지난 1주', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '지난 2주', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: '지난 1달', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: '지난 3달', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];

  const excelDownload = (data: any) => {
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, `winloss_${Date.now()}.xlsx`);
  };

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
    for (let i = 0; i < 1000; i++) {
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
    routeTitleVar('크레딧 내역');
  }, []);
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
                <div className=' font-bold'>다운로드</div>
              </button>
            </div>
            <div className='flex items-center mr-3'>
              <div className='text-sm mr-3'>표시개수: </div>
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
        <span className='flex items-center gap-1 font-medium'>
          <div>페이지</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>
        <span className='flex items-center gap-1 font-medium'>
          | 페이지:
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
  );
};
