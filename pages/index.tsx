import * as React from "react";
import LoginPage from "./loginPage";
import Script from "next/script";
import { useRouter } from "next/router";
import commmonfunctions from "../commonFunctions/commmonfunctions";

export default function Home() {
  const router = useRouter();
  if (typeof window !== "undefined") {
    const logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken) {
      commmonfunctions.GivenPermition().then((res: any) => {
        if (res.roleId === 1 && router.asPath.includes('admin')) {
          router.push(router.asPath)
        } else if (res.roleId === 2 && router.asPath.includes('user')) {
          router.push(router.asPath);
        } else if (res.roleId !== 1 && res.roleId !== 2 && router.asPath.includes('admin')) {
          router.push(router.asPath)
        } else {
          router.push("/userprofile");
        }
      })
    } else {
      return <LoginPage />
    }
  }
  return (
    <>
      <Script src="https://amexmena.gateway.mastercard.com/static/checkout/checkout.min.js"
        data-error="errorCallback"
        data-cancel="cancelCallback"
        strategy="beforeInteractive"
      > </Script>

      {/* <LoginPage /> */}
    </>
  );
}
