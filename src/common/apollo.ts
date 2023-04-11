import { ApolloClient, makeVar, InMemoryCache } from '@apollo/client';
import {
	SESSIONSTORAGE_AGENT_DEPTH,
	SESSIONSTORAGE_AUTH,
	SESSIONSTORAGE_ID,
	SESSIONSTORAGE_JUNKET,
	SESSIONSTORAGE_LANGUAGE,
	SESSIONSTORAGE_LOGGEDIN_MEMBER_DATA,
	SESSIONSTORAGE_TOKEN,
} from './constants';
import { ITableResponse } from './api/queries/table_query';
import { IGameResultRes } from './api/queries/game_query';
import { IBetHistoryResponse } from './api/queries/bethistory_query';
import { IBetLimitResponse } from './api/queries/betlimit_query';
import { RestLink } from 'apollo-link-rest';
import { IAccntSubAccntRes, IAcctInfoRes } from './api/queries/accnt_query';
import { ITransactionRes } from './api/queries/transaction_query';
import { IIdNickResData } from './api/queries/idNick_query';
import {
	ISlotEgmHistoryRes,
	ISlotGameHistoryRes,
} from './api/queries/slot_query';
import { IWinnLossDataRes } from './api/queries/winloss_query';
import { IUserLogRes } from './api/queries/userLog_query';

const token = sessionStorage.getItem(SESSIONSTORAGE_TOKEN);
const myAuth = sessionStorage.getItem(SESSIONSTORAGE_AUTH);
const myJunket = sessionStorage.getItem(SESSIONSTORAGE_JUNKET);
const mySelectedLang = sessionStorage.getItem(SESSIONSTORAGE_LANGUAGE);
const currencyDepth = sessionStorage.getItem(SESSIONSTORAGE_AGENT_DEPTH);
const myID = sessionStorage.getItem(SESSIONSTORAGE_ID);
const myData = JSON.parse(
	String(sessionStorage.getItem(SESSIONSTORAGE_LOGGEDIN_MEMBER_DATA))
);

// Authority state management
export const agentDepth = makeVar(currencyDepth);
export const myAuthority = makeVar(myAuth);
export const belongedJunket = makeVar(myJunket);
export const isUpdatedVar = makeVar(false);
export const isLoggedInVar = makeVar(Boolean(token));
export const jwtTokenVar = makeVar(token);
export const proposalNumvar = makeVar('');
export const routeTitleVar = makeVar('');
export const langVar = makeVar(mySelectedLang);
export const my_user_id = makeVar(myID);
export const sRModal = makeVar(false);
export const limitModal = makeVar(false);
export const limitModalType = makeVar('');
export const sidebarVar = makeVar(true);

// general state management
export const betLimitList = makeVar([]);
export const tableList = makeVar([]);
export const tableWinLossList = makeVar([]);
export const avatarList = makeVar([]);
export const sAvatarList = makeVar([]);
export const scGameBetList = makeVar([]);
export const soGameBetList = makeVar([]);
export const rGameBetList = makeVar([]);
export const gameResultList = makeVar([]);
export const accntGeneralList = makeVar([]);
export const subAccountDatalist = makeVar<IAccntSubAccntRes[]>([]);
export const roleAccountDatalist = makeVar<IAccntSubAccntRes[]>([]);
export const parentIdList = makeVar<string[]>([]);
export const transactionList = makeVar<ITransactionRes[]>([]);
export const idNickList = makeVar<IIdNickResData[]>([]);

// modal data state management
export const tableData = makeVar<ITableResponse | null>(null);
export const gameResultData = makeVar<IGameResultRes | null>(null);
export const limitData = makeVar<IBetLimitResponse[]>([]);
export const betData = makeVar<IBetHistoryResponse | null>(null);
export const loggedInMemberData = makeVar<IAcctInfoRes | null>(myData);
export const accntGeneralDataBal = makeVar<IAcctInfoRes[]>([]);
export const accntGeneralData = makeVar<IAcctInfoRes | null>(null);
export const subAccountData = makeVar<IAccntSubAccntRes | null>(null);
export const roleAccountData = makeVar<IAccntSubAccntRes | null>(null);
export const slotGameHistoryData = makeVar<ISlotGameHistoryRes[] | []>([]);
export const slotEgmHistoryData = makeVar<ISlotEgmHistoryRes[] | []>([]);
export const memberWinlossData = makeVar<IWinnLossDataRes[] | []>([]);
export const subMemberWinlossData = makeVar<IWinnLossDataRes[] | []>([]);
export const userLogData = makeVar<IUserLogRes[] | []>([]);

