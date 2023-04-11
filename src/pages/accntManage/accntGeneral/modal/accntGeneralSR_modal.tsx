import { useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GrClose } from "react-icons/gr";
import { langVar, sRModal, subAccountData } from "../../../../common/apollo";

interface IModalProps {
  // setSRModal: React.Dispatch<React.SetStateAction<boolean>>;
  sRModalType: string;
}

export const AccntGeneralSRModal: React.FC<IModalProps> = ({
  // setSRModal,
  sRModalType,
}) => {
  const { t } = useTranslation(["page"]);

  const selectedLang = useReactiveVar(langVar);
  const accntData = useReactiveVar(subAccountData);
  const srModal = useReactiveVar(sRModal);

  const clickModalClose = () => {
    sRModal(!srModal);
  };

  useEffect(() => {}, []);

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-1000 overflow-auto outline-0">
      <div className="fixed w-full h-full bg-black bg-opacity-40 flex flex-col justify-center items-center">
        <div className="w-11/12 md:w-1/2 2xl:w-1/3 top-12 shadow-lg">
          <div className="">
            <div className="lg:col-span-2">
              <div className="border rounded-t-md font-medium text-lg px-6 py-3 border-b flex flex-row justify-between bg-gray-100">
                <div className="text-gray-500 font-bold">
                  {sRModalType === "S" ? t("쉐어") : t("롤링")}
                </div>
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
                  <div className="">
                    <div className="form-group mb-6 flex">
                      <div className="flex flex-row items-center">
                        <div
                          className={`text-gray-500 mr-1 ${
                            selectedLang === "English" ? "w-24" : "w-12"
                          }`}
                        >
                          {t("계정명")}:{" "}
                        </div>
                      </div>
                      <div className="pl-2 w-40">{accntData?.user_id}</div>
                    </div>
                    {accntData?.baccarat_permit === "Y" ? (
                      <div className="form-group mb-6 flex">
                        <div className="flex flex-row items-center">
                          <div
                            className={`text-gray-500 mr-1 ${
                              selectedLang === "English" ? "w-24" : "w-12"
                            }`}
                          >
                            {t("바카라")}:{" "}
                          </div>
                        </div>
                        <div className="pl-2 w-40">
                          {`${t("쉐어")} ${accntData?.baccarat_share} %`}
                        </div>
                        <div className="pl-2 w-40">
                          {`${t("롤링")} ${accntData?.baccarat_rolling} %`}
                        </div>
                      </div>
                    ) : null}
                    {accntData?.slot_permit === "Y" ? (
                      <div className="form-group mb-6 flex">
                        <div className="flex flex-row items-center">
                          <div
                            className={`text-gray-500 mr-1 ${
                              selectedLang === "English" ? "w-24" : "w-12"
                            }`}
                          >
                            {t("슬롯")}:{" "}
                          </div>
                        </div>
                        <div className="pl-2 w-40">
                          {`${t("쉐어")} ${accntData?.slot_share} %`}
                        </div>
                        <div className="pl-2 w-40">
                          {`${t("롤링")} ${accntData?.slot_rolling} %`}
                        </div>
                      </div>
                    ) : null}
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
