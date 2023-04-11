import { useReactiveVar } from '@apollo/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IBetLimitResponse } from '../../../common/api/queries/betlimit_query';
import { routeTitleVar } from '../../../common/apollo';
import { Button } from '../../../components/button';
import dummyData from '../../accntManage/dummydata_accntGen.json';
import { HiOutlinePencilAlt } from 'react-icons/hi';
export const BetlimitList = () => {
  const navigate = useNavigate();
  const data = dummyData.betLimit;

  const [modal, setModal] = useState(false);

  const onClickAccntReg = () => {
    navigate('/betlimit-register');
  };

  const onClickModal = (data: IBetLimitResponse) => {
    setModal(!modal);
  };

  const columnHelper = createColumnHelper<IBetLimitResponse>();
  const columns = [
    columnHelper.accessor('currency', {
      header: '화폐',
    }),
    columnHelper.accessor('bp_min', {
      header: '뱅커/플레이어',
    }),
    columnHelper.accessor('tie_min', {
      header: '타이',
    }),
    columnHelper.accessor('pair_min', {
      header: '페어',
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useReactiveVar(routeTitleVar);
  useEffect(() => {
    routeTitleVar('베팅한도 관리');
  }, []);
  return (
    <div>
      <div className='border rounded-md mt-5 shadow-md'>
        <div className='flex flex-row justify-between items-center border-b bg-gray-100'>
          <div className='w-full flex flex-row justify-between gap-3 items-center mx-5 my-3'>
            <div onClick={onClickAccntReg}>
              <Button canClick={true} actionText={'한도 생성'} />
            </div>
            <div className='flex opacity-0'>
              <div>표시개수</div>
              <div>
                <select
                  className='forminput'
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
            </div>
            <div className='flex items-center gap-3'>
              <div className='form-group flex'>
                <select className='forminput w-48'>
                  <option value=''>선택</option>
                  <option value='PHP'>PHP</option>
                  <option value='KRW'>KRW</option>
                  <option value='CNY'>CNY</option>
                  <option value='HKD'>HKD</option>
                  <option value='USD'>USD</option>
                </select>
              </div>
              {/* <div className='form-group flex'>
                <input
                  type='text'
                  className='forminput w-48'
                  placeholder='계정명 입력'
                />
              </div> */}
              <Button canClick={true} actionText={'검색'} />
            </div>
          </div>
        </div>
        <div className='flex flex-col' style={{ backgroundColor: '#245c81' }}>
          <div className=''>
            <table className='w-full'>
              <thead className='border-b'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      if (header.column.columnDef.header === '잔액') {
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
                              className='flex flex-row justify-end items-center text-sm'
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
                        header.column.columnDef.header === '배팅한도'
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
                              className='text-center text-sm'
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
                      }
                    })}
                    <th
                      style={{ cursor: 'default' }}
                      className='text-sm font-bold text-white px-1 text-cneter pb-1'
                    >
                      수정
                    </th>
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
                      if (cell.column.columnDef.header === '뱅커/플레이어') {
                        return (
                          <td
                            key={`cell_${cell.id}`}
                            className='px-4 py-2 text-sm text-left text-gray-900'
                          >
                            {`${row.original.bp_min.toLocaleString()} ~ ${row.original.bp_max.toLocaleString()}`}
                          </td>
                        );
                      } else if (cell.column.columnDef.header === '타이') {
                        return (
                          <td
                            key={`cell_${cell.id}`}
                            className='px-4 py-2 text-sm text-left text-gray-900'
                          >
                            {`${row.original.tie_min.toLocaleString()} ~ ${row.original.tie_max.toLocaleString()}`}
                          </td>
                        );
                      } else if (cell.column.columnDef.header === '페어') {
                        return (
                          <td
                            key={`cell_${cell.id}`}
                            className='px-4 py-2 text-sm text-left text-gray-900'
                          >
                            {`${row.original.pair_min.toLocaleString()} ~ ${row.original.pair_max.toLocaleString()}`}
                          </td>
                        );
                      } else {
                        return (
                          <td
                            key={cell.id}
                            className='px-4 py-2 text-sm text-left font-medium text-gray-900'
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
                      <div className='flex justify-center'>
                        {/* <div
                          className='border rounded text-sm py-1 px-2.5 font-semibold text-white cursor-pointer bg-orange-500'
                          onClick={() => onClickModal(row.original)}
                        >
                          수정
                        </div> */}
                        <HiOutlinePencilAlt className='text-xl text-gray-600' />
                      </div>
                    </td>
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
      {/* {modal ? (
        <AccntGeneralSetupModal setModal={setModal} accountName={accntName} />
      ) : null} */}
      {/* {depositModal ? (
        <AccntGenDepositModal setDepositModal={setDepositModal} />
      ) : null} */}
    </div>
  );
};
