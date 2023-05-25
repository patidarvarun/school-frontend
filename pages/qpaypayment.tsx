import * as React from "react";
import qpayConfig from "../helper/qpayConfig";
import Loader from "./commoncmp/loader";
import Script from "next/script";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";

export default function qpaypayment() {
 const [showLoader,setShowLoader]= React.useState(true);
 setTimeout(callBack_func, 5000);
 function callBack_func() {
  setShowLoader(false)
 }
 const router = useRouter();
  React.useEffect(()=>{
    setlocal();
  },[router.query]);
  
function setlocal (){
  localStorage?.setItem('invoiceid',JSON.stringify(invoiceid));
  localStorage?.setItem('cbqRefrenceNumber',JSON.stringify(refrenceNumber));
  localStorage?.setItem('price',JSON.stringify(price));
  localStorage?.setItem('sageCustomerId',JSON.stringify(sageCustomerId));
}
  let search = router.query;
  let price = search.amount;
  let refrenceNumber = search.refrenceNumber;
  let invoiceid = search.invoiceid ;
  let sageCustomerId = search.sageCustomerId;
 
  const currentDateTime = new Date().toISOString().split(".")[0] + "Z";
  const transactionUniqid= uuidv4();
  let data: any = {
    SECRET_KEY: process.env.NEXT_PUBLIC_QPAY_SECERET_KEY ,
    Action: process.env.NEXT_PUBLIC_QPAY_ACTION ,
    Amount:price,
    BankID: process.env.NEXT_PUBLIC_QPAY_BankID,
    CurrencyCode: process.env.NEXT_PUBLIC_QPAY_CURRENCYCODE,
    ExtraFields_f14: process.env.NEXT_PUBLIC_QPAY_SUCCESS_URL,
    ExtraFields_f3: "1000000001",
    Lang: process.env.NEXT_PUBLIC_QPAY_LANG,
    MerchantID: process.env.NEXT_PUBLIC_QPAY_MERCHANT_ID,
    MerchantModuleSessionID: process.env.NEXT_PUBLIC_QPAY_MERCHANT_MODULE_SESSION_ID,
    NationalID: process.env.NEXT_PUBLIC_QPAY_NATIONAL_ID,
    PUN: transactionUniqid,
    PaymentDescription: "EZConnect Sample Payment",
    Quantity: 1,
    TransactionRequestDate:currentDateTime
  };
  let signature = qpayConfig.sign(data);
  console.log("signature =>", signature);

  data["SecureHash"] = signature;

  const [secretKey, setSecretKey] = React.useState<any>(
    process.env.NEXT_PUBLIC_QPAY_SECERET_KEY
  );
  const [action, setAction] = React.useState<any>(
    process.env.NEXT_PUBLIC_QPAY_ACTION
  );
  const [bankid, setBankId] = React.useState<any>(
    process.env.NEXT_PUBLIC_QPAY_BankID
  );
  const [currencyCode, setCurrencyCode] = React.useState<any>(
    process.env.NEXT_PUBLIC_QPAY_CURRENCYCODE
  );
  const[successurl,setSuccessUrl]=React.useState<any>()
  const[ExtraFieldsf3,setExtraFieldsf3]=React.useState<any>()

  const [merchantId, setMerchantId] = React.useState<any>(process.env.NEXT_PUBLIC_QPAY_MERCHANT_ID);
  const [transactionUuid, setTransactionUuid] = React.useState<any>(transactionUniqid);
  const [merchantSessionid, setMerchantSessionid] = React.useState<any>(process.env.NEXT_PUBLIC_QPAY_MERCHANT_MODULE_SESSION_ID);
  const [nationalId, setNationalId] = React.useState<any>(process.env.NEXT_PUBLIC_QPAY_NATIONAL_ID);
  const [description, setDescription] = React.useState<any>("EZConnect Sample Payment");
  const [locale, setLocale] = React.useState<any>(process.env.NEXT_PUBLIC_CBQ_LOCALE);
  const [quantity, setQantity] = React.useState<any>(1);
  const [transactionDate, setTransactionDate] = React.useState<any>(currentDateTime);
  const [amount, setAmount] = React.useState<any>(price);
  const [currency, setCurrency] = React.useState<any>( process.env.NEXT_PUBLIC_QPAY_CURRENCYCODE);

  const [actionurl ,setActionUrl] = React.useState<any>(process.env.NEXT_PUBLIC_QPAY_ACTION_URL)
  return (
    <>
    {showLoader && <Loader/>}
     <Script  
      type="text/javascript"
     strategy="afterInteractive"
     data-error="errorCallback"
     data-cancel="cancelCallback"
   
    
      >
      {`document.forms['payment_confirmation'].submit()`}
      </Script>
   
      <div>
        <form
          name="payment_confirmation"
          id="payment_confirmation"
          action={actionurl}
          method="post"
        >
          <input
            hidden
            type="text"
            id="SECRET_KEY"
            name="SECRET_KEY"
            value={secretKey}
          />
          <input
          hidden
            type="text"
            id="Action"
            name="Action"
            value={action}
          />
          <input
          hidden
            type="text"
            id="Amount"
            name="Amount"
            value={amount}
          />
          <input
          hidden
            type="text"
            id="BankID"
            name="BankID"
            value={bankid}
          />
          <input
          hidden
            type="text"
            id="CurrencyCode"
            name="CurrencyCode"
            value={currency}
          />
          <input
          hidden
            type="text"
            id="ExtraFields_f14"
            name="ExtraFields_f14"
            value={successurl}
          />
             <input
          hidden
            type="text"
            id="ExtraFields_f3"
            name="ExtraFields_f3"
            value={ExtraFieldsf3}
          />
            <input
          hidden
            type="text"
            id="MerchantID"
            name="MerchantID"
            value={merchantId}
          />
          <input
          hidden
            type="text"
            id="PUN"
            name="PUN"
            value={transactionUuid}
          />
             <input
          hidden
            type="text"
            id="MerchantModuleSessionID"
            name="MerchantModuleSessionID"
            value={merchantSessionid}
          />
             <input
          hidden
            type="text"
            id="NationalID"
            name="NationalID"
            value={nationalId}
          />
          <input
          hidden
            type="text"
            id="Lang"
            name="Lang"
            value={locale}
          />
          <input
          hidden
            type="text"
            id="PaymentDescription"
            name="PaymentDescription"
            value={description}
          />
          <input
          hidden
            type="text"
            id="Quantity"
            name="Quantity"
            value={quantity}
          />
          
          <input
          hidden
            type="text"
            id="TransactionRequestDate"
            name="TransactionRequestDate"
            value={transactionDate}
          />
        
      
          <input
          hidden
            type="text"
            id="SecureHash"
            name="SecureHash"
            value={signature}
          />

          <input hidden type="submit" id="btnSubmit" name="btnSubmit" value="Confirm" />
        </form>
      </div>
    </>
  );
}
