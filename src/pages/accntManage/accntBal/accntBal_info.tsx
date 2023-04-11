import {useReactiveVar} from '@apollo/client';
import {AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {MEMBER_INFO_GET, SUB_MEMBERS_GET_SUM,} from '../../../common/api/queries/accnt_query';
import {
  accntGeneralData,
  accntGeneralDataBal,
  langVar,
  loggedInMemberData,
  my_user_id,
  parentIdList,
  routeTitleVar,
  sidebarVar,
  subAccountDatalist,
} from '../../../common/apollo';

export const AccntBalInfo = () => {
  const {t} = useTranslation(['page']);

  const selectedLang = useReactiveVar(langVar);
  const myId = useReactiveVar(my_user_id);
  const myData = useReactiveVar(loggedInMemberData);
  const parentList = useReactiveVar(parentIdList);
  useReactiveVar(routeTitleVar);
  useReactiveVar(accntGeneralDataBal);
  useReactiveVar(subAccountDatalist);
  useReactiveVar(sidebarVar);

  const getMemberInfo = () => {
    MEMBER_INFO_GET(String(myId)).then((res: AxiosResponse | any) => {
      if (res.data.data) {
        accntGeneralData(res.data.data);
      }
    });
  };

  const onClickAgentId = (agentId: string) => {
    MEMBER_INFO_GET(agentId).then((res: AxiosResponse | any) => {
      if (res.data.data) {
        accntGeneralDataBal([res.data.data]);
        const parentIdArr: string[] = res.data.data?.parent_id.split('.');
        if (parentIdArr.indexOf(String(myData?.user_id)) === -1) {
          parentIdList([String(myId)]);
        } else {
          const filteredIdArr = parentIdArr.slice(
            parentIdArr.indexOf(String(myData?.user_id))
          );
          parentIdList([...filteredIdArr, agentId]);
        }
      }
    });
    SUB_MEMBERS_GET_SUM(agentId)
      .then((res: AxiosResponse | any) => {
        if (res.data.data) {
          subAccountDatalist(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };


  // mobile size sidebar close logic -------------------------------------------------------
  const [clientWidth, setCilentWidth] = useState(window.innerWidth);
  const getWidth = () => window.innerWidth;
  useEffect(() => {
    const resizeListener = () => {
      setCilentWidth(getWidth());
    };
    window.addEventListener("resize", resizeListener);
  });
  //-----------------------------------------------------------------------------------------

  useEffect(() => {
    routeTitleVar(String(t('계정잔액')));
    getMemberInfo();
    onClickAgentId(String(myId));
    //sidebar close-----------------------
    if (clientWidth <= 768) {
      sidebarVar(false);
    }
    //-----------------------------------

  }, []);


  useEffect(() => {
    routeTitleVar(String(t('계정잔액')));
    getMemberInfo();
    onClickAgentId(String(myId));
  }, []);
  useEffect(() => {
    routeTitleVar(String(t('계정잔액')));
  }, [selectedLang]);
  return (
    <div>
      <div className='flex'>
        <div className='mr-2'>{t('에이전트')}:</div>
        {parentList.map((elem, index) => {
          if (index === 0) {
            return (
              <div
                className='font-semibold text-blue-500 ml-1 cursor-pointer'
                key={elem}
                onClick={() => -onClickAgentId(elem)}
              >{`${String(elem)}`}</div>);
          } else {
            return (
              <div
                className='font-semibold text-blue-500 ml-1 cursor-pointer'
                key={elem}
                onClick={() => onClickAgentId(elem)}
              >{`/${String(elem)}`}</div>
            );
          }
        })}
      </div>
    </div>
  );
};
