import React, { useEffect, useRef, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  IBetLimitResponse,
  USER_LIMITS_GET_QUERY,
} from '../../../../common/api/queries/betlimit_query';
import { useReactiveVar } from '@apollo/client';
import { langVar } from '../../../../common/apollo';
import {
  accntGeneralData,
  limitData,
  limitModal,
  limitModalType,
  subAccountData,
} from '../../../../common/apollo';
import { AxiosResponse } from 'axios/index';
import { useTranslation } from 'react-i18next';

interface IModalProps {
  // setBetLimitModal: React.Dispatch<React.SetStateAction<boolean>>;
  accountName: string;
}

export const AccntGeneralBetLimitModal: React.FC<IModalProps> = ({
  // setBetLimitModal,
  accountName,
}) => {
  const { t } = useTranslation(['page']);

  const subAccntData = useReactiveVar(subAccountData);
  const limitDataArr = useReactiveVar(limitData);
  const betLimitModal = useReactiveVar(limitModal);
  const memberData = useReactiveVar(accntGeneralData);
  const modalType = useReactiveVar(limitModalType);
  const selectedLang = useReactiveVar(langVar);

  // const data = subAccntData?.betlimit.split(',');

  const [requested, SetRequested] = useState(true);
  const [idQueryPath, setIdQueryPath] = useState('');
  const [data, setData] = useState<IBetLimitResponse[]>([]);

  const clickModalClose = () => {
    limitModal(!betLimitModal);
  };

  const columnHelper = createColumnHelper<IBetLimitResponse>();

  const useAvaIdInputOutside = (ref: React.MutableRefObject<any>) => {
    const handleClickOutside = (e: { target: any }) => {
      if (
        !requested &&
        ref.current &&
        !ref.current.contains(e.target) &&
        idQueryPath.length > 3
      ) {
        requestTriggerId(idQueryPath);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    });
  };

  const subAccntLimitData = () => {
    const filteredLimitData = limitDataArr.filter((elem) => {
      if (modalType === 'T') {
        return subAccntData?.betlimit.split(',').includes(elem.id);
      } else if (modalType === 'I') {
        return memberData?.betlimit.split(',').includes(elem.id);
      }
    });
    setData(filteredLimitData);
  };

  const getLimitData = () => {
    USER_LIMITS_GET_QUERY()
      .then((res: AxiosResponse | any) => {
        if (res.data.data[0].code === 1) {
          const rawLimitArr = res.data.data[0].data.list;
          const filteredLimitArr = rawLimitArr.filter(
            (elem: IBetLimitResponse) => {
              // change user's default curreny later on
              return elem.currency === 'PHP';
            }
          );
          limitData(filteredLimitArr);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const requestTriggerId = (idQueryPath: string) => {};

  const avaIdInputRef = useRef(null);
  useAvaIdInputOutside(avaIdInputRef);

  const columns = [
    columnHelper.accessor('bp_min', {
      header: String(t('뱅커/플레이어')),
    }),
    columnHelper.accessor('tie_min', {
      header: String(t('타이')),
    }),
    columnHelper.accessor('pair_min', {
      header: String(t('페어')),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    getLimitData();
  }, []);
  useEffect(() => {
    subAccntLimitData();
  }, [limitDataArr]);

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-1000 overflow-auto outline-0">
      <div className="fixed w-full h-full bg-black bg-opacity-40 flex flex-col justify-center items-center">
        <div className="w-11/12 md:w-1/2 2xl:w-1/3 top-10 shadow-lg">
          <div className="">
            <div className="lg:col-span-2">
              <div className="border rounded-t-md font-medium text-lg px-6 py-3 border-b flex flex-row justify-between bg-gray-100">
                <div className="text-gray-500 font-bold">{t('배팅한도')}</div>
                <GrClose
                  className="mt-1 cursor-pointer"
                  onClick={clickModalClose}
                />
              </div>
              <div className="p-6 rounded-b-md shadow-md bg-white">
                <form>
                  <input
                    type="text"
                    name="username"
                    className="w-0 h-0 border-0 block"
                  />
                  <input type="password" className="w-0 h-0 border-0 block" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group mb-3 flex">
                      <div className="flex flex-row items-center">
                        <div
                          className={`text-gray-500 mr-1 ${
                            selectedLang === 'English' ? 'w-24' : 'w-12'
                          }`}
                        >
                          {t('계정명')}:
                        </div>
                      </div>
                      <div className="pl-2 w-40">
                        {modalType === 'T' ? accountName : memberData?.user_id}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="py-3">
                      <table className="w-full overflow-x-scroll">
                        <thead className="w-full bg-gray-500">
                          {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <th
                                  key={header.id}
                                  onClick={header.column.getToggleSortingHandler()}
                                  className="text-sm text-left font-bold text-white px-2 py-2"
                                >
                                  <div className="text-left">
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          ))}
                        </thead>
                        <tbody className="border">
                          {table.getRowModel().rows.map((row) => (
                            <tr
                              key={row.id}
                              className="even:bg-white odd:bg-gray-100 text-xs"
                            >
                              {row.getVisibleCells().map((cell) => {
                                if (
                                  cell.column.columnDef.header ===
                                  t('뱅커/플레이어')
                                ) {
                                  return (
                                    <td
                                      key={`cell_${cell.id}`}
                                      className="px-2 py-2 text-sm text-left text-gray-900"
                                    >
                                      {`${row.original.bp_min.toLocaleString()} ~ ${row.original.bp_max.toLocaleString()}`}
                                    </td>
                                  );
                                } else if (
                                  cell.column.columnDef.header === t('타이')
                                ) {
                                  return (
                                    <td
                                      key={`cell_${cell.id}`}
                                      className="px-2 py-2 text-sm text-left text-gray-900"
                                    >
                                      {`${row.original.tie_min.toLocaleString()} ~ ${row.original.tie_max.toLocaleString()}`}
                                    </td>
                                  );
                                } else if (
                                  cell.column.columnDef.header === t('페어')
                                ) {
                                  return (
                                    <td
                                      key={`cell_${cell.id}`}
                                      className="px-2 py-2 text-sm text-left text-gray-900"
                                    >
                                      {`${row.original.pair_min.toLocaleString()} ~ ${row.original.pair_max.toLocaleString()}`}
                                    </td>
                                  );
                                } else {
                                  return (
                                    <td
                                      key={cell.id}
                                      className="px-2 py-2 text-sm text-left font-medium text-gray-900"
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
                  <div className="w-full flex justify-end">
                    <div className="" onClick={clickModalClose}>
                      <button className="border border-gray-500 rounded-md py-2 px-7 font-bold text-md text-gray-600 flex items-center bg-gray-100">
                        <div className="text-xl mr-1 text-red-500">
                          <AiOutlineCloseCircle />
                        </div>
                        <div className="font-bold text-base">{t('닫기')}</div>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
