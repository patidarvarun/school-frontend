import {
  Breadcrumbs,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
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
import MiniDrawer from "../../sidebar";
import axios from "axios";
import { api_url, auth_token, qatar_currency } from "../../../helper/config";
import Image from "next/image";
import Box from "@mui/material/Box";
import Script from "next/script";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import getwayService from "../../../services/gatewayService";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../helper/activityLogs";
import UserService from "../../../commonFunctions/servives";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "rgb(26, 112, 197)",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgb(26, 112, 197)",
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
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

const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

const BootstrapButton = styled(Button)({
  backgroundColor: "#1A70C5",
  color: "#FFFFFF",
  margin: "7px",
  "&:hover": {
    backgroundColor: "#1A70C5",
  },
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const style1 = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 331,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle {...other} sx={{ m: 0, p: 2 }}>
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
  const { invoiceId } = router.query;
  const [value, setValue] = useState<any>({ id: null, title: null });
  const [tab, setTab] = useState(0);
  const [invoiceno, setInvoiceNo] = useState();
  const [invoice, setInvoice] = useState<any>([]);
  const [item, setItem] = useState<any>([]);
  const [invDet, setinvDet] = useState<any>([]);
  const [product, setProduct] = useState<any>([]);
  const [dollerOpen, setDollerOpen] = useState(false);
  const [recievedPay, setRecieved] = useState<any>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [note, setNote] = useState<any>([]);
  const [customerTotalCreditNoteBalance, setCustomerTotalCreditNoteBalance] =
    useState(0);
  const [customerCreditNoteRequestId, setCustomerCreditNoteRequestId] =
    useState<any>(null);
  const [applyCreditNoteAmount, setApplyCreditNoteAmount] = useState<any>(0);
  const [finalAmountToPay, setFinalAmountToPay] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [InvoiceAmount, setInvoiceAmount] = useState(0);
  const [customerCreditNoteRemaingAmount, setCustomerCreditNoteRemaingAmount] =
    useState(0);
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [customerID, setCustomerId] = useState<any>("");
  const [orderId, setorderId] = useState("");
  const [userUniqueId, setUserUniqId] = useState<any>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState<any>([]);
  const [itemsId, setritemsId] = useState<any>("");
  const [spinner, setShowspinner] = useState(false);
  const [Receptspinner, setShowsReceiptpinner] = useState(false);
  const [sageCustomerId, setsageCustomerId] = useState("");
  const [customerParentIdd, setCustomerParentIdd] = useState<any>("");
  const [partialAmount, setPartialAmount] = useState<any>(0);
  const [handlePaymentValue, setHandlePaymentValue] = useState<any>("");
  const [openThank, setOpenThank] = useState(false);
  const handleThanksOpen = () => setOpenThank(true);
  const handleThanksClose = () => setOpenThank(false);
  const [receiveDate, setReceiveDate] = useState<any>(new Date());
  const [creditToApply, setCreditToApply] = useState<any>("");
  const [creditPopupError, setCreditPopupError] = useState<any>("");
  const [paymentToApply, setPaymentToApply] = useState<any>("");
  const [applyPaymentPopupError, setApplyPaymentPopupError] = useState<any>("");
  const [dueInvoiceAmount, setDueInvoiceAmount] = useState(0);
  const [creditApplied, setCreditApplied] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  var creditNoteNewId: any;

  //verify token 
  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });
    commmonfunctions.VerifyLoginUser().then((res) => {
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
        router.push("/");
      }
    });
    const logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    getItem();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      invoiceDataById();
      router.push(`/admin/viewInvoice/${invoiceId}`);
    }
  }, [router.isReady]);

  // get items
  const getItem = async () => {
    await axios({
      method: "GET",
      url: `${api_url}/getItems`,

      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        setItem(res?.data.data);
      })
      .catch((err) => { });
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
      .catch((err) => { });
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
      .catch((err) => { });
  };

  // get invoice det
  const invoiceDataById = async () => {
    await axios({
      method: "POST",
      url: `${api_url}/getInvoice/${invoiceId}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        const lastArrayOfObject = res.data.data[res.data.data.length - 1];
        const results = res?.data.data;
        setInvoice([...results].reverse());
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
            .catch((err) => { });
        }
        setinvDet(res?.data.data);
        setInvoiceNo(res?.data?.invoiceNo);
      })
      .catch((err) => { });
  };

  //get invoices
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
      .catch((err) => { });
  };

  // price calculation
  var price = 0;
  for (let d of product) {
    price = price + d.item_total_price;
  }

  // payment functionality
  const handleClickOpen = async (item: any) => {
    setCreditToApply("");
    setFinalAmountToPay(0);
    setPaymentToApply("");
    setRecieved(item);
    setDollerOpen(true);
    setorderId(item?.tuition_invoice_id || item?.invoiceId);
    setInvoiceAmount(item.amount);
    setInvoiceStatus(item.status);
    setFinalAmountToPay(
      item.amount_due === null || item.amount_due === 0
        ? item.amount
        : item.amount_due
    );
    setDueInvoiceAmount(item.amount_due);
    setCustomerId(item.customerId);
    setritemsId(item.itemId);
    let response = await axios.get(
      `${api_url}/getuserdetails/${item.customerId}`,
      {
        headers: {
          Authorization: auth_token,
        },
      }
    );
    let getCusId =
      response?.data?.data[0]?.parentId === 0
        ? response?.data?.data[0]?.id
        : response?.data?.data[0]?.parentId;

    getCustomerNotes(getCusId);
    setCustomerParentIdd(getCusId);
    setsageCustomerId(
      response.data.data[0].sageParentId || response.data.data[0].sageCustomerId
    );
  };

  //get credit ballance
  const getCustomerNotes = async (id: any) => {
    try {
      const response = await fetch(`${api_url}/creditballance/${id}`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      console.log(res, "res---<");
      setCustomerCreditNoteRequestId(res?.CreditRequestId_FromSageCreditNotes);
      setCustomerTotalCreditNoteBalance(res?.creditBal_FromSageCreditNotes);
      setApplyCreditNoteAmount(res?.creditBal_FromSageCreditNotes);
    } catch (error: any) {
      console.log("error", error.message);
    }
  };

  //unique key generate
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

  //wallet checked functionality
  const handleCheckBoxClick = async (e: any) => {
    console.log("event =>", e.target.checked);
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

      console.log("creditNoteRemaingAmount =>", creditNoteRemaingAmount);
      setCustomerCreditNoteRemaingAmount(creditNoteRemaingAmount);
    } else {
      setApplyCreditNoteAmount(0);
      setFinalAmountToPay(InvoiceAmount);
      setCustomerCreditNoteRequestId(null);
    }
  };
  const handleReceiveDate = (date: any) => {
    setReceiveDate(date);
  };
  //handle payment functionality
  let receiveDateNew = moment(receiveDate).format("MM/DD/YYYY");
  const handleCreate = async (id: any) => {
    const Checkout: any = (window as any).Checkout;
    const creditNotesId = customerCreditNoteRequestId;
    if (partialAmount > recievedPay.amount) {
      toast.warn("You can not enter more than amount of invoice amount.");
    }
    if (
      paymentMethod === "Amex" &&
      isChecked === true &&
      finalAmountToPay > 0
    ) {
      var requestData = {
        apiOperation: "CREATE_CHECKOUT_SESSION",
        order: {
          id: orderId,
          amount: finalAmountToPay,
          currency: "QAR",
          description: "Orderd",
        },
        interaction: {
          returnUrl: `${process.env.NEXT_PUBLIC_AMEX_SUCCESS_RETURN_URL
            }?orderid=${orderId}&paymentMethod=${paymentMethod}&creditNoteId=${creditNotesId}&remaingAmount=${applyCreditNoteAmount}&customerID=${customerID}&DBInvoiceid=${id}&itemIdd=${itemsId}&invoiceTitle=${"INVOICES"}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_AMEX_INVOICE_USER_REDIRECT_URL}`,
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
      await getwayService.getSession(requestData, async function (result: any) {
        if (result?.data?.result === "SUCCESS") {
          await Checkout.configure({
            session: {
              id: result?.data.session.id,
            },
          });
          await Checkout.showPaymentPage();
        }
      });
    }
    if (
      paymentMethod === "Amex" &&
      isChecked === false &&
      finalAmountToPay > 0
    ) {
      var requestData = {
        apiOperation: "CREATE_CHECKOUT_SESSION",
        order: {
          id: orderId,
          amount: finalAmountToPay,
          currency: "QAR",
          description: "Orderd",
        },
        interaction: {
          returnUrl: `${process.env.NEXT_PUBLIC_AMEX_SUCCESS_RETURN_URL
            }?orderid=${orderId}&paymentMethod=${paymentMethod}&creditNoteId=${null}&remaingAmount=${applyCreditNoteAmount}&customerID=${customerID}&DBInvoiceid=${id}&itemIdd=${itemsId}&invoiceTitle=${"INVOICES"}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_AMEX_INVOICE_USER_REDIRECT_URL}`,
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
      await getwayService.getSession(requestData, async function (result: any) {
        if (result?.data?.result === "SUCCESS") {
          await Checkout.configure({
            session: {
              id: result?.data.session.id,
            },
          });
          await Checkout.showPaymentPage();
        }
      });
    }
    // only cash payment
    if (paymentMethod === "Cash") {
      try {
        const rendomTransactionId = keyGen(5);
        let amount = finalAmountToPay > 0 ? finalAmountToPay : InvoiceAmount;

        const dataforRemaingAmount: any = {
          customerId: customerParentIdd,
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
          creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
        };
        console.log("@@@@@@@@@@@@@", reqData);
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    } else if (paymentMethod === "Cash" && isChecked === true) {
      try {
        const dataforRemaingAmount: any = {
          customerId: customerParentIdd,
          Amount: applyCreditNoteAmount,
          amountMode: 0,
        };

        const rendomTransactionId = keyGen(5);
        let price =
          customerTotalCreditNoteBalance > InvoiceAmount ? 0 : finalAmountToPay;

        if (applyCreditNoteAmount !== 0) {
          await insertRemainingNotesAmount(dataforRemaingAmount);
        }
        let reqData = {
          totalAmount: price,
          paidAmount: price,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNotesId,
        };
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }
    if (paymentMethod === "Check") {
      if (handlePaymentValue === "") {
        toast.error("Check number code is required !");
      } else if (totalPay === 0) {
        toast.warn("Please select Cash method !");
      } else {
        try {
          const rendomTransactionId = keyGen(5);
          let amount = finalAmountToPay > 0 ? finalAmountToPay : InvoiceAmount;

          const dataforRemaingAmount: any = {
            customerId: customerParentIdd,
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
            transactionId: `check-${rendomTransactionId} `,
            amexorderId: orderId,
            paymentMethod: "Printed Check",
            idForPayment: orderId,
            check_no: handlePaymentValue,
            creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
          };

          await transactionSaveInDB(reqData);
          await updateInvoiceAfterPay(id);

          handleCloses();
        } catch (error: any) {
          console.log("Error ", error.message);
        }
      }
    }
    if (paymentMethod === "Credit Card") {
      if (handlePaymentValue === "") {
        toast.error("Authorization code is required !");
      } else if (totalPay === 0) {
        toast.warn("Please select Cash method !");
      } else {
        try {
          const rendomTransactionId = keyGen(5);
          let amount = finalAmountToPay > 0 ? finalAmountToPay : InvoiceAmount;

          const dataforRemaingAmount: any = {
            customerId: customerParentIdd,
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
            transactionId: `creditcard-${rendomTransactionId} `,
            amexorderId: orderId,
            paymentMethod: paymentMethod,
            idForPayment: orderId,
            authorization_code: handlePaymentValue,
            creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
          };
          await transactionSaveInDB(reqData);
          await updateInvoiceAfterPay(id);

          handleCloses();
        } catch (error: any) {
          console.log("Error ", error.message);
        }
      }
    }
    if (paymentMethod === "Record transfer" && isChecked === false) {
      try {
        const rendomTransactionId = keyGen(5);
        let amount = finalAmountToPay > 0 ? finalAmountToPay : InvoiceAmount;
        let reqData = {
          totalAmount: amount,
          paidAmount: amount,
          transactionId: `record-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: paymentMethod,
          idForPayment: orderId,
          reference_no: handlePaymentValue,
          creditNotesId: creditNotesId,
        };

        console.log("%$$$$$$$$$$$%%@@@@@@@", reqData);

        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);

        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentMethod === "Amex" && finalAmountToPay === 0) {
      try {
        const dataforRemaingAmount: any = {
          customerId: customerParentIdd,
          Amount: applyCreditNoteAmount,
          amountMode: 0,
        };

        const rendomTransactionId = keyGen(5);
        let reqData = {
          totalAmount: finalAmountToPay,
          paidAmount: finalAmountToPay,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNotesId,
        };
        await transactionSaveInDB(reqData);
        if (applyCreditNoteAmount !== 0) {
          await insertRemainingNotesAmount(dataforRemaingAmount);
        }
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (
      paymentMethod === "QPay" &&
      isChecked === false &&
      InvoiceAmount !== 0
    ) {
      localStorage.setItem("invoiceId", id);
      localStorage.setItem("user", "admin");
      localStorage.setItem("note", note);
      localStorage.setItem("sagecustomerid", sageCustomerId);
      localStorage.setItem("dbcustomerid", customerID);
      localStorage.setItem("itemIdd", itemsId);
      localStorage.setItem("invoiceTitle", "INVOICES");
      localStorage.setItem("creditNoteId", customerCreditNoteRequestId);

      const rendomTransactionId = keyGen(5);

      await getwayService.getTransactionData(id, async function (result: any) {
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
                totalAmount: InvoiceAmount,
                paidAmount: InvoiceAmount,
                transactionId: `qpay-${rendomTransactionId}`,
                amexorderId: orderId,
                paymentMethod: "QPay",
                idForPayment: orderId,
                creditNotesId: null,
              };
              await getwayService.transactionDataSaveInDB(
                reqData,
                async function (transresult: any) {
                  console.log("@@@@@@@@@@@@#result", transresult);
                  let data = {
                    amount: InvoiceAmount,
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
            totalAmount: InvoiceAmount,
            paidAmount: InvoiceAmount,
            transactionId: `qpay-${rendomTransactionId}`,
            amexorderId: orderId,
            paymentMethod: "QPay",
            idForPayment: orderId,
            creditNotesId: null,
          };
          await getwayService.transactionDataSaveInDB(
            reqData,
            async function (transresult: any) {
              console.log("@@@@@@@@@@@@#result", transresult);
              let data = {
                amount: InvoiceAmount,
                PUN: transresult?.transactionId,
              };
              getwayService.redirectQPayPayment(data);
            }
          );
        }
      });
    } else if (
      paymentMethod === "QPay" &&
      isChecked === false &&
      InvoiceAmount === 0
    ) {
      try {
        const rendomTransactionId = keyGen(5);
        let reqData = {
          totalAmount: InvoiceAmount,
          paidAmount: InvoiceAmount,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNotesId,
        };
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentMethod === "QPay" && isChecked === true) {
      localStorage.setItem("invoiceId", id);
      localStorage.setItem("user", "admin");
      localStorage.setItem("note", note);
      localStorage.setItem("sagecustomerid", sageCustomerId);
      localStorage.setItem("dbcustomerid", customerID);
      localStorage.setItem("itemIdd", itemsId);
      localStorage.setItem("invoiceTitle", "INVOICES");
      localStorage.setItem("creditNoteId", creditNotesId);
      localStorage.setItem("creditNoteAmount", applyCreditNoteAmount);

      const rendomTransactionId = keyGen(5);
      let amount = isChecked
        ? Math?.abs(InvoiceAmount - applyCreditNoteAmount)
        : InvoiceAmount;
      const dataforRemaingAmount: any = {
        customerId: customerParentIdd,
        Amount: applyCreditNoteAmount,
        amountMode: 0,
      };

      if (amount === 0) {
        try {
          const rendomTransactionId = keyGen(5);
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
          if (applyCreditNoteAmount !== 0) {
            await insertRemainingNotesAmount(dataforRemaingAmount);
          }
          await updateInvoiceAfterPay(id);
          handleCloses();
        } catch (error: any) {
          console.log("Error ", error.message);
        }
      } else {
        await getwayService.getTransactionData(
          id,
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
                  let reqData = {
                    totalAmount: amount,
                    paidAmount: amount,
                    transactionId: `qpay-${rendomTransactionId}`,
                    amexorderId: orderId,
                    paymentMethod: "QPay",
                    idForPayment: orderId,
                    creditNotesId: creditNotesId,
                  };
                  await getwayService.transactionDataSaveInDB(
                    reqData,
                    async function (transresult: any) {
                      let data = {
                        amount: amount,
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
                totalAmount: amount,
                paidAmount: amount,
                transactionId: `qpay-${rendomTransactionId}`,
                amexorderId: orderId,
                paymentMethod: "QPay",
                idForPayment: orderId,
                creditNotesId: creditNotesId,
              };
              await getwayService.transactionDataSaveInDB(
                reqData,
                async function (transresult: any) {
                  let data = {
                    amount: amount,
                    PUN: transresult?.transactionId,
                  };
                  await getwayService.redirectQPayPayment(data);
                }
              );
            }
          }
        );
      }
    }
    if (
      paymentMethod === "CBQ" &&
      isChecked === false &&
      finalAmountToPay !== 0
    ) {
      localStorage.setItem("user", "admin");
      localStorage.setItem("itemIdd", itemsId);
      localStorage.setItem("invoiceTitle", "INVOICES");

      router.push(
        `/checkpayment/cbq/?amount=${finalAmountToPay}&refrenceNumber=${orderId}&sageCustomerId=${sageCustomerId}&creditNotesId=${creditNotesId}&invoiceid=${id}&dbcustomerid=${customerID}`
      );
    } else if (
      paymentMethod === "CBQ" &&
      isChecked === false &&
      finalAmountToPay === 0
    ) {
      try {
        const rendomTransactionId = keyGen(5);
        let reqData = {
          totalAmount: finalAmountToPay,
          paidAmount: finalAmountToPay,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNotesId,
        };
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentMethod === "CBQ" && isChecked === true) {
      localStorage.setItem("user", "admin");
      localStorage.setItem("itemIdd", itemsId);
      localStorage.setItem("invoiceTitle", "INVOICES");
      let amount = isChecked
        ? Math?.abs(InvoiceAmount - applyCreditNoteAmount)
        : InvoiceAmount;
      const dataforRemaingAmount: any = {
        customerId: customerParentIdd,
        Amount: applyCreditNoteAmount,
        amountMode: 0,
      };

      if (amount === 0) {
        try {
          const rendomTransactionId = keyGen(5);
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
          if (applyCreditNoteAmount !== 0) {
            await insertRemainingNotesAmount(dataforRemaingAmount);
          }
          await updateInvoiceAfterPay(id);
          handleCloses();
        } catch (error: any) {
          console.log("Error ", error.message);
        }
      } else {
        router.push(
          `/checkpayment/cbq/?amount=${amount}&refrenceNumber=${orderId}&sageCustomerId=${sageCustomerId}&creditNotesId=${creditNotesId}&invoiceid=${id}&dbcustomerid=${customerID}&creditNoteAmount=${applyCreditNoteAmount}`
        );
      }
    }
  };

  const transactionSaveInDB = async (data: any) => {
    getwayService.transactionDataSaveInDB(data, async function (result: any) {
      data = {
        invoiceTitle: "INVOICE",
        customerId: customerID,
        transactionId:
          result &&
          result.insetTransatction &&
          result.insetTransatction?.insertId,
        activityId: 0,
        itemId: itemsId,
      };
      await commmonfunctions.SendEmailsAfterPayment(data);
      let item = {
        refrenceId: result.referenceNumber,
        transactionId:
          result &&
          result.insetTransatction &&
          result.insetTransatction?.insertId,
      };
      console.log("itemitem", item);
      DownloadReceipt(item, "", "admin_side");
      setShowSuccess(true);
      AddLogs(
        userUniqueId,
        `Invoice purchase transaction id - #${data?.transactionId}`
      );
      setTimeout(callBack_func, 5000);
      async function callBack_func() {
        setShowSuccess(false);
        if (paymentMethod === "Cash") {
          await getwayService.getARInoviceRecordNumber(
            orderId,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                ARreceiveONDate: receiveDateNew,
              };
              console.log("data for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) { }
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.referenceNumber,
              //     ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              //     ARreceiveONDate: receiveDateNew,
              //     ARCheckNo: handlePaymentValue,
              //   };
              //   console.log("data2 for apply pay =>", ARdata);
              //   await getwayService.createAndApplyPaymentARInvoice(
              //     ARdata,
              //     async function (result: any) {
              //     console.log('result',result);
              //     }
              //   );
              // }
              if (paymentMethod === "Cash" && isChecked === true) {
                const ARdata = {
                  customerId: sageCustomerId,
                  amount: applyCreditNoteAmount,
                  ARpaymentMethod: "Cash",
                  referenceNumber: result.referenceNumber,
                  ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                  ARreceiveONDate: receiveDateNew,
                };
                console.log("data for apply pay =>", ARdata);
                await getwayService.createAndApplyPaymentARInvoice(
                  ARdata,
                  async function (result: any) {
                    console.log("result", result);
                  }
                );
              }
            }
          );
          //  toast.success("Payment Successfully !");
        } else if (paymentMethod === "Check") {
          await getwayService.getARInoviceRecordNumber(
            orderId,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Printed Check",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                ARreceiveONDate: receiveDateNew,
                ARCheckNo: handlePaymentValue,
              };
              console.log("data2 for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {
                  console.log("result", result);
                }
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.referenceNumber,
              //     ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              //     ARreceiveONDate: receiveDateNew,
              //     ARCheckNo: handlePaymentValue,
              //   };
              //   console.log("data2 for apply pay =>", ARdata);
              //   await getwayService.createAndApplyPaymentARInvoice(
              //     ARdata,
              //     async function (result: any) {
              //     console.log('result',result);

              //     }
              //   );
              // }
            }
          );
        } else if (paymentMethod === "Credit Card") {
          await getwayService.getARInoviceRecordNumber(
            orderId,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Credit Card",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                ARreceiveONDate: receiveDateNew,
                ARAuthCode: handlePaymentValue,
                // ARCardType: cardType,
              };
              console.log("data2 for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {
                  console.log("result", result);
                }
              );
              // if (creditToApply > 0) {
              //   const ARdata = {
              //     customerId: sageCustomerId,
              //     amount: creditToApply,
              //     ARpaymentMethod: "Cash",
              //     referenceNumber: result.referenceNumber,
              //     ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              //     ARreceiveONDate: receiveDateNew,
              //     ARCheckNo: handlePaymentValue,
              //   };
              //   console.log("data2 for apply pay =>", ARdata);
              //   await getwayService.createAndApplyPaymentARInvoice(
              //     ARdata,
              //     async function (result: any) {
              //     console.log('result',result);

              //     }
              //   );
              // }
            }
          );
        } else if (paymentMethod === "Record transfer" || result.amount === 0) {
          await getwayService.getARInoviceRecordNumber(
            orderId,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Record Transfer",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
              };
              console.log("data2 for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) { }
              );
            }
          );
        } else if (paymentMethod === "Amex" || result.amount === 0) {
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
                async function (result: any) { }
              );
            }
          );
        } else if (paymentMethod === "QPay" || result.amount === 0) {
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
                async function (result: any) { }
              );
            }
          );
        } else if (paymentMethod === "CBQ" || result.amount === 0) {
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
                async function (result: any) { }
              );
            }
          );
        }
      }
    });
  };

  async function getCustomerIDByInvoice() {
    await axios({
      method: "GET",
      url: `${api_url}/getcustomeridByinvoiceid/${invoice[0]?.invoiceId}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Invoice payment created by - #CUS-${data?.data?.data[0]?.customerId}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const updateInvoiceAfterPay = async (invoiceId: any) => {
    try {
      let totalBothAmount = parseInt(totalPay + creditToApply);
      let dueAmount =
        dueInvoiceAmount === null ? InvoiceAmount : dueInvoiceAmount;
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
          getCustomerIDByInvoice();
          toast.success("Payment Successfully !");
          handleThanksOpen();
          setTimeout(() => {
            handleCloses();
            handleThanksClose();
            router.push("/admin/invoices/invoice");
          }, 4000);
        })
        .catch((err) => { });
    } catch (error: any) {
      console.log("error => ", error.message);
    }
  };

  async function getSageCustomerId() {
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${customerID}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Amount debit by - #CUS-${data?.data?.data[0]?.customerId}`
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

  //download invoice
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

  //download receipt
  const DownloadReceipt = async (item: any, title: string, isSide: string) => {
    const reqData = {
      RCTNumber: item?.refrenceId,
      isSide: isSide,
      transactionId: item?.transactionId,
    };
    UserService.DownloadReceiptSinglePaid(reqData).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${item?.refrenceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      return false;
    });
  };

  //handle popup close
  const handleCloses = () => {
    setDollerOpen(false);
    setPaymentMethod("Cash");
    setHandlePaymentValue("");
    setCreditPopupError("");
    setApplyPaymentPopupError("");
    setCreditPopupError("");
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

  let totalPay: any =
    (paymentToApply === "" || paymentToApply === 0) && creditToApply > 0
      ? 0
      : paymentToApply === "" || paymentToApply === 0
        ? dueInvoiceAmount
        : paymentToApply;

  let dueAmount =
    invDet[0]?.amount_due !== null || invDet[0]?.amount_due !== 0
      ? invDet[0]?.amount_due
      : invDet[0]?.amount;

  const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

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
              <div className="buycss" style={{ textAlign: "end" }}>
                <Link
                  href="/admin/invoices/invoice"
                  style={{ color: "#1A70C5", textDecoration: "none" }}
                >
                  <Button variant="contained" startIcon={<ArrowBackIcon />}>
                    {" "}
                    <b>Back To List</b>
                  </Button>
                </Link>
              </div>
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
                  <div className="aititle">
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
                  <div className="icenter">
                    <div className="invoice">
                      {/*bread cump */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        style={{ padding: "8px", marginBottom: "15px" }}
                      >
                        <Stack
                          style={{ paddingLeft: "50px", paddingRight: "50px" }}
                        >
                          <Stack spacing={3}>
                            <Typography
                              gutterBottom
                              style={{ fontWeight: "bold", color: "#333333" }}
                            >
                              Bill To :
                            </Typography>
                          </Stack>
                          <Typography
                            gutterBottom
                            style={{ fontWeight: "bold", color: "#333333" }}
                          >
                            {invDet[0]?.name}
                          </Typography>
                        </Stack>
                        <Stack>
                          <Stack spacing={3}>
                            <Typography
                              gutterBottom
                              style={{ fontWeight: "bold", color: "#333333" }}
                            >
                              Date To :
                            </Typography>
                          </Stack>
                          <Typography
                            gutterBottom
                            style={{ fontWeight: "bold", color: "#333333" }}
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
                        alignItems="center"
                        justifyContent="space-between"
                        style={{ padding: "8px", marginBottom: "15px" }}
                      >
                        <Stack
                          style={{ paddingLeft: "50px", paddingRight: "50px" }}
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
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div className="ickk">
                      <div className="cinvoice">
                        <div>
                          {invDet && invDet[0]?.status === "Paid" ? (
                            <Typography style={{ textAlign: "center" }}>
                              <b>
                                {commmonfunctions.formatePrice(
                                  Number(invDet && invDet[0]?.amount)
                                )}
                                {" (" + qatar_currency + ") "} Paid
                              </b>
                            </Typography>
                          ) : (
                            <Typography style={{ textAlign: "center" }}>
                              <b>
                                {commmonfunctions.formatePrice(
                                  Number(
                                    dueAmount
                                      ? dueAmount
                                      : invDet && invDet[0]?.amount
                                  )
                                )}
                                {" (" + qatar_currency + ")"} DUE
                              </b>
                            </Typography>
                          )}
                          {invDet && invDet[0]?.status === "Paid" ? (
                            <BootstrapButton
                              type="button"
                              style={{ backgroundColor: "#42D5CD" }}
                              sx={{ width: 250, padding: 1, margin: 2 }}
                              onClick={() =>
                                DownloadReceipt(invDet[0], " ", "admin_side")
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

                          {invDet && invDet[0]?.status === "Draft" ? (
                            <BootstrapButton
                              sx={{ width: 250, padding: 1, margin: 2 }}
                              disabled
                            >
                              Download Invoice{" "}
                            </BootstrapButton>
                          ) : (
                            <BootstrapButton
                              sx={{ width: 250, padding: 1, margin: 2 }}
                              onClick={() =>
                                DownloadInvoice(
                                  invDet && invDet[0],
                                  "",
                                  "admin_side"
                                )
                              }
                            >
                              Download Invoice{" "}
                              <Typography
                                style={{ fontSize: "2px", paddingLeft: "10px" }}
                              >
                                {spinner === true ? (
                                  <CircularProgress color="inherit" />
                                ) : (
                                  ""
                                )}
                              </Typography>
                            </BootstrapButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        style={{ padding: "8px" }}
                      >
                        <Stack>
                          <Typography
                            variant="h5"
                            gutterBottom
                            style={{
                              fontWeight: "bold",
                              color: "#333333",
                            }}
                          >
                            Line Items
                          </Typography>
                        </Stack>
                      </Stack>
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
                          {product.map((row: any, key: any) => (
                            <TableRow id={key}>
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
                                  Number(row?.item_price)
                                )}{" "}
                                {"(" + qatar_currency + ")"}
                              </TableCell>
                              <TableCell>
                                {commmonfunctions.formatePrice(
                                  Number(row?.item_total_price)
                                )}{" "}
                                {"(" + qatar_currency + ")"}
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
                                Txn Amount
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
                                {commmonfunctions.formatePrice(creditApplied)}
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
                                {commmonfunctions.formatePrice(paymentAmount)}
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
                                  dueAmount
                                    ? dueAmount
                                    : invDet && invDet[0]?.amount
                                  // : 0.0
                                )}
                                {" (" + qatar_currency + ")"}
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
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
                                        {invDetail?.status === "Paid" ||
                                          invDetail?.status ===
                                          "Partially paid" ? (
                                          <BootstrapTooltip title="Download receipt">
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
                                                width={35}
                                                height={35}
                                              />
                                            </Button>
                                          </BootstrapTooltip>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow >
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
      </Box >
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
            Receive Payment
          </BootstrapDialogTitle>
          <DialogContent dividers className="popup">
            <Grid>
              <Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">Customer</InputLabel>
                      <OutlinedInput
                        defaultValue={recievedPay.name}
                        type="text"
                        id="name"
                        placeholder="Customer Name..."
                        fullWidth
                        disabled
                        size="small"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">
                        Received On <span className="err_str">*</span>
                      </InputLabel>
                      <DatePicker
                        className="myDatePicker"
                        selected={receiveDate}
                        onChange={(date: any) => handleReceiveDate(date)}
                        name="receiveDate"
                        dateFormat="MM/dd/yyyy"
                        placeholderText="Date"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
              <Stack style={{ marginTop: "8px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
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
                        onClick={() => {
                          setHandlePaymentValue("");
                        }}
                      >
                        <MenuItem value="All"></MenuItem>
                        <MenuItem value="Check">Check</MenuItem>
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                        <MenuItem value="Cash">Cash</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                  {paymentMethod === "Cash" ? (
                    ""
                  ) : paymentMethod === "Check" ? (
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Check no. <span className="err_str">*</span>
                        </InputLabel>
                        <OutlinedInput
                          value={handlePaymentValue}
                          type="text"
                          id="name"
                          placeholder="Check No..."
                          fullWidth
                          size="small"
                          onChange={(e: any) =>
                            setHandlePaymentValue(e.target.value)
                          }
                        />
                      </Stack>
                    </Grid>
                  ) : paymentMethod === "Record transfer" ? (
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Reference no. <span className="err_str">*</span>
                        </InputLabel>
                        <OutlinedInput
                          value={handlePaymentValue}
                          type="text"
                          id="name"
                          placeholder="Reference no..."
                          fullWidth
                          size="small"
                          onChange={(e: any) =>
                            setHandlePaymentValue(e.target.value)
                          }
                        />
                      </Stack>
                    </Grid>
                  ) : paymentMethod === "Credit Card" ? (
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="name">
                          Authorization code <span className="err_str">*</span>
                        </InputLabel>
                        <OutlinedInput
                          value={handlePaymentValue}
                          type="text"
                          id="name"
                          placeholder="authorization code..."
                          fullWidth
                          size="small"
                          onChange={(e: any) =>
                            setHandlePaymentValue(e.target.value)
                          }
                        />
                      </Stack>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Stack>
              <Stack style={{ marginTop: "15px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2.4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">Txn amount</InputLabel>
                      <OutlinedInput
                        disabled
                        defaultValue={
                          commmonfunctions.formatePrice(recievedPay.amount) +
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
                      <InputLabel htmlFor="name">Credits available</InputLabel>
                      <OutlinedInput
                        disabled
                        value={`${applyCreditNoteAmount}.00 (QAR)`}
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
                        type="text"
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
                      <Typography style={style}>{creditPopupError}</Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={2.4}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">Payment amount</InputLabel>
                      <OutlinedInput
                        onChange={(e) =>
                          handleReceivePaymentAccordingToUs(e, "payment")
                        }
                        type="text"
                        id="name"
                        placeholder="Payment to apply"
                        name="Payment to apply"
                        fullWidth
                        size="small"
                      />
                    </Stack>
                    {applyPaymentPopupError && (
                      <Typography style={style}>
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
                        Want to use credit balance :
                        {commmonfunctions.formatePrice(
                          customerTotalCreditNoteBalance
                        ) +
                          " (" +
                          qatar_currency +
                          ")"}
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
                        {commmonfunctions.formatePrice(totalPay && totalPay) +
                          " (" +
                          qatar_currency +
                          ")"}{" "}
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
              disabled={
                creditPopupError || applyPaymentPopupError ? true : false
              }
              onClick={() => handleCreate(recievedPay.id)}
            >
              Receive
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </div>
      <div>
        <Modal
          open={openThank}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style1}>
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
      <ToastContainer />
    </>
  );
}
