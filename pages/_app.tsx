import type { AppProps } from "next/app";
import "../styles/auth.css";
import "../styles/sidebar.css";
import "../styles/invoice.css";
import "../styles/hideInputTypeNumberArrow.css";
import "../styles/dashboard.css";
import "../styles/customer.css";
import "../styles/globals.css";
import "../styles/addinvoice.css";
import "../styles/globals.css";
import "../styles/thankyou.css";
import "../styles/cancelpayment.css";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import commmonfunctions from "../commonFunctions/commmonfunctions";
import jwt_decode from "jwt-decode";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
        router.push("/");
      }
    });
    const logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null || logintoken === "") {
      router.push("/");
    }
    if (typeof window !== "undefined") {
      if (router.asPath.includes("auth")) {
        router.push(router.asPath);
      } else if (router.asPath.includes("q_pay_payment")) {
        router.push(router.asPath);
      } else if (
        router.asPath.includes("thankyou") ||
        router.asPath.includes("amexPaymentSuccess") ||
        router.asPath.includes("qpay_invoice_thankyou") ||
        router.asPath.includes("cancelpayment")
      ) {
        // router.push(router.asPath);
      } else {
        const storedToken = localStorage.getItem("QIS_loginToken");
        if (storedToken) {
          let decodedData: any = jwt_decode(storedToken, { header: true });
          let expirationDate = decodedData.exp;
          var current_time = Date.now() / 1000;
          if (expirationDate < current_time) {
            localStorage.removeItem("QIS_loginToken");
            router.push("/");
          }
          commmonfunctions.GivenPermition().then((res: any) => {
            if (res.roleId === 1 && router.asPath.includes("admin")) {
              router.push(router.asPath);
            } else if (res.roleId === 2 && router.asPath.includes("user")) {
              router.push(router.asPath);
            } else if (
              res.roleId !== 1 &&
              res.roleId !== 2 &&
              router.asPath.includes("admin")
            ) {
              router.push(router.asPath);
            } else {
              router.push("/userprofile");
            }
          });
        } else {
          if (
            storedToken === undefined ||
            storedToken === null ||
            storedToken === ""
          ) {
            router.push("/");
          }
        }
      }
    }
  }, []);

  return <Component {...pageProps} />;
}
