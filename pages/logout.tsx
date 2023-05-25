import React from "react";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import PreLoader from "./commoncmp/loader";

function Logoutpage() {
  const router = useRouter();
  useEffect(() => {
    const login_token = localStorage.getItem("QIS_loginToken");
    const login_user = localStorage.getItem("QIS_User");
    if (login_token !== null && login_user) {
      localStorage.removeItem("QIS_loginToken");
      localStorage.removeItem("QIS_User");
      router.push("/");
    } else {
      router.push("/");
    }
  }, []);
  return (
    <>
      <PreLoader />
    </>
  );
}
export default Logoutpage;
