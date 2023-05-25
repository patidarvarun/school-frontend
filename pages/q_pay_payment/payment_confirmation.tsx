import React, { useState } from "react";
import { useRouter } from "next/router";
import crypto from "crypto";
import moment from "moment";
import Script from "next/script";
import Loader from "../commoncmp/loader";
import commmonfunctions from "../../commonFunctions/commmonfunctions";

export default function Payment_confirmation() {
  const router = useRouter();
  let SECRET_KEY = "OGQ4NWZhYjQwZjVjZWI3MjFlYTBiNDVm";
  const [showLoader, setShowLoader] = React.useState(true);
  setTimeout(callBack_func, 7000);
  function callBack_func() {
    setShowLoader(false);
  }
  React.useEffect(() => {
  }, [router.query]);

  var date1 = new Date();
  let dateTime1 = moment(date1).format("DDMMYYYYHHmmss");

  let search: any = router?.query;

  let Action = "0";
  let Amount = search.amount;
  let BankID = "QPAYPG02";
  let CurrencyCode = "634";
  // let ExtraFields_f14 = "http://localhost:5003/api/get_qpay";
  let ExtraFields_f14 = "https://api-school.mangoitsol.com/api/get_qpay";
  let ExtraFields_f3 = "1000000001";
  let Lang = "en";
  let MerchantID = "QIS";
  let MerchantModuleSessionID = "aTnieSdK5fV3ZZ4Qc1OD2J-";
  let NationalID = "8897871212";
  let PUN = search.PUN;
  let PaymentDescription = `EZConnect${"+"}Sample${"+"}Payment`;
  let Quantity = "1";
  let TransactionRequestDate = search.dateTime;

  return (
    <>
      {showLoader && <Loader />}
      <Script
        type="text/javascript"
        strategy="afterInteractive"
        data-error="errorCallback"
        data-cancel="cancelCallback"
      >
        {`setTimeout("document.payment_confirmation.submit()",4000)`};
        {/* {`document.forms['payment_confirmation'].submit()`} */}
      </Script>

      <div style={{ display: "none" }}>
        <form
          id="payment_confirmation"
          name="payment_confirmation"
          action="https://pgtest3.qcb.gov.qa/QPayOnePC/PaymentPayServlet"
          method="post"
        >
          <fieldset id="confirmation">
            <div>
              <input type="hidden" value={Action} name="Action" id="Action" />
              <input
                type="hidden"
                value={search.amount}
                name="Amount"
                id="Amount"
              />
              <input type="hidden" value={BankID} name="BankID" id="BankID" />
              <input
                type="hidden"
                value={CurrencyCode}
                name="CurrencyCode"
                id="CurrencyCode"
              />
              <input
                type="hidden"
                value={ExtraFields_f14}
                name="ExtraFields_f14"
                id="ExtraFields_f14"
              />
              <input
                type="hidden"
                value={ExtraFields_f3}
                name="ExtraFields_f3"
                id="ExtraFields_f3"
              />
              <input type="hidden" value={Lang} name="Lang" id="Lang" />
              <input
                type="hidden"
                value={MerchantID}
                name="MerchantID"
                id="MerchantID"
              />
              <input
                type="hidden"
                value={MerchantModuleSessionID}
                name="MerchantModuleSessionID"
                id="MerchantModuleSessionID"
              />
              <input
                type="hidden"
                value={NationalID}
                name="NationalID"
                id="NationalID"
              />
              <input type="hidden" value={search.PUN} name="PUN" id="PUN" />
              <input
                type="hidden"
                value="EZConnect+Sample+Payment"
                name="PaymentDescription"
                id="PaymentDescription"
              />
              <input
                type="hidden"
                value={Quantity}
                name="Quantity"
                id="Quantity"
              />
              <input
                type="hidden"
                value={TransactionRequestDate}
                name="TransactionRequestDate"
                id="TransactionRequestDate"
              />
              <div id="paymentDetailsSection" className="section"></div>
            </div>
          </fieldset>
          <input
            hidden
            type="text"
            id="SecureHash"
            name="SecureHash"
            value={search.hashKey}
          />
          <input
            hidden
            type="submit"
            id="btnSubmit"
            name="btnSubmit"
            value="Confirm"
          />
        </form>
      </div>
    </>
  );
}
