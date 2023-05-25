import {
  Card,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  FormControl,
  TableContainer,
  TableHead,
  Menu,
  Button,
  Breadcrumbs,
  Box,
  Pagination,
  styled,
  OutlinedInput,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { BiFilterAlt } from "react-icons/bi";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { BsTelegram } from "react-icons/bs";
import { Grid, InputLabel, Stack } from "@mui/material";
import Modal from "@mui/material/Modal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import MiniDrawer from "../../sidebar";
import axios from "axios";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { api_url, auth_token, qatar_currency } from "../../../helper/config";
import moment from "moment";
import Image from "next/image";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CachedIcon from "@mui/icons-material/Cached";
import Alert from "@mui/material/Alert";
import Script from "next/script";
import getwayService from "../../../services/gatewayService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, SubmitHandler } from "react-hook-form";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import MainFooter from "../../commoncmp/mainfooter";
import PDFService from "../../../commonFunctions/invoicepdf";
import { AddLogs } from "../../../helper/activityLogs";
import ReceiptPDFService from "../../../commonFunctions/receiptInvoicepdf";
import PaymentPopup from "../../commoncmp/paymentpopup";
import Loader from "../../commoncmp/myload";
import UserService from "../../../commonFunctions/servives";
import FilterListIcon from "@mui/icons-material/FilterList";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

//fot tooltip showing
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

//for dialog boxex
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
export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const styleptag = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

//for tab functionality
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

//for from values
export interface FormValues {
  status: Number;
  res: String;
  startDate: String;
  endDate: String;
  Total: String;
  sort: String;
  customer: String;
  sdata: String;
  option: String;
  firstName: String;
  recievedPay: any;
  name: String;
  description: String;
  price: String;
}

//pagination Function
function usePagination(data: any, itemsPerPage: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);
  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }
  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }
  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }
  function jump(page: any) {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  }
  return { next, prev, jump, currentData, currentPage, maxPage };
}

