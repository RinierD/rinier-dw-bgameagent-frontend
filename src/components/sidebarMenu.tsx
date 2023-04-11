import React from 'react';
import { MenuProps } from 'antd';
import {
  LaptopOutlined,
  ReconciliationOutlined,
  UserOutlined,
  PicCenterOutlined,
} from '@ant-design/icons';


export const fixedSidebarMenu: MenuProps['items'] = [
  {
    key: `parent_계정관리`,
    label: '계정관리',
    icon: React.createElement(UserOutlined),
    children: [
      { key: '/accnt-general', label: '계정총람' },
      { key: '/accnt-sub', label: '서브계정' },
      { key: '/accnt-balance', label: '계정잔액' },
      { key: '/accnt-online', label: '온라인회원' },
    ],
  },
  {
    key: `parent_내역조회`,
    label: '내역조회',
    icon: React.createElement(PicCenterOutlined),
    children: [
      { key: '/winloss', label: '윈로스내역' },
      { key: '/game-result', label: '게임기록' },
      { key: '/acct-balance-mod', label: '계정금액변경' },
      { key: '/game-balance-mod', label: '게임금액변경' },
      { key: '/user-log', label: '사용내역' },
    ],
  },
  {
    key: `parent_설정`,
    label: '설정',
    icon: React.createElement(LaptopOutlined),
    children: [
      { key: '/password-change', label: '비밀번호 변경' },
      { key: '/checktime-setup', label: '조회시간 설정' },
    ],
  },
  {
    key: `parent_관리자메뉴`,
    label: '관리자메뉴',
    icon: React.createElement(ReconciliationOutlined),
    children: [
      { key: '/betlimit', label: '베팅한도 관리' },
      { key: '/credit-manage', label: '크레딧 관리' },
      { key: '/credit-log', label: '크레딧 내역' },
    ],
  },
];

export const fixedSidebarMenuUser: MenuProps['items'] = [
  {
    key: `parent_계정관리`,
    label: '계정관리',
    icon: React.createElement(UserOutlined),
    children: [
      { key: '/accnt-general', label: '계정총람' },
      { key: '/accnt-sub', label: '서브계정' },
      { key: '/accnt-balance', label: '계정잔액' },
      { key: '/accnt-online', label: '온라인회원' },
    ],
  },
  {
    key: `parent_내역조회`,
    label: '내역조회',
    icon: React.createElement(PicCenterOutlined),
    children: [
      { key: '/winloss', label: '윈로스내역' },
      { key: '/game-result', label: '게임기록' },
      { key: '/acct-balance-mod', label: '계정금액변경' },
      { key: '/game-balance-mod', label: '게임금액변경' },
      { key: '/user-log', label: '사용내역' },
    ],
  },
  {
    key: `parent_설정`,
    label: '설정',
    icon: React.createElement(LaptopOutlined),
    children: [
      { key: '/password-change', label: '비밀번호 변경' },
      { key: '/checktime-setup', label: '조회시간 설정' },
    ],
  },
];
