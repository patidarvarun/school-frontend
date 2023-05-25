import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { api_url } from "../helper/config";
import Loader from "./commoncmp/myload";

export default function cancelpayment() {
  const router = useRouter();
  const [spinner, setShowspinner] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [load, setLoad] = React.useState<any>(false);

  let userr =
    typeof window !== "undefined" ? window.localStorage.getItem("user") : false;
  let dbinvoiceIdd: any =
    typeof window !== "undefined"
      ? window.localStorage.getItem("dbInvoiceid")
      : false;
  let saleOrderId: any =
    typeof window !== "undefined"
      ? window.localStorage.getItem("salesOrder")
      : false;
  useEffect(() => {}, [userr]);

  const redirectAfterCBQpay = async () => {
    setLoad(true);
    setShowspinner(true);
    setBtnDisabled(true);

    if (userr === "user") {
      console.log("dbinvoiceIdd", dbinvoiceIdd);
      let idd =
        dbinvoiceIdd && typeof dbinvoiceIdd === "string"
          ? JSON.parse(dbinvoiceIdd)
          : dbinvoiceIdd === null
          ? ""
          : dbinvoiceIdd;

      console.log(typeof dbinvoiceIdd, dbinvoiceIdd, "cbqidcbqid", idd);
      if (idd !== "" && saleOrderId !== "") {
        try {
          await axios({
            method: "DELETE",
            url: `${api_url}/deleteActivityInvoice/${idd}`,
          }).then(async (data) => {
            console.log("data", data);
            typeof window !== "undefined"
              ? window.localStorage.removeItem("dbInvoiceid")
              : false;
            typeof window !== "undefined"
              ? window.localStorage.removeItem("sageCustomerId")
              : false;
            typeof window !== "undefined"
              ? window.localStorage.removeItem("salesOrder")
              : false;
            typeof window !== "undefined"
              ? window.localStorage.removeItem("creditNotesId")
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
              ? window.localStorage.removeItem("cbqRefrenceNumber")
              : false;
            typeof window !== "undefined"
              ? window.localStorage.removeItem("price")
              : false;
            typeof window !== "undefined"
              ? window.localStorage.removeItem("salseOrder")
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
              ? window.localStorage.removeItem("customerIdid")
              : false;

            router.push(
              `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`
            );
            // setLoad(false);
            setShowspinner(false);
            setBtnDisabled(false);
          });
        } catch (error) {
          console.log("error", error);
        }
      } else {
        console.log("@@@@@@@@@@@@else");
        typeof window !== "undefined"
          ? window.localStorage.removeItem("dbInvoiceid")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("sageCustomerId")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("salesOrder")
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
          ? window.localStorage.removeItem("paymentToApply")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("cbqRefrenceNumber")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("price")
          : false;
        typeof window !== "undefined"
          ? window.localStorage.removeItem("salseOrder")
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
          ? window.localStorage.removeItem("customerIdid")
          : false;

        router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/user/dashboard`);
        setShowspinner(false);
        setBtnDisabled(false);
      }
    } else {
      typeof window !== "undefined"
        ? window.localStorage.removeItem("dbInvoiceid")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("sageCustomerId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("salesOrder")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("creditNotesId")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("paymentToApply")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("dbcustomerid")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("creditNoteAmount")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("cbqRefrenceNumber")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("price")
        : false;
      typeof window !== "undefined"
        ? window.localStorage.removeItem("salseOrder")
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
        ? window.localStorage.removeItem("customerIdid")
        : false;

      router.push(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/admin/dashboard`);
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
              <h1 style={{ color: "red" }}>
                Payment failed due to some reason.
              </h1>

              <button
                disabled={btnDisabled}
                className="go-home"
                onClick={() => {
                  redirectAfterCBQpay();
                }}
              >
                go to dashboard
                <Typography
                  style={{
                    fontSize: "2px",
                    padding: "10px 50px",
                    position: "relative",
                    top: "-35px",
                  }}
                >
                  {spinner === true ? <CircularProgress color="warning" /> : ""}
                </Typography>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
