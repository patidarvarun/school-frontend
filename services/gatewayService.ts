// var request = require('request');
// import request from 'request'
var qs = require("qs");
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

// import { getApiVersion, getBaseUrl, getMerchantId, getTestMerchantUrl, setAuthentication } from '../util/commonUtils';
// var {AMEX_TOKEN} = require('../helper/config');
import {
  IS_CERT_AUTH_ENABLED,
  AMEX_TOKEN,
  BASEURL,
  API_VERSION,
  MERCHANTID,
  DB_BASE_URL,
  CBQ_ACCESS_KEY,
  CBQ_PROFILE_ID,
  CBQ_MERCHANT_ID,
  CBQ_TRANSACTION_TYPE,
  CBQ_CURRENCY_CODE,
  api_url,
} from "../helper/config";

import commonUtils from "../util/commonUtils";
import cyberSourceSecureConfig from "../helper/cyberSourceSecureConfig";
import moment from "moment";
const config: any = {
  IS_CERT_AUTH_ENABLED,
  BASEURL,
  API_VERSION,
  MERCHANTID,
  DB_BASE_URL,
  AMEX_TOKEN,
};
class getwayService {
  getSession = async (requestData: any, callback: any) => {
    console.log("AMEX_TOKEN =>", AMEX_TOKEN);
    var url = commonUtils.getTestMerchantUrl(config) + "/session";
    var data = JSON.stringify(requestData);

    var configData = {
      method: "post",
      url: url,
      headers: {
        Authorization: `Basic ${AMEX_TOKEN}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      data: data,
    };
    await axios({
      method: "POST",
      url: `${api_url}/get_amex_session`,
      data: configData,
    })
      .then((res) => {
        if (res.status === 200) {
          return callback(res);
        }
      })
      .catch((error) => {
        return callback(error);
      });
  };

  retriveOrder = async (url: any, callback: any) => {
    var configData = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Basic ${AMEX_TOKEN}`,
        "Access-Control-Allow-Origin": "*",
      },
      data: "",
    };
    console.log(configData, "configData");
    await axios({
      method: "POST",
      url: `${api_url}/getAmexRetriveOrder`,
      data: configData,
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("response order ", res);
          return callback(res);
        }
      })
      .catch((error) => {
        console.log("error =>", error);
        return callback(error);
      });

