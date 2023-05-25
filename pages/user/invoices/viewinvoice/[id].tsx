import {
  Breadcrumbs,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tab,
  TableContainer,
  TableHead,
  Tabs,
  styled,
} from "@mui/material";
import { Stack } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import MiniDrawer from "../../../sidebar";
import axios from "axios";
import { api_url, auth_token, qatar_currency } from "../../../../helper/config";
import Image from "next/image";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PDFService from "../../../../commonFunctions/invoicepdf";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import getwayService from "../../../../services/gatewayService";
import Loader from "../../../commoncmp/myload";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../../helper/activityLogs";
import RequestFormCmp from "../../salesinvoices/requestFormCmp";
import ReceiptPDFService from "../../../../commonFunctions/receiptInvoicepdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../../commonFunctions/servives";
export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapButton = styled(Button)({
  backgroundColor: "#1A70C5",
  color: "#FFFFFF",
  margin: "7px",
  "&:hover": {
    backgroundColor: "#1A70C5",
  },
});

const styleptag = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Guardians() {
  const router = useRouter();
  const { id } = router.query;
  const [value, setValue] = useState<any>({ id: null, title: null });
  const [invoiceno, setInvoiceNo] = useState();
  const [invoice, setInvoice] = useState<any>([]);
  const [invDet, setinvDet] = useState<any>([]);
  const [invDetails, setinvDetails] = useState<any>([]);
  const [product, setProduct] = useState<any>([]);
  const [dollerOpen, setDollerOpen] = useState(false);
  const [recievedPay, setRecieved] = useState<any>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [note, setNote] = useState<any>([]);
  const [customerTotalCreditNoteBalance, setCustomerTotalCreditNoteBalance] =
    useState(0);
  const [partialAmount, setPartialAmount] = useState<any>(0);
  const [customerCreditNoteRequestId, setCustomerCreditNoteRequestId] =
    useState<any>(null);
  const [applyCreditNoteAmount, setApplyCreditNoteAmount] = useState<any>(0);
  const [finalAmountToPay, setFinalAmountToPay] = useState<any>(0);
  const [isChecked, setIsChecked] = useState(false);
  const [InvoiceAmount, setInvoiceAmount] = useState(0);
  const [customerCreditNoteRemaingAmount, setCustomerCreditNoteRemaingAmount] =
    useState(0);
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [customerID, setCustomerId] = useState("");
  const [orderId, setorderId] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState<any>([]);
  const [myload, setmyload] = useState(false);
  const [userUniqueId, setUserUniqId] = useState<any>();
  const [CreditReqFormOpen, setCreditReqFormOpen] = useState(false);
  const [itemsId, setritemsId] = useState<any>("");
  const [sageCustomerId, setSageCustomerID] = useState("");
  const [spinner, setShowspinner] = useState(false);
  const [Receptspinner, setShowsReceiptpinner] = useState(false);
  const [creditToApply, setCreditToApply] = useState<any>("");
  const [creditPopupError, setCreditPopupError] = useState<any>("");
  const [paymentToApply, setPaymentToApply] = useState<any>("");
  const [applyPaymentPopupError, setApplyPaymentPopupError] = useState<any>("");
  const [dueInvoiceAmount, setDueInvoiceAmount] = useState<any>(0);
  const [tab, setTab] = useState(0);
  const [creditApplied, setCreditApplied] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  var creditNoteNewId: any;

  useEffect(() => {
    let logintoken: any;
    commmonfunctions.VerifyLoginUser().then(async (res) => {
      setUserUniqId(res?.id);
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
      }
      let response = await axios.get(`${api_url}/getuserdetails/${res?.id}`, {
        headers: {
          Authorization: auth_token,
        },
      });
      const userData = response?.data?.data[0];
      setSageCustomerID(userData.sageParentId || userData.sageCustomerId);
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

  useEffect(() => {
    if (router.isReady) {
      invoiceDataById();
      router.push(`/user/invoices/viewinvoice/${id}`);
    }
  }, [router.isReady]);

  // tab change
  const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // get credit applied
  const getCreditApplied = async (id: any) => {
    await axios({
      method: "POST",
      url: `${api_url}/getCreditApplied/${id}`,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res: any) => {
        const sumCheckTransactionAmount = res.data.data.reduce(
          (sum: any, transaction: any) =>
            transaction.amountMode === 0 && sum + transaction.amount,
          0
        );
        setCreditApplied(sumCheckTransactionAmount);
      })
      .catch((err) => {});
  };

  // get payment applied
  const getTransactionApplied = async (id: any) => {
    await axios({
      method: "POST",
      url: `${api_url}/getTransactionAmount/${id}`,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res: any) => {
        const sumCheckTransactionAmount = res.data.data.reduce(
          (sum: any, transaction: any) => sum + transaction.paidAmount,
          0
        );
        setPaymentAmount(sumCheckTransactionAmount);
      })
      .catch((err) => {});
  };

  // get invoice det
  const invoiceDataById = async () => {
    setmyload(true);
    await axios({
      method: "POST",
      url: `${api_url}/getInvoice/${id}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        const lastArrayOfObject = res.data.data[res.data.data.length - 1];
        setmyload(false);
        setInvoice(res?.data.data);
        setValue({
          id: res?.data.data[0].id,
          title: res?.data.data[0].name,
        });
        if (res) {
          axios({
            method: "POST",
            url: `${api_url}/getItembyid/${lastArrayOfObject?.id}`,
            headers: {
              "content-type": "multipart/form-data",
            },
          })
            .then((res) => {
              getCreditApplied(lastArrayOfObject?.id);
              getTransactionApplied(lastArrayOfObject?.id);
              setProduct(res?.data.data);
            })
            .catch((err) => {});
        }
        setinvDet(res?.data.data);
        setinvDetails(res?.data.data[0]);
        setInvoiceNo(res?.data?.invoiceNo);
      })
      .catch((err) => {});
  };

  //genetate pdf
  // function generateSimplePDF(product: any, title: string, isSide: string) {
  //   setShowspinner(true);
  //   PDFService.generateSimplePDF(product, title, isSide);
  //   setTimeout(() => {
  //     setShowspinner(false);
  //   }, 2000);
  // }
  const DownloadInvoice = async (item: any, title: string, isSide: string) => {
    const invoiceid = item?.tuition_invoice_id || item?.invoiceId;
    const reqData = {
      id: item?.id,
      invoiceId: invoiceid,
      isSide: isSide,
    };
    UserService.DownloadInvoices(reqData).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceid}.pdf`);
      document.body.appendChild(link);
      link.click();
      return false;
    });
  };

  //generate receipt
  // const ReceiptPdf = async (item: any, receipt_title: string, isSide: String) => {
  //   setShowsReceiptpinner(true);
  //   ReceiptPDFService.ReceiptPDF(item, receipt_title, isSide);
  //   setTimeout(() => {
  //     setShowsReceiptpinner(false);
  //   }, 2000);
  // };

  const DownloadReceipt = async (item: any, title: string, isSide: string) => {
    const reqData = {
      RCTNumber: item?.refrenceId,
      isSide: isSide,
      transactionId: item?.transactionId,
      invoiceId: item?.tuition_invoice_id || item?.invoiceId,
    };
    UserService.DownloadReceipt(reqData).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${item?.refrenceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      return false;
    });
  };

  // price cal
  var price = 0;
  for (let d of product) {
    price = price + d.item_total_price;
  }

  // payment functionality
  const handleClickOpen = async (item: any) => {
    if (item.status == "Paid") {
      setDollerOpen(false);
      toast.success("Already Paid!");
    } else {
      setCreditToApply("");
      setFinalAmountToPay(0);
      setPaymentToApply("");
      setRecieved(item);
      setDollerOpen(true);
    }
    setorderId(item.tuition_invoice_id || item?.invoiceId);
    setInvoiceAmount(item.amount);
    setDueInvoiceAmount(item.amount_due);
    setInvoiceStatus(item.status);
    setFinalAmountToPay(
      item.amount_due === null || item.amount_due === 0
        ? item.amount
        : item.amount_due
    );
    setCustomerId(item.customerId);
    getCustomerNotes(userUniqueId);
    setritemsId(item.itemId);
    let response = await axios.get(
      `${api_url}/getuserdetails/${item.customerId}`,
      {
        headers: {
          Authorization: auth_token,
        },
      }
    );
    setSageCustomerID(
      sageCustomerId !== null
        ? sageCustomerId
        : response.data.data[0].sageParentId ||
            response.data.data[0].sageCustomerId
    );
  };
  console.log("sageCustomerIdsageCustomerId", sageCustomerId);

  const handleCloses = () => {
    setDollerOpen(false);
    setApplyPaymentPopupError("");
    setCreditPopupError("");
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
      setCustomerCreditNoteRequestId(res?.CreditRequestId_FromSageCreditNotes);
      setCustomerTotalCreditNoteBalance(res?.creditBal_FromSageCreditNotes);
      setApplyCreditNoteAmount(res?.creditBal_FromSageCreditNotes);
    } catch (error: any) {
      console.log("error", error.message);
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

  const handleCheckBoxClick = async (e: any) => {
    setIsChecked(e.target.checked);
    if (e.target.checked === true) {
      let applyCreditNoteAmout =
        customerTotalCreditNoteBalance > InvoiceAmount
          ? InvoiceAmount
          : customerTotalCreditNoteBalance;
      let creditNoteRemaingAmount =
        customerTotalCreditNoteBalance > InvoiceAmount
          ? customerTotalCreditNoteBalance - InvoiceAmount
          : 0;
      setApplyCreditNoteAmount(applyCreditNoteAmout);
      let actualPay =
        customerTotalCreditNoteBalance > InvoiceAmount
          ? 0
          : InvoiceAmount - customerTotalCreditNoteBalance;
      setFinalAmountToPay(actualPay);
      setCustomerCreditNoteRemaingAmount(creditNoteRemaingAmount);
    } else {
      setApplyCreditNoteAmount(0);
      setFinalAmountToPay(InvoiceAmount);
      setCustomerCreditNoteRequestId(null);
    }
  };

  let totalPay =
    (paymentToApply === "" || paymentToApply === 0) && creditToApply > 0
      ? 0
      : paymentToApply === "" || paymentToApply === 0
      ? dueInvoiceAmount
      : paymentToApply;

  console.log("totalPaytotalPay", totalPay);
  const handleCreate = async (id: any) => {
    const Checkout: any = (window as any).Checkout;

    const creditNotesId = isChecked ? customerCreditNoteRequestId : null;
    if (paymentMethod === "") {
      toast.error("Payment method is required !");
    }
    if (paymentMethod === "Amex" && creditToApply !== "" && totalPay > 0) {
      localStorage?.setItem("dbInvoiceid", "");
      localStorage.setItem("salesOrder", "");
      localStorage.setItem("paymentToApply", paymentToApply);

      if (totalPay === 0) {
        console.log("finalAmountToPaytoastrre", totalPay);
        toast.error("amount will not be $0 for Amex payment method");
      }
      const dataforRemaingAmount: any = {
        customerId: userUniqueId,
        sageCustomerId: parseInt(sageCustomerId),
        invoiceId: id,
        sageinvoiceId: orderId,
        Amount: creditToApply,
        amountMode: 0,
      };
      if (invoiceStatus === "draft") {
        toast.error(
          "Invoice has status with Draft,Only Pending invoice Can Pay "
        );
      } else {
        var requestData = {
          apiOperation: "CREATE_CHECKOUT_SESSION",
          order: {
            id: orderId,
            amount: totalPay,
            currency: "QAR",
            description: "Orderd",
          },
          interaction: {
            returnUrl: `${
              process.env.NEXT_PUBLIC_AMEX_SUCCESS_RETURN_URL
            }?orderid=${orderId}&paymentMethod=${paymentMethod}&creditNoteId=${null}&DBInvoiceid=${id}&remaingAmount=${creditToApply}&customerID=${customerID}&itemIdd=${itemsId}&invoiceTitle=${"INVOICES"}&customerIdd=${userUniqueId}&sageCustomerId=${sageCustomerId}&dueInvoiceAmount=${dueInvoiceAmount}&finalAmountToPay=${finalAmountToPay}`,
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
    if (paymentMethod === "Amex" && totalPay > 0 && creditToApply === "") {
      localStorage?.setItem("dbInvoiceid", "");
      localStorage.setItem("salesOrder", "");
      localStorage.setItem("paymentToApply", paymentToApply);

      if (totalPay === 0) {
        console.log("finalAmountToPaytoastrre", totalPay);
        toast.error("amount will not be $0 for Amex payment method");
      }
      if (invoiceStatus === "draft") {
        toast.error(
          "Invoice has status with Draft,Only Pending invoice Can Pay "
        );
      } else {
        var requestData1 = {
          apiOperation: "CREATE_CHECKOUT_SESSION",
          order: {
            id: orderId,
            amount: totalPay,
            currency: "QAR",
            description: "Orderd",
          },
          interaction: {
            returnUrl: `${
              process.env.NEXT_PUBLIC_AMEX_SUCCESS_RETURN_URL
            }?orderid=${orderId}&paymentMethod=${paymentMethod}&creditNoteId=${null}&DBInvoiceid=${id}&customerID=${customerID}&itemIdd=${itemsId}&invoiceTitle=${"INVOICES"}&finalAmountToPay=${finalAmountToPay}`,
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
    if (paymentMethod === "Cash") {
      try {
        const rendomTransactionId = keyGen(5);
        let amount = finalAmountToPay > 0 ? finalAmountToPay : InvoiceAmount;
        let reqData = {
          totalAmount: amount,
          paidAmount: amount,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNoteNewId,
        };
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }
    if (paymentMethod === "Cash" && isChecked === true) {
      try {
        const dataforRemaingAmount: any = {
          customerId: userUniqueId,
          Amount: applyCreditNoteAmount,
          amountMode: 0,
        };

        const rendomTransactionId = keyGen(5);
        // let amount = finalAmountToPay > 0 ? finalAmountToPay : InvoiceAmount;
        let amount = isChecked
          ? Math?.abs(InvoiceAmount - applyCreditNoteAmount)
          : InvoiceAmount;
        let reqData = {
          totalAmount: amount,
          paidAmount: amount,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNotesId,
        };

        await transactionSaveInDB(reqData);
        await insertRemainingNotesAmount(dataforRemaingAmount);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }
    if (paymentMethod === "Amex" && totalPay === 0) {
      try {
        const dataforRemaingAmount: any = {
          customerId: userUniqueId,
          sageCustomerId: parseInt(sageCustomerId),
          invoiceId: id,
          sageinvoiceId: orderId,
          Amount: creditToApply,
          amountMode: 0,
        };
        if (creditToApply !== "") {
          await insertRemainingNotesAmount(dataforRemaingAmount);
        }

        const rendomTransactionId = keyGen(10);
        let reqData = {
          totalAmount: totalPay,
          paidAmount: totalPay,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNoteNewId,
        };
        console.log("@@@@@@@@@@", reqData);
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentMethod === "QPay" && totalPay > 0 && creditToApply === "") {
      localStorage.setItem("invoiceId", id);
      localStorage.setItem("user", "user");
      localStorage.setItem("note", note);
      localStorage.setItem("sagecustomerid", sageCustomerId);
      localStorage.setItem("dbcustomerid", customerID);
      localStorage.setItem("itemIdd", itemsId);
      localStorage.setItem("invoiceTitle", "INVOICES");
      localStorage?.setItem("customerIdd", userUniqueId);
      localStorage?.setItem("dueInvoiceAmount", dueInvoiceAmount);
      localStorage?.setItem("finalAmountToPay", finalAmountToPay);
      localStorage.setItem("creditNoteAmount", creditToApply);
      localStorage.setItem("fromSalesOrder", "fromInvoiceOrder");
      localStorage.setItem("paymentToApply", paymentToApply);

      const rendomTransactionId = keyGen(10);

      // await getwayService.getTransactionData(id, async function (result: any) {
      //   if (result && result?.transactionId !== "") {
      //     await axios({
      //       method: "DELETE",
      //       url: `${api_url}/deleteTransaction/${result?.id}`,
      //       headers: {
      //         Authorization: auth_token,
      //       },
      //     })
      //       .then(async (data) => {
      //         console.log("@@@@@deleteData");
      //         let reqData = {
      //           totalAmount: totalPay,
      //           paidAmount: totalPay,
      //           transactionId: `${rendomTransactionId}`,
      //           amexorderId: orderId,
      //           paymentMethod: "Credit Card",
      //           idForPayment: orderId,
      //           creditNotesId: null,
      //           card_type: "QPay",
      //         };
      //         await getwayService.transactionDataSaveInDB(
      //           reqData,
      //           async function (transresult: any) {
      //             console.log("@@@@@@@@@@@@#result", transresult);
      //             let data = {
      //               amount: totalPay,
      //               PUN: transresult?.transactionId,
      //             };
      //             getwayService.redirectQPayPayment(data);
      //           }
      //         );
      //       })
      //       .catch((error) => {
      //         console.error("Error:", error);
      //       });
      //   } else {
      let reqData = {
        totalAmount: totalPay,
        paidAmount: totalPay,
        transactionId: `${rendomTransactionId}`,
        amexorderId: orderId,
        paymentMethod: "Credit Card",
        idForPayment: orderId,
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
      //   }
      // });
    } else if (paymentMethod === "QPay" && totalPay === 0) {
      try {
        const rendomTransactionId = keyGen(10);
        const dataforRemaingAmount: any = {
          customerId: userUniqueId,
          sageCustomerId: parseInt(sageCustomerId),
          invoiceId: id,
          sageinvoiceId: orderId,
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
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNoteNewId,
        };
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentMethod === "QPay" && totalPay > 0 && creditToApply !== "") {
      localStorage.setItem("invoiceId", id);
      localStorage.setItem("user", "user");
      localStorage.setItem("note", note);
      localStorage.setItem("sagecustomerid", sageCustomerId);
      localStorage.setItem("dbcustomerid", customerID);
      localStorage.setItem("itemIdd", itemsId);
      localStorage.setItem("invoiceTitle", "INVOICES");
      localStorage.setItem("creditNoteId", creditNotesId);
      localStorage.setItem("creditNoteAmount", creditToApply);
      localStorage?.setItem("customerIdd", userUniqueId);
      localStorage?.setItem("dueInvoiceAmount", dueInvoiceAmount);
      localStorage?.setItem("finalAmountToPay", finalAmountToPay);
      localStorage.setItem("fromSalesOrder", "fromInvoiceOrder");
      localStorage.setItem("paymentToApply", paymentToApply);

      const rendomTransactionId = keyGen(5);

      // await getwayService.getTransactionData(id, async function (result: any) {
      //   if (result && result?.transactionId !== "") {
      //     await axios({
      //       method: "DELETE",
      //       url: `${api_url}/deleteTransaction/${result?.id}`,
      //       headers: {
      //         Authorization: auth_token,
      //       },
      //     })
      //       .then(async (data) => {
      //         console.log("@@@@@deleteData");
      //         let reqData = {
      //           totalAmount: totalPay,
      //           paidAmount: totalPay,
      //           transactionId: `${rendomTransactionId}`,
      //           amexorderId: orderId,
      //           paymentMethod: "Credit Card",
      //           idForPayment: orderId,
      //           creditNotesId: "null",
      //           card_type: "QPay",
      //         };
      //         await getwayService.transactionDataSaveInDB(
      //           reqData,
      //           async function (transresult: any) {
      //             let data = {
      //               amount: totalPay,
      //               PUN: transresult?.transactionId,
      //             };
      //             console.log("transresult", data);
      //             await getwayService.redirectQPayPayment(data);
      //           }
      //         );
      //       })
      //       .catch((error) => {
      //         console.error("Error:", error);
      //       });
      //   } else {
      let reqData = {
        totalAmount: totalPay,
        paidAmount: totalPay,
        transactionId: `${rendomTransactionId}`,
        amexorderId: orderId,
        paymentMethod: "Credit Card",
        idForPayment: orderId,
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
      //   }
      // });
    }

    if (paymentMethod === "CBQ" && totalPay > 0 && creditToApply === "") {
      localStorage.setItem("user", "user");
      localStorage.setItem("itemIdd", itemsId);
      localStorage.setItem("invoiceTitle", "INVOICES");
      localStorage?.setItem("dueInvoiceAmount", dueInvoiceAmount);
      localStorage?.setItem("finalAmountToPay", finalAmountToPay);
      localStorage?.setItem("dbInvoiceid", "");
      localStorage.setItem("salesOrder", "");
      localStorage.setItem("paymentToApply", paymentToApply);

      router.push(
        `/checkpayment/cbq/?amount=${totalPay}&refrenceNumber=${orderId}&sageCustomerId=${sageCustomerId}&creditNotesId=${null}&invoiceid=${id}&dbcustomerid=${customerID}&customerIdd=${userUniqueId}`
      );
    } else if (paymentMethod === "CBQ" && totalPay === 0) {
      try {
        const rendomTransactionId = keyGen(5);
        const dataforRemaingAmount: any = {
          customerId: userUniqueId,
          sageCustomerId: parseInt(sageCustomerId),
          invoiceId: id,
          sageinvoiceId: orderId,
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
          amexorderId: orderId,
          paymentMethod: "Case",
          idForPayment: orderId,
          creditNotesId: creditNoteNewId,
        };
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentMethod === "CBQ" && totalPay > 0 && creditToApply !== "") {
      localStorage.setItem("user", "user");
      localStorage.setItem("itemIdd", itemsId);
      localStorage.setItem("invoiceTitle", "INVOICES");
      localStorage?.setItem("dueInvoiceAmount", dueInvoiceAmount);
      localStorage?.setItem("finalAmountToPay", finalAmountToPay);
      localStorage?.setItem("dbInvoiceid", "");
      localStorage.setItem("salesOrder", "");
      localStorage.setItem("paymentToApply", paymentToApply);

      router.push(
        `/checkpayment/cbq/?amount=${totalPay}&refrenceNumber=${orderId}&sageCustomerId=${sageCustomerId}&creditNotesId=${creditNotesId}&invoiceid=${id}&dbcustomerid=${customerID}&creditNoteAmount=${creditToApply}&customerIdd=${userUniqueId}`
      );
      // }
    }
  };

  const transactionSaveInDB = async (data: any) => {
    getwayService.transactionDataSaveInDB(data, async function (result: any) {
      //send email functionality
      data = {
        invoiceTitle: "INVOICES",
        customerId: customerID,
        transactionId:
          result &&
          result.insetTransatction &&
          result.insetTransatction?.insertId,
        activityId: 0,
        itemId: itemsId,
      };
      await commmonfunctions.SendEmailsAfterPayment(data);
      setShowSuccess(true);
      setTimeout(callBack_func, 5000);
      async function callBack_func() {
        setShowSuccess(false);
        if (paymentMethod === "CBQ") {
          // toast.success("Payment Successfully !");
          await getwayService.getARInoviceRecordNumber(
            orderId,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              console.log("data for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {}
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.referenceNumber,
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
        if (paymentMethod === "QPay") {
          // toast.success("Payment Successfully !");
          await getwayService.getARInoviceRecordNumber(
            orderId,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              console.log("data for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {}
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.referenceNumber,
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
        if (paymentMethod === "Amex") {
          // toast.success("Payment Successfully !");
          await getwayService.getARInoviceRecordNumber(
            orderId,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              console.log("data for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {}
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.referenceNumber,
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
      }
    });
  };

  // const transactionSaveInDB = async (data: any) => {
  //   getwayService.transactionDataSaveInDB(data, async function (result: any) {
  //     //send email functionality
  //     data = {
  //       invoiceTitle: "INVOICES",
  //       customerId: customerID,
  //       transactionId: result && result?.insetTransatction?.insertId,
  //       activityId: 0,
  //       itemId: itemsId,
  //     };
  //     const res = await commmonfunctions.SendEmailsAfterPayment(data);
  //     setShowSuccess(true);
  //     setTimeout(callBack_func, 4000);
  //     async function callBack_func() {
  //       setShowSuccess(false);
  //       if (result.amount === 0) {
  //         // toast.success("Payment Successfully !");
  //         await getwayService.getARInoviceRecordNumber(
  //           orderId,
  //           async function (ARRecordNumberResult: any) {
  //             const ARdata = {
  //               customerId: sageCustomerId,
  //               amount: result.amount,
  //               ARpaymentMethod: "Cash",
  //               referenceNumber: result.referenceNumber,
  //               ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
  //             };
  //             console.log("data for apply pay =>", ARdata);
  //             await getwayService.createAndApplyPaymentARInvoice(
  //               ARdata,
  //               async function (result: any) {}
  //             );
  //           }
  //         );
  //       }
  //       // document.location.href = `${process.env.NEXT_PUBLIC_AMEX_INVOICE_USER_REDIRECT_URL}`;
  //     }
  //   });
  // };

  const updateInvoiceAfterPay = async (invoiceId: any) => {
    try {
      let getAmount = totalPay === 0 ? 0 : totalPay;
      let totalBothAmount = parseInt(getAmount + creditToApply);
      let dueAmount = dueInvoiceAmount === 0 ? InvoiceAmount : dueInvoiceAmount;

      console.log(
        "getAmount",
        getAmount,
        "totalPay",
        totalPay,
        "totalBothAmount",
        totalBothAmount,
        "creditToApply",
        creditToApply,
        "dueAmount",
        dueAmount,
        "dueInvoiceAmount",
        dueInvoiceAmount,
        "InvoiceAmount",
        InvoiceAmount,
        "finalAmountToPay",
        finalAmountToPay
      );

      let statuss = "";
      if (dueAmount === totalBothAmount) {
        statuss = "Paid";
      } else {
        statuss = "Partially paid";
      }

      let requestedData = {
        note: note ? note : null,
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
        .then((res) => {
          getUser();
          setNote("");
          AddLogs(
            userUniqueId,
            `Invoice Created id - #${invDetails?.invoiceId}`
          );
          toast.success("Payment Successfully !");
          setTimeout(() => {
            handleCloses();
            router.push("/user/invoices/invoiceslist/ci");
          }, 2000);
        })
        .catch((err) => {});
    } catch (error: any) {
      console.log("error => ", error.message);
    }
  };

  async function getSageCustomerId() {
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${invDetails?.customerId}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Amount Debit by - #CUS-${data?.data?.data[0]?.customerId}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

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
          getSageCustomerId();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getUser = async () => {
    await axios({
      method: "POST",
      url: `${api_url}/getInvoice`,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        setUser(res?.data.data);
        setInvoice(res?.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Credit Request
  const handleReqOpen = () => {
    setCreditReqFormOpen(true);
  };

  const closePoP = (data: any) => {
    setCreditReqFormOpen(false);

    invoiceDataById();
  };

  const reqDet = {
    userId: invDetails && invDetails?.customerId,
    sageinvoiceId:
      (invDetails && invDetails?.tuition_invoice_id) || invDetails?.invoiceId,
    invoiceId: invDetails && invDetails?.id,
    status: 0,
    amount: invDetails && invDetails?.amount,
    createdBy: userUniqueId,
  };

  // handle Receive Payment Modal
  const handleReceivePaymentAccordingToUs = (e: any, identifier: any) => {
    const transactionAmount =
      recievedPay?.amount_due === null || recievedPay?.amount_due === 0
        ? recievedPay.amount
        : recievedPay.amount_due;
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

  console.log("invoiceinvoice", invoice);
  console.log("invDetinvDet", invDet[0]);
  return (
    <>
      <Script
        src="https://amexmena.gateway.mastercard.com/static/checkout/checkout.min.js"
        data-error="errorCallback"
        data-cancel="cancelCallback"
        strategy="beforeInteractive"
      ></Script>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="guardianBar">
            {/*bread cump */}
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
                      href="/admin/dashboard"
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
                      Invoices View
                    </Link>
                  </Breadcrumbs>
                </Stack>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: "bold", color: "#333333" }}
                >
                  INVOICE VIEW
                </Typography>
              </Stack>
              <Stack>
                <div className="cinvoice">
                  <div
                    className="buycss"
                    style={{ textAlign: "end", marginRight: "10px" }}
                  >
                    <Link
                      href="/user/invoices/invoiceslist/ci"
                      style={{ color: "#1A70C5", textDecoration: "none" }}
                    >
                      <Button variant="contained" startIcon={<ArrowBackIcon />}>
                        {" "}
                        <b>Back To List</b>
                      </Button>
                    </Link>
                  </div>
                  <div>
                    {invDetails && invDetails?.amount !== 0 ? (
                      <div>
                        {invDetails.isRequested === 1 ? (
                          <Button
                            size="small"
                            variant="contained"
                            style={{
                              backgroundColor: "#D1D2D2",
                              color: "whitesmoke",
                            }}
                            disabled
                            sx={{ width: 135 }}
                          >
                            <b>Requested</b>
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleReqOpen()}
                          >
                            <b>Credit Request</b>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button disabled size="small" variant="contained">
                        <b>Credit Request</b>
                      </Button>
                    )}
                  </div>
                </div>
              </Stack>
            </Stack>
            {/*bread cump */}
            <div className="midBar">
              <div className="guardianList" style={{ padding: "20px" }}>
                <Stack
                  style={{ marginBottom: "10px" }}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Tabs
                      value={tab}
                      onChange={handleChanges}
                      aria-label="basic tabs example"
                    >
                      <Tab
                        className="filter-list"
                        label={`Invoice Detail`}
                        {...a11yProps(0)}
                      />
                      <Tab
                        label={`Invoice txn's (${invoice && invoice.length})`}
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                </Stack>
                <TabPanel value={tab} index={0}>
                  <div className="aititle" style={{ padding: "0px 50px" }}>
                    <div className="iatitle flex">
                      <div className="invoive-img">
                        {" "}
                        <Image
                          className="iaimg"
                          src="/favicon.ico"
                          alt="Picture of the author"
                          width={65}
                          height={62}
                        />
                      </div>
                      <div className="invoice-name-detail">
                        <span className="iahead">
                          Qatar International School
                        </span>
                        <span className="line">
                          Qatar international school W.L.L
                        </span>
                        <span className="line">
                          United Nations St, West Bay, P.O. Box: 5697
                        </span>
                        <span className="line">Doha, Qatar</span>
                      </div>
                    </div>
                    <div className="itele">
                      <span className="Tline">Telephone: 443434343</span>
                      <span className="Tline">Website: www.qis.org</span>
                      <span className="Tline">Email: qisfinance@qis.org</span>
                    </div>
                  </div>

                  {myload ? (
                    <Loader />
                  ) : (
                    <>
                      <div className="icenter" style={{ padding: "0px 50px" }}>
                        <div className="invoice">
                          {/*bread cump */}
                          <Stack
                            direction="row"
                            alignItems="left"
                            justifyContent="space-between"
                            style={{ padding: "8px", marginBottom: "15px" }}
                          >
                            <Stack
                              style={{
                                paddingLeft: "0px",
                                paddingRight: "0px",
                              }}
                            >
                              <Stack spacing={3}>
                                <Typography
                                  gutterBottom
                                  style={{
                                    fontWeight: "bold",
                                    color: "#5A6873",
                                    textAlign: "left",
                                    marginBottom: "0",
                                  }}
                                >
                                  Bill To :
                                </Typography>
                              </Stack>
                              <Typography
                                gutterBottom
                                style={{
                                  fontWeight: "normal",
                                  color: "#5A6873",
                                  textAlign: "left",
                                }}
                              >
                                {invDet[0]?.name}
                              </Typography>
                            </Stack>

                            <Stack>
                              <Stack spacing={3} style={{ textAlign: "right" }}>
                                <Typography
                                  gutterBottom
                                  style={{
                                    fontWeight: "bold",
                                    color: "#5A6873",
                                    marginBottom: "0",
                                  }}
                                >
                                  Date To :
                                </Typography>
                              </Stack>
                              <Typography
                                gutterBottom
                                style={{
                                  fontWeight: "normal",
                                  color: "#5A6873",
                                }}
                              >
                                {moment(
                                  invDet[0]?.invoiceDate,
                                  "DD/MM/YYYY"
                                ).format("MMM DD, YYYY")}
                              </Typography>
                            </Stack>
                          </Stack>
                          <br />
                          <Stack
                            direction="row"
                            alignItems="left"
                            justifyContent="space-between"
                            style={{ padding: "8px", marginBottom: "10px" }}
                          >
                            <Stack
                              style={{
                                paddingLeft: "0px",
                                paddingRight: "0px",
                              }}
                            >
                              <Stack spacing={3}>
                                <div style={{ display: "flex" }}>
                                  <Typography
                                    gutterBottom
                                    style={{
                                      fontWeight: "bold",
                                      color: "#5A6873",
                                      textAlign: "left",
                                      marginBottom: "0",
                                    }}
                                  >
                                    Invoice No.:
                                  </Typography>
                                  <Typography
                                    gutterBottom
                                    style={{
                                      fontWeight: "normal",
                                      color: "#5A6873",
                                      textAlign: "left",
                                    }}
                                  >
                                    &nbsp;
                                    {invDet[0]?.invoiceId ||
                                      invoice[0]?.tuition_invoice_id}
                                  </Typography>
                                  {invDet[0]?.paymentMethod === null ? (
                                    ""
                                  ) : (
                                    <>
                                      <Typography
                                        gutterBottom
                                        style={{
                                          fontWeight: "bold",
                                          color: "#5A6873",
                                          textAlign: "left",
                                          marginBottom: "0",
                                          marginLeft: "25px",
                                        }}
                                      >
                                        Paid By.:
                                      </Typography>
                                      <Typography
                                        gutterBottom
                                        style={{
                                          fontWeight: "normal",
                                          color: "#5A6873",
                                          textAlign: "left",
                                        }}
                                      >
                                        &nbsp;{invDet[0]?.paymentMethod}
                                      </Typography>
                                    </>
                                  )}

                                  {invDet[0]?.paymentMethod === null ? (
                                    ""
                                  ) : (
                                    <>
                                      <Typography
                                        gutterBottom
                                        style={{
                                          fontWeight: "bold",
                                          color: "#5A6873",
                                          textAlign: "left",
                                          marginBottom: "0",
                                          marginLeft: "25px",
                                        }}
                                      >
                                        Check/Receipt No.:
                                      </Typography>
                                      <Typography
                                        gutterBottom
                                        style={{
                                          fontWeight: "normal",
                                          color: "#5A6873",
                                          textAlign: "left",
                                        }}
                                      >
                                        &nbsp;{invDet[0]?.refrenceId}
                                      </Typography>
                                    </>
                                  )}
                                </div>
                              </Stack>
                            </Stack>
                          </Stack>
                        </div>
                      </div>
                      <div
                        className="ickks"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          background: "#F4F4F4",
                          padding: "25px 0",
                        }}
                      >
                        <div className="ickk">
                          <div className="cinvoice">
                            <div>
                              {invDet && invDet[0]?.status === "Paid" ? (
                                <Typography
                                  style={{
                                    textAlign: "center",
                                    color: "#5A6873",
                                    fontSize: "20px",
                                  }}
                                >
                                  <b>
                                    {invDet[0]?.amount}{" "}
                                    {" (" + qatar_currency + ")"} Paid
                                  </b>
                                </Typography>
                              ) : (
                                <Typography
                                  style={{
                                    textAlign: "center",
                                    color: "#5A6873",
                                    fontSize: "20px",
                                  }}
                                >
                                  <b>
                                    {commmonfunctions.formatePrice(
                                      invDet[0]?.amount_due
                                    )}{" "}
                                    {" (" + qatar_currency + ")"} DUE
                                  </b>
                                </Typography>
                              )}

                              {/* {invDetails.isRequested === 1 ? (
                              <BootstrapButton
                                type="button"
                                style={{
                                  backgroundColor: "#42D5CD",
                                  color: "#fff",
                                }}
                                sx={{ width: 250, padding: 1, margin: 2 }}
                                onClick={() =>
                                  handleClickOpen(invDet && invDet[0])
                                }
                                disabled={
                                  (invDet &&
                                    invDet[0]?.status === "Paid" &&
                                    invDet) ||
                                  invDet[0]?.status === "Draft" ||
                                  invDetails.isRequested === 1
                                    ? true
                                    : false
                                }
                              >
                                Pay Now !
                              </BootstrapButton>
                            ) : (
                              <BootstrapButton
                                type="button"
                                style={{
                                  backgroundColor: "#42D5CD",
                                  color: "#fff",
                                }}
                                sx={{ width: 250, padding: 1, margin: 2 }}
                                onClick={() =>
                                  handleClickOpen(invDet && invDet[0])
                                }
                                disabled={
                                  (invDet &&
                                    invDet[0]?.status === "Paid" &&
                                    invDet) ||
                                  invDet[0]?.status === "Draft"
                                    ? true
                                    : false
                                }
                              >
                                Pay Now !
                              </BootstrapButton>)} */}

                              {invDet && invDet[0]?.status === "Paid" ? (
                                <BootstrapButton
                                  type="button"
                                  style={{ backgroundColor: "#42D5CD" }}
                                  sx={{ width: 250, padding: 1, margin: 2 }}
                                  onClick={() =>
                                    DownloadReceipt(
                                      invDet[0],
                                      " ",
                                      "customer-side"
                                    )
                                  }
                                >
                                  Download Receipt{" "}
                                  {Receptspinner === true ? (
                                    <CircularProgress color="inherit" />
                                  ) : (
                                    ""
                                  )}
                                </BootstrapButton>
                              ) : (
                                <BootstrapButton
                                  type="button"
                                  style={{ backgroundColor: "#42D5CD" }}
                                  sx={{ width: 250, padding: 1, margin: 2 }}
                                  onClick={() =>
                                    handleClickOpen(invDet && invDet[0])
                                  }
                                  disabled={
                                    (invDet &&
                                      invDet[0]?.status === "Paid" &&
                                      invDet) ||
                                    invDet[0]?.status === "Draft"
                                      ? true
                                      : false
                                  }
                                >
                                  Pay Now !
                                </BootstrapButton>
                              )}

                              <BootstrapButton
                                sx={{ width: 250, padding: 1, margin: 2 }}
                                onClick={() =>
                                  DownloadInvoice(
                                    invDet && invDet[0],
                                    "",
                                    "customer-side"
                                  )
                                }
                              >
                                Download Invoice{" "}
                                {spinner === true ? (
                                  <CircularProgress color="inherit" />
                                ) : (
                                  ""
                                )}
                              </BootstrapButton>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Card
                        sx={{ minWidth: 275 }}
                        style={{ padding: "0 50px" }}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            style={{ padding: "8px" }}
                          ></Stack>
                          <Table
                            className="invoice-table"
                            style={{ marginTop: "20px" }}
                          >
                            <TableHead>
                              <TableRow>
                                {/* <TableCell>
                                <Typography>INVOICE ID</Typography>
                              </TableCell> */}
                                <TableCell>
                                  <Typography>Item Name</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Description</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Item Unit</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Quantity</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Rate</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Amount</Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {product.map((row: any) => (
                                <TableRow key={row.name}>
                                  {/* <TableCell>{invDetails?.invoiceId || invDetails?.tuition_invoice_id}</TableCell> */}
                                  <TableCell>{row.item_name}</TableCell>
                                  <TableCell>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: row.item_description,
                                      }}
                                    ></div>
                                  </TableCell>
                                  <TableCell>{row.item_unit}</TableCell>
                                  <TableCell>{row.quantity}</TableCell>
                                  <TableCell>
                                    {commmonfunctions.formatePrice(
                                      row.item_price
                                    )}
                                    {" (" + qatar_currency + ")"}
                                  </TableCell>
                                  <TableCell>
                                    {commmonfunctions.formatePrice(
                                      row.item_total_price
                                    )}
                                    {" (" + qatar_currency + ")"}
                                  </TableCell>
                                </TableRow>
                              ))}

                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="blank-td"
                                ></TableCell>
                                <TableCell>
                                  <div
                                    className=""
                                    style={{
                                      textAlign: "left",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Subtotal
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    {commmonfunctions.formatePrice(price)}
                                    {" (" + qatar_currency + ")"}
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="blank-td"
                                ></TableCell>
                                <TableCell>
                                  <div
                                    className=""
                                    style={{
                                      textAlign: "left",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Credit Applied
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    {commmonfunctions.formatePrice(
                                      creditApplied
                                    )}
                                    {" (" + qatar_currency + ")"}
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="blank-td"
                                ></TableCell>
                                <TableCell>
                                  <div
                                    className=""
                                    style={{
                                      textAlign: "left",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Amount Paid
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    {commmonfunctions.formatePrice(
                                      paymentAmount
                                    )}
                                    {" (" + qatar_currency + ")"}
                                  </div>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="blank-td"
                                ></TableCell>
                                <TableCell>
                                  <div
                                    className=""
                                    style={{
                                      textAlign: "left",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {" "}
                                    Outstanding{" "}
                                    {invDet && invDet[0]?.status === "Paid"
                                      ? "Paid"
                                      : "Due"}{" "}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    {commmonfunctions.formatePrice(
                                      invDet && invDet[0]?.amount_due
                                    )}
                                    {" (" + qatar_currency + ")"}
                                  </div>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <TableContainer>
                    <div style={{ width: "100%", overflow: "auto" }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="left">Transaction Id</TableCell>
                            <TableCell align="left">Receipt Number</TableCell>
                            <TableCell align="left">TXN Amount</TableCell>
                            <TableCell align="left">Credit Applied</TableCell>
                            <TableCell align="left">Amount Paid</TableCell>
                            <TableCell align="left">Payment Method</TableCell>
                            <TableCell align="left">Payment date</TableCell>
                            <TableCell align="left">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {invoice &&
                            invoice.map((invDetail: any, key: any) => {
                              return (
                                <>
                                  <TableRow
                                    hover
                                    key={key}
                                    className="boder-bottom"
                                  >
                                    <TableCell scope="row">
                                      {invDetail?.transactionNumber}
                                    </TableCell>
                                    <TableCell>
                                      {invDetail?.refrenceId}
                                    </TableCell>
                                    <TableCell> {invDetail?.amount}</TableCell>
                                    <TableCell>
                                      {invDetail?.creditAmountMode === 0
                                        ? invDetail?.creditAmount
                                        : 0}
                                    </TableCell>
                                    <TableCell>
                                      {invDetail?.transactionAmount}
                                    </TableCell>
                                    <TableCell>
                                      {invDetail.paymentMethod}
                                    </TableCell>
                                    <TableCell>
                                      {moment(invDetail.transactionDate).format(
                                        "DD-MMM-YYYY"
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {" "}
                                      <div className="btn">
                                        {invDetail?.status === "Paid" || invDetail?.status === "Partially paid" ? (
                                          <Button className="idiv">
                                            <Image
                                              onClick={() =>
                                                DownloadReceipt(
                                                  invDetail,
                                                  "",
                                                  "admin_side"
                                                )
                                              }
                                              src="/file-text.png"
                                              alt="Receipt Invoice"
                                              title="Receipt Invoice"
                                              width={35}
                                              height={35}
                                            />
                                          </Button>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                </>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </TableContainer>
                </TabPanel>
              </div>
            </div>
          </div>
        </Box>
      </Box>
      <div>
        <BootstrapDialog
          onClose={handleCloses}
          aria-labelledby="customized-dialog-title"
          open={dollerOpen}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleCloses}
          >
            Pay Payment
          </BootstrapDialogTitle>
          <DialogContent dividers className="popup">
            <Grid>
              <Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">Customer</InputLabel>
                      <OutlinedInput
                        defaultValue={recievedPay.name}
                        type="text"
                        id="name"
                        disabled
                        placeholder="Customer Name..."
                        fullWidth
                        size="small"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">Received On</InputLabel>
                      <OutlinedInput
                        disabled
                        defaultValue={moment(
                          recievedPay.invoiceDate,
                          "DD/MM/YYYY"
                        ).format("ll")}
                        type="text"
                        id="name"
                        placeholder="Phone..."
                        fullWidth
                        size="small"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">
                        Payment Method <span className="err_str">*</span>
                      </InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        defaultValue="Cash"
                        size="small"
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                        }}
                      >
                        <MenuItem value="All"></MenuItem>
                        <MenuItem value="CBQ">Credit Card</MenuItem>
                        <MenuItem value="QPay">Debit Card</MenuItem>
                        <MenuItem value="Amex">Amex</MenuItem>
                        {/* <MenuItem value="Cash">Cash</MenuItem> */}
                        {/* <MenuItem value="Cashd">
                                Cash on Delivery
                              </MenuItem> */}
                      </Select>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>

              <Stack style={{ marginTop: "15px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2.4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">Txn amount</InputLabel>
                      <OutlinedInput
                        disabled
                        defaultValue={commmonfunctions.formatePrice(
                          recievedPay.amount
                        )}
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
                      <InputLabel htmlFor="name">Credits available</InputLabel>
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
                      <InputLabel htmlFor="name">Credits to apply</InputLabel>
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
                          customerTotalCreditNoteBalance !== 0 ? false : true
                        }
                        name="Credit to apply"
                        size="small"
                        value={creditToApply}
                        onChange={(e) =>
                          handleReceivePaymentAccordingToUs(e, "creditNotes")
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
                      <InputLabel htmlFor="name">Payment amount</InputLabel>
                      <OutlinedInput
                        onChange={(e) =>
                          handleReceivePaymentAccordingToUs(e, "payment")
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
                      <InputLabel htmlFor="name">Outstanding amount</InputLabel>
                      <OutlinedInput
                        disabled
                        value={
                          commmonfunctions.formatePrice(finalAmountToPay) +
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
                    {/* {customerTotalCreditNoteBalance != 0 && (
                      <>
                        <Checkbox
                          onChange={(e) => {
                            handleCheckBoxClick(e);
                          }}
                          className="checkbox132"
                        />
                        Want to use credit balance :$
                        {customerTotalCreditNoteBalance}.00
                      </>
                    )} */}

                    <div>
                      <h5 className="apply">Apply Payment</h5>
                    </div>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name"></InputLabel>
                      <p>
                        Total txn amount :{" "}
                        {commmonfunctions.formatePrice(InvoiceAmount) +
                          " (" +
                          qatar_currency +
                          ")"}{" "}
                      </p>
                    </Stack>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name"></InputLabel>
                      <p>
                        Total outstanding amount :{" "}
                        {commmonfunctions.formatePrice(
                          dueInvoiceAmount === null
                            ? InvoiceAmount
                            : dueInvoiceAmount
                        ) +
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
                        Total pay :{" "}
                        {commmonfunctions.formatePrice(
                          totalPay && totalPay
                        )}{" "}
                        {" (" + qatar_currency + ")"}
                      </p>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              autoFocus
              onClick={() => handleCreate(recievedPay.id)}
              disabled={creditPopupError || applyPaymentPopupError}
            >
              Pay
            </Button>
          </DialogActions>
        </BootstrapDialog>
        <ToastContainer />
      </div>
      {CreditReqFormOpen ? (
        <RequestFormCmp
          open={RequestFormCmp}
          reqDet={reqDet}
          closeDialog={closePoP}
        />
      ) : (
        ""
      )}
    </>
  );
}
