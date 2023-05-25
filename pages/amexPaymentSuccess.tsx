import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "./commoncmp/myload";
import getwayService from "../services/gatewayService";
import axios from "axios";
import { api_url, auth_token } from "../helper/config";
import commmonfunctions from "../commonFunctions/commmonfunctions";

export default function AmexSuccessPage() {
  const router = useRouter();
  let userr =
    typeof window !== "undefined" ? window.localStorage.getItem("user") : false;

  const [load, setLoad] = useState<any>(true);
  let search = router.query;
  console.log("search@@", search);
  var remaingAmount: any;
  var dueInvoiceAmount: any;
  var creditNoteNewId: any;
  var finalAmountToPay: any;

  useEffect(() => {
    let search = router.query;
    let amexOrderId = search.orderid;
    let paymentMethod = search.paymentMethod;
    let creditRequestId = search.creditNoteId;
    let customerid = search.customerID;
    remaingAmount = search.remaingAmount;
    let DBInvoiceid = search.DBInvoiceid;
    let itemIdd = search.itemIdd;
    let invoiceTitle = search.invoiceTitle;
    let tempTransactionId = search.tempTransactionId;
    let customerIdd = search.customerIdd;
    dueInvoiceAmount = search.dueInvoiceAmount;
    finalAmountToPay = search.finalAmountToPay;

    console.log(amexOrderId, "!!!!!!!!!!!!!!", paymentMethod);
    if (paymentMethod && amexOrderId) {
      // setTimeout(() => {
      orderPlaced(
        amexOrderId,
        paymentMethod,
        creditRequestId,
        DBInvoiceid,
        customerid,
        invoiceTitle,
        itemIdd,
        remaingAmount,
        customerIdd,
        dueInvoiceAmount,
        finalAmountToPay
      );
      // }, 8000);
    }
    if (paymentMethod && tempTransactionId) {
      multipleorderPlaced(paymentMethod, tempTransactionId);
    }
  }, [router.query]);
  var totalpaid: any;

  let paymentToApplied =
    typeof window !== "undefined"
      ? window.localStorage.getItem("paymentToApply")
      : false;

  const orderPlaced = async (
    amexOrderId: any,
    paymentMethod: any,
    creditRequestId: any,
    DBInvoiceid: any,
    customerid: any,
    invoiceTitle: any,
    itemIdd: any,
    remaingAmount: any,
    customerIdd: any,
    dueInvoiceAmount: any,
    finalAmountToPay: any
  ) => {
    console.log(
      "creditRequestId",
      creditRequestId,
      "remaingAmount",
      remaingAmount
    );
    const data = { orderId: amexOrderId };
    var apiRequest = data;
    var sageCustomerId = "";
    var customerParentIdd = "";
    let cusId = customerid?.slice(1, -1);
    let creditNoteid = creditRequestId?.slice(1, -1);
    let creditNotePrice = remaingAmount?.slice(1, -1);

    console.log("########", cusId, creditNoteid, creditNotePrice);

    var requestUrl = await getwayService.getRequestUrl("REST", apiRequest);
    getwayService.retriveOrder(requestUrl, async function (orderresult: any) {
      if (orderresult.status === 200) {
        const amextransactionData = orderresult.data;
        const transactionData = {
          idForPayment: amexOrderId,
          totalAmount: amextransactionData?.transaction[0].transaction.amount,
          paidAmount: amextransactionData?.transaction[0].transaction.amount,
          paymentMethod: "Credit Card",
          amexorderId: amexOrderId,
          transactionId: amextransactionData?.transaction[0].transaction.id,
          creditNotesId: creditRequestId ? creditRequestId : null,
          card_type: "Amex",
        };
        totalpaid = amextransactionData?.transaction[0].transaction.amount;
        var ARRefrenceNumber = "";
        var generatedTransactionId: any;
        await getwayService.transactionDataSaveInDB(
          transactionData,
          async function (result: any) {
            generatedTransactionId = result?.insetTransatction?.insertId;
            ARRefrenceNumber = await getwayService.generateRefrenceNumber(
              generatedTransactionId
            );
            console.log("ARRefrenceNumber =>", ARRefrenceNumber);
            let response = await axios.get(
              `${api_url}/getuserdetails/${customerid}`,
              {
                headers: {
                  Authorization: auth_token,
                },
              }
            );
            sageCustomerId =
              response.data.data[0].sageParentId ||
              response.data.data[0].sageCustomerId;

            customerParentIdd =
              response?.data?.data[0]?.parentId === 0
                ? response?.data?.data[0]?.id
                : response?.data?.data[0]?.parentId;

            // setsageCustomerId(response.data.data[0].sageParentId);
            if (invoiceTitle && invoiceTitle === "SALES") {
              let data = {
                invoiceTitle: invoiceTitle,
                customerId: customerid,
                transactionId: result && result?.insetTransatction?.insertId,
                activityId: itemIdd,
                itemId: 0,
              };
              commmonfunctions.SendEmailsAfterPayment(data).then((res) => {});
            } else {
              let data = {
                invoiceTitle: invoiceTitle,
                customerId: customerid,
                transactionId: result && result?.insetTransatction?.insertId,
                activityId: 0,
                itemId: itemIdd,
              };
              commmonfunctions.SendEmailsAfterPayment(data).then((res) => {});
            }

            await getwayService.getARInoviceRecordNumber(
              amexOrderId,
              async function (ARRecordNumberResult: any) {
                const data = {
                  customerId: sageCustomerId,
                  amount:
                    amextransactionData?.transaction[0].transaction.amount,
                  ARpaymentMethod: "Credit Card",
                  referenceNumber: ARRefrenceNumber,
                  ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                };
                console.log("data for apply pay =>", data);
                await getwayService.createAndApplyPaymentARInvoice(
                  data,
                  async function (result1: any) {
                    console.log("REsult1", result1);
                  }
                );
                await updateInvoiceAfterPay(DBInvoiceid);
                console.log(
                  "remaingAmountremaingAmoun!!!t",
                  typeof remaingAmount
                );
                let checkingRemaingAmount = typeof remaingAmount;
                console.log("checkingRemaingAmountchec", checkingRemaingAmount);
                if (
                  checkingRemaingAmount === undefined ||
                  checkingRemaingAmount === "undefined"
                ) {
                  console.log("@@@@@@@@@@@undefinfff");
                } else {
                  const reqData: any = {
                    customerId: customerIdd,
                    Amount: remaingAmount,
                    sageCustomerId: sageCustomerId,
                    invoiceId: DBInvoiceid,
                    sageinvoiceId: amexOrderId,
                    amountMode: 0,
                  };
                  console.log("reqData =>", reqData);
                  await insertRemainingNotesAmount(reqData);
                  const data = {
                    customerId: sageCustomerId,
                    amount: remaingAmount,
                    ARpaymentMethod: "Cash",
                    referenceNumber: ARRefrenceNumber,
                    ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                  };
                  console.log("@@@@@@@@@data1", data);
                  // await getwayService.createAndApplyPaymentARInvoice(
                  //   data,
                  //   async function (result: any) {
                  //     console.log(
                  //       "generatedTransactionId",
                  //       generatedTransactionId
                  //     );
                  //   }
                  // );
                  let reqData1 = {
                    id: generatedTransactionId,
                    creditNotesId: creditNoteNewId,
                  };
                  await updateTransaction(reqData1);
                }
              }
            );
            setLoad(false);
          }
        );
      }
    });
  };

  const multipleorderPlaced = async (
    paymentMethod: any,
    tempTransactionId: any
  ) => {
    var sageCustomerId = "";
    var customerParentIdd = "";
    let getResponse = await axios.get(
      `${api_url}/getTempTransaction/${tempTransactionId}`
    );
    const data = { orderId: getResponse.data.data.transaction_id };
    var apiRequest = data;

    var requestUrl = await getwayService.getRequestUrl("REST", apiRequest);

    let loopdata = getResponse.data.data.invoice_array;

    getwayService.retriveOrder(requestUrl, async function (orderresult: any) {
      if (orderresult.status === 200) {
        const amextransactionData = orderresult.data;

        for (let i = 0; i < loopdata.length; i++) {
          let reqData = {
            totalAmount: loopdata[i].amount,
            paidAmount: loopdata[i].amount,
            transactionId: getResponse.data.data.transaction_id,
            amexorderId:
              loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
            paymentMethod: "Credit Card",
            idForPayment:
              loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
            creditNotesId: null,
            card_type: "Amex",
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
      }
    });
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
      setTimeout(callBack_func, 5000);
      async function callBack_func() {
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

  const updateTransaction = async (data: any) => {
    let requestedData = {
      id: data.id,
      creditNotesId: data.creditNotesId,
    };
    console.log("requestedData333", requestedData);
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

  const updateInvoiceAfterPay = async (invoiceId: any) => {
    try {
      let totalPay = totalpaid > 0 ? totalpaid : 0;
      let applypay = parseInt(remaingAmount);
      let totalBothAmount = applypay + totalPay;
      let dueAmount =
        dueInvoiceAmount === null || dueInvoiceAmount === 0
          ? totalpaid
          : dueInvoiceAmount;
      let dueAmount1 = parseInt(dueAmount);

      console.log(
        dueInvoiceAmount,
        "totalPay",
        totalPay,
        applypay,
        "totalBothAmount",
        totalBothAmount,
        dueAmount,
        "dueAmount1",
        dueAmount1,
        "finalAmountToPay",
        finalAmountToPay,
        "remaingAmount",
        remaingAmount,
        "remaingAmounttype",
        typeof remaingAmount
      );
      let finalAmountToPay1 = parseInt(finalAmountToPay, 10);
      let statuss = "";
      console.log(
        parseInt(finalAmountToPay),
        "finalAmountToPay1",
        finalAmountToPay1
      );
      if (remaingAmount === undefined || remaingAmount === "undefined") {
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
      await axios({
        method: "PUT",
        url: `${api_url}/updateInvoice/${invoiceId}`,
        data: requestedData,
        headers: {
          "content-type": "multipart/form-data",
        },
      })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    } catch (error: any) {
      console.log("error => ", error.message);
    }
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
        if (data) {
          creditNoteNewId = data?.data?.data?.insertId;
          // getSageId(reqData?.customerId);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const redirectAfterpay = () => {
    if (userr === "admin") {
      document.location.href = `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/admin/dashboard`;
    } else {
      typeof window !== "undefined"
        ? window.localStorage.removeItem("paymentToApply")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("dbInvoiceid")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("salesOrder")
        : false;

      document.location.href = `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`;
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
