import React, { useEffect, useState } from "react";
import { getBalance } from "@api/index";
import { PRICING } from "@constants/url";
import { BtnType } from "../../types/enums";
import { Button } from "@components/index";
import "./styles.scss";
interface Props {
  gottenKey: string;
  needToUpdateBalance: number;
  isCreditsInsufficient: boolean;
  setIsCreditsInsufficient: (status: boolean) => void;
}

const BalanceBanner: React.FC<Props> = ({
  gottenKey,
  needToUpdateBalance,
  isCreditsInsufficient,
  setIsCreditsInsufficient,
}) => {
  const [keyBalance, setKeyBalance] = useState<number | null>(null);
  const [checkBalanceAgain, setCheckBalanceAgain] = useState<number>(0);

  useEffect(() => {
    const getBalanceRequest = async () => {
      const response: GetBalanceReturnType = await getBalance(gottenKey);
      if (response.success) {
        if (response.msg === 0) {
          setIsCreditsInsufficient(true);
        } else {
          setIsCreditsInsufficient(false);
        }
        setKeyBalance(response.msg as number);
      } else {
        setIsCreditsInsufficient(true);
      }
    };

    getBalanceRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkBalanceAgain, gottenKey, needToUpdateBalance]);

  useEffect(() => {
    const checkIfUserCameBack = () => {
      if (document.visibilityState === "visible") {
        setCheckBalanceAgain((prev) => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", () => {
      checkIfUserCameBack();
    });

    return () => {
      document.removeEventListener("visibilitychange", checkIfUserCameBack);
    };
  }, []);

  return (
    <div className={`balance-container ${isCreditsInsufficient ? 'full-width' : ''}`}>
      <div className="text-container">
        <span className="balance-text">Balance</span>
        <span className="credits-text">{keyBalance} credits </span>
      </div>
      {isCreditsInsufficient ? (
        <div style={{ width: 180, height: 30 }}>
          <Button
            type={BtnType.ADD_CREDITS}
            cb={() => window.open(PRICING, "_blank")}
            tabIndex={99}
          />
        </div>
      ) : (
        <div
          className="plus-container"
          onClick={() => window.open(PRICING, "_blank")}
          tabIndex={99}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              window.open(PRICING, "_blank");
            }
          }}
          title="Add more credits"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 5.5V0.5H6.5V5.5H11.5V6.5H6.5V11.5H5.5V6.5H0.5V5.5H5.5Z"
              fill="#520BE5"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default BalanceBanner;
