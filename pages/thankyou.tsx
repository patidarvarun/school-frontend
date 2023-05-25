import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { api_url, auth_token } from "../helper/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getwayService from "../services/gatewayService";
import Loader from "./commoncmp/myload";
import commmonfunctions from "../commonFunctions/commmonfunctions";
export default function thankyou() {
  const router = useRouter();
  let userr =
    typeof window !== "undefined" ? window.localStorage.getItem("user") : false;
  const [load, setLoad] = useState<any>(true);
  let tempTransactionId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("tempTransactionId")
      : false;
  useEffect(() => {
    if (router.isReady) {
      router.replace("/thankyou");
    } else {
      router.push("/thankyou");
    }

    setTimeout(() => {
      if (tempTransactionId !== null) {
        redirectMultipleCBQpay();
      } else {
        redirectAfterCBQpay();
      }
    }, 2000);
  }, [userr]);

  // setTimeout(() => {
  //   // setLoad(false);
  // }, 5000);

  const redirectMultipleCBQpay = async () => {
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
        card_type: "CBQ",
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
          data1.amexorderId,
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

  var dueInvoiceAmount: any;
  var amount: any;
  var creditNotePrice: any;
  var creditNoteNewId: any;
  var finalAmountToPay: any;

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
  var payAmount: any;
  var paymentToApplied: any;
  var referenceNo: any;

  const redirectAfterCBQpay = async () => {
    const toupdateInvoiceid = localStorage.getItem("dbInvoiceid");
    const cbqRefrenceNumber = localStorage.getItem("cbqRefrenceNumber");
    const price = localStorage.getItem("price");
    const sageCustomerId = localStorage.getItem("sageCustomerId");
    const creditNotesId = localStorage.getItem("creditNotesId");
    const dbcustomerid = localStorage.getItem("dbcustomerid");
    const creditNoteAmount = localStorage.getItem("creditNoteAmount");
    const salseOrder = localStorage.getItem("salseOrder");
    const invoiceTitle = localStorage.getItem("invoiceTitle");
    const itemIdd = localStorage.getItem("itemIdd");
    const customerIdd = localStorage.getItem("customerIdid");
    const wwwy = customerIdd ? JSON.parse(customerIdd) : "";
    payAmount = price ? JSON.parse(price) : "";
    dueInvoiceAmount = localStorage.getItem("dueInvoiceAmount");
    paymentToApplied = localStorage.getItem("paymentToApply");
    finalAmountToPay = localStorage.getItem("finalAmountToPay");
    const dbInvoiceIdd = toupdateInvoiceid ? JSON.parse(toupdateInvoiceid) : "";
    const cid = sageCustomerId?.substring(1, sageCustomerId.length - 1);
    const rendomTransactionId = keyGen(5);
    let cusId = dbcustomerid?.slice(1, -1);
    let creditNoteid = creditNotesId?.slice(1, -1);
    creditNotePrice = creditNoteAmount?.slice(1, -1);
    referenceNo = cbqRefrenceNumber ? JSON.parse(cbqRefrenceNumber) : "";
    var customerParentIdd = "";
    var transaction: any;

    try {
      var data = {
        invoiceId: toupdateInvoiceid,
      };

      var reqData = {
        invoiceId: dbInvoiceIdd,
        paymentMethod: "Credit Card",
        amex_order_Id: referenceNo,
      };
      console.log("reqData!!", reqData);
      var config = {
        method: "post",
        url: `${api_url}/getTransactionByDescOrder`,
        headers: {
          "Content-Type": "application/json",
        },
        data: reqData,
      };

      transaction = await axios(config);
      console.log("@@transaction", transaction.data);

      var ARRefrenceNumber = "";
      var generatedTransactionId: any;
      generatedTransactionId = transaction.data.id;

      let response = await axios.get(`${api_url}/getuserdetails/${cusId}`, {
        headers: {
          Authorization: auth_token,
        },
      });

      customerParentIdd =
        response?.data?.data[0]?.parentId === 0
          ? response?.data?.data[0]?.id
          : response?.data?.data[0]?.parentId;

      if (invoiceTitle === "INVOICES") {
        let data1 = {
          invoiceTitle: invoiceTitle,
          customerId: cusId,
          transactionId: generatedTransactionId,
          activityId: 0,
          itemId: itemIdd,
        };
        commmonfunctions.SendEmailsAfterPayment(data1).then((res) => {});
      } else {
        let data1 = {
          invoiceTitle: invoiceTitle,
          customerId: cusId,
          transactionId: generatedTransactionId,
          activityId: itemIdd,
          itemId: 0,
        };
        commmonfunctions.SendEmailsAfterPayment(data1).then((res) => {});
      }
      await getwayService.getARInoviceRecordNumber(
        transaction.data.amex_order_Id,
        async function (ARRecordNumberResult: any) {
          const data = {
            customerId: cid,
            amount: payAmount,
            ARpaymentMethod: "Credit Card",
            referenceNumber: transaction.data.refrenceId,
            ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
          };
          console.log("data for apply pay =>", data);
          await getwayService.createAndApplyPaymentARInvoice(
            data,
            async function (resultt: any) {
              console.log("resultt", resultt);
            }
          );
        }
      );
      await updateInvoice(dbInvoiceIdd);
      await updateTransaction({
        id: generatedTransactionId,
        card_type: "CBQ",
        // transactionId: transaction.data.transactionId,
        // sale_order_id: salseOrder !== "" ? salseOrder : "null",
      });
      //     console.log("creditNotePricetype", typeof creditNotePrice);
      //     if (creditNotePrice > 0 || creditNotePrice !== "ndefine") {
      //       const reqData: any = {
      //         customerId: customerParentIdd,
      //         Amount: creditNotePrice,
      //         sageCustomerId: cid,
      //         invoiceId: dbInvoiceIdd,
      //         sageinvoiceId: referenceNo,
      //         amountMode: 0,
      //       };
      //       await insertRemainingNotesAmount(reqData);
      //       await getwayService.getARInoviceRecordNumber(
      //         referenceNo,
      //         async function (ARRecordNumberResult: any) {
      //           const data = {
      //             customerId: cid,
      //             amount: creditNotePrice,
      //             ARpaymentMethod: "Cash",
      //             referenceNumber: ARRefrenceNumber,
      //             ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
      //           };
      //           console.log("data for apply pay =>", data);
      //           // await getwayService.createAndApplyPaymentARInvoice(
      //           //   data,
      //           //   async function (result: any) {}
      //           // );
      //         }
      //       );
      //       await updateTransaction({
      //         id: generatedTransactionId,
      //         creditNotesId: creditNoteNewId,
      // card_type: "CBQ",
      //         // sale_order_id: salseOrder !== "" ? salseOrder : "null",
      //       });
      //     }
      //   }
      // );
      setLoad(false);
    } catch (error: any) {
      console.log("error => ", error.message);
    }
  };

  const updateInvoice = async (dbInvoiceIdd: any) => {
    // let newInvoiceId = toupdateInvoiceid.slice(1, -1);

    let totalPay = payAmount > 0 ? payAmount : 0;
    let applypay = parseInt(creditNotePrice);
    let totalPayment = parseInt(totalPay);
    let totalBothAmount = applypay + totalPayment;
    let dueAmount =
      dueInvoiceAmount === null || dueInvoiceAmount === 0
        ? payAmount
        : dueInvoiceAmount;
    let dueAmount1 = parseInt(dueAmount);

    console.log(
      "totalPay",
      totalPay,
      payAmount,
      applypay,
      totalPayment,
      "totalBothAmount",
      totalBothAmount,
      dueAmount,
      dueAmount1,
      "dueInvoiceAmount",
      dueInvoiceAmount,
      "finalAmountToPay",
      finalAmountToPay,
      "finalAmountToPaytype",
      typeof finalAmountToPay
    );
    let finalAmountToPay1 = parseInt(finalAmountToPay, 10);
    console.log("finalAmountToPay1", finalAmountToPay1);
    let checkApplyPayment = typeof paymentToApplied;
    console.log("@@@@@##checkApplyPayment", checkApplyPayment);
    console.log("paymentToApplied", paymentToApplied);

    let statuss = "";

    if (
      creditNotePrice === undefined ||
      creditNotePrice === "ndefine" ||
      creditNotePrice === "undefined"
    ) {
      if (
        finalAmountToPay === "0" ||
        finalAmountToPay === 0 ||
        finalAmountToPay1 === 0
      ) {
        statuss = "Paid";
      } else if (paymentToApplied === "" || paymentToApplied === null) {
        if (finalAmountToPay1 === totalPayment) {
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
      finalAmountToPay1 === totalPayment && paymentToApplied === ""
        ? 0
        : finalAmountToPay1;
    console.log("finalfinal", final);
    let requestedData = {
      note: null,
      status: statuss,
      amount_due: final,
    };

    await axios({
      method: "PUT",
      url: `${api_url}/updateInvoice/${dbInvoiceIdd}`,
      data: requestedData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        toast.success("Payment Successfully !");
      })
      .catch((err) => {});
  };

  const updateTransaction = async (data: any) => {
    let requestedData = {
      id: data.id,
      card_type: data.card_type,
      transactionId: data.refrenceId,
      // creditNotesId: data.creditNotesId,
    };
    await axios({
      method: "PUT",
      url: `${api_url}/updateCBQTransaction`,
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

  const redirectAfterpay = () => {
    typeof window !== "undefined"
      ? window.localStorage.removeItem("dbInvoiceid")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("cbqRefrenceNumber")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("price")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("sageCustomerId")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("creditNotesId")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("dbcustomerid")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("creditNoteAmount")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("fromSalesOrder")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("salseOrder")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("salesOrder")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("customerIdid")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("invoiceTitle")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("itemIdd")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("tempTransactionId")
      : false;

    typeof window !== "undefined"
      ? window.localStorage.removeItem("dueInvoiceAmount")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("finalAmountToPay")
      : false;
    typeof window !== "undefined"
      ? window.localStorage.removeItem("paymentToApply")
      : false;
    if (userr === "user") {
      document.location.href = `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`;
    } else {
      document.location.href = `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/admin/dashboard`;
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
              <h1>Thank you !</h1>
              <p>Thanks for Payment. </p>
              <p>you should receive a confirmation email soon </p>

              <button className="go-home" onClick={redirectAfterpay}>
                go to dashboard
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
