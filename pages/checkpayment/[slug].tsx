import * as React from "react";
import cyberSourceSecureConfig from "../../helper/cyberSourceSecureConfig";
import Loader from "../commoncmp/loader";
import Script from "next/script";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { CBQ_ACCESS_KEY,CBQ_PROFILE_ID,CBQ_MERCHANT_ID,CBQ_TRANSACTION_TYPE,CBQ_CURRENCY_CODE,CBQ_TRANSACTION_URL} from "../../helper/config";

export default function CheckPayment() {
  const [showLoader, setShowLoader] = React.useState(true);
  setTimeout(callBack_func, 5000);
  function callBack_func() {
    setShowLoader(false);
  }
  const router = useRouter();

  var price: any = '';
  var refrenceNumber: any = '';
  var invoiceid: any = '';
  var sageCustomerId: any = '';
  var creditNotesId : any = '';
  var dbcustomerid : any = '';
  var creditNoteAmount : any = '';
  var salseOrder:any='';
  var customerIdd:any='';
//   var dueInvoiceAmount:any='';
// var finalAmountToPay:any;

  // var invoiceTitle:any='';
  // var itemIdd:any='';
  
  React.useEffect(() => {
    setlocal();
    
    var search = router.query;
     price = search.amount;
     refrenceNumber = search.refrenceNumber;
     invoiceid = search.invoiceid;
     sageCustomerId = search.sageCustomerId;
     creditNotesId= search.creditNotesId;
     dbcustomerid =search.dbcustomerid;
     creditNoteAmount =search.creditNoteAmount;
     salseOrder=search?.salseOrder;
     customerIdd=search.customerIdd;
    //  dueInvoiceAmount=search.dueInvoiceAmount;
    //  finalAmountToPay=search.finalAmountToPay;
    //  invoiceTitle=search?.invoiceTitle;
    //  itemIdd=search?.itemIdd;
     
  }, [router.query]);
    console.log('datadatasearch',router.query);
  function setlocal() {
    localStorage?.setItem("cbqRefrenceNumber", JSON.stringify(refrenceNumber));
    localStorage?.setItem("price", JSON.stringify(price));
    localStorage?.setItem("sageCustomerId", JSON.stringify(sageCustomerId));
    localStorage?.setItem("creditNotesId", JSON.stringify(creditNotesId));
    localStorage?.setItem("dbcustomerid", JSON.stringify(dbcustomerid));
    localStorage?.setItem("creditNoteAmount", JSON.stringify(creditNoteAmount));
    localStorage?.setItem("dbInvoiceid", JSON.stringify(invoiceid));
    localStorage?.setItem("customerIdid", JSON.stringify(customerIdd));
    // localStorage?.setItem("dueInvoiceAmount", JSON.stringify(dueInvoiceAmount));
    // localStorage?.setItem("finalAmountToPay", JSON.stringify(finalAmountToPay));


    // localStorage?.setItem("invoiceTitle", JSON.stringify(invoiceTitle));
    // localStorage?.setItem("itemIdd", JSON.stringify(itemIdd));

    if(salseOrder !== ''){
    localStorage?.setItem("salseOrder", JSON.stringify(salseOrder));
    }
  }
  let search = router.query;
  console.log('invoiceidinvoiceidinvoiceid',search);
   price = search.amount;
   refrenceNumber = search.refrenceNumber;
   invoiceid = search.invoiceid;
   sageCustomerId = search.sageCustomerId;
   creditNotesId= search.creditNotesId;
   dbcustomerid =search.dbcustomerid;
   creditNoteAmount =search.creditNoteAmount;
   salseOrder=search?.salseOrder

  const currentDateTime = new Date().toISOString().split(".")[0] + "Z";
  const transactionUniqid = uuidv4();
  let data: any = {
    access_key: CBQ_ACCESS_KEY,
    profile_id: CBQ_PROFILE_ID,
    req_profile_id: CBQ_PROFILE_ID,
    ots_profileid: CBQ_PROFILE_ID,
    merchant_id: CBQ_MERCHANT_ID,
    transaction_uuid: transactionUniqid,
    signed_field_names:
      "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency",
    unsigned_field_names: "",
    signed_date_time: currentDateTime,
    locale: "en",
    transaction_type: CBQ_TRANSACTION_TYPE,
    // 'reference_number': refrensh__number,
    reference_number: refrenceNumber,
    amount: price,
    currency: CBQ_CURRENCY_CODE,
  };
  
  console.log('datadata',data);

  let signature = cyberSourceSecureConfig.sign(data);
  console.log("signature =>", signature);

  data["signature"] = signature;

  console.log('signaturesignature',signature);


  const [accessKey, setAccessKey] = React.useState<any>(
    CBQ_ACCESS_KEY
  );
  const [profileId, setProfileId] = React.useState<any>(
    CBQ_PROFILE_ID
  );
  const [reqProfileId, setReqProfileId] = React.useState<any>(
    CBQ_PROFILE_ID
  );
  const [otsProfileid, setOtsProfileid] = React.useState<any>(
    CBQ_PROFILE_ID
  );
  const [merchantId, setMerchantId] = React.useState<any>(
    CBQ_MERCHANT_ID
  );
  const [transactionUuid, setTransactionUuid] =
    React.useState<any>(transactionUniqid);
  const [signedFieldNames, setSignedFieldNames] = React.useState<any>(
    "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency"
  );
  const [unsignedFieldNames, setUnsignedFieldNames] = React.useState<any>("");
  const [signedDateTime, setSignedDateTime] =
    React.useState<any>(currentDateTime);
  const [locale, setLocale] = React.useState<any>(process.env.NEXT_PUBLIC_CBQ_LOCALE);
  const [transactionType, setTransactionType] = React.useState<any>(
    CBQ_TRANSACTION_TYPE
  );
  const [referenceNumber, setReferenceNumber] =
    React.useState<any>(refrenceNumber);
  const [amount, setAmount] = React.useState<any>(price);
  const [currency, setCurrency] = React.useState<any>(
    CBQ_CURRENCY_CODE
  );

  const [actionurl ,setActionUrl] = React.useState<any>(process.env.NEXT_PUBLIC_CBQ_ACTION_URL)
  return (
    <>
      {showLoader && <Loader />}
      <Script
        type="text/javascript"
        strategy="afterInteractive"
        data-error="errorCallback"
        data-cancel="cancelCallback"
      >
           {/* {`setTimeout("document.payment_confirmation.submit()",4000)`}; */}
        {`document.forms['payment_confirmation'].submit()`}
      </Script>

      <div>
        <form
          name="payment_confirmation"
          id="payment_confirmation"
          action={CBQ_TRANSACTION_URL}
          method="post"
        >
          <input
            
            type="hidden"
            id="access_key"
            name="access_key"
            value={accessKey}
          />
          <input
            
            type="hidden"
            id="profile_id"
            name="profile_id"
            value={profileId}
          />
          <input
            
            type="hidden"
            id="req_profile_id"
            name="req_profile_id"
            value={reqProfileId}
          />
          <input
            
            type="hidden"
            id="ots_profileid"
            name="ots_profileid"
            value={otsProfileid}
          />
          <input
            
            type="hidden"
            id="merchant_id"
            name="merchant_id"
            value={merchantId}
          />
          <input
            
            type="hidden"
            id="transaction_uuid"
            name="transaction_uuid"
            value={transactionUuid}
          />
          <input
            
            type="hidden"
            id="signed_field_names"
            name="signed_field_names"
            value={signedFieldNames}
          />
          <input
            
            type="hidden"
            id="unsigned_field_names"
            name="unsigned_field_names"
            value={unsignedFieldNames}
          />
          <input
            
            type="hidden"
            id="signed_date_time"
            name="signed_date_time"
            value={currentDateTime}
          />
          <input  type="hidden" id="locale" name="locale" value={locale} />
          <input
            
            type="hidden"
            id="transaction_type"
            name="transaction_type"
            value={transactionType}
          />
          <input
            
            type="hidden"
            id="reference_number"
            name="reference_number"
            value={referenceNumber}
          />
          <input  type="hidden" id="amount" name="amount" value={amount} />
          <input
            
            type="hidden"
            id="currency"
            name="currency"
            value={currency}
          />
          <input
            
            type="hidden"
            id="signature"
            name="signature"
            value={signature}
          />

          <input
            hidden
            type="submit"
            id="btnSubmit"
            name="btnSubmit"
            value="Submit"
          />
        </form>
      </div>
    </>
  );
}