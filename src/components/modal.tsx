import React from 'react';

interface IModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ManageAccountRegisterModal: React.FC<IModalProps> = ({
  setModal,
}) => {
  const clickModalClose = () => {
    setModal((current) => !current);
  };

  return (
    <div className='box-border fixed top-0 right-0 bottom-0 left-0 z-1000 overflow-auto outline-0'>
      <div className='fixed w-full h-full backdrop-blur-sm'>
        <div className='box-border relative shadow-lg m-24 bg-white top-12'>
          <div>
            <div className='border rounded-md lg:col-span-2'>
              <div className='text-blue-500 font-medium text-lg px-6 py-3 border-b'>
                사용자 계정 추가
              </div>
              <div className='p-6 rounded-lg shadow-md bg-white'>
                <form>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='mb-6'>
                      <div className='mb-2 text-gray-500'>화폐</div>
                      <input
                        type='text'
                        className='forminput'
                        id='exampleInput124'
                        placeholder='solaire'
                      />
                    </div>
                    <div className='mb-6'>
                      <div className='mb-2 text-gray-500'>유형</div>
                      <input
                        type='text'
                        className='forminput'
                        id='exampleInput124'
                        placeholder='숫자'
                      />
                    </div>
                    <div className='mb-6'>
                      <div className='mb-2 text-gray-500'>금액</div>
                      <input
                        type='text'
                        className='forminput'
                        id='exampleInput124'
                        placeholder='숫자'
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='mb-6'>
                      <div className='mb-2 text-gray-500'>전화번호 1</div>
                      <input
                        type='text'
                        className='forminput'
                        id='exampleInput123'
                        placeholder='전화번호 입력'
                      />
                    </div>
                    <div className='mb-6'>
                      <div className='mb-2 text-gray-500'>전화번호 2</div>
                      <input
                        type='text'
                        className='forminput'
                        id='exampleInput123'
                        placeholder='전화번호 입력'
                      />
                    </div>
                    <div className='mb-6'>
                      <div className='mb-2 text-gray-500'>전화번호 3</div>
                      <input
                        type='text'
                        className='forminput'
                        id='exampleInput123'
                        placeholder='전화번호 입력'
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='form-group mb-6'>
                      <div className='mb-2 text-gray-500'>정켓명</div>
                      <input
                        type='text'
                        className='forminput'
                        id='exampleInput124'
                        placeholder='정켓명'
                      />
                    </div>
                    <div className='form-group mb-6'>
                      <div className='mb-2 text-gray-500'>이름</div>
                      <input
                        type='text'
                        className='forminput'
                        id='exampleInput124'
                        placeholder='이름 입력'
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='form-group mb-6'>
                      <div className='mb-2 text-gray-500'>금액 유형</div>
                      <select className='forminput'>
                        <option value='0' selected>
                          선택
                        </option>
                        <option value='1'>어카운트</option>
                        <option value='2'>현금</option>
                        <option value='3'>마커</option>
                      </select>
                    </div>
                    <div className='form-group mb-6'>
                      <div className='mb-2 text-gray-500'>바이인 금액</div>
                      <input
                        type='number'
                        className='forminput'
                        id='exampleInput124'
                        placeholder='바이인 금액 입력'
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md'>
            <button
              type='button'
              className='inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out'
              onClick={clickModalClose}
            >
              Close
            </button>
            <button
              type='button'
              className='inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1'
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
