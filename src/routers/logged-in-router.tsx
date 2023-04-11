import { useReactiveVar } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
	isLoggedInVar,
	langVar,
	loggedInMemberData,
	my_user_id,
	myAuthority,
	parentIdList,
	routeTitleVar,
	sidebarVar,
} from '../common/apollo';
import { PageNotFound } from '../pages/404';
import logoImage from '../common/assets/logo.png';
import { Layout, Menu, MenuProps, theme } from 'antd';
import { AiOutlineBars } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { MdLogout } from 'react-icons/md';
import Badge from 'antd/es/badge';
import { AccntGeneral } from '../pages/accntManage/accntGeneral/accntGeneral';
import { AccntGeneralReg } from '../pages/accntManage/accntGeneral/accntGeneral_reg';
import { AccntSub } from '../pages/accntManage/accntSub/accntSub';
import { AccntBal } from '../pages/accntManage/accntBal/accntBal';
import { AccntOnline } from '../pages/accntManage/accntOnline/accntOnline';
import { AccntBalHistory } from '../pages/history/accntbal/accntBalHistory';
import { WinlossHistory } from '../pages/history/winloss/winlossHistory';
import { GameHistory } from '../pages/history/game/gameHistory';
import { GameBal } from '../pages/history/gamebal/gameBal';
import { UserLog } from '../pages/history/userlog/userLog';
import { RootAccntReg } from '../pages/adminMenu/rootAccntAdd/rootAccnt_reg';
import { CreditHistory } from '../pages/adminMenu/creditList/creditHistory';
import { PasswordChange } from '../pages/setup/passwordMod/passwordChange';
import { CheckingTimeSetup } from '../pages/setup/checkingTime/checkingTimeSetup';
import { BetLimitSetup } from '../pages/adminMenu/betLimitAdd/betLimitSetup';
import { BetLimitAdd } from '../pages/adminMenu/betLimitAdd/betLimitAdd';
import { CreditManage } from '../pages/adminMenu/creditAdd/creditManage';
import { AccntGeneralAdmin } from '../pages/accntManage/accntGeneral/accntGeneralAdmin';
import { AccntGeneralAReg } from '../pages/accntManage/accntGeneral/accntGeneralA_reg';
import { useTranslation } from 'react-i18next';
import {
	SESSIONSTORAGE_LANGUAGE,
	SESSIONSTORAGE_LOGGEDIN_MEMBER_DATA,
} from '../common/constants';
import {
	LaptopOutlined,
	PicCenterOutlined,
	ReconciliationOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { AccntGeneralMod } from '../pages/accntManage/accntGeneral/accntGeneral_mod';
import { MEMBER_INFO_GET } from '../common/api/queries/accnt_query';
import { AxiosResponse } from 'axios';
import { SubAccntReg } from '../pages/accntManage/accntSub/subAccnt_reg';
import { SubAccntMod } from '../pages/accntManage/accntSub/accntSub_mod';

const { Header, Content, Sider, Footer } = Layout;

const adminRoutes = [
	{ path: '/accnt-general', element: <AccntGeneralAdmin /> },
	{ path: '/accnt-register', element: <AccntGeneralAReg /> },
	{ path: '/accnt-mod', element: <AccntGeneralMod /> },
];

const userRoutes = [
	{ path: '/accnt-general', element: <AccntGeneral /> },
	{ path: '/accnt-register', element: <AccntGeneralReg /> },
	{ path: '/accnt-mod', element: <AccntGeneralMod /> },
];

const commonRoutes = [
	{ path: '/', element: <AccntGeneral /> },
	{ path: '/accnt-sub', element: <AccntSub /> },
	{ path: '/subAccnt-register', element: <SubAccntReg /> },
	{ path: '/subAccnt-mod', element: <SubAccntMod /> },
	{ path: '/accnt-balance', element: <AccntBal /> },
	{ path: '/accnt-online', element: <AccntOnline /> },
	{ path: '/winloss', element: <WinlossHistory /> },
	{ path: '/game-result', element: <GameHistory /> },
	{ path: '/acct-balance-mod', element: <AccntBalHistory /> },
	{ path: '/game-balance-mod', element: <GameBal /> },
	{ path: '/user-log', element: <UserLog /> },
	{ path: '/rootagent', element: <RootAccntReg /> },
	{ path: '/betlimit', element: <BetLimitSetup /> },
	{ path: '/credit-manage', element: <CreditManage /> },
	{ path: '/credit-log', element: <CreditHistory /> },
	{ path: '/password-change', element: <PasswordChange /> },
	{ path: '/checktime-setup', element: <CheckingTimeSetup /> },
	{ path: '/betlimit-register', element: <BetLimitAdd /> },
];

export const LoggedInRouter: React.FC = () => {
	const { t, i18n } = useTranslation(['page']);

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	// const [openSidebar, setOpenSidebar] = useState(true);
	const openSidebar = useReactiveVar(sidebarVar);

	const routeTitle = useReactiveVar(routeTitleVar);
	const grantedAuthority = useReactiveVar(myAuthority);
	useReactiveVar(isLoggedInVar);
	useReactiveVar(routeTitleVar);
	useReactiveVar(parentIdList);
	const myData = useReactiveVar(loggedInMemberData);
	const selectedLang = useReactiveVar(langVar);
	const myId = useReactiveVar(my_user_id);

	const navigate = useNavigate();

	const grantedRoutes =
		grantedAuthority === 'ADMIN'
			? [...adminRoutes, ...commonRoutes]
			: [...userRoutes, ...commonRoutes];

	const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
		i18n.changeLanguage(e.currentTarget.value);
		langVar(String(e.currentTarget.value));
		sessionStorage.setItem(
			SESSIONSTORAGE_LANGUAGE,
			String(e.currentTarget.value)
		);
	};

	const userMenuArr = [
		{
			key: `parent_계정관리`,
			label: t('계정 관리'),
			icon: React.createElement(UserOutlined),
			children: [
				{ key: '/accnt-general', label: t('계정총람') },
				{ key: '/accnt-sub', label: t('서브계정') },
				{ key: '/accnt-balance', label: t('계정잔액') },
				{ key: '/accnt-online', label: t('온라인회원') },
			],
		},
		{
			key: `parent_내역조회`,
			label: t('내역조회'),
			icon: React.createElement(PicCenterOutlined),
			children: [
				{ key: '/winloss', label: t('윈로스내역') },
				{ key: '/game-result', label: t('게임기록') },
				{ key: '/acct-balance-mod', label: t('계정금액변경') },
				{ key: '/game-balance-mod', label: t('게임금액변경') },
				{ key: '/user-log', label: t('사용내역') },
			],
		},
		{
			key: `parent_설정`,
			label: t('설정'),
			icon: React.createElement(LaptopOutlined),
			children: [
				{ key: '/password-change', label: t('비밀번호 변경') },
				{ key: '/checktime-setup', label: t('조회시간 설정') },
			],
		},
	];

	const adminMenuArr = [
		{
			key: `parent_관리자메뉴`,
			label: t('관리자메뉴'),
			icon: React.createElement(ReconciliationOutlined),
			children: [
				{ key: '/betlimit', label: t('베팅한도 관리') },
				{ key: '/credit-manage', label: t('크레딧 관리') },
				{ key: '/credit-log', label: t('크레딧 내역') },
			],
		},
	];

	const fixedSidebarMenu: MenuProps['items'] = [
		...userMenuArr,
		...adminMenuArr,
	];
	const fixedSidebarMenuUser: MenuProps['items'] = [...userMenuArr];

	const languageArr = [
		<option key='한국어' value='한국어'>
			{t('한국어')}
		</option>,
		<option key='English' value='English'>
			{t('English')}
		</option>,
		<option key='中文' value='中文'>
			{t('中文')}
		</option>,
	];

	const getMyInfo = () => {
		MEMBER_INFO_GET(String(myId)).then((res: AxiosResponse | any) => {
			if (res.data.data) {
				loggedInMemberData(res.data.data);
				sessionStorage.setItem(
					SESSIONSTORAGE_LOGGEDIN_MEMBER_DATA,
					JSON.stringify(res.data.data)
				);
				let filteredParentIdArr: string[] = res.data.data?.parent_id.split('.');
				if (filteredParentIdArr.indexOf(String(myId)) === -1) {
					parentIdList([String(myId)]);
				}
			}
		});
	};

	const logout = () => {
		sessionStorage.clear();
		routeTitleVar('');
		myAuthority('');
		isLoggedInVar(false);
		navigate('/');
	};

	const logoOnClick = () => {
		routeTitleVar('');
		navigate('/');
	};

	const clickOpenSideBar = () => {
		sidebarVar(!openSidebar);
	};

	const handleNavigate = (key: string) => {
		navigate(key);
		if (openSidebar && clientWidth <= 768) {
			sidebarVar(false);
		}
	};

	useEffect(() => {
		i18n.changeLanguage(String(selectedLang));
		getMyInfo();
	}, []);

	const [clientWidth, setCilentWidth] = useState(window.innerWidth);
	const getWidth = () => window.innerWidth;

	useEffect(() => {
		const resizeListener = () => {
			setCilentWidth(getWidth());
		};
		window.addEventListener('resize', resizeListener);
		return () => window.removeEventListener('resize', resizeListener);
	}, []);

	// => This field below has a hidden bug when rendering. but for now this line of code will be used temporarily.
	useEffect(() => {
		if (clientWidth <= 768) {
			sidebarVar(false);
			// => will cast and find the width once it find it the 'sidebarVar' gonna be equals to (false) and automatically closed the sidebar.
		} else if (clientWidth >= 769) {
			sidebarVar(true);
			// => will cast and find the width once it find it the 'sidebarVar' gonna be equals to (true) and automatically open the sidebar.
		}
	}, [clientWidth, sidebarVar]);

	return (
		<div>
			<Layout className='min-h-screen'>
				<Header
					style={{
						height: '48px',
						backgroundColor: '#104468',
						paddingLeft: '20px',
						paddingRight: '20px',
					}}
				>
					<div className='w-full flex justify-between items-center h-12'>
						<div className='inline-flex gap-9 md:flex-row-reverse'>
							<div onClick={clickOpenSideBar}>
								<AiOutlineBars className='text-2xl mt-1 text-white cursor-pointer' />
							</div>
							<div onClick={logoOnClick}>
								<img
									src={logoImage}
									alt=''
									className='h-7 ml-1 mb-1 cursor-pointer'
								/>
							</div>
						</div>
						<div className='flex items-center'>
							<div className='text-left text-white hidden md:flex'>
								<div className='flex gap-5 mr-5'>
									<div>
										{t('어카운트 잔액')}:{' '}
										{myData?.balance_default.toLocaleString()}
									</div>
									<div>
										{t('환영합니다')} {myId}
									</div>
								</div>
							</div>
							<div className='flex mr-5'>
								<div className='items-center mr-2 text-lg text-white hidden md:flex'>
									<BsGlobe />
								</div>
								<select
									className='rounded-sm cursor-pointer text-sm w-20'
									onChange={(e) => onChangeLang(e)}
								>
									<option key={selectedLang} value={String(selectedLang)}>
										{t(String(selectedLang))}
									</option>
									{languageArr.filter((elem) => {
										return elem.key !== String(selectedLang);
									})}
								</select>
							</div>
							<div className=''>
								<div className='cursor-pointer'>
									<Badge className='flex'>
										<MdLogout
											className='text-2xl text-white'
											onClick={() => logout()}
										/>
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</Header>
				<Layout
					style={{
						position: 'relative',
					}}
				>
					<Sider
						width={openSidebar ? 220 : 0}
						style={{
							background: colorBgContainer,
							borderRightWidth: clientWidth > 768 ? '2px' : '0px',
							height: clientWidth < 768 ? '100%' : undefined,
							transition: '0.3s',

							// CODE TO OVERLAY THE CONTENT OF THE BODY
							zIndex: clientWidth < 768 ? '999' : undefined,
							overflowX: clientWidth < 768 ? 'hidden' : undefined,
							position: clientWidth < 768 ? 'absolute' : undefined,
							boxShadow: clientWidth < 768 ? '0px 0px 10px #888888' : undefined,
						}}
					>
						<div className='pl-7 mt-3 font-semibold text-xl text-gray-500'>
							{t('메뉴')}
						</div>
						<Menu
							onClick={({ key }) => handleNavigate(key)}
							mode='inline'
							style={{ height: '90%', borderRightWidth: '0px' }}
							items={
								grantedAuthority === 'ADMIN'
									? fixedSidebarMenu
									: fixedSidebarMenuUser
							}
						/>
					</Sider>
					<Layout style={{ padding: '0' }}>
						<Content
							style={{
								padding: 24,
								margin: 0,
								minHeight: 280,
								background: colorBgContainer,
							}}
						>
							<div className='text-xl font-semibold text-gray-500 ml-1 mb-2'>
								{routeTitle}
							</div>
							<Routes>
								{grantedRoutes.map((route) => {
									return (
										<Route
											key={route.path}
											path={route.path}
											element={route.element}
										/>
									);
								})}
								<Route path='*' element={<PageNotFound />} />
							</Routes>
						</Content>
						<Footer style={{ textAlign: 'center', backgroundColor: 'white' }}>
							<div className='flex flex-col justify-center gap-2 sm:flex-row'>
								<div> Copyright© 2023 DOWINN Group.</div>
								<div>All rights reserved.</div>
							</div>
						</Footer>
					</Layout>
				</Layout>
			</Layout>
		</div>
	);
};
