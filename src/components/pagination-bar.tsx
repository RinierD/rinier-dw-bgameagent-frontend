import React from 'react';

interface IPaginationProps {
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const PaginationBar: React.FC<IPaginationProps> = ({
  totalPages,
  page,
  setPage,
}) => {
  // const [page, setPage] = useState(1);
  const onNextPageClick = () => {
    setPage((current) => current + 1);
  };
  const onPrevPageClick = () => {
    setPage((current) => current - 1);
  };

  return (
    <div className='grid grid-cols-3 text-center max-w-xs items-center mx-auto mt-10'>
      {page > 1 ? (
        <button onClick={onPrevPageClick} className='text-2xl font-medium'>
          &larr;
        </button>
      ) : (
        <div></div>
      )}
      <span className='mx-2'>
        Page {page} of {totalPages}
      </span>
      {page !== totalPages ? (
        <button onClick={onNextPageClick} className='text-2xl font-medium'>
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};
