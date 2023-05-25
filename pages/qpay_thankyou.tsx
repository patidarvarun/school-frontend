import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { api_url, auth_token } from "../helper/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getwayService from "../services/gatewayService";
import { AddLogs } from "../helper/activityLogs";
import commmonfunctions from "../commonFunctions/commmonfunctions";
import { CircularProgress, Typography } from "@mui/material";
import Loader from "./commoncmp/myload";

export default function QpayThankyou() {
  const router = useRouter();
  const [spinner, setShowspinner] = React.useState(false);
  const [load, setLoad] = React.useState<any>(true);

  let data: any = router?.query;
  const [userUniqueId, setUserUniqId] = useState<any>();
  let getitemIdd =
    typeof window !== "undefined"
      ? window.localStorage.getItem("itemIdd")
      : false;
  let note =
    typeof window !== "undefined" ? window.localStorage.getItem("note") : false;
  let invoiceId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("invoiceId")
      : false;
  let creditNoteId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("creditNoteId")
      : false;
  let userr =
    typeof window !== "undefined" ? window.localStorage.getItem("user") : false;
  let sageCustomerId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("sagecustomerid")
      : false;
  const dbcustomerid =
    typeof window !== "undefined"
      ? window.localStorage.getItem("dbcustomerid")
      : false;
      const invoiceTitle = typeof window !== "undefined"
      ? window.localStorage.getItem("invoiceTitle")
      : false;

  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });
    const rendomTransactionId = keyGen(5);
    if (data?.StatusMessage === "Canceled before payment method selection.") {
      console.log("PaymentCancelled");
    } else {
      let reqData = {
        totalAmount: data.amount,
        paidAmount: data.amount,
        transactionId: `QPay-${rendomTransactionId} `,
        amexorderId: data.PUN,
        paymentMethod: "QPay",
        idForPayment: data.PUN,
        creditNotesId: creditNoteId === null ? null : creditNoteId,
        sales_order_Id: data.PUN,
      };
      transactionSave(reqData);
    }
    setTimeout(() => {
      setLoad(false);
    }, 5000);
  }, [router.query]);

  const redirectAfterCBQpay = () => {
    setShowspinner(true);
    if (userr === "user") {
      typeof window !== "undefined"
        ? window.localStorage.removeItem("itemIdd")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("invoiceId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("creditNoteId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("user")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("note")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("sagecustomerid")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("invoiceTitle")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("dbcustomerid")
        : false;
      router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`);
      setShowspinner(false);
    } else {
      typeof window !== "undefined"
        ? window.localStorage.removeItem("itemIdd")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("invoiceId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("creditNoteId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("user")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("note")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("sagecustomerid")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("invoiceTitle")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("dbcustomerid")
        : false;
      router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/admin/dashboard`);
    }
  };

  const keyGen = (keyLength: any) => {
    var i,
      key = "",
      characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (i = 0; i < keyLength; i++) {
      key += characters.substr(
        Math.floor(Math.random() * charactersLength + 1),
        1
      );
    }
    return key;
  };

  const transactionSave = async (data1: any) => {
    await axios({
      method: "POST",
      url: `${api_url}/createTransaction`,
      data: data1,
      headers: {
        Authorization: auth_token,
      },
    })
      .then(async (result: any) => {
        if(invoiceTitle === "INVOICES"){
          let maildata = {
            invoiceTitle: invoiceTitle,
            customerId: dbcustomerid,
            transactionId: result && result?.data?.insetTransatction?.insertId,
            activityId: 0,
            itemId: getitemIdd,
          };
          commmonfunctions.SendEmailsAfterPayment(maildata).then((res) => {});
        }else{
          let maildata = {
            invoiceTitle: invoiceTitle,
            customerId: dbcustomerid,
            transactionId: result && result?.data?.insetTransatction?.insertId,
            activityId: getitemIdd,
            itemId: 0,
          };
          commmonfunctions.SendEmailsAfterPayment(maildata).then((res) => {});
        }
        
        AddLogs(
          userUniqueId,
          `Sales order transaction id - #${data1?.transactionId}`
        );
        await getwayService.getARInoviceRecordNumber(
          data.PUN,
          async function (ARRecordNumberResult: any) {
            const ARdata = {
              customerId: sageCustomerId,
              amount: data.amount,
              ARpaymentMethod: "EFT",
              referenceNumber: result.data.referenceNumber,
              ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
            };
            console.log("data for apply pay =>", ARdata);
            await getwayService.createAndApplyPaymentARInvoice(
              ARdata,
              async function (result: any) {
                await updateInvoiceAfterPay(getitemIdd);
              }
            );
          }
        );
      })
      .catch((error: any) => {
        console.log("error =>", error);
      });
  };
  const updateInvoiceAfterPay = async (invoiceId: any) => {
    try {
      let requestedData = {
        note: null,
        status: "Paid",
      };
      await axios({
        method: "PUT",
        url: `${api_url}/updateInvoice/${invoiceId}`,
        data: requestedData,
        headers: {
          "content-type": "multipart/form-data",
        },
      })
        .then((res) => {
          console.log("okkk");
        })
        .catch((err) => {});
    } catch (error: any) {
      console.log("error => ", error.message);
    }
  };

  return (
    <div>
      {load ? (
        <Loader />
      ) : (
        <div className="content">
          <div className="wrapper-1">
            <div className="wrapper-2">
              {data?.StatusMessage === "Payment%20failed." ||
              data?.StatusMessage === "Payment failed." ||
              data?.StatusMessage ===
                "Canceled before payment method selection." ? (
                <>
                  <h1 style={{ color: "red" }}>Error</h1>
                  <p>Payment Failed </p>
                  {/* <p>you should receive a confirmation email soon </p> */}
                </>
              ) : (
                <>
                  <h1>Thank you !</h1>
                  <p>Thanks for Payment. </p>
                  <p>you should receive a confirmation email soon </p>
                </>
              )}
              <div></div>
              <button className="go-home" onClick={redirectAfterCBQpay}>
                go to dashboard
                <Typography style={{ fontSize: "2px", paddingLeft: "10px" }}>
                  {spinner === true ? <CircularProgress color="inherit" /> : ""}
                </Typography>
              </button>
            </div>
          </div>
        </div>
      )}

      <link
        href="https://fonts.googleapis.com/css?family=Kaushan+Script|Source+Sans+Pro"
        rel="stylesheet"
      ></link>
    </div>
  );
}
