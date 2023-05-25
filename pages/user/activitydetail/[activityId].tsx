import {
  Card,
  Stack,
  Typography,
  Breadcrumbs,
  Pagination,
  Grid,
  styled,
  OutlinedInput,
  Button,
  CircularProgress,
  InputLabel,
  Checkbox,
  MenuItem,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsTelegram } from "react-icons/bs";
import Modal from "@mui/material/Modal";
import Link from "next/link";
import axios from "axios";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  api_url,
  auth_token,
  base_url,
  qatar_currency,
} from "../../../helper/config";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Paper from "@mui/material/Paper";
import MiniDrawer from "../../sidebar";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MainFooter from "../../commoncmp/mainfooter";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import getwayService from "../../../services/gatewayService";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { useForm, SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import { AddLogs } from "../../../helper/activityLogs";
import UserService from "../../../commonFunctions/servives";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const styleptag = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 331,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
enum typeEnum {
  Free = "Free",
  Paid = "Paid",
}

enum statusEnum {
  Active = "Active",
  Archive = "Archive",
  Draft = "Draft",
}
type FormValues = {
  name: string;
  type: typeEnum;
  payment: number;
  image: any;
  short_description: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  status: statusEnum;
  startDates: string;
  custId: number;
};
type HTMLData = {
  content: { "mycustom-html": string };
};
export default function Guardians() {
  let localUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [activity, setActivity] = useState<FormValues | any>("");
  const [htmlData, setHtmlData] = useState<HTMLData>({
    content: { "mycustom-html": "<p>demo</p>" },
  });
  const [activites, setactivites] = useState<any>([]);
  const todayDate = moment(new Date()).format("YYYY.MM.DD");
  const [open, setOpen] = React.useState(false);
  const [spinner, setshowspinner] = React.useState(false);
  const [Check, setCheck] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [userDetail, setUserDetail] = useState<any>([]);
  const [itemID, setItemId] = useState("");
  const [activityDetail, setActivityData] = useState<any>([]);
  const [creditAmount, setCreditAmount] = React.useState<any>("");
  const [creditNoteId, setcreditNoteId] = React.useState<any>(null);
  const [price, setPrice] = React.useState<any>("");
  const [activityId, setActivityId] = React.useState<any>("");
  const [paymentPayMethod, setPaymentPayMethod] = React.useState<any>("");
  const [orderId, setorderId] = React.useState("");
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const [ARInvoiceId, setARInvoiceId] = useState("");
  const [openThank, setOpenThank] = React.useState(false);
  const handleThanksOpen = () => setOpenThank(true);
  const handleThanksClose = () => setOpenThank(false);
  const [custId, setcustId] = React.useState<FormValues | any>("");
  const [childs, setchilds] = React.useState([]);
  const [sageCustomerId, setSageCustomerID] = useState("");
  const [dbCustomerId, setDBCustomerID] = useState("");
  const [customerTotalCreditNoteBalance, setCustomerTotalCreditNoteBalance] =
    useState(0);
  const [partialAmount, setPartialAmount] = useState<any>(0);
  const [customerCreditNoteRequestId, setCustomerCreditNoteRequestId] =
    useState<any>(null);
  const [applyCreditNoteAmount, setApplyCreditNoteAmount] = useState<any>(0);
  const [creditToApply, setCreditToApply] = useState<any>("");
  const [creditPopupError, setCreditPopupError] = useState<any>("");
  const [paymentToApply, setPaymentToApply] = useState<any>("");
  const [applyPaymentPopupError, setApplyPaymentPopupError] = useState<any>("");
  const [recievedPay, setRecieved] = useState<any>([]);
  const [finalAmountToPay, setFinalAmountToPay] = useState<any>(0);
  const [dueInvoiceAmount, setDueInvoiceAmount] = useState<any>(0);
  var creditNoteNewId: any;

  const router = useRouter();
  const activityid = router?.query?.activityId;
  var Checkout: any;
  let creditBalance: any;
  let logintoken: any;
  var sageintacctorderID: any = "";
  let sageintacctInvoiceID: any = "";
  var dbInvoiceId: any = "";

  React.useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
      getChilds(res?.id);
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
      }
    });
    logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId === 2) {
      } else {
        router.push("/");
      }
    });
  }, []);

  const manageActivity = async () => {
    let login_token: any;
    login_token = localStorage.getItem("QIS_loginToken");
    const decoded: any = jwt_decode(login_token);
    let response = await axios.get(`${api_url}/getuserdetails/${decoded.id}`, {
      headers: {
        Authorization: auth_token,
      },
    });
    const userData = response?.data?.data[0];
    setUserDetail(userData);
  };
  //get childs
  const getChilds = async (id: any) => {
    UserService.getChilds(id).then((response) => setchilds(response));
  };
  const mycusts = childs.concat(userDetail);

  const handlePaymentName = (data: any) => {
    const Checkout: any = (window as any).Checkout;
    setPaymentPayMethod(data);
  };

  let today = new Date();
  const todaysDate = moment(today).format("MMM DD,YYYY");
  const invoiceDate = moment(today).format("DD/MM/YYYY");
  const createdDate = moment(today).format("DD/MM/YYYY");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setCreditPopupError("");
    setApplyPaymentPopupError("");
  };

  const getActivityDetail = async () => {
    try {
      const response = await fetch(`${api_url}/getActivityData/${activityid}`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();

      setActivity(res.data);
      setHtmlData(res.data[0].description);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getActivityDetail();
    manageActivity();
  }, [activityid]);

  const handlePopupOpen = () => {
    setCreditToApply("");
    // setFinalAmountToPay(0);
    setPaymentToApply("");
    setActivityData(activity[0]?.id);
    setActivityId(activity[0]?.id);
    setPrice(activity[0]?.price);
    getCustomerNotes(userDetail.id);
    setItemId(activity[0]?.id);
    // setItemId(activity[0]?.Iid);
    setRecieved(activity[0]);
    setFinalAmountToPay(activity[0]?.price);
    setSageCustomerID(userDetail.sageCustomerId || userDetail.sageParentId);
    setDBCustomerID(userDetail.id);
    handleClickOpen();
  };

  const insertRemainingNotesAmount = async (reqData: any) => {
    // const reqData = {
    //   customerId: userDetail?.id,
    //   Amount: creditBalance,
    //   amountMode: 0,
    // };
    await axios({
      method: "PUT",
      url: `${api_url}/insertDbAmount`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        console.log("####", data);
        creditNoteNewId = data?.data?.data?.insertId;
        if (data) {
          AddLogs(
            userUniqueId,
            `Payment debit id - #CUS-${userDetail?.sageCustomerId}`
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getCustomerNotes = async (id: any) => {
    try {
      const response = await fetch(`${api_url}/creditballance/${id}`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      let creditnoteid = res.CreditRequestId ? res.CreditRequestId : null;
      // setcreditNoteId(creditnoteid);
      // setCreditAmount(res?.creditBal);
      setCustomerCreditNoteRequestId(res?.CreditRequestId_FromSageCreditNotes);
      setCustomerTotalCreditNoteBalance(res?.creditBal_FromSageCreditNotes);
      setApplyCreditNoteAmount(res?.creditBal_FromSageCreditNotes);
    } catch (error: any) {
      console.log("error", error.message);
    }
  };
  if (Check === true) {
    var hideshowstyle = {
      display: "block",
    };
  } else {
    var hideshowstyle = {
      display: "none",
    };
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const Checkout: any = (window as any).Checkout;
    if (partialAmount > price) {
      toast.warn("You can not enter more than amount of invoice amount.");
    }

    if (paymentPayMethod === "") {
      toast.error("Please select payment method !");
    } else {
      if (custId !== "" && activityId !== "") {
        setshowspinner(true);
        setBtnDisabled(true);
        const reqData = {
          amount: price,
          status: "Pending",
          customerId: custId,
          itemId: activityId,
          createdDate: createdDate,
          invoiceDate: invoiceDate,
          createdBy: userDetail?.id,
        };
        await axios({
          method: "POST",
          url: `${api_url}/addSalesOrders`,
          data: reqData,
          headers: {
            Authorization: auth_token,
          },
        })
          .then(async (data: any) => {
            if (data) {
              if (data?.status === 200) {
                setorderId(data.data.sageIntacctorderID);
                sageintacctorderID = data.data.sageIntacctorderID;
              }
              // setshowspinner(false);
              // setBtnDisabled(false);
              AddLogs(
                userUniqueId,
                `Sales Order purchase id - #SAL-${data?.data?.sageIntacctorderID}`
              );
              // setOpen(false);
              // handleThanksOpen();
              setTimeout(() => {
                // handleThanksClose();
              }, 3000);
            }
          })
          .catch((error) => {
            setshowspinner(false);
            setBtnDisabled(false);
          });
        // }
      }
    }

    let orderamount = Check ? Math?.abs(price - creditBalance) : price;

    // // convert sales order to invoice
    await createInvoice();
    //make payment only cash

    if (paymentPayMethod === "Cash" && Check === false) {
      const unique = keyGen(5);
      const reqData1 = {
        totalAmount: price,
        paidAmount: price,
        transactionId: `case-${unique} `,
        amexorderId: sageintacctInvoiceID,
        paymentMethod: paymentPayMethod === "" ? "Cash" : paymentPayMethod,
        idForPayment: sageintacctInvoiceID,
        creditNotesId: null,
        sales_order_Id: sageintacctorderID,
      };

      await axios({
        method: "POST",
        url: `${api_url}/createTransaction`,
        data: reqData1,
        headers: {
          Authorization: auth_token,
        },
      })
        .then(async (result: any) => {
          AddLogs(
            userUniqueId,
            `Sales order transaction id - #${reqData1?.transactionId}`
          );
          await getwayService.getARInoviceRecordNumber(
            result.data.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId || userDetail.sageParentId,
                amount: result.data.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.data.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              console.log("data for apply pay =>", ARdata);
              await updateInvoiceAfterPay(dbInvoiceId);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {}
              );
            }
          );
          toast.success("Activity purchase Successfully !");
          setOpen(false);
          handleThanksOpen();
          let data = {
            invoiceTitle: "SALES",
            customerId: userUniqueId,
            transactionId: result && result?.data?.insetTransatction?.insertId,
            activityId: itemID,
            itemId: 0,
          };
          commmonfunctions.SendEmailsAfterPayment(data).then((res) => {});
          setshowspinner(false);
          setBtnDisabled(false);
          setTimeout(() => {
            handleThanksClose();
            router.push("/user/invoices/invoiceslist/ci");
          }, 3000);
        })
        .catch((error: any) => {
          console.log("error =>", error);
        });
    }
    if (paymentPayMethod === "Cash" && Check === true) {
      const unique = keyGen(5);
      const reqData1 = {
        totalAmount: totalPrice,
        paidAmount: totalPrice,
        transactionId: `case-${unique} `,
        amexorderId: sageintacctInvoiceID,
        paymentMethod: paymentPayMethod === "" ? "Cash" : paymentPayMethod,
        idForPayment: sageintacctInvoiceID,
        creditNotesId: creditNoteId,
        sales_order_Id: sageintacctorderID,
      };

      await axios({
        method: "POST",
        url: `${api_url}/createTransaction`,
        data: reqData1,
        headers: {
          Authorization: auth_token,
        },
      })
        .then(async (result: any) => {
          AddLogs(
            userUniqueId,
            `Sales order transaction id - #${reqData1?.transactionId}`
          );
          await getwayService.getARInoviceRecordNumber(
            result.data.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId || userDetail.sageParentId,
                amount: result.data.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.data.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              console.log("data for apply pay =>", ARdata);
              await updateInvoiceAfterPay(dbInvoiceId);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {}
              );
            }
          );
          toast.success("Activity purchase Successfully !");
          setOpen(false);
          handleThanksOpen();
          let data = {
            invoiceTitle: "SALES",
            customerId: userUniqueId,
            transactionId: result && result?.data?.insetTransatction?.insertId,
            activityId: itemID,
            itemId: 0,
          };
          commmonfunctions.SendEmailsAfterPayment(data).then((res) => {});
          setshowspinner(false);
          setBtnDisabled(false);
          setTimeout(() => {
            handleThanksClose();
            router.push("/user/invoices/invoiceslist/ci");
          }, 3000);
        })
        .catch((error: any) => {
          console.log("error =>", error);
        });
    }

    if (paymentPayMethod === "Amex" && creditToApply !== "" && totalPay > 0) {
      localStorage?.setItem("dbInvoiceid", JSON.stringify(dbInvoiceId));
      localStorage.setItem("salesOrder", "sageintacctorderID");
      localStorage.setItem("paymentToApply", paymentToApply);

      if (totalPay === 0) {
        console.log("finalAmountToPaytoastrre", totalPay);
        toast.error("amount will not be $0 for Amex payment method");
      } else {
        var requestData = {
          apiOperation: "CREATE_CHECKOUT_SESSION",
          order: {
            id: sageintacctInvoiceID,
            amount: totalPay,
            currency: "QAR",
            description: "Orderd",
          },
          interaction: {
            returnUrl: `${
              process.env.NEXT_PUBLIC_AMEX_SUCCESS_RETURN_URL
            }?orderid=${sageintacctInvoiceID}&paymentMethod=${paymentPayMethod}&creditNoteId=${null}&DBInvoiceid=${dbInvoiceId}&remaingAmount=${creditToApply}&customerID=${dbCustomerId}&itemIdd=${itemID}&invoiceTitle=${"INVOICES"}&customerIdd=${userUniqueId}&sageCustomerId=${sageCustomerId}&dueInvoiceAmount=${price}&finalAmountToPay=${finalAmountToPay}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_AMEX_CUSTOMER_PAY_INVOICE_CANCEL_URL}`,
            operation: "PURCHASE",
            merchant: {
              name: "QATAR INTERNATIONAL SCHOOL - ONLINE 634",
              address: {
                line1: "200 Sample St",
                line2: "1234 Example Town",
              },
            },
          },
        };
        await getwayService.getSession(
          requestData,
          async function (result: any) {
            if (result?.data?.result === "SUCCESS") {
              await Checkout.configure({
                session: {
                  id: result?.data.session.id,
                },
              });
              await Checkout.showPaymentPage();
            }
          }
        );
      }
    }
    if (paymentPayMethod === "Amex" && totalPay > 0 && creditToApply === "") {
      localStorage?.setItem("dbInvoiceid", JSON.stringify(dbInvoiceId));
      localStorage.setItem("salesOrder", "sageintacctorderID");
      localStorage.setItem("paymentToApply", paymentToApply);

      if (totalPay === 0) {
        console.log("finalAmountToPaytoastrre", totalPay);
        toast.error("amount will not be $0 for Amex payment method");
      } else {
        var requestData1 = {
          apiOperation: "CREATE_CHECKOUT_SESSION",
          order: {
            id: sageintacctInvoiceID,
            amount: totalPay,
            currency: "QAR",
            description: "Orderd",
          },
          interaction: {
            returnUrl: `${
              process.env.NEXT_PUBLIC_AMEX_SUCCESS_RETURN_URL
            }?orderid=${sageintacctInvoiceID}&paymentMethod=${paymentPayMethod}&creditNoteId=${null}&DBInvoiceid=${dbInvoiceId}&customerID=${dbCustomerId}&itemIdd=${itemID}&invoiceTitle=${"INVOICES"}&finalAmountToPay=${finalAmountToPay}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_AMEX_CUSTOMER_PAY_INVOICE_CANCEL_URL}`,
            operation: "PURCHASE",
            merchant: {
              name: "QATAR INTERNATIONAL SCHOOL - ONLINE 634",
              address: {
                line1: "200 Sample St",
                line2: "1234 Example Town",
              },
            },
          },
        };

        console.log("requestData1", requestData1);
        await getwayService.getSession(
          requestData1,
          async function (result: any) {
            if (result?.data?.result === "SUCCESS") {
              await Checkout.configure({
                session: {
                  id: result?.data.session.id,
                },
              });
              await Checkout.showPaymentPage();
            }
          }
        );
      }
    }
    if (paymentPayMethod === "Amex" && totalPay === 0) {
      try {
        const dataforRemaingAmount: any = {
          customerId: userUniqueId,
          sageCustomerId: parseInt(dbCustomerId),
          invoiceId: dbInvoiceId,
          sageinvoiceId: sageintacctInvoiceID,
          Amount: creditToApply,
          amountMode: 0,
        };
        if (creditToApply !== "") {
          await insertRemainingNotesAmount(dataforRemaingAmount);
        }

        const rendomTransactionId = keyGen(5);
        let reqData = {
          totalAmount: totalPay,
          paidAmount: totalPay,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: sageintacctInvoiceID,
          paymentMethod: "Cash",
          idForPayment: sageintacctInvoiceID,
          creditNotesId: creditNoteNewId,
        };
        console.log("@@@@@@@@@@", reqData);
        await transactionSave(reqData);
        await updateInvoiceAfterPay(dbInvoiceId);
        // handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentPayMethod === "QPay" && totalPay > 0 && creditToApply === "") {
      localStorage.setItem("invoiceId", dbInvoiceId);
      localStorage.setItem("user", "user");
      localStorage.setItem("note", "null");
      localStorage.setItem("sagecustomerid", sageCustomerId);
      localStorage.setItem("dbcustomerid", dbCustomerId);
      localStorage.setItem("itemIdd", itemID);
      // localStorage.setItem("invoiceTitle", "INVOICES");
      localStorage?.setItem("customerIdd", userUniqueId);
      localStorage?.setItem("dueInvoiceAmount", dueInvoiceAmount);
      localStorage?.setItem("finalAmountToPay", finalAmountToPay);
      localStorage.setItem("creditNoteAmount", creditToApply);
      localStorage.setItem("invoiceTitle", "SALES");
      localStorage.setItem("salseOrder", sageintacctorderID);
      localStorage.setItem("fromSalesOrder", "fromSalesOrder");
      localStorage.setItem("paymentToApply", paymentToApply);

      const rendomTransactionId = keyGen(10);

      await getwayService.getTransactionData(
        dbInvoiceId,
        async function (result: any) {
          if (result && result?.transactionId !== "") {
            await axios({
              method: "DELETE",
              url: `${api_url}/deleteTransaction/${result?.id}`,
              headers: {
                Authorization: auth_token,
              },
            })
              .then(async (data) => {
                console.log("@@@@@deleteData");
                let reqData = {
                  totalAmount: totalPay,
                  paidAmount: totalPay,
                  transactionId: `${rendomTransactionId}`,
                  amexorderId: sageintacctInvoiceID,
                  paymentMethod: "Credit Card",
                  idForPayment: sageintacctInvoiceID,
                  creditNotesId: null,
                  card_type: "QPay",
                };
                await getwayService.transactionDataSaveInDB(
                  reqData,
                  async function (transresult: any) {
                    console.log("@@@@@@@@@@@@#result", transresult);
                    let data = {
                      amount: totalPay,
                      PUN: transresult?.transactionId,
                    };
                    getwayService.redirectQPayPayment(data);
                  }
                );
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            let reqData = {
              totalAmount: totalPay,
              paidAmount: totalPay,
              transactionId: `${rendomTransactionId}`,
              amexorderId: sageintacctInvoiceID,
              paymentMethod: "Credit Card",
              idForPayment: sageintacctInvoiceID,
              creditNotesId: null,
              card_type: "QPay",
            };
            await getwayService.transactionDataSaveInDB(
              reqData,
              async function (transresult: any) {
                let data = {
                  amount: totalPay,
                  PUN: transresult?.transactionId,
                };
                getwayService.redirectQPayPayment(data);
              }
            );
          }
        }
      );
    } else if (paymentPayMethod === "QPay" && totalPay === 0) {
      try {
        const rendomTransactionId = keyGen(10);
        const dataforRemaingAmount: any = {
          customerId: userUniqueId,
          sageCustomerId: parseInt(sageCustomerId),
          invoiceId: dbInvoiceId,
          sageinvoiceId: sageintacctInvoiceID,
          Amount: creditToApply,
          amountMode: 0,
        };

        if (creditToApply !== "") {
          await insertRemainingNotesAmount(dataforRemaingAmount);
        }

        let reqData = {
          totalAmount: totalPay,
          paidAmount: totalPay,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: sageintacctInvoiceID,
          paymentMethod: "Cash",
          idForPayment: sageintacctInvoiceID,
          creditNotesId: creditNoteNewId,
        };
        await transactionSave(reqData);
        await updateInvoiceAfterPay(dbInvoiceId);
        // handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentPayMethod === "QPay" && totalPay > 0 && creditToApply !== "") {
      localStorage.setItem("invoiceId", dbInvoiceId);
      localStorage.setItem("user", "user");
      localStorage.setItem("note", "null");
      localStorage.setItem("sagecustomerid", sageCustomerId);
      localStorage.setItem("dbcustomerid", dbCustomerId);
      localStorage.setItem("itemIdd", itemID);
      // localStorage.setItem("invoiceTitle", "INVOICES");
      localStorage?.setItem("customerIdd", userUniqueId);
      localStorage?.setItem("dueInvoiceAmount", dueInvoiceAmount);
      localStorage?.setItem("finalAmountToPay", finalAmountToPay);
      localStorage.setItem("creditNoteAmount", creditToApply);
      localStorage.setItem("invoiceTitle", "SALES");
      localStorage.setItem("salseOrder", sageintacctorderID);
      localStorage.setItem("fromSalesOrder", "fromSalesOrder");
      localStorage.setItem("paymentToApply", paymentToApply);

      const rendomTransactionId = keyGen(10);

      await getwayService.getTransactionData(
        dbInvoiceId,
        async function (result: any) {
          if (result && result?.transactionId !== "") {
            await axios({
              method: "DELETE",
              url: `${api_url}/deleteTransaction/${result?.id}`,
              headers: {
                Authorization: auth_token,
              },
            })
              .then(async (data) => {
                console.log("@@@@@deleteData");
                let reqData = {
                  totalAmount: totalPay,
                  paidAmount: totalPay,
                  transactionId: `${rendomTransactionId}`,
                  amexorderId: sageintacctInvoiceID,
                  paymentMethod: "Credit Card",
                  idForPayment: sageintacctInvoiceID,
                  creditNotesId: "null",
                  card_type: "QPay",
                };
                await getwayService.transactionDataSaveInDB(
                  reqData,
                  async function (transresult: any) {
                    let data = {
                      amount: totalPay,
                      PUN: transresult?.transactionId,
                    };
                    console.log("transresult", data);
                    await getwayService.redirectQPayPayment(data);
                  }
                );
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            let reqData = {
              totalAmount: totalPay,
              paidAmount: totalPay,
              transactionId: `${rendomTransactionId}`,
              amexorderId: sageintacctInvoiceID,
              paymentMethod: "Credit Card",
              idForPayment: sageintacctInvoiceID,
              creditNotesId: "null",
              card_type: "QPay",
            };
            await getwayService.transactionDataSaveInDB(
              reqData,
              async function (transresult: any) {
                let data = {
                  amount: totalPay,
                  PUN: transresult?.transactionId,
                };
                console.log("transresulttransresult", data);
                await getwayService.redirectQPayPayment(data);
              }
            );
          }
        }
      );
    }

    if (paymentPayMethod === "CBQ" && totalPay > 0 && creditToApply === "") {
      localStorage.setItem("user", "user");
      localStorage.setItem("itemIdd", itemID);
      localStorage.setItem("invoiceTitle", "SALES");
      localStorage?.setItem("dueInvoiceAmount", dueInvoiceAmount);
      localStorage?.setItem("finalAmountToPay", finalAmountToPay);
      localStorage?.setItem("dbInvoiceid", dbInvoiceId);
      localStorage.setItem("salesOrder", "sageintacctorderID");
      localStorage.setItem("paymentToApply", paymentToApply);

      router.push(
        `/checkpayment/cbq/?amount=${totalPay}&refrenceNumber=${sageintacctInvoiceID}&sageCustomerId=${sageCustomerId}&creditNotesId=${null}&invoiceid=${dbInvoiceId}&dbcustomerid=${dbCustomerId}&customerIdd=${userUniqueId}`
      );
    } else if (paymentPayMethod === "CBQ" && totalPay === 0) {
      try {
        const rendomTransactionId = keyGen(5);
        const dataforRemaingAmount: any = {
          customerId: userUniqueId,
          sageCustomerId: parseInt(sageCustomerId),
          invoiceId: dbInvoiceId,
          sageinvoiceId: sageintacctInvoiceID,
          Amount: creditToApply,
          amountMode: 0,
        };

        if (creditToApply !== "") {
          await insertRemainingNotesAmount(dataforRemaingAmount);
        }
        let reqData = {
          totalAmount: totalPay,
          paidAmount: totalPay,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: sageintacctInvoiceID,
          paymentMethod: "Case",
          idForPayment: sageintacctInvoiceID,
          creditNotesId: creditNoteNewId,
        };
        await transactionSave(reqData);
        await updateInvoiceAfterPay(dbInvoiceId);
        // handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentPayMethod === "CBQ" && totalPay > 0 && creditToApply !== "") {
      localStorage.setItem("user", "user");
      localStorage.setItem("itemIdd", itemID);
      localStorage.setItem("invoiceTitle", "SALES");
      localStorage?.setItem("dueInvoiceAmount", dueInvoiceAmount);
      localStorage?.setItem("finalAmountToPay", finalAmountToPay);
      localStorage?.setItem("dbInvoiceid", dbInvoiceId);
      localStorage.setItem("salesOrder", "sageintacctorderID");
      localStorage.setItem("paymentToApply", paymentToApply);

      router.push(
        `/checkpayment/cbq/?amount=${totalPay}&refrenceNumber=${sageintacctInvoiceID}&sageCustomerId=${sageCustomerId}&invoiceid=${dbInvoiceId}&dbcustomerid=${dbCustomerId}&creditNoteAmount=${creditToApply}&customerIdd=${userUniqueId}`
      );
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

  const createInvoice = async () => {
    const dates = new Date();
    const invoiceDate = moment(dates).format("DD/MM/YYYY");
    const createdDate = moment(dates).format("DD/MM/YYYY");
    const requestedData = {
      itemId: [itemID],
      quantity: ["1"],
      amount: price,
      amount_due: price,
      status: "Pending",
      createdDate: createdDate,
      createdBy: userDetail.id,
      invoiceDate: invoiceDate,
      customerId: userDetail.id,
      invoiceNo: keyGen(10),
      sageSOid: sageintacctorderID,
    };
    if (paymentPayMethod === "") {
      console.log("se");
    } else {
      await axios({
        method: "POST",
        url: `${api_url}/createInvoice`,
        data: requestedData,
        headers: {
          "content-type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (!res) {
            // toast.success("something wents wrong !");
          } else {
            dbInvoiceId = res?.data?.data?.insertId;
            sageintacctInvoiceID = res?.data?.sageIntacctInvoiceID;
            setARInvoiceId(res?.data?.sageIntacctInvoiceID);
            AddLogs(
              userUniqueId,
              `Invoice created id - #${res?.data?.sageIntacctInvoiceID}`
            );
            // toast.success("Invoice created Successfully !");
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err, "error");
          }
        });
    }
  };

  const transactionSave = async (data: any) => {
    await axios({
      method: "POST",
      url: `${api_url}/createTransaction`,
      data: data,
      headers: {
        Authorization: auth_token,
      },
    })
      .then(async (result: any) => {
        console.log("resultresult", result);
        AddLogs(
          userUniqueId,
          `Sales order transaction id - #${data?.transactionId}`
        );
        if (paymentPayMethod === "Amex") {
          await getwayService.getARInoviceRecordNumber(
            result.data.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId || userDetail.sageParentId,
                amount: result.data.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.data.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              // toast.success("Activity purchase Successfully !");
              console.log("data for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {
                  // await updateInvoiceAfterPay(dbInvoiceId);
                }
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId || userDetail.sageParentId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.data.referenceNumber,
              //     ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              //   };
              //   console.log("data2 for apply pay =>", ARdata);
              //   await getwayService.createAndApplyPaymentARInvoice(
              //     ARdata,
              //     async function (result: any) {}
              //   );
              // }
            }
          );
        } else if (paymentPayMethod === "QPay") {
          await getwayService.getARInoviceRecordNumber(
            result.data.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId || userDetail.sageParentId,
                amount: result.data.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.data.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              // toast.success("Activity purchase Successfully !");
              console.log("data for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {
                  // await updateInvoiceAfterPay(dbInvoiceId);
                }
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId || userDetail.sageParentId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.data.referenceNumber,
              //     ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              //   };
              //   console.log("data2 for apply pay =>", ARdata);
              //   await getwayService.createAndApplyPaymentARInvoice(
              //     ARdata,
              //     async function (result: any) {}
              //   );
              // }
            }
          );
        } else if (paymentPayMethod === "CBQ") {
          await getwayService.getARInoviceRecordNumber(
            result.data.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId || userDetail.sageParentId,
                amount: result.data.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.data.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              // toast.success("Activity purchase Successfully !");
              console.log("data for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {
                  // await updateInvoiceAfterPay(dbInvoiceId);
                }
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId || userDetail.sageParentId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.data.referenceNumber,
              //     ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              //   };
              //   console.log("data2 for apply pay =>", ARdata);
              //   await getwayService.createAndApplyPaymentARInvoice(
              //     ARdata,
              //     async function (result: any) {}
              //   );
              // }
            }
          );
        }
        toast.success("Activity purchase Successfully !");
        setOpen(false);
        handleThanksOpen();
        let data1 = {
          invoiceTitle: "SALES",
          customerId: userUniqueId,
          transactionId: result && result?.data?.insetTransatction?.insertId,
          activityId: itemID,
          itemId: 0,
        };
        commmonfunctions.SendEmailsAfterPayment(data1).then((res) => {});
        setshowspinner(false);
        setBtnDisabled(false);
        setTimeout(() => {
          handleThanksClose();
          router.push("/user/invoices/invoiceslist/ci");
        }, 3000);
      })
      .catch((error: any) => {
        console.log("error =>", error);
      });
  };
  const updateInvoiceAfterPay = async (invoiceId: any) => {
    try {
      let getAmount = totalPay === 0 ? 0 : totalPay;
      let totalBothAmount = parseInt(getAmount + creditToApply);
      let dueAmount = dueInvoiceAmount === 0 ? price : dueInvoiceAmount;

      console.log(
        dueInvoiceAmount,
        "getAmount",
        getAmount,
        totalBothAmount,
        dueAmount,
        "creditToApply",
        creditToApply
      );

      let statuss = "";
      if (dueAmount === totalBothAmount) {
        statuss = "Paid";
      } else {
        statuss = "Partially paid";
      }

      let requestedData = {
        note: "null",
        status: statuss,
        amount_due: finalAmountToPay,
      };
      console.log("##########", requestedData);
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
  const handleCustId = (data: any) => {
    setcustId(data);
  };

  let totalPrice =
    price === 0
      ? 0
      : price < creditAmount
      ? 0
      : Math?.abs(creditAmount - price);
  creditBalance =
    creditAmount === price
      ? creditAmount
      : creditAmount > price
      ? price
      : creditAmount;

  // handle Receive Payment Modal
  const handleReceivePaymentAccordingToUs = (e: any, identifier: any) => {
    const transactionAmount = price;
    let OutstandingAmount: any;
    const creditBal = customerTotalCreditNoteBalance;
    console.log("identifieridentifier", identifier);
    if (identifier === "creditNotes") {
      setApplyCreditNoteAmount("");

      if (
        e.target.name === "Credit to apply" &&
        customerTotalCreditNoteBalance
      ) {
        if (e.target.value) {
          if (creditBal < parseInt(e.target.value)) {
            // setFinalAmountToPay(OutstandingAmount);
            setCreditPopupError(
              "Credits to apply must be less than or equal to Credits available"
            );
            setApplyCreditNoteAmount(creditBal);
          } else if (transactionAmount < parseInt(e.target.value)) {
            setCreditPopupError(
              "Credits to apply must be less than or equal to Transaction amount"
            );
            setFinalAmountToPay(transactionAmount);
            setApplyCreditNoteAmount(creditBal);
          } else if (paymentToApply > 0) {
            let applyAmount1 = parseInt(e.target.value);
            let newB = transactionAmount - (applyAmount1 + paymentToApply);
            if (newB < 0) {
              setCreditPopupError(
                "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
              );
              setApplyPaymentPopupError("");
              setApplyCreditNoteAmount(creditBal);
              // } else if (newB === transactionAmount) {
              //   OutstandingAmount = transactionAmount - newB;
              //   setFinalAmountToPay(OutstandingAmount);
              //   setCreditPopupError("");
            } else {
              const creditedAmount = creditBal - parseInt(e.target.value);
              OutstandingAmount = newB;
              setApplyCreditNoteAmount(creditedAmount);
              setCreditPopupError("");
              setFinalAmountToPay(OutstandingAmount);
              setApplyPaymentPopupError("");
            }
          } else {
            const creditedAmount = creditBal - parseInt(e.target.value);
            OutstandingAmount = transactionAmount - parseInt(e.target.value);
            setApplyCreditNoteAmount(creditedAmount);
            setCreditPopupError("");
            setFinalAmountToPay(OutstandingAmount);
          }
          setCreditToApply(parseInt(e.target.value));
        } else {
          if (paymentToApply > 0) {
            setCreditToApply("");
            setApplyCreditNoteAmount(creditBal);
            OutstandingAmount = transactionAmount - paymentToApply;
            setFinalAmountToPay(OutstandingAmount);
            setCreditPopupError("");
          } else {
            setCreditToApply("");
            setApplyCreditNoteAmount(creditBal);
            setFinalAmountToPay(transactionAmount);
            setCreditPopupError("");
            setApplyPaymentPopupError("");
          }
        }
      }
    } else if (identifier === "payment") {
      let applyAmount = parseInt(e.target.value);

      let newA =
        transactionAmount -
        ((!Number.isNaN(applyAmount) ? applyAmount : 0) + creditToApply);
      if (e.target.value) {
        if (newA < 0) {
          setApplyPaymentPopupError(
            "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
          );
        } else {
          OutstandingAmount = newA;
          setFinalAmountToPay(OutstandingAmount);
          setApplyPaymentPopupError("");
          setCreditPopupError("");
        }
        // else if (newA === transactionAmount ) {
        //   console.log('@#$$%%%%%%');
        //   OutstandingAmount = transactionAmount - newA;
        //   console.log('OutstandingAmount',OutstandingAmount);
        //   setFinalAmountToPay(OutstandingAmount);
        //   setApplyPaymentPopupError("");
        // }
        setPaymentToApply(parseInt(e.target.value));
      } else {
        setPaymentToApply(0);
        setApplyPaymentPopupError("");
        // setApplyCreditNoteAmount(creditBal);
        setFinalAmountToPay(transactionAmount);
        OutstandingAmount = transactionAmount - creditToApply;
        setFinalAmountToPay(OutstandingAmount);
      }
    }
  };

  // const handleReceivePaymentAccordingToUs = (e: any, identifier: any) => {
  //   const transactionAmount = price;
  //   let OutstandingAmount: any;
  //   const creditBal = customerTotalCreditNoteBalance;

  //   if (identifier === "creditNotes") {
  //     setApplyCreditNoteAmount("");

  //     if (
  //       e.target.name === "Credit to apply" &&
  //       customerTotalCreditNoteBalance
  //     ) {
  //       if (e.target.value) {
  //         if (creditBal < parseInt(e.target.value)) {
  //           setFinalAmountToPay(OutstandingAmount);
  //           setCreditPopupError(
  //             "Credits to apply must be less than or equal to Credits available"
  //           );
  //           setApplyCreditNoteAmount(creditBal);
  //         } else if (transactionAmount < parseInt(e.target.value)) {
  //           setCreditPopupError(
  //             "Credits to apply must be less than or equal to Transaction amount"
  //           );
  //           setFinalAmountToPay(transactionAmount);
  //           setApplyCreditNoteAmount(creditBal);
  //         } else if (paymentToApply > 0) {
  //           let applyAmount1 = parseInt(e.target.value);
  //           let newB = applyAmount1 + paymentToApply;
  //           if (newB > transactionAmount) {
  //             setCreditPopupError(
  //               "Credits to apply must be less than or equal to Credits available"
  //             );
  //             setApplyCreditNoteAmount(creditBal);
  //           } else if (newB === transactionAmount) {
  //             OutstandingAmount = transactionAmount - newB;
  //             setFinalAmountToPay(OutstandingAmount);
  //             setCreditPopupError("");
  //           } else {
  //             const creditedAmount = creditBal - parseInt(e.target.value);
  //             OutstandingAmount = transactionAmount - newB;
  //             setApplyCreditNoteAmount(creditedAmount);
  //             setCreditPopupError("");
  //             setFinalAmountToPay(OutstandingAmount);
  //           }
  //         } else {
  //           const creditedAmount = creditBal - parseInt(e.target.value);
  //           OutstandingAmount = transactionAmount - parseInt(e.target.value);
  //           setApplyCreditNoteAmount(creditedAmount);
  //           setCreditPopupError("");
  //           setFinalAmountToPay(OutstandingAmount);
  //         }
  //         setCreditToApply(parseInt(e.target.value));
  //       } else {
  //         if (paymentToApply > 0) {
  //           setCreditToApply("");
  //           setApplyCreditNoteAmount(creditBal);
  //           OutstandingAmount = transactionAmount - paymentToApply;
  //           setFinalAmountToPay(OutstandingAmount);
  //           setCreditPopupError("");
  //         } else {
  //           setCreditToApply("");
  //           setApplyCreditNoteAmount(creditBal);
  //           setFinalAmountToPay(transactionAmount);
  //           setCreditPopupError("");
  //         }
  //       }
  //     }
  //   } else if (identifier === "payment") {
  //     let applyAmount = parseInt(e.target.value);
  //     let newA = applyAmount + creditToApply;

  //     if (e.target.value) {
  //       if (newA > transactionAmount) {
  //         setApplyPaymentPopupError(
  //           "Payment to apply must be less than or equal to total payment"
  //         );
  //       } else {
  //         OutstandingAmount = transactionAmount - newA;
  //         setFinalAmountToPay(OutstandingAmount);
  //         setApplyPaymentPopupError("");
  //       }
  //       //  else if (newA === transactionAmount) {
  //       //   OutstandingAmount = transactionAmount - newA;
  //       //   setFinalAmountToPay(OutstandingAmount);
  //       //   setApplyPaymentPopupError("");
  //       // }
  //       setPaymentToApply(parseInt(e.target.value));
  //     } else {
  //       setPaymentToApply("0.00");
  //       setApplyCreditNoteAmount(creditBal);
  //       setFinalAmountToPay(transactionAmount);
  //       OutstandingAmount = transactionAmount - creditToApply;
  //       setFinalAmountToPay(OutstandingAmount);
  //     }
  //   }
  // };

  let totalPay =
    (paymentToApply === "" || paymentToApply === 0) && creditToApply > 0
      ? 0
      : paymentToApply === "" || paymentToApply === 0
      ? price
      : paymentToApply;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="guardianBar">
            <div>
              <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              >
                <BootstrapDialogTitle
                  id="customized-dialog-title"
                  onClose={handleClose}
                >
                  Pay Payment
                </BootstrapDialogTitle>
                <DialogContent dividers>
                  <Box sx={{ width: "100%" }}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="payment-form"
                    >
                      <Grid className="">
                        <Stack style={{ marginTop: "5px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name">
                                  Select Child{" "}
                                  <span className="err_str">*</span>
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  size="small"
                                  value={custId}
                                  {...register("custId", {
                                    required: "Field is Required *",
                                  })}
                                  onChange={(e) => handleCustId(e.target.value)}
                                >
                                  {mycusts &&
                                    mycusts.map((item: any, key: any) => {
                                      return (
                                        <MenuItem id={key} value={item.id}>
                                          {item.name}
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                                {errors.custId?.type && (
                                  <span
                                    style={{
                                      color: "red",
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {custId === ""
                                      ? errors?.custId?.message
                                      : ""}
                                  </span>
                                )}
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name">Date</InputLabel>
                                <span className="label-box">
                                  {todaysDate && todaysDate}
                                </span>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Stack>
                        <Stack style={{ marginTop: "20px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name">
                                  Activity Name
                                </InputLabel>
                                <span className="label-box">
                                  {activity && activity[0]?.name}
                                </span>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="payment">
                                  Payment Method
                                </InputLabel>
                                <FormControl fullWidth>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    defaultValue={"Cash"}
                                    size="small"
                                    // disabled={
                                    //   (totalPrice === 0 && price === 0) ||
                                    //   (Check === true && creditAmount > price)
                                    //     ? true
                                    //     : false
                                    // }
                                    {...register("payment")}
                                    onChange={(e) =>
                                      handlePaymentName(e.target.value)
                                    }
                                  >
                                    <MenuItem value="All"></MenuItem>
                                    <MenuItem value="CBQ">Credit Card</MenuItem>
                                    <MenuItem value="QPay">Debit Card</MenuItem>
                                    <MenuItem value="Amex">Amex</MenuItem>
                                    {/* <MenuItem value="Cash">Cash</MenuItem> */}
                                  </Select>
                                </FormControl>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Stack>
                        <Stack style={{ marginTop: "20px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={2.4}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name">
                                  Txn amount
                                </InputLabel>
                                <OutlinedInput
                                  disabled
                                  defaultValue={
                                    commmonfunctions.formatePrice(price) +
                                    " (" +
                                    qatar_currency +
                                    ")"
                                  }
                                  type="text"
                                  id="name"
                                  placeholder="Alternate Email..."
                                  fullWidth
                                  size="small"
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name">
                                  Credits available{" "}
                                </InputLabel>
                                <OutlinedInput
                                  disabled
                                  value={`${applyCreditNoteAmount}.00`}
                                  type="text"
                                  id="name"
                                  placeholder="Alternate Email..."
                                  fullWidth
                                  size="small"
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name">
                                  Credits to apply{" "}
                                </InputLabel>
                                <OutlinedInput
                                  fullWidth
                                  id="name"
                                  type="number"
                                  placeholder={
                                    customerTotalCreditNoteBalance === 0
                                      ? "No credits to apply"
                                      : "Credit to apply"
                                  }
                                  disabled={
                                    customerTotalCreditNoteBalance !== 0
                                      ? false
                                      : true
                                  }
                                  name="Credit to apply"
                                  size="small"
                                  value={creditToApply}
                                  onChange={(e) =>
                                    handleReceivePaymentAccordingToUs(
                                      e,
                                      "creditNotes"
                                    )
                                  }
                                />
                              </Stack>
                              {creditPopupError && (
                                <Typography style={styleptag}>
                                  {creditPopupError}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name">
                                  Payment amount{" "}
                                </InputLabel>
                                <OutlinedInput
                                  onChange={(e) =>
                                    handleReceivePaymentAccordingToUs(
                                      e,
                                      "payment"
                                    )
                                  }
                                  type="number"
                                  id="name"
                                  placeholder="Payment to apply"
                                  name="Payment to apply"
                                  fullWidth
                                  size="small"
                                />
                              </Stack>
                              {applyPaymentPopupError && (
                                <Typography style={styleptag}>
                                  {applyPaymentPopupError}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={12} md={2.4}>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name">
                                  Outstanding amount{" "}
                                </InputLabel>
                                <OutlinedInput
                                  disabled
                                  value={
                                    commmonfunctions.formatePrice(
                                      finalAmountToPay
                                    ) +
                                    " (" +
                                    qatar_currency +
                                    ")"
                                  }
                                  type="text"
                                  id="name"
                                  placeholder="Alternate Email..."
                                  fullWidth
                                  size="small"
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                        </Stack>
                        <Stack style={{ marginTop: "20px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                              <div>
                                <h5 className="apply">Apply Payment</h5>
                              </div>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name"></InputLabel>
                                <p>
                                  Total txn amount :{" "}
                                  {commmonfunctions.formatePrice(price) +
                                    " (" +
                                    qatar_currency +
                                    ")"}{" "}
                                </p>
                              </Stack>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name"></InputLabel>
                                <div>
                                  <span style={{ color: "red" }}>
                                    Total credit amount:{" "}
                                    {commmonfunctions.formatePrice(
                                      creditToApply ? creditToApply : 0
                                    ) +
                                      " (" +
                                      qatar_currency +
                                      ")"}{" "}
                                  </span>
                                </div>
                              </Stack>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name"></InputLabel>
                                <p>
                                  Total payment amount:{" "}
                                  {commmonfunctions.formatePrice(
                                    paymentToApply ? paymentToApply : 0
                                  ) +
                                    " (" +
                                    qatar_currency +
                                    ")"}{" "}
                                </p>
                              </Stack>
                              <Stack spacing={1}>
                                <InputLabel htmlFor="name"></InputLabel>
                                <p>
                                  {" "}
                                  Total pay : {commmonfunctions.formatePrice(totalPay && totalPay)}{" "}
                                  {" (" + qatar_currency + ")"}
                                </p>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>
                      <DialogActions>
                        <Button
                          type="submit"
                          variant="contained"
                          size="small"
                          sx={{ width: 150 }}
                          autoFocus
                          disabled={
                            btnDisabled ||
                            creditPopupError ||
                            applyPaymentPopupError
                          }
                        >
                          <b>Pay</b>
                          <span
                            style={{ fontSize: "2px", paddingLeft: "10px" }}
                          >
                            {spinner === true ? (
                              <CircularProgress color="inherit" />
                            ) : (
                              ""
                            )}
                          </span>
                        </Button>
                      </DialogActions>
                    </form>
                    <ToastContainer />
                  </Box>
                </DialogContent>
              </BootstrapDialog>
            </div>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              style={{ padding: "8px", marginBottom: "15px" }}
            >
              <Stack>
                <Stack spacing={3}>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link
                      key="1"
                      color="inherit"
                      href="/"
                      style={{ color: "#1A70C5", textDecoration: "none" }}
                    >
                      Home
                    </Link>
                    <Link
                      key="2"
                      color="inherit"
                      href="/"
                      style={{ color: "#7D86A5", textDecoration: "none" }}
                    >
                      Activities
                    </Link>
                  </Breadcrumbs>
                </Stack>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: "bold", color: "#333333" }}
                >
                  VIEW ACTIVITY
                </Typography>
              </Stack>
              <div className="buycss" style={{ textAlign: "end" }}>
                <Link
                  href="/user/activities/buy"
                  style={{ color: "#1A70C5", textDecoration: "none" }}
                >
                  <Button variant="contained" startIcon={<ArrowBackIcon />}>
                    {" "}
                    Back To List
                  </Button>
                </Link>
              </div>
            </Stack>
            <Card
              style={{ margin: "10px", padding: "15px" }}
              className="box-shadow"
            >
              <div className="view-main">
                <div className="view-mainleft">
                  <span
                    className="title view-activity"
                    style={{ fontSize: "30px" }}
                  >
                    {activity && activity[0]?.name}
                  </span>
                  <div className="date" style={{ display: "flex" }}>
                    <div className="sdiv">
                      <h4>
                        <span style={{ color: "#000" }}>StartDate : </span>
                        {moment(
                          activity && activity[0]?.startDate,
                          "YYYY.MM.DD"
                        ).format("DD-MM-YYYY")}
                      </h4>
                    </div>
                    <div className="sdiv">
                      - &nbsp;
                      <h4>
                        <span style={{ color: "#000" }}>EndDate : </span>
                        {moment(
                          activity && activity[0]?.endDate,
                          "YYYY.MM.DD"
                        ).format("DD-MM-YYYY")}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="view-mainright">
                  {activity && activity[0]?.price === 0 ? (
                    <div style={{ marginLeft: "55%" }}>
                      <h4 style={{ color: "#395ba9" }}>Free</h4>
                    </div>
                  ) : (
                    <div style={{ display: "flex" }}>
                      <h4>Amount</h4> &nbsp;&nbsp;
                      <h3 style={{ color: "orangered", fontSize: "24px" }}>
                        {commmonfunctions.formatePrice(
                          activity && activity[0]?.price
                        )}{" "}
                        {" (" + qatar_currency + ")"}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
              {/* <p>{activity[0]?.description}</p>  */}
              <div
                dangerouslySetInnerHTML={{
                  __html: activity && activity[0]?.description,
                }}
              ></div>
              <div
                className="font-size-15"
                dangerouslySetInnerHTML={{
                  __html: activity && activity[0]?.short_description,
                }}
              ></div>
              <br />
              <div style={{ textAlign: "end" }}>
                <Button
                  variant="contained"
                  size="large"
                  className="btnCustomerdetailPay"
                  onClick={handlePopupOpen}
                >
                  Buy
                </Button>
              </div>
            </Card>
          </div>
          <div>
            <Modal
              open={openThank}
              // onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <h2
                  style={{
                    textAlign: "center",
                    color: "orangered",
                    position: "relative",
                    top: "30px",
                  }}
                >
                  Thank You for{" "}
                </h2>
                <br />
                <h2
                  style={{
                    textAlign: "center",
                    color: "orangered",
                    position: "relative",
                    bottom: "30px",
                  }}
                >
                  Payment
                </h2>
              </Box>
            </Modal>
          </div>
          <MainFooter />
        </Box>
      </Box>
    </>
  );
}
