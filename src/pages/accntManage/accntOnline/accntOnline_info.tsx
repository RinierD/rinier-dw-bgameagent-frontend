import { useReactiveVar } from '@apollo/client';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { langVar, routeTitleVar } from '../../../common/apollo';

export const AccntOnlineInfo = () => {
  const { t } = useTranslation(['page']);
  useReactiveVar(routeTitleVar);
  const selectedLang = useReactiveVar(langVar);

  useEffect(() => {
    routeTitleVar(String(t('온라인회원')));
  }, []);
  useEffect(() => {
    routeTitleVar(String(t('온라인회원')));
  }, [selectedLang]);
  return (
    <div>
      <div>this is AccntOnlineInfo component</div>
    </div>
  );
};
