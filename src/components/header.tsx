import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  belongedJunket,
  isLoggedInVar,
  myAuthority,
  routeTitleVar,
} from '../common/apollo';

interface IHeaderProps {
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Header: React.FC<IHeaderProps> = ({ setOpenSidebar }) => {
  // const { data } = useMe();
  useReactiveVar(isLoggedInVar);
  useReactiveVar(routeTitleVar);
  useReactiveVar(myAuthority);
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    routeTitleVar('');
    myAuthority('');
    belongedJunket('');
    isLoggedInVar(false);
    navigate('/');
  };

  const clickOpenSideBar = () => {
    setOpenSidebar((current) => !current);
  };

  return (
    <>
      <header className='bg-white'>
        <div className='w-full px-5 xl:px-0 py-3 mx-auto flex justify-between items-center'>
          <div className='flex flex-row items-center'>
            <span className='text-s cursor-pointer' onClick={clickOpenSideBar}>
              {/* <FontAwesomeIcon icon={faBars} className='text-lg' /> */}
            </span>
            <Link to='/' onClick={() => routeTitleVar('')}>
              <div className='ml-10 font-bold text-lg'>Dowinn CMS</div>
            </Link>
          </div>
          <button onClick={logout}>log out</button>
          <span className='text-xs'>
            <Link to='/edit-profile'>
              {/* <FontAwesomeIcon icon={faUser} className='text-lg' /> */}
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};