const restLink = new RestLink({
	uri: `${process.env.REACT_APP_URL?.slice(
		0,
		process.env.REACT_APP_URL.length - 1
	)}`,
	customFetch: fetch,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': `${process.env.REACT_CLIENT_URL}`,
		'Access-Control-Allow-Credentials': 'true',
	},
	credentials: 'include',
});

export const client = new ApolloClient({
	link: restLink,
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					agentDepth: {
						read() {
							return agentDepth();
						},
					},
					isLoggedIn: {
						read() {
							return isLoggedInVar();
						},
					},
					sidebarVar: {
						read() {
							return sidebarVar();
						},
					},
					limitModal: {
						read() {
							return limitModal();
						},
					},
					sRModal: {
						read() {
							return sRModal();
						},
					},
					limitModalType: {
						read() {
							return limitModalType();
						},
					},
					my_user_id: {
						read() {
							return my_user_id();
						},
					},
					belongedJunket: {
						read() {
							return belongedJunket();
						},
					},
					myAuthority: {
						read() {
							return myAuthority();
						},
					},
					token: {
						read() {
							return jwtTokenVar();
						},
					},
					betLimitList: {
						read() {
							return betLimitList();
						},
					},
					tableList: {
						read() {
							return tableList();
						},
					},
					tableWinLossList: {
						read() {
							return tableWinLossList();
						},
					},
					avatarList: {
						read() {
							return avatarList();
						},
					},
					sAvatarList: {
						read() {
							return sAvatarList();
						},
					},
					isUpdatedVar: {
						read() {
							return isUpdatedVar();
						},
					},
					scGameBetList: {
						read() {
							return scGameBetList();
						},
					},
					soGameBetList: {
						read() {
							return soGameBetList();
						},
					},
					rGameBetList: {
						read() {
							return rGameBetList();
						},
					},
					gameResultList: {
						read() {
							return gameResultList();
						},
					},
					accntGeneralList: {
						read() {
							return accntGeneralList();
						},
					},
					parentIdList: {
						read() {
							return parentIdList();
						},
					},
					idNickList: {
						read() {
							return idNickList();
						},
					},
					proposalNumvar: {
						read() {
							return proposalNumvar();
						},
					},
					routeTitleVar: {
						read() {
							return routeTitleVar();
						},
					},
					langVar: {
						read() {
							return langVar();
						},
					},
					tableData: {
						read() {
							return tableData();
						},
					},
					betData: {
						read() {
							return betData();
						},
					},
					limitData: {
						read() {
							return limitData();
						},
					},
					gameResultData: {
						read() {
							return gameResultData();
						},
					},
					loggedInMemberData: {
						read() {
							return loggedInMemberData();
						},
					},
					accntGeneralDataBal: {
						read() {
							return accntGeneralDataBal();
						},
					},
					accntGeneralData: {
						read() {
							return accntGeneralData();
						},
					},
					subAccountData: {
						read() {
							return subAccountData();
						},
					},
					roleAccountData: {
						read() {
							return roleAccountData();
						},
					},
					subAccountDatalist: {
						read() {
							return subAccountDatalist();
						},
					},
					roleAccountDatalist: {
						read() {
							return roleAccountDatalist();
						},
					},
					transactionList: {
						read() {
							return transactionList();
						},
					},
					slotGameHistoryData: {
						read() {
							return slotGameHistoryData();
						},
					},
					slotEgmHistoryData: {
						read() {
							return slotEgmHistoryData();
						},
					},
					memberWinlossData: {
						read() {
							return memberWinlossData();
						},
					},
					subMemberWinlossData: {
						read() {
							return subMemberWinlossData();
						},
					},
					userLogData: {
						read() {
							return userLogData();
						},
					},
				},
			},
		},
	}),
});