export default function Guardians() {
  const [user, setUser] = useState<FormValues | any>([]);
  const [open, setOpen] = useState(false);
  const [pop, setPop] = useState(false);
  const [share, setShare] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [sdata, setUserId] = useState<FormValues | any>([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [value, setValue] = useState(0);
  const [id, setId] = useState();
  const [dollerOpen, setDollerOpen] = useState(false);
  const [recievedPay, setRecieved] = useState<FormValues | any>([]);
  const [sort, setSort] = useState<FormValues | any>("ASC");
  const [status, setStatus] = useState<FormValues | any>("All");
  const [note, setNote] = useState<FormValues | any>("");
  const [disable, setDisable] = useState<FormValues | any>(false);
  const [paiddisable, setPaidDisable] = useState<FormValues | any>(false);
  const [Invoicedata, setInvoice] = useState<FormValues | any>([]);
  let [page, setPage] = useState(1);
  const [searchdata, setsearchdata] = useState([]);
  const [row_per_page, set_row_per_page] = useState(5);
  const [searchquery, setsearchquery] = useState("");
  const [custpermit, setcustpermit] = useState<any>([]);
  const [roleid, setroleid] = useState(0);
  const router = useRouter();
  const [orderId, setorderId] = useState("");
  const [InvoiceAmount, setInvoiceAmount] = useState(0);
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerTotalCreditNoteBalance, setCustomerTotalCreditNoteBalance] =
    useState(0);
  const [customerCreditNoteRequestId, setCustomerCreditNoteRequestId] =
    useState<any>(null);
  const [applyCreditNoteAmount, setApplyCreditNoteAmount] = useState<any>(0);
  const [finalAmountToPay, setFinalAmountToPay] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [customerID, setCustomerId] = useState<any>("");
  const [userUniqueId, setUserUniqId] = useState<any>();
  const [newPayOpen, setnewPayOpen] = useState(false);
  const [custDt, setcustDt] = useState<any>([]);
  const [sageCustomerId, setsageCustomerId] = useState("");
  const [itemsId, setritemsId] = useState<any>("");
  const [customerParentIdd, setCustomerParentIdd] = useState<any>("");
  const [receiveDate, setReceiveDate] = useState<any>(new Date());
  const [cardType, setCardType] = useState<any>("");
  const [handlePaymentValue, setHandlePaymentValue] = useState<any>("");
  const [openThank, setOpenThank] = useState(false);
  const [creditToApply, setCreditToApply] = useState<any>("");
  const [creditPopupError, setCreditPopupError] = useState<any>("");
  const [paymentToApply, setPaymentToApply] = useState<any>("");
  const [applyPaymentPopupError, setApplyPaymentPopupError] = useState<any>("");
  const [dueInvoiceAmount, setDueInvoiceAmount] = useState(0);
  const [loader, setLoadar] = useState(true);
  const handleThanksOpen = () => setOpenThank(true);
  const handleThanksClose = () => setOpenThank(false);

  const [customerCreditNoteRemaingAmount, setCustomerCreditNoteRemaingAmount] =
    useState(0);
  var Checkout: any;
  var creditNoteNewId: any;

  //global loader
  const [myload, setmyload] = useState(true);
  setTimeout(() => {
    setmyload(false);
  }, 2000);

  // verify user login and previlegs
  let logintoken: any;
  useEffect(() => {
    commmonfunctions.CheckTekenRExpire();
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId == 1) {
        setroleid(res.roleId);
      } else if (res.roleId > 1 && res.roleId !== 2) {
        commmonfunctions.ManageInvoices().then((res) => {
          if (!res) {
            router.push("/userprofile");
          } else {
            setcustpermit(res);
          }
        });
      }
    });
  }, []);

  //for payment
  useEffect(() => {
    let search = router.query;
    let amexOrderId = search.orderid;
    let paymentMethod = search.paymentMethod;
    let creditRequestId = search.creditNoteId;
    let customerid = search.customerID;
    let remaingAmount = search.remaingAmount;
    let DBInvoiceid = search.DBInvoiceid;
    if (paymentMethod && amexOrderId) {
      // orderPlaced(amexOrderId, paymentMethod, creditRequestId, DBInvoiceid);
    }
    if (creditRequestId) {
      const reqData: any = {
        customerId: customerid,
        Amount: remaingAmount,
        amountMode: 0,
      };
      // insertRemainingNotesAmount(reqData);
    }
    getUser();
  }, [router.query]);

  //get invoices
  const getUser = () => {
    setLoadar(true);
    UserService.getInvoices().then((res: any) => {
      setUser(res);
      setInvoice(res);
      setsearchdata(res);
      setLoadar(false);
    });
  };

  //filter functionality
  let receiveDateNew = moment(receiveDate).format("MM/DD/YYYY");
  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    setLoadar(true);
    let sdate = moment(startDate).format("DD/MM/YYYY");
    let edate = moment(endDate).format("DD/MM/YYYY");
    var ids: any = [];
    if (sdata?.length > 0) {
      for (let item of sdata) {
        ids.push(item?.customerId);
      }
    }
    let reqData = {
      status: status,
      startDate: sdate === "Invalid date" ? "" : sdate,
      endDate: edate === "Invalid date" ? "" : edate,
      order: sort,
      amount: data.Total.replace("$", ""),
      customer: ids ? ids : "",
    };

    await axios({
      method: "POST",
      url: `${api_url}/getInvoice`,
      data: reqData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        setUser(res?.data.data);
        setUserId("");
        setLoadar(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadar(false);
      });
  };
  //reset filter
  const handleReset = () => {
    reset();
    setSort("ASC");
    setStatus("All");
    setUserId("");
    setStartDate(null);
    setEndDate(null);
    getUser();
  };

  //get customer credit notes
  const getCustomerNotes = async (id: any) => {
    try {
      const response = await fetch(`${api_url}/creditballance/${id}`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      // setCustomerCreditNoteRequestId(res?.getCreditRequestQuery_FromPortalDB[0]?.id);
      setCustomerTotalCreditNoteBalance(res?.creditBal_FromSageCreditNotes);
      setApplyCreditNoteAmount(res?.creditBal_FromSageCreditNotes);
    } catch (error: any) {
      console.log("error", error.message);
    }
  };

  //handle credit ballance payment
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

  //handle payment box
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
    // setorderId(item.invoiceId);
    setorderId(item?.tuition_invoice_id || item?.invoiceId);
    setInvoiceAmount(item.amount);
    setDueInvoiceAmount(item.amount_due);
    setInvoiceStatus(item.status);
    setFinalAmountToPay(
      item.amount_due === null || item.amount_due === 0
        ? item.amount
        : item.amount_due
    );
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

  const handleCloses = () => {
    setDollerOpen(false);
    setPaymentMethod("Cash");
    setHandlePaymentValue("");
    setCreditPopupError("");
    setApplyPaymentPopupError("");
  };

  const closePopper = () => setOpen(false);
  const handleOpen = (id: any) => {
    setPop(true);
    setId(id);
  };
  const handleClose = () => setPop(false);
  const handleEmailClose = () => setShare(false);
  const handleCancel = () => {
    handleClose();
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();



  const orderPlaced = async (
    amexOrderId: any,
    paymentMethod: any,
    creditRequestId: any,
    DBInvoiceid: any
  ) => {
    const data = { orderId: amexOrderId };
    var apiRequest = data;
    var requestUrl = await getwayService.getRequestUrl("REST", apiRequest);
    getwayService.retriveOrder(requestUrl, async function (orderresult: any) {
      if (orderresult.status === 200) {
        const amextransactionData = orderresult.data;
        const transactionData = {
          idForPayment: amexOrderId,
          totalAmount: amextransactionData?.transaction[0].transaction.amount,
          paidAmount: amextransactionData?.transaction[0].transaction.amount,
          paymentMethod: paymentMethod,
          amexorderId: amexOrderId,
          transactionId: amextransactionData?.transaction[0].transaction.id,
          creditNotesId: creditRequestId ? creditRequestId : null,
        };
        // await transactionSaveInDB(transactionData);
        // await updateInvoiceAfterPay(amexOrderId);

        var ARRefrenceNumber = "";
        await getwayService.transactionDataSaveInDB(
          transactionData,
          async function (result: any) {
            var generatedTransactionId = result?.insetTransatction?.insertId;
            ARRefrenceNumber = await getwayService.generateRefrenceNumber(
              generatedTransactionId
            );
            await getwayService.getARInoviceRecordNumber(
              amexOrderId,
              async function (ARRecordNumberResult: any) {
                const data = {
                  customerId: sageCustomerId,
                  amount:
                    amextransactionData?.transaction[0].transaction.amount,
                  ARpaymentMethod: "EFT",
                  referenceNumber: ARRefrenceNumber,
                  ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                };
                await getwayService.createAndApplyPaymentARInvoice(
                  data,
                  async function (result: any) {
                    await updateInvoiceAfterPay(DBInvoiceid);

                    setTimeout(() => {
                      document.location.href = `${process.env.NEXT_PUBLIC_AMEX_INVOICE_REDIRECT_URL}`;
                    }, 3000);
                  }
                );
              }
            );
          }
        );
      }
    });
  };

  //make payment functionality
  const handleCreate = async (id: any) => {
    // console.log(process.env.NEXT_PUBLIC_REDIRECT_URL,"Checkout =>",(window as any).Checkout);
    const Checkout: any = (window as any).Checkout;
    const creditNotesId = customerCreditNoteRequestId;
    if (
      paymentMethod === "Amex" &&
      isChecked === true &&
      finalAmountToPay > 0
    ) {
      if (finalAmountToPay === 0) {
        toast.error("amount will not be $0 for Amex payment method");
      }
      if (invoiceStatus === "draft") {
        toast.error(
          "Invoice has status with Draft,Only Pending invoice Can Pay "
        );
      } else {
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
              }?orderid=${orderId}&paymentMethod=${paymentMethod}&creditNoteId=${creditNotesId}&DBInvoiceid=${id}&remaingAmount=${applyCreditNoteAmount}&customerID=${customerID}&itemIdd=${itemsId}&invoiceTitle=${"INVOICES"}`,
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
    if (
      paymentMethod === "Amex" &&
      isChecked === false &&
      finalAmountToPay > 0
    ) {
      if (finalAmountToPay === 0) {
        toast.error("amount will not be $0 for Amex payment method");
      }
      if (invoiceStatus === "draft") {
        toast.error(
          "Invoice has status with Draft,Only Pending invoice Can Pay "
        );
      } else {
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
              }?orderid=${orderId}&paymentMethod=${paymentMethod}&creditNoteId=${null}&DBInvoiceid=${id}&remaingAmount=${applyCreditNoteAmount}&customerID=${customerID}&itemIdd=${itemsId}&invoiceTitle=${"INVOICES"}`,
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
    //only cash payment
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
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentMethod === "Check") {
      if (handlePaymentValue === "") {
        toast.error("Check number is required !");
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
          customerId: customerParentIdd,
          Amount: applyCreditNoteAmount,
          amountMode: 0,
        };
        const rendomTransactionId = keyGen(5);
        let price =
          customerTotalCreditNoteBalance > InvoiceAmount ? 0 : finalAmountToPay;

        let reqData = {
          totalAmount: price,
          paidAmount: price,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNotesId,
        };
        if (applyCreditNoteAmount !== 0) {
          insertRemainingNotesAmount(dataforRemaingAmount);
        }
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
          transactionId: `case-${rendomTransactionId}`,
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
          if (applyCreditNoteAmount !== 0) {
            await insertRemainingNotesAmount(dataforRemaingAmount);
          }
          await transactionSaveInDB(reqData);
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
  async function getSageDeleteId() {
    // let reqData = { isDeleted: 1 };
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${customerID}`,
      headers: {
        Authorization: auth_token,
        "x-access-token": logintoken,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Invoice Payment created by id - #CUS-${data?.data?.data[0]?.customerId}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //save data into transaction
  const transactionSaveInDB = async (data: any) => {
    getwayService.transactionDataSaveInDB(data, async function (result: any) {
      //sending emails with receipt attachement
      data = {
        transactionId:
          result &&
          result.insetTransatction &&
          result.insetTransatction?.insertId,
        invoiceId: data?.amexorderId
        ,
      };
      await commmonfunctions.SendEmailsAfterPayment(data);
      let item = {
        refrenceId: result.referenceNumber,
        transactionId:
          result &&
          result.insetTransatction &&
          result.insetTransatction?.insertId,
        invoiceId: data?.invoiceId
      };
      DownloadReceipt(item, "", "admin_side");
      setShowSuccess(true);
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

              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {

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
              //       console.log('result',result);
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

                await getwayService.createAndApplyPaymentARInvoice(
                  ARdata,
                  async function (result: any) {
                    console.log("ok");
                  }
                );
                if (creditToApply > 0) {
                  const ARdata = {
                    customerId: sageCustomerId,
                    amount: creditToApply,
                    ARpaymentMethod: "Cash",
                    referenceNumber: result.referenceNumber,
                    ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                    ARreceiveONDate: receiveDateNew,
                    ARCheckNo: handlePaymentValue,
                  };

                  await getwayService.createAndApplyPaymentARInvoice(
                    ARdata,
                    async function (result: any) { }
                  );
                }
              }
            }
          );
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
                // ARpaymentONDate:""
                // ARCardType: cardType,
              };

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

  //update invoice
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
        note: note ? note : "",
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
          getSageDeleteId();
          toast.success("Payment Successfully !");
          handleThanksOpen();
          setTimeout(() => {
            setValue(0);
            handlePaid();
            handleThanksClose();
            router.push("/admin/invoices/invoice");
          }, 3000);
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

  async function getSageId(idd: any) {
    // let reqData = { isDeleted: 1 };
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${idd}`,
      headers: {
        Authorization: auth_token,
        "x-access-token": logintoken,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Credit Balance debit by id - #CUS-${data?.data?.data[0]?.customerId}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const getTransactionById = async (id: any) => {
    var data = {
      invoiceId: id,
    };

    var config = {
      method: "post",
      url: `${api_url}/getTransaction`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const transaction = await axios(config);
    let getTransactionNo = transaction.data.transactionId;
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
          setCustomerCreditNoteRequestId(data?.data?.data?.insertId);
          creditNoteNewId = data?.data?.data?.insertId;
          getSageId(reqData?.customerId);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const pending = Invoicedata?.filter((a: any) => a.status == "Pending");
  const partialPaid = Invoicedata?.filter(
    (a: any) => a.status == "Partially paid"
  );
  const paid = Invoicedata?.filter((a: any) => a.status == "Paid");
  const draft = Invoicedata?.filter((a: any) => a.status == "Draft");
  const handleAll = () => {
    setDisable(false);
    setPaidDisable(false);
    setUser(searchdata);
  };
  const handlePaid = () => {
    const paids = Invoicedata.filter((a: any) => a.status == "Paid");
    setDisable(false);
    setPaidDisable(true);
    setUser(paids);
  };
  const handlePending = () => {
    const pendings = Invoicedata.filter((a: any) => a.status == "Pending");
    setDisable(false);
    setPaidDisable(false);
    setUser(pendings);
  };

  const handlePartiallyPaid = () => {
    const partiallyPaid = Invoicedata.filter(
      (a: any) => a.status == "Partially paid"
    );
    setDisable(false);
    setPaidDisable(false);
    setUser(partiallyPaid);
  };
  const handleDraft = () => {
    const drafts = Invoicedata.filter((a: any) => a.status == "Draft");
    setDisable(true);

    setUser(drafts);
  };
  const getDefaultValue = () => {
    if (sdata.length) {
      return sdata.map((cat: any) => cat.name);
    }
  };
  const handleChange = (date: any) => {
    setStartDate(date);
  };

  const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //handle delete
  const handledelete = async () => {
    let reqData = {
      userId: "2",
    };
    await axios({
      method: "DELETE",
      url: `${api_url}/deleteInvoice/${id}`,
      data: reqData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        AddLogs(userUniqueId, `Delete invoice id - #${res?.data?.invoiceid}`);
        getUser();
        toast.success("Deleted Successfully !");
        setTimeout(() => {
          handleClose();
        }, 2000);
      })
      .catch((err) => { });
  };

  async function getCustomerIDByInvoice() {
    await axios({
      method: "GET",
      url: `${api_url}/getcustomeridByinvoiceid/${invoiceNumber}`,
      headers: {
        Authorization: auth_token,
        "x-access-token": logintoken,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Invoice Mail send to - #CUS-${data?.data?.data[0]?.customerId}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // send email func
  const handleSend = async () => {
    await axios({
      method: "GET",
      url: `${api_url}/sendInvoiceEmail/${invoiceId}`,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        getCustomerIDByInvoice();
        toast.success("Send Invoice Mail Successfully !");
        setShare(false);
      })
      .catch((err) => { });
  };

  //handle share send invoice email
  const handleShare = async (item: any) => {
    setInvoiceId(item?.id);
    setInvoiceNumber(item?.invoiceId);
    setShare(true);
  };
  const handleReceiveDate = (date: any) => {
    setReceiveDate(date);
  };
  // pagination func
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  const PER_PAGE = row_per_page;
  const count = Math.ceil(user.length / PER_PAGE);
  const DATA = usePagination(user, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  // searching functionality
  const searchItems = (e: any) => {
    setsearchquery(e.target.value);
    setPage(1);
    DATA.jump(1);
    if (e.target.value == "") {
      setUser(searchdata);
    } else {
      const filterres = user.filter((item: any) => {
        return (
          `${item.sageCustomerId}`
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          `${item.sageParentId}`
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.email1.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.status.toLowerCase().includes(e.target.value.toLowerCase()) ||
          `${item.amount}`.includes(e.target.value) ||
          item.invoiceId
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.tuition_invoice_id
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      const dtd = filterres;
      setUser(dtd);
    }
  };

  //generate pdf
  // const generateSimplePDF = async (item: any, title: any, isSide: string) => {
  //   PDFService.generateSimplePDF(item, title, isSide);
  // };

  const DownloadInvoice = async (item: any, title: string, isSide: string) => {
    const invoiceid = item?.tuition_invoice_id || item?.invoiceId;
    const reqData = {
      id: item.id,
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
  // const ReceiptPdf = async (
  //   item: any,
  //   receipt_title: string,
  //   isSide: String
  // ) => {
  //   ReceiptPDFService.ReceiptPDF(item, receipt_title, isSide);
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
  //handle pay open
  const handlePayOpen = (item: any) => {
    setnewPayOpen(true);
    setcustDt(item);
  };
  const closePoP = (data: any) => {
    setnewPayOpen(false);
  };

  // handle Receive Payment Modal
  const handleReceivePaymentAccordingToUs = (e: any, identifier: any) => {
    const transactionAmount =
      recievedPay?.amount_due === null || recievedPay?.amount_due === 0
        ? recievedPay.amount
        : recievedPay.amount_due;
    let OutstandingAmount: any;
    const creditBal = customerTotalCreditNoteBalance;
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

  let totalPay: any =
    (paymentToApply === "" || paymentToApply === 0) && creditToApply > 0
      ? 0
      : paymentToApply === "" || paymentToApply === 0
        ? finalAmountToPay
        : paymentToApply;
  //refresh fuctionality
  const Refresh = () => {
    getUser();
  };
  //sort functionality
  const DataSort = () => {
    setUser([...user].reverse());
  };

  return (
    <>
      <Script
        src="https://amexmena.gateway.mastercard.com/static/checkout/checkout.min.js"
        data-error="errorCallback"
        data-cancel="cancelCallback"
        strategy="beforeInteractive"
      ></Script>
      {myload ? (
        <Loader />
      ) : roleid === 1 || roleid !== 2 ? (
        <>
          <Box sx={{ display: "flex" }}>
            <MiniDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <div className="guardianBar">
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
                          href="/admin/invoices/invoice"
                          style={{ color: "#7D86A5", textDecoration: "none" }}
                        >
                          Invoices
                        </Link>
                      </Breadcrumbs>
                    </Stack>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ fontWeight: "bold", color: "#333333" }}
                    >
                      INVOICES
                    </Typography>
                    {showSuccess && (
                      <Alert
                        style={{
                          width: "50%",
                          height: 50,
                          marginLeft: 430,
                          marginTop: "-50px",
                        }}
                        severity="success"
                      >
                        Thank You ! Payment Recieved
                      </Alert>
                    )}
                  </Stack>
                  {(custpermit && custpermit.canAdd === true) ||
                    roleid === 1 ? (
                    <Link
                      href="/admin/addinvoice"
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        className="button-new"
                        variant="contained"
                        size="small"
                        sx={{ width: 150 }}
                      >
                        New Invoice
                      </Button>
                    </Link>
                  ) : (
                    ""
                  )}
                </Stack>
                <Card
                  style={{ margin: "10px", padding: "15px" }}
                  className="box-shadow"
                >
                  <TableContainer>
                    <Stack
                      style={{ marginBottom: "10px" }}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Tabs
                          value={value}
                          onChange={handleChanges}
                          aria-label="basic tabs example"
                        >
                          <Tab
                            className="filter-list"
                            label={`All (${Invoicedata.length})`}
                            {...a11yProps(0)}
                            onClick={handleAll}
                          />
                          <Tab
                            label={`Paid (${paid.length})`}
                            {...a11yProps(1)}
                            onClick={handlePaid}
                          />
                          <Tab
                            label={`Un Paid  (${pending.length})`}
                            {...a11yProps(2)}
                            onClick={handlePending}
                          />
                          <Tab
                            label={`Partially Paid  (${partialPaid.length})`}
                            {...a11yProps(2)}
                            onClick={handlePartiallyPaid}
                          />
                          <Tab
                            label={`Draft (${draft.length})`}
                            {...a11yProps(3)}
                            onClick={handleDraft}
                          />
                        </Tabs>
                      </Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        className="fimport-export-box"
                      >
                        <MenuItem onClick={DataSort}>
                          <span
                            style={{
                              color: "#1a70c5",
                              fontWeight: "600",
                              marginTop: "8px",
                            }}
                          >
                            <FilterListIcon />
                          </span>
                          &nbsp;{" "}
                          <span
                            style={{
                              color: "#1a70c5",
                              fontWeight: "600",
                              marginRight: "10px",
                            }}
                          >
                            Sort
                          </span>
                        </MenuItem>
                        <MenuItem onClick={Refresh}>
                          <span
                            style={{
                              color: "#1a70c5",
                              fontWeight: "600",
                              marginTop: "8px",
                            }}
                          >
                            <CachedIcon />
                          </span>
                          &nbsp;{" "}
                          <span
                            style={{
                              color: "#1a70c5",
                              fontWeight: "600",
                              marginRight: "10px",
                            }}
                          >
                            REFRESH
                          </span>
                        </MenuItem>
                        <PopupState
                          variant="popover"
                          popupId="demo-popup-popover"
                        >
                          {(popupState: any) => (
                            <Box>
                              <MenuItem {...bindTrigger(popupState)}>
                                <div>
                                  <span>
                                    <BiFilterAlt />
                                  </span>
                                  &nbsp; Filter
                                </div>
                              </MenuItem>
                              <Menu {...bindMenu(popupState)}>
                                <Container>
                                  <Grid>
                                    <Typography variant="h5">
                                      <b>Filter</b>
                                    </Typography>
                                    <form
                                      onSubmit={handleSubmit(onSubmit)}
                                      className="form-filter"
                                    >
                                      <Grid container spacing={3}>
                                        <Grid
                                          className="filterdd"
                                          item
                                          xs={12}
                                          md={3}
                                        >
                                          <Stack spacing={1} sx={{}}>
                                            <InputLabel id="demo-select-small">
                                              Customer
                                            </InputLabel>
                                            <Autocomplete
                                              multiple
                                              id="tags-outlined"
                                              options={Invoicedata}
                                              getOptionLabel={(option: any) =>
                                                option?.name +
                                                ` (${option.sageParentId !== null
                                                  ? "Parent - " +
                                                  option.sageParentId
                                                  : "Child - " +
                                                  option.sageCustomerId
                                                })`
                                              }
                                              onChange={(
                                                event: any,
                                                value: any
                                              ) => {
                                                setUserId(value);
                                              }}
                                              // filterSelectedOptions={false}
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  variant="outlined"
                                                  placeholder="Categories"
                                                />
                                              )}
                                            />
                                          </Stack>
                                        </Grid>

                                        <Grid item xs={12} md={3}>
                                          <Stack spacing={1}>
                                            <InputLabel id="demo-select-small">
                                              Date Range
                                            </InputLabel>

                                            <DatePicker
                                              className="myDatePicker"
                                              selected={startDate}
                                              onChange={(date: any) =>
                                                setStartDate(date)
                                              }
                                              name="startDate"
                                              dateFormat="MM/dd/yyyy"
                                              placeholderText="Start Date"
                                            />
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                          <Stack spacing={1}>
                                            <InputLabel id="demo-select-small"></InputLabel>
                                            .
                                            <DatePicker
                                              className="myDatePicker"
                                              selected={endDate}
                                              onChange={(date: any) =>
                                                setEndDate(date)
                                              }
                                              name="startDate"
                                              dateFormat="MM/dd/yyyy"
                                              placeholderText="End Date"
                                              minDate={startDate}
                                            />
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                          <Stack spacing={1}>
                                            <InputLabel id="demo-select-small">
                                              Total
                                            </InputLabel>
                                            <OutlinedInput
                                              fullWidth
                                              id="Total"
                                              placeholder="Total"
                                              multiline
                                              {...register("Total")}
                                            />
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                          <Stack spacing={1}>
                                            <InputLabel htmlFor="status">
                                              Sort
                                            </InputLabel>
                                            <Select
                                              defaultValue="none"
                                              onChange={(e) =>
                                                setSort(e.target.value)
                                              }
                                              value={sort}
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              label="Status"
                                            >
                                              <MenuItem value="ASC">
                                                Date, Oldest First
                                              </MenuItem>
                                              <MenuItem value="DESC">
                                                Date, Newest First
                                              </MenuItem>
                                            </Select>
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                          <Stack spacing={1}>
                                            <InputLabel id="demo-select-small">
                                              Status
                                            </InputLabel>
                                            <Select
                                              onChange={(e) =>
                                                setStatus(e.target.value)
                                              }
                                              labelId="demo-select-small"
                                              id="demo-select-small"
                                              value={status}
                                              label="Status"
                                            >
                                              <MenuItem value="All">
                                                All
                                              </MenuItem>
                                              <MenuItem value="Pending">
                                                Pending
                                              </MenuItem>
                                              <MenuItem value="Paid">
                                                Paid
                                              </MenuItem>
                                              <MenuItem value="Draft">
                                                Draft
                                              </MenuItem>
                                            </Select>
                                          </Stack>
                                        </Grid>
                                        <br></br>
                                      </Grid>
                                      &nbsp; &nbsp; &nbsp;
                                      <Grid container spacing={3}>
                                        <Grid item xs={3} md={3}>
                                          <Stack spacing={1}>
                                            <Button
                                              onClick={popupState.close}
                                              variant="contained"
                                              type="submit"
                                            >
                                              Apply Filter
                                            </Button>
                                          </Stack>
                                        </Grid>
                                        <Grid item xs={3} md={3}>
                                          <Stack spacing={1}>
                                            <Button
                                              onClick={handleReset}
                                              variant="contained"
                                            >
                                              reset Filter
                                            </Button>
                                          </Stack>
                                        </Grid>
                                      </Grid>
                                    </form>
                                  </Grid>
                                </Container>
                              </Menu>
                            </Box>
                          )}
                        </PopupState>
                        {/* <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <Box>
                            <MenuItem {...bindTrigger(popupState)}>
                              Export
                              <KeyboardArrowDownIcon />
                            </MenuItem>
                          </Box>
                        )}
                      </PopupState>
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <Box>
                            <MenuItem
                              {...bindTrigger(popupState)}
                              style={{ border: "none," }}
                            >
                              Import
                              <KeyboardArrowDownIcon />
                            </MenuItem>
                          </Box>
                        )}
                      </PopupState> */}
                        <FormControl>
                          <OutlinedInput
                            onChange={(e) => searchItems(e)}
                            id="name"
                            type="search"
                            name="Search"
                            placeholder="Search by custid, name or invid..."
                            value={searchquery}
                            style={{ width: "300px" }}
                          />
                        </FormControl>
                      </Stack>
                    </Stack>
                    {loader ? (
                      <Loader />
                    ) : (
                      <div style={{ width: "100%", overflow: "auto" }}>
                        <Table
                          style={{
                            marginTop: "20px",
                            width: "100px",
                            display: "table-caption",
                          }}
                        >
                          <TableHead>
                            <TableRow>
                              {/* <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell> */}
                              <TableCell width={200}>CUSTOMER ID</TableCell>
                              <TableCell width={260}>CUSTOMER NAME</TableCell>
                              <TableCell width={300}>CUSTOMER EMAIL</TableCell>
                              <TableCell>INVOICE ID</TableCell>
                              <TableCell>INVOICE DATE</TableCell>
                              <TableCell>STATUS</TableCell>
                              <TableCell>
                                TOTAL{"(" + qatar_currency + ")"}
                              </TableCell>
                              <TableCell className="action-th">
                                ACTION
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {DATA.currentData() && DATA.currentData() ? (
                              DATA.currentData().map((item: any, key: any) => (
                                <TableRow
                                  hover
                                  tabIndex={-1}
                                  role="checkbox"
                                  className="boder-bottom"
                                  id={key}
                                >
                                  {/* <TableCell padding="checkbox">
                              <Checkbox />
                            </TableCell> */}
                                  <TableCell align="left">
                                    {item?.sageParentId || item?.sageCustomerId}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item?.name}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item?.email1}
                                  </TableCell>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    padding="none"
                                  >
                                    <Link
                                      href={`/admin/viewInvoice/${item.id}`}
                                    >
                                      <TableCell align="left">
                                        {item?.tuition_invoice_id ||
                                          item?.invoiceId}
                                      </TableCell>
                                    </Link>
                                  </TableCell>

                                  <TableCell align="left">
                                    {moment(
                                      item.createdDate,
                                      "DD/MM/YYYY"
                                    ).format("ll")}
                                  </TableCell>

                                  <TableCell align="left">
                                    {item.status === "Paid" ? (
                                      <span style={{ color: "green" }}>
                                        Paid
                                      </span>
                                    ) : item.status === "Pending" ? (
                                      <span style={{ color: "blue" }}>
                                        UnPaid
                                      </span>
                                    ) : item.status === "Draft" ? (
                                      <span style={{ color: "blue" }}>
                                        Draft
                                      </span>
                                    ) : (
                                      <span style={{ color: "red" }}>
                                        Partially Paid
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell align="left">
                                    {commmonfunctions.formatePrice(item.amount)}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="action-td action"
                                  >
                                    <div className="btn">
                                      {item?.status === "Paid" ? (
                                        <BootstrapTooltip title="Download Receipt">
                                          <Button className="idiv">
                                            <Image
                                              onClick={() =>
                                                DownloadReceipt(
                                                  item,
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
                                      {item?.status !== "Draft" ? (
                                        <BootstrapTooltip title="Download Invoice">
                                          <Button className="idiv">
                                            <Image
                                              onClick={() =>
                                                DownloadInvoice(
                                                  item,
                                                  "",
                                                  "admin_side"
                                                )
                                              }
                                              // onClick={() =>
                                              //   generateSimplePDF(item, "", "admin_side")
                                              // }
                                              src="/download.svg"
                                              alt="Invoice"
                                              width={35}
                                              height={35}
                                            />
                                          </Button>
                                        </BootstrapTooltip>
                                      ) : (
                                        ""
                                      )}

                                      {item?.status === "Paid" ||
                                        item?.status === "Pending" ||
                                        item?.status === "Partially paid" ? (
                                        <BootstrapTooltip title="Send Invoice Email">
                                          <Button
                                            className="idiv"
                                            disabled={false}
                                          >
                                            <Image
                                              onClick={() => handleShare(item)}
                                              src="/share.svg"
                                              alt="Send Email"
                                              width={35}
                                              height={35}
                                            />
                                          </Button>
                                        </BootstrapTooltip>
                                      ) : (
                                        // <Button className="idiv" disabled={true}>
                                        //   <Image
                                        //     src="/share.svg"
                                        //     alt="Send Email"
                                        //     title="Send Email"
                                        //     width={35}
                                        //     height={35}
                                        //   />
                                        // </Button>
                                        ""
                                      )}

                                      {item?.status === "Pending" ? (
                                        <Button
                                          variant="outlined"
                                          onClick={() => handleClickOpen(item)}
                                        >
                                          <b>Pay</b>
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {item?.status === "Partially paid" ? (
                                        <Button
                                          variant="outlined"
                                          onClick={() => handleClickOpen(item)}
                                        >
                                          <b>Pay</b>
                                        </Button>
                                      ) : (
                                        ""
                                      )}
                                      {(custpermit &&
                                        custpermit.canEdit === true) ||
                                        roleid === 1 ? (
                                        <>
                                          {item.status === "Draft" ? (
                                            <Button className="idiv">
                                              <Link
                                                href={`/admin/editInvoice/${item.id}`}
                                              >
                                                <Image
                                                  src="/edit.svg"
                                                  alt="Edit Invoice"
                                                  title="Edit Invoice"
                                                  width={35}
                                                  height={35}
                                                />
                                              </Link>
                                            </Button>
                                          ) : (
                                            ""
                                          )}
                                        </>
                                      ) : (
                                        ""
                                      )}

                                      {/* {(custpermit &&
                                  custpermit.canDelete === true) ||
                                roleid === 1 ? (
                                  <Button className="idiv">
                                    <IconButton
                                      className="action-delete"
                                      style={{ color: "#F95A37" }}
                                      onClick={() => handleOpen(item.id)}
                                    >
                                      <RiDeleteBin5Fill />
                                    </IconButton>
                                  </Button>
                                ) : (
                                  ""
                                )} */}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <h3>No Record found</h3>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    {user == "" ? (
                      <h3 style={{ marginLeft: "15px" }}>No Record found</h3>
                    ) : (
                      ""
                    )}
                    {user != "" ? (
                      <Stack
                        style={{ marginBottom: "10px", marginTop: "10px" }}
                        direction="row"
                        alignItems="right"
                        justifyContent="space-between"
                      >
                        <Pagination
                          count={count}
                          page={page}
                          color="primary"
                          onChange={handlePageChange}
                        />
                        <FormControl>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={5}
                            onChange={handlerowchange}
                            size="small"
                            style={{
                              width: "50px",
                              height: "40px",
                              marginRight: "15px",
                            }}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    ) : (
                      ""
                    )}
                  </TableContainer>
                </Card>
                <Modal
                  open={share}
                  onClose={handleEmailClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="ISBOX popup send">
                    <div className="Isend">
                      <div>
                        <h3 className="ehead">Send Document</h3>
                      </div>
                      <div className="Isend">
                        <h3 className="eshead">
                          How would you like to deliver this document to the
                          customer?
                        </h3>
                      </div>
                    </div>
                    <div className="sendEmailBox">
                      <div>
                        <Box>
                          <BsTelegram
                            onClick={handleSend}
                            className="telegram"
                          ></BsTelegram>
                        </Box>
                      </div>
                      <div>
                        <h3>Email</h3>
                      </div>
                    </div>
                  </Box>
                </Modal>
                <Modal
                  open={pop}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="popup">
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Delete Invoice
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Are you sure want to delete Invoice from the records.
                      <div className="kk">
                        <Button
                          className="popup"
                          onClick={handledelete}
                          variant="text"
                        >
                          ok
                        </Button>
                        <Button
                          onClick={handleCancel}
                          className="ok"
                          variant="text"
                        >
                          cancel
                        </Button>
                      </div>
                    </Typography>
                  </Box>
                </Modal>
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
                      Recieve Payment
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
                                  disabled
                                  type="text"
                                  id="name"
                                  placeholder="Customer Name..."
                                  fullWidth
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
                                  onChange={(date: any) =>
                                    handleReceiveDate(date)
                                  }
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
                                  Payment Method{" "}
                                  <span className="err_str">*</span>
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
                                  <MenuItem value="Credit Card">
                                    Credit Card
                                  </MenuItem>

                                  <MenuItem value="Cash">Cash</MenuItem>
                                </Select>
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              {paymentMethod === "Cash" ? (
                                ""
                              ) : paymentMethod === "Check" ? (
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
                              ) : paymentMethod === "Record transfer" ? (
                                <Stack spacing={1}>
                                  <InputLabel htmlFor="name">
                                    Reference no.{" "}
                                    <span className="err_str">*</span>
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
                              ) : paymentMethod === "Credit Card" ? (
                                <Stack spacing={1}>
                                  <InputLabel htmlFor="name">
                                    Authorization code{" "}
                                    <span className="err_str">*</span>
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
                              ) : (
                                ""
                              )}
                            </Grid>
                          </Grid>
                        </Stack>
                      </Grid>

                      <Stack style={{ marginTop: "15px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2.4}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="name">Txn amount</InputLabel>
                              <OutlinedInput
                                disabled
                                defaultValue={
                                  commmonfunctions.formatePrice(
                                    recievedPay.amount
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
                          <Grid item xs={12} md={2.4}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="name">
                                Credits available{" "}
                              </InputLabel>
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
                                type="number"
                                onChange={(e) =>
                                  handleReceivePaymentAccordingToUs(
                                    e,
                                    "payment"
                                  )
                                }
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
                                {commmonfunctions.formatePrice(totalPay) +
                                  " (" +
                                  qatar_currency +
                                  ")"}{" "}
                              </p>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Stack>
                      {/* </Grid> */}
                      {/* <div className="total-amount">
                    <div className="hh">Total Amount:</div>
                    <div>${recievedPay.amount}.00</div>
                  </div> */}
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant="contained"
                        autoFocus
                        disabled={
                          creditPopupError || applyPaymentPopupError
                            ? true
                            : false
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
                <ToastContainer />
              </div>

              <MainFooter />
            </Box>
          </Box>
        </>
      ) : (
        ""
      )}
      {newPayOpen ? (
        <PaymentPopup
          open={newPayOpen}
          closeDialog={closePoP}
          custDt={custDt}
          invoiceStatus={invoiceStatus}
        />
      ) : (
        ""
      )}
    </>
  );
}
