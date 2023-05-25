import React, { Fragment, useEffect, useState } from "react";
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
  let creditNoteAmount: any =
    typeof window !== "undefined"
      ? window.localStorage.getItem("creditNoteAmount")
      : false;
  let paymentToApplied: any =
    typeof window !== "undefined"
      ? window.localStorage.getItem("paymentToApply")
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
  const invoiceTitle =
    typeof window !== "undefined"
      ? window.localStorage.getItem("invoiceTitle")
      : false;
  let tempTransactionId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("tempTransactionId")
      : false;

  let customerIdd =
    typeof window !== "undefined"
      ? window.localStorage.getItem("customerIdd")
      : false;

  let dueInvoiceAmount: any =
    typeof window !== "undefined"
      ? window.localStorage.getItem("dueInvoiceAmount")
      : false;

  let finalAmountToPay: any =
    typeof window !== "undefined"
      ? window.localStorage.getItem("finalAmountToPay")
      : false;

  let checkSalesOrder: any =
    typeof window !== "undefined"
      ? window.localStorage.getItem("fromSalesOrder")
      : false;

  let checkInvoiceSales: any =
    typeof window !== "undefined"
      ? window.localStorage.getItem("invoiceSales")
      : false;

  let data: any = router?.query;

  useEffect(() => {
    if (data?.StatusMessage === undefined) {
      console.log("undefiend");
    } else if (
      data?.StatusMessage === "Payment failed." ||
      data?.StatusMessage === "Payment%20failed." ||
      data?.StatusMessage === "Canceled before payment method selection."
    ) {
      setLoad(false);
      return console.log("payment failed");
    } else {
      setLoad(true);
      let reqData = {
        id: invoiceId,
        creditNotesId: "null",
      };
      if (tempTransactionId !== null) {
        bulkTransactionArray();
      } else {
        transactionSave(reqData);
      }
    }
  }, [router.query]);
  let customerParentIdd = "";
  var creditNoteNewId: any;

  const redirectToCancelled = async () => {
    setLoad(true);
    setShowspinner(true);
    // let startWith = checkInvoiceSales && checkInvoiceSales.includes("SI");

    if (checkSalesOrder === "fromSalesOrder") {
      try {
        const response = await fetch(`${api_url}/getTransId/${data?.PUN}`, {
          method: "GET",
          headers: {
            Authorization: auth_token,
          },
        });
        const res = await response.json();
        console.log(response, "res", res);
        await axios({
          method: "DELETE",
          url: `${api_url}/deleteActivityInvoice/${res?.data[0]?.invoiceId}`,
        }).then(async (data) => {
          console.log("dataSage", data);
        });
        await axios({
          method: "DELETE",
          url: `${api_url}/deleteTransaction/${res?.data[0]?.id}`,
        }).then(async (data) => {
          console.log("dataDb", data);
        });
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
          ? window.localStorage.removeItem("note")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("invoiceSales")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("sagecustomerid")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("paymentToApply")
          : false;

        typeof window !== "undefined"
          ? window.localStorage.removeItem("invoiceTitle")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("dbcustomerid")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("creditNoteAmount")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("tempTransactionId")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("customerIdd")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("dueInvoiceAmount")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("finalAmountToPay")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("fromSalesOrder")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("salseOrder")
          : false;
        router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`);
        // setLoad(false);
        // setShowspinner(false);
      } catch (error) {
        console.log("error", error);
      }
    } else if (checkSalesOrder === "fromInvoiceOrder") {
      try {
        const response = await fetch(`${api_url}/getTransId/${data?.PUN}`, {
          method: "GET",
          headers: {
            Authorization: auth_token,
          },
        });
        const res = await response.json();
        console.log(response, "res", res);
        await axios({
          method: "DELETE",
          url: `${api_url}/deleteTransaction/${res?.data[0]?.id}`,
        }).then(async (data) => {
          console.log("dataDb", data);
        });
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
          ? window.localStorage.removeItem("note")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("sagecustomerid")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("paymentToApply")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("invoiceSales")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("invoiceTitle")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("dbcustomerid")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("creditNoteAmount")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("tempTransactionId")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("customerIdd")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("dueInvoiceAmount")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("finalAmountToPay")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("fromSalesOrder")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("salseOrder")
          : false;
        router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`);
        // setLoad(false);
        // setShowspinner(false);
      } catch (error) {
        console.log("error", error);
      }
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
        ? window.localStorage.removeItem("note")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("invoiceSales")
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
      typeof window !== "undefined"
        ? window.localStorage.removeItem("paymentToApply")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("creditNoteAmount")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("tempTransactionId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("customerIdd")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("dueInvoiceAmount")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("finalAmountToPay")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("fromSalesOrder")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("salseOrder")
        : false;
      router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`);
      // setLoad(false);
      // setShowspinner(false);
    }
  };

  const redirectAfterCBQpay = () => {
    setShowspinner(true);
    setLoad(true);
    if (userr === "user") {
      typeof window !== "undefined"
        ? window.localStorage.removeItem("itemIdd")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("invoiceId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("paymentToApply")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("fromSalesOrder")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("creditNoteId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("note")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("invoiceSales")
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
      typeof window !== "undefined"
        ? window.localStorage.removeItem("creditNoteAmount")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("tempTransactionId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("customerIdd")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("dueInvoiceAmount")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("finalAmountToPay")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("salseOrder")
        : false;
      router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`);
      setShowspinner(false);
    } else {
      typeof window !== "undefined"
        ? window.localStorage.removeItem("itemIdd")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("creditNoteAmount")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("paymentToApply")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("fromSalesOrder")
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
      typeof window !== "undefined"
        ? window.localStorage.removeItem("tempTransactionId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("customerIdd")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("dueInvoiceAmount")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("finalAmountToPay")
        : false;

      router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/admin/dashboard`);
    }
  };
  console.log(
    "creditNoteId",
    creditNoteId,
    "dbcustomerid",
    dbcustomerid,
    "creditNoteAmount",
    creditNoteAmount
  );

  const bulkTransactionArray = async () => {
    let getResponse = await axios.get(
      `${api_url}/getTempTransaction/${tempTransactionId}`
    );

    let loopdata = getResponse.data.data.invoice_array;

    for (let i = 0; i < loopdata.length; i++) {
      let reqData = {
        totalAmount: loopdata[i].amount,
        paidAmount: loopdata[i].amount,
        transactionId: getResponse.data.data.transaction_id,
        amexorderId: loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
        paymentMethod: "Credit Card",
        idForPayment: loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
        creditNotesId: null,
        card_type: "QPay",
      };
      let additionData = {
        customerID: loopdata[i].customerId,
        itemId: loopdata[i].itemId,
        sageCustomerId: loopdata[i].sageCustomerId,
      };
      await transactionSaveInDB(reqData, additionData);
      await loopupdateInvoiceAfterPay(loopdata[i].id);
    }
    await deleteTempId(tempTransactionId);
  };

  const transactionSaveInDB = async (data1: any, otherData: any) => {
    getwayService.transactionDataSaveInDB(data1, async function (result: any) {
      let maildata = {
        invoiceTitle: "INVOICE",
        customerId: otherData.customerID,
        transactionId:
          result &&
          result.insetTransatction &&
          result.insetTransatction?.insertId,
        activityId: 0,
        itemId: otherData.itemId,
      };
      await commmonfunctions.SendEmailsAfterPayment(maildata);
      // setShowSuccess(true);
      setTimeout(callBack_func, 5000);
      async function callBack_func() {
        // setShowSuccess(false);
        await getwayService.getARInoviceRecordNumber(
          data1.idForPayment,
          async function (ARRecordNumberResult: any) {
            const ARdata = {
              customerId: otherData.sageCustomerId,
              amount: result.amount,
              ARpaymentMethod: "Credit Card",
              referenceNumber: result.referenceNumber,
              ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
            };
            console.log("data1 for apply pay =>", ARdata);
            await getwayService.createAndApplyPaymentARInvoice(
              ARdata,
              async function (result: any) {
                console.log("ok", result);
              }
            );
          }
        );
      }
    });
  };

  const deleteTempId = async (id: any) => {
    try {
      await axios({
        method: "DELETE",
        url: `${api_url}/deleteTempTransaction/${id}`,
      }).then(async (data) => {
        console.log("data", data);
        setTimeout(() => {
          setLoad(false);
        }, 4000);
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const loopupdateInvoiceAfterPay = async (invoiceId: any) => {
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
        .then((res: any) => {
          console.log("res", res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error: any) {
      console.log("error => ", error.message);
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
  var transaction: any;
  const transactionSave = async (data1: any) => {
    await axios({
      method: "PUT",
      url: `${api_url}/updateTransaction`,
      data: data1,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (result: any) => {
        var data = {
          invoiceId: invoiceId,
        };

        var config = {
          method: "post",
          url: `${api_url}/getTransaction`,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        transaction = await axios(config);
        let finalAmountToPayment = parseInt(finalAmountToPay, 10);
        console.log("finalAmountToPay1", finalAmountToPayment);

        let response = await axios.get(
          `${api_url}/getuserdetails/${dbcustomerid}`,
          {
            headers: {
              Authorization: auth_token,
            },
          }
        );
        let transactiontableid = transaction.data.id;
        customerParentIdd =
          response?.data?.data[0]?.parentId === 0
            ? response?.data?.data[0]?.id
            : response?.data?.data[0]?.parentId;

        if (invoiceTitle === "INVOICES") {
          let maildata = {
            invoiceTitle: invoiceTitle,
            customerId: dbcustomerid,
            transactionId: transaction.data.id,
            activityId: 0,
            itemId: getitemIdd,
          };
          commmonfunctions.SendEmailsAfterPayment(maildata).then((res) => {});
        } else {
          let maildata = {
            invoiceTitle: invoiceTitle,
            customerId: dbcustomerid,
            transactionId: transaction.data.id,
            activityId: getitemIdd,
            itemId: 0,
          };
          commmonfunctions.SendEmailsAfterPayment(maildata).then((res) => {});
        }
        commmonfunctions.VerifyLoginUser().then((res) => {
          AddLogs(
            res.id,
            `Invoice transaction id - #${transaction?.data?.transactionId}`
          );
        });
        await getwayService.getARInoviceRecordNumber(
          transaction.data.amex_order_Id,
          async function (ARRecordNumberResult: any) {
            const ARdata = {
              customerId: sageCustomerId,
              amount: transaction.data.paidAmount,
              ARpaymentMethod: "Credit Card",
              referenceNumber: transaction.data.refrenceId,
              ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
            };
            console.log("data for apply pay =>", ARdata);
            await getwayService.createAndApplyPaymentARInvoice(
              ARdata,
              async function (result1: any) {
                console.log("result", result1);
              }
            );
          }
        );
        await updateInvoiceAfterPay(invoiceId);
        if (creditNoteAmount > 0) {
          const reqData: any = {
            customerId: customerParentIdd,
            Amount: creditNoteAmount,
            sageCustomerId: sageCustomerId,
            invoiceId: invoiceId,
            sageinvoiceId: transaction.data.amex_order_Id,
            amountMode: 0,
          };
          await insertRemainingNotesAmount(reqData);
          await getwayService.getARInoviceRecordNumber(
            transaction.data.amex_order_Id,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId,
                amount: creditNoteAmount,
                ARpaymentMethod: "Cash",
                referenceNumber: transaction.data.refrenceId,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              console.log("data for apply pay =>", ARdata);
              // await getwayService.createAndApplyPaymentARInvoice(
              //   ARdata,
              //   async function (result: any) {
              //   }
              // );
            }
          );
          await updatedTransaction({
            id: transactiontableid,
            creditNotesid: creditNoteNewId,
            // sale_order_id: salseOrder !== "" ? salseOrder : null,
          });
        }
        setLoad(false);
      })
      .catch((error: any) => {
        console.log("error =>", error);
      });
  };

  const updatedTransaction = async (data: any) => {
    let requestedData = {
      id: data.id,
      creditNotesId:
        data?.creditNotesid !== undefined
          ? data?.creditNotesid
          : creditNoteNewId,
    };
    console.log("requestedData", requestedData);
    await axios({
      method: "PUT",
      url: `${api_url}/updateTransaction`,
      data: requestedData,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log("transaction update Successfully !");
      })
      .catch((err) => {});
  };
  const insertRemainingNotesAmount = async (reqData: any) => {
    await axios({
      method: "PUT",
      url: `${api_url}/insertDbAmount`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        console.log("@@", data);
        creditNoteNewId = data?.data?.data?.insertId;
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const updateInvoiceAfterPay = async (invoiceId: any) => {
    try {
      let totalpaid = transaction.data.paidAmount;
      let totalPay = totalpaid > 0 ? totalpaid : 0;
      let creditNote = parseInt(creditNoteAmount);
      let totalBothAmount = creditNote + totalPay;
      let dueAmount =
        dueInvoiceAmount === null || dueInvoiceAmount === 0
          ? totalpaid
          : dueInvoiceAmount;
      let dueAmount1 = parseInt(dueAmount);

      console.log(
        "creditNote",
        creditNote,
        "totalpaid",
        totalpaid,
        "totalPay",
        totalPay,
        "totalBothAmount",
        totalBothAmount,
        "dueInvoiceAmount",
        dueInvoiceAmount,
        "dueAmount",
        dueAmount,
        "dueAmount1",
        dueAmount1,
        "finalAmountToPay",
        finalAmountToPay,
        "creditNoteAmount",
        creditNoteAmount
      );
      let finalAmountToPay1 = parseInt(finalAmountToPay, 10);
      console.log("finalAmountToPay1", finalAmountToPay1);

      let checkApplyPayment = typeof paymentToApplied;
      console.log("@@@@@##checkApplyPayment", checkApplyPayment);
      console.log("paymentToApplied", paymentToApplied);

      let statuss = "";

      if (
        creditNoteAmount === undefined ||
        creditNoteAmount === "undefined" ||
        creditNoteAmount === "ndefine" ||
        creditNoteAmount === "" ||
        creditNoteAmount === "null" ||
        creditNoteAmount === null
      ) {
        if (
          finalAmountToPay === "0" ||
          finalAmountToPay === 0 ||
          finalAmountToPay1 === 0
        ) {
          statuss = "Paid";
        } else if (paymentToApplied === "" || paymentToApplied === null) {
          if (finalAmountToPay1 === totalPay) {
            statuss = "Paid";
          }
        } else {
          statuss = "Partially paid";
        }
      } else {
        if (dueAmount1 === totalBothAmount) {
          statuss = "Paid";
        } else {
          statuss = "Partially paid";
        }
      }
      let final =
        finalAmountToPay1 === totalPay && paymentToApplied === ""
          ? 0
          : finalAmountToPay1;
      console.log("finalfinal", final);
      let requestedData = {
        note: null,
        status: statuss,
        amount_due: final,
      };
      console.log("requestedData", requestedData);
      await axios({
        method: "PUT",
        url: `${api_url}/updateInvoice/${invoiceId}`,
        data: requestedData,
        headers: {
          "content-type": "multipart/form-data",
        },
      })
        .then((res) => {
          // setLoad(false);
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
                <Fragment>
                  <>
                    <h1 style={{ color: "red" }}>Error</h1>
                    <p>Payment failed due to some reason.</p>
                  </>
                  <button className="go-home" onClick={redirectToCancelled}>
                    go to dashboard
                    <Typography
                      style={{ fontSize: "2px", paddingLeft: "10px" }}
                    >
                      {spinner === true ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        ""
                      )}
                    </Typography>
                  </button>
                </Fragment>
              ) : (
                <Fragment>
                  <>
                    <h1>Thank you !</h1>
                    <p>Thanks for Payment. </p>
                    <p>you should receive a confirmation email soon </p>
                  </>
                  <button className="go-home" onClick={redirectAfterCBQpay}>
                    go to dashboard
                    <Typography
                      style={{ fontSize: "2px", paddingLeft: "10px" }}
                    >
                      {spinner === true ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        ""
                      )}
                    </Typography>
                  </button>
                </Fragment>
              )}
              {/* <button className="go-home" onClick={redirectAfterCBQpay}>
                go to dashboard
                <Typography style={{ fontSize: "2px", paddingLeft: "10px" }}>
                  {spinner === true ? <CircularProgress color="inherit" /> : ""}
                </Typography>
              </button> */}
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