    // await axios(configData)
    //   .then(function (response) {
    //     console.log("response order ", response);
    //     return callback(response);
    //   })
    //   .catch(function (error) {
    //     console.log("error =>", error);
    //     return callback(error);
    //   });
  };

  apiRequestBody = async (apiOperation: any, data: any) => {
    var returnObj: any = {
      apiOperation: apiOperation,
    };
    switch (apiOperation) {
      case "RETRIVE":
        returnObj.transaction = {
          targetOrderId: data.orderId,
        };
        break;

      default:
        // throwUnsupportedProtocolException();
        "Error in request body";
    }
    return returnObj;
  };

  getRequestUrl = async (apiProtocol: any, request: any) => {
    var base = commonUtils.getBaseUrl(config);

    switch (apiProtocol) {
      case "REST":
        var url =
          getApiBaseURL(base, apiProtocol) +
          "/version/" +
          commonUtils.getApiVersion(config) +
          "/merchant/" +
          commonUtils.getMerchantId(config) +
          "/order/" +
          request.orderId;
        if (request.transactionId) {
          url += "/transaction/" + request.transactionId;
        }
        return url;
      case "NVP":
        return (
          getApiBaseURL(base, apiProtocol) +
          "/version/" +
          commonUtils.getApiVersion(config)
        );
      default:
        // throwUnsupportedProtocolException();
        "Error in request body";
    }
    return null;
  };

  // QPAy source secure
  redirectQPayPayment = async (requestedData: any) => {
    var date1 = new Date();
    let dateTime1 = moment(date1).format("DDMMYYYYHHmmss");
    var hash = "";

    let Action = "0";
    let Amount = requestedData.amount;
    let BankID = "QPAYPG02";
    let CurrencyCode = "634";
    let ExtraFields_f14 = "https://api-school.mangoitsol.com/api/get_qpay";
    let ExtraFields_f3 = "1000000001";
    let Lang = "en";
    let MerchantID = "QIS";
    let MerchantModuleSessionID = "aTnieSdK5fV3ZZ4Qc1OD2J-";
    let NationalID = "8897871212";
    let PUN = requestedData.PUN;
    let PaymentDescription = `EZConnect${"+"}Sample${"+"}Payment`;
    let Quantity = "1";
    let TransactionRequestDate = dateTime1;

    let data =
      "OGQ4NWZhYjQwZjVjZWI3MjFlYTBiNDVm" +
      Action +
      Amount +
      BankID +
      CurrencyCode +
      ExtraFields_f14 +
      ExtraFields_f3 +
      Lang +
      MerchantID +
      MerchantModuleSessionID +
      NationalID +
      PUN +
      PaymentDescription +
      Quantity +
      TransactionRequestDate;

    const textAsBuffer = new TextEncoder().encode(data);
    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      textAsBuffer
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hash = hashArray.map((item) => item.toString(16).padStart(2, "0")).join("");

    window.location.replace(
      `/q_pay_payment/payment_confirmation?amount=${requestedData.amount}&PUN=${requestedData.PUN}&hashKey=${hash}&dateTime=${TransactionRequestDate}`
    );
  };

  // cyber source secure
  redirectCyberSourcePayment = async (requestedData: any) => {
    try {
      const currentDateTime = new Date().toISOString().split(".")[0] + "Z";
      const uniqId = uuidv4();
      const refrensh__number = commonUtils.keyGen(4);

      console.log("current date => ", currentDateTime);

      const data: any = {
        access_key: CBQ_ACCESS_KEY,
        profile_id: CBQ_PROFILE_ID,
        req_profile_id: CBQ_PROFILE_ID,
        ots_profileid: CBQ_PROFILE_ID,
        merchant_id: CBQ_MERCHANT_ID,
        transaction_uuid: uniqId,
        signed_field_names:
          "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency",
        unsigned_field_names: "",
        signed_date_time: currentDateTime,
        locale: "en",
        transaction_type: CBQ_TRANSACTION_TYPE,
        reference_number: requestedData.refrenceNumber,
        amount: requestedData.amount,
        currency: CBQ_CURRENCY_CODE,
        submit: "Submit",
      };

      let signature = await cyberSourceSecureConfig.sign(data);
      console.log("signature =>", signature);
      data["signature"] = signature;

      console.log("signaturesignature", signature);
      window.location.replace(
        `/checkpayment/cbq/?signature=${signature}&amount=${requestedData.amount}&refrenceNumber=${requestedData.refrenceNumber}&invoiceid=${requestedData.invoiceid}&dateTime=${currentDateTime}&transactionUniqid=${uniqId}`
      );
    } catch (error: any) {
      console.log("error =>", error.message);
    }
  };

  transactionDataSaveInDB = async (data: any, callback: any) => {
    var Tdata = JSON.stringify(data);
    var configData = {
      method: "post",
      url: `${config.DB_BASE_URL}/createTransaction`,
      headers: {
        "Content-Type": "application/json",
      },
      data: Tdata,
    };

    axios(configData)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        return callback(response.data);
      })
      .catch(function (error) {
        console.log(error);
        return callback(error);
      });
  };

  throwUnsupportedProtocolException = async () => {
    throw "Unsupported API protocol!";
  };

  createAndApplyPaymentARInvoice = async (data: any, callback: any) => {
    try {
      // var data = JSON.stringify({
      //   "customerId": "10381",
      //   "amount": 100,
      //   "ARpaymentMethod": "EFT",
      //   "referenceNumber": "RTC-000000002",
      //   "ARinvoiceRecordNumber": 1352
      // });
      var requestData = JSON.stringify(data);
      var configData = {
        method: "post",
        // url: 'http://localhost:5003/api/AccountsReceivable/applyPayment',
        url: `${config.DB_BASE_URL}/AccountsReceivable/applyPayment`,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      };

      await axios(configData)
        .then(function (response: any) {
          console.log(response,"!!!!!!!!!!!!!!!",JSON.stringify(response.data));
          return callback(response.data);
        })
        .catch(function (error: any) {
          console.log("error",error);
          return callback(error);
        });
    } catch (error) {
      console.log("error =>", error);
    }
  };

  saveTempTransaction = async (data: any, callback: any) => {
    try {
      var configData = {
        method: "POST",
        url: `${config.DB_BASE_URL}/createTempTransaction`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      await axios(configData)
        .then(function (response: any) {
          console.log(response);
          return callback(response);
        })
        .catch(function (error: any) {
          console.log(error);
          return callback(error);
        });
    } catch (error) {
      console.log("error =>", error);
    }
  };

  getARInoviceRecordNumber = async (
    sageIntacctARInvoiceID: any,
    callback: any
  ) => {
    try {
      console.log("sageIntacctARInvoiceID =>", sageIntacctARInvoiceID);
      var data = {
        arInvoiceId: sageIntacctARInvoiceID,
      };
      console.log("data =>", data);

      var configData = {
        method: "post",
        // url: 'http://localhost:5003/api/AccountsReceivable/getARInvoiceRecordNo',
        url: `${config.DB_BASE_URL}/AccountsReceivable/getARInvoiceRecordNo`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios(configData)
        .then(function (response: any) {
          console.log(JSON.stringify(response.data));
          return callback(response.data);
        })
        .catch(function (error: any) {
          console.log(error);
          return callback(error);
        });
    } catch (error) {
      console.log("Error =>", error);
    }
  };

  generateRefrenceNumber = (DBTransactionId: any) => {
    let gId = `${DBTransactionId?.toString()}`;
    let tempRef = "RCT-000000000";
    let refrenceNumber = tempRef.slice(0, -gId.length);
    let finalGeneratedRefrenceNumber = refrenceNumber + gId;
    console.log(
      "finalGeneratedRefrenceNumber =>",
      finalGeneratedRefrenceNumber
    );
    return finalGeneratedRefrenceNumber;
  };
  getTransactionData = async (id: any, callback: any) => {
    try {
      var data = {
        invoiceId: id,
      };

      var config = {
        method: "post",
        url: `${api_url}/getTransaction`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      await axios(config)
        .then(function (response: any) {
          console.log(JSON.stringify(response.data));
          return callback(response.data);
        })
        .catch(function (error: any) {
          console.log(error);
          return callback(error);
        });
    } catch (error) {
      console.log("Error =>", error);
    }
  };
}
function getApiBaseURL(gatewayHost: any, apiProtocol: any) {
  switch (apiProtocol) {
    case "REST":
      return gatewayHost + "/api/rest";
    case "NVP":
      return gatewayHost + "/api/nvp";
    default:
      // throwUnsupportedProtocolException();
      "Error in api base url function";
  }
  return null;
}

export default new getwayService();
