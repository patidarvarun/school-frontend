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
import { Grid, InputLabel, Stack } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MiniDrawer from "../../../sidebar";
import axios from "axios";
import Select from "@mui/material/Select";
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
import Script from "next/script";
import getwayService from "../../../../services/gatewayService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, SubmitHandler } from "react-hook-form";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/router";
import ReceiptPDFService from "../../../../commonFunctions/receiptInvoicepdf";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import { api_url, auth_token, qatar_currency } from "../../../../helper/config";
import MainFooter from "../../../commoncmp/mainfooter";
import PDFService from "../../../../commonFunctions/invoicepdf";
import { AddLogs } from "../../../../helper/activityLogs";
import RequestFormCmp from "../../salesinvoices/requestFormCmp";
import jwt_decode from "jwt-decode";
import Loader from "../../../commoncmp/myload";
import UserService from "../../../../commonFunctions/servives";
import FilterListIcon from "@mui/icons-material/FilterList";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import CachedIcon from "@mui/icons-material/Cached";

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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
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
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export interface FormValues {
  status: string;
  startDate: String;
  endDate: String;
  total: String;
  sort: String;
  invoiceId: String;
}

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

export default function UserInvoices() {
  const [getInvoices, setgetInvoices] = useState<FormValues | any>([]);
  const [Invoicedata, setInvoice] = useState<FormValues | any>([]);
  const [searchdata, setsearchdata] = useState([]);
  const [searchquery, setsearchquery] = useState("");
  const [custid, setcustid] = useState<any>([]);
  const [custname, setcustname] = useState<any>("");
  const [sort, setSort] = useState<FormValues | any>("ASC");
  const [status, setStatus] = useState<FormValues | any>("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [note, setNote] = useState<FormValues | any>([]);
  const [value, setValue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerTotalCreditNoteBalance, setCustomerTotalCreditNoteBalance] =
    useState(0);
  const [customerCreditNoteRequestId, setCustomerCreditNoteRequestId] =
    useState<any>(null);
  const [applyCreditNoteAmount, setApplyCreditNoteAmount] = useState<any>(0);
  const [finalAmountToPay, setFinalAmountToPay] = useState<any>(0);
  const [orderId, setorderId] = useState("");
  const [salesInvoiceId, setSalesInvoiceId] = useState<any>("");
  const [InvoiceAmount, setInvoiceAmount] = useState(0);
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerID, setCustomerId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const [customerCreditNoteRemaingAmount, setCustomerCreditNoteRemaingAmount] =
    useState(0);
  const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const router = useRouter();
  const [dollerOpen, setDollerOpen] = useState(false);
  const [recievedPay, setRecieved] = useState<FormValues | any>([]);
  const [sageCustomerId, setSageCustomerID] = useState("");
  const [CreditReqFormOpen, setCreditReqFormOpen] = useState(false);
  const [reqDet, setreqDet] = useState<any>([]);
  const [itemsId, setritemsId] = useState<any>("");
  const [roleid, setroleid] = React.useState<any>("");
  const [myload, setmyload] = React.useState(true);
  const [creditToApply, setCreditToApply] = useState<any>("");
  const [creditPopupError, setCreditPopupError] = useState<any>("");
  const [paymentToApply, setPaymentToApply] = useState<any>("");
  const [applyPaymentPopupError, setApplyPaymentPopupError] = useState<any>("");
  const [dueInvoiceAmount, setDueInvoiceAmount] = useState<any>(0);
  const [loader, setLoadar] = React.useState(true);
  var Checkout: any;
  var creditNoteNewId: any;

  setTimeout(() => {
    setmyload(false);
  }, 2000);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  // verify user login and previlegs
  useEffect(() => {
    let login_token: any;
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
      const idds = res?.id;
      getChilds(res?.id, idds);
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
      }
    });
    login_token = localStorage.getItem("QIS_loginToken");
    if (login_token === undefined || login_token === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      setroleid(res.roleId);
      if (res.roleId !== 2) {
        router.push("/userprofile");
      }
    });
    getDetailsOfCustomer();
  }, []);

  useEffect(() => {
    let search = router.query;
    let amexOrderId = search.orderid;
    let paymentMethod = search.paymentMethod;
    let creditRequestId = search.creditNoteId;
    let customerid = search.customerID;
    let remaingAmount = search.remaingAmount;
    let DBInvoiceid = search.invoiceiddb;
    if (paymentMethod && amexOrderId) {
      console.log("order created");
      buyActivity(amexOrderId, paymentMethod, creditRequestId, DBInvoiceid);
    }
  }, [router.query]);

  //get customer details
  const getDetailsOfCustomer = async () => {
    let login_token: any;
    login_token = localStorage.getItem("QIS_loginToken");
    const decoded: any = jwt_decode(login_token);
    let response = await axios.get(`${api_url}/getuserdetails/${decoded.id}`, {
      headers: {
        Authorization: auth_token,
      },
    });
    const userData = response?.data?.data[0];
    setSageCustomerID(userData.sageParentId || userData.sageCustomerId);
  };

  //get childs
  const getChilds = async (id: any, cuUId: any) => {
    UserService.getChilds(id).then((response: any[]) => {
      //get child ids
      let ids: any[] = [];
      response.map((dt: any) => {
        ids.push(dt.id);
      });
      const invids = ids.concat(cuUId);
      setcustid(invids);
      Invoices(invids);
    });
  };

  //get invoices by user id
  const Invoices = async (id: any) => {
    setLoadar(true);
    await axios({
      method: "POST",
      url: `${api_url}/getInvoicebyUser/${id}`,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        setgetInvoices(res?.data.filter((dt: any) => dt.isRequested !== 2));
        setInvoice(res?.data.filter((dt: any) => dt.isRequested !== 2));
        setsearchdata(res?.data.filter((dt: any) => dt.isRequested !== 2));
        setLoadar(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadar(false);
      });
  };

  // pagination;
  const [row_per_page, set_row_per_page] = useState(5);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  let [page, setPage] = React.useState(1);
  const PER_PAGE = row_per_page;
  const count = Math.ceil(getInvoices?.length / PER_PAGE);
  const DATA = usePagination(getInvoices, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  //tab functionality
  //count lrngth
  const pending = Invoicedata?.filter((a: any) => a.status == "Pending");
  const partiallPaid = Invoicedata?.filter(
    (a: any) => a.status == "Partially paid"
  );
  const paid = Invoicedata?.filter((a: any) => a.status == "Paid");

  const handleAll = () => {
    setgetInvoices(searchdata);
  };
  const handlePaid = () => {
    const paids = Invoicedata.filter((a: any) => a.status == "Paid");
    setgetInvoices(paids);
  };
  const handlePending = () => {
    const pendings = Invoicedata.filter((a: any) => a.status == "Pending");
    setgetInvoices(pendings);
  };
  const handlePartiallyPaid = () => {
    const partiallyPaid = Invoicedata.filter(
      (a: any) => a.status == "Partially paid"
    );
    setgetInvoices(partiallyPaid);
  };

  // searching functionality
  const searchItems = (e: any) => {
    setsearchquery(e.target.value);
    if (e.target.value === "") {
      setgetInvoices(searchdata);
    } else {
      const filterres = getInvoices.filter((item: any) => {
        return (
          item.status?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item.invoiceId
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.tuition_invoice_id
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          `${item.amount}`?.toLowerCase().includes(e.target.value.toLowerCase())
        );
      });
      const dtd = filterres;
      setgetInvoices(dtd);
    }
  };

  //generate pdf
  // const generateSimplePDF = async (item: any, title: string, isSide: string) => {
  //   PDFService.generateSimplePDF(item, title, isSide);
  // };
  const DownloadInvoice = async (item: any, title: string, isSide: string) => {
    const invoiceid = item?.tuition_invoice_id || item?.invoiceId;
    const reqData = {
      id: item?.invid,
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
  // const ReceiptPdf = async (item: any, receipt_title: string, isSide: string) => {
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

  // filter functionality
  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    setLoadar(true);
    let sdate = moment(startDate).format("DD/MM/YYYY");
    let edate = moment(endDate).format("DD/MM/YYYY");
    const reqData = {
      status: status,
      startDate: sdate === "Invalid date" ? "" : sdate,
      endDate: edate === "Invalid date" ? "" : edate,
      order: sort,
      amount: data.total.replace("$", ""),
      invoiceId: data.invoiceId,
    };
    await axios({
      method: "POST",
      url: `${api_url}/getInvoicebyUser/${custid}`,
      data: reqData,
    })
      .then((res) => {
        setgetInvoices(res?.data);
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
    setStartDate(null);
    setEndDate(null);
    setInvoiceId("");
    Invoices(custid);
  };

  const buyActivity = async (
    amexOrderId: any,
    paymentMethod: any,
    creditNoteId: any,
    DBInvoiceid: any
  ) => {
    var generatedTransactionId = "";
    const data = { orderId: amexOrderId };
    var apiRequest = data;
    var requestUrl = await getwayService.getRequestUrl("REST", apiRequest);
    await getwayService.retriveOrder(
      requestUrl,
      async function (orderresult: any) {
        console.log("order result =>", orderresult);
        if (orderresult.status === 200) {
          const amextransactionData = orderresult.data;
          const transactionData = {
            idForPayment: amexOrderId,
            totalAmount: amextransactionData?.transaction[0].transaction.amount,
            paidAmount: amextransactionData?.transaction[0].transaction.amount,
            paymentMethod: paymentMethod,
            amexorderId: amexOrderId,

            transactionId: amextransactionData?.transaction[0].transaction.id,
            creditNotesId: creditNoteId,
          };
          var ARRefrenceNumber = "";
          await getwayService.transactionDataSaveInDB(
            transactionData,
            async function (result: any) {
              generatedTransactionId = result?.insetTransatction?.insertId;
              ARRefrenceNumber = await getwayService.generateRefrenceNumber(
                generatedTransactionId
              );
              console.log("ARRefrenceNumber =>", ARRefrenceNumber);
              await getwayService.getARInoviceRecordNumber(
                amexOrderId,
                async function (ARRecordNumberResult: any) {
                  console.log(
                    "ARRecordNumberResult['RECORDNO'] =>",
                    ARRecordNumberResult["RECORDNO"]
                  );

                  const data = {
                    customerId: sageCustomerId,
                    amount:
                      amextransactionData?.transaction[0].transaction.amount,
                    ARpaymentMethod: "EFT",
                    referenceNumber: ARRefrenceNumber,
                    ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                  };
                  console.log("data for apply pay =>", data);
                  await getwayService.createAndApplyPaymentARInvoice(
                    data,
                    async function (result: any) {
                      await updateInvoiceAfterPay(DBInvoiceid);

                      setTimeout(() => {
                        document.location.href = `${process.env.NEXT_PUBLIC_AMEX_CUSTOMER_PAY_INVOICE_CANCEL_URL}`;
                      }, 3000);
                    }
                  );
                }
              );
            }
          );
        }
      }
    );
  };

  //invoice payment
  const handleClickOpen = (item: any) => {
    console.log(item, "itemmmmm", sageCustomerId);
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
    setorderId(item?.invoiceId ? item.invoiceId : item.tuition_invoice_id);
    setSalesInvoiceId(item?.invoiceId);
    setInvoiceAmount(item.amount);
    setInvoiceStatus(item.status);
    setFinalAmountToPay(
      item.amount_due === null || item.amount_due === 0
        ? item.amount
        : item.amount_due
    );
    setDueInvoiceAmount(item.amount_due);
    setCustomerId(item.customerId);
    getCustomerNotes(userUniqueId);
    setritemsId(item.itemId);
    setSageCustomerID(
      sageCustomerId !== null
        ? sageCustomerId
        : item.sageParentId || item.sageCustomerId
    );
  };

  //Credit Request
  const handleReqkOpen = (item: any) => {
    console.log(item);
    setreqDet(item);
    setCreditReqFormOpen(true);
  };

  const closePoP = (data: any) => {
    setCreditReqFormOpen(false);
    Invoices(custid);
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
      console.log("CreditRequestId =>", res);
      setCustomerCreditNoteRequestId(res?.CreditRequestId_FromSageCreditNotes);
      setCustomerTotalCreditNoteBalance(res?.creditBal_FromSageCreditNotes);
      setApplyCreditNoteAmount(res?.creditBal_FromSageCreditNotes);
    } catch (error: any) {
      console.log("error", error.message);
    }
  };
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
  let totalPay =
    (paymentToApply === "" || paymentToApply === 0) && creditToApply > 0
      ? 0
      : paymentToApply === "" || paymentToApply === 0
      ? dueInvoiceAmount
      : paymentToApply;

  
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
          creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
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
    console.log("totalPay", totalPay);
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

        const rendomTransactionId = keyGen(5);
        let reqData = {
          totalAmount: totalPay,
          paidAmount: totalPay,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: orderId,
          paymentMethod: "Cash",
          idForPayment: orderId,
          creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
        };
        console.log("@@@@@@@@@@", reqData);
        await transactionSaveInDB(reqData);
        await updateInvoiceAfterPay(id);
        handleCloses();
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }
    console.log("dueInvoiceAmountdueInvoiceAmount", dueInvoiceAmount);
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
      localStorage.setItem("invoiceSales", salesInvoiceId);

      const rendomTransactionId = keyGen(10);

      // await getwayService.getTransactionData(id, async function (result: any) {
      //   console.log("@@@@@@@@@@@result", result);
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
          creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
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
      localStorage.setItem("invoiceSales", salesInvoiceId);

      const rendomTransactionId = keyGen(10);

      // await getwayService.getTransactionData(id, async function (result: any) {
      // console.log("@@@@@@@@@@@result", result);
      // return false;
      // if (result && result?.transactionId !== "") {
      //   await axios({
      //     method: "DELETE",
      //     url: `${api_url}/deleteTransaction/${result?.id}`,
      //     headers: {
      //       Authorization: auth_token,
      //     },
      //   })
      //     .then(async (data) => {
      //       console.log("@@@@@deleteData");
      //       let reqData = {
      //         totalAmount: totalPay,
      //         paidAmount: totalPay,
      //         transactionId: `${rendomTransactionId}`,
      //         amexorderId: orderId,
      //         paymentMethod: "Credit Card",
      //         idForPayment: orderId,
      //         creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
      //         card_type: "QPay",
      //       };
      //       await getwayService.transactionDataSaveInDB(
      //         reqData,
      //         async function (transresult: any) {
      //           let data = {
      //             amount: totalPay,
      //             PUN: transresult?.transactionId,
      //           };
      //           console.log("transresult", data);
      //           await getwayService.redirectQPayPayment(data);
      //         }
      //       );
      //     })
      //     .catch((error) => {
      //       console.error("Error:", error);
      //     });
      // } else {
      let reqData = {
        totalAmount: totalPay,
        paidAmount: totalPay,
        transactionId: `${rendomTransactionId}`,
        amexorderId: orderId,
        paymentMethod: "Credit Card",
        idForPayment: orderId,
        creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
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
      // }
      // });
      // }
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
          creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
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
          AddLogs(userUniqueId, `Amount debit by id - #CUS-${sageCustomerId}`);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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

  const updateInvoiceAfterPay = async (invoiceId: any) => {
    try {
      let getAmount = totalPay === 0 ? 0 : totalPay;
      let totalBothAmount = parseInt(getAmount + creditToApply);

      let dueAmount = dueInvoiceAmount === 0 ? InvoiceAmount : dueInvoiceAmount;
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
          setNote("");
          AddLogs(userUniqueId, `Invoice created id - #${reqDet?.invoiceId}`);
          toast.success("Payment Successfully !");
          setTimeout(() => {
            handleCloses();
            // Invoices(custid);
            setValue(0);
            router.push("/user/invoices/invoiceslist/ci");
          }, 3000);
        })
        .catch((err) => {});
    } catch (error: any) {
      console.log("error => ", error.message);
    }
  };

  const handleCloses = () => {
    setDollerOpen(false);
    setApplyPaymentPopupError("");
    setCreditPopupError("");
  };

  const reqDetails = {
    userId: reqDet && reqDet?.customerId,
    sageinvoiceId: (reqDet && reqDet?.tuition_invoice_id) || reqDet?.invoiceId,
    invoiceId: reqDet && reqDet?.invid,
    status: 0,
    amount: reqDet && reqDet?.amount,
    createdBy: userUniqueId,
  };

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

  //refresh fuctionality
  const Refresh = () => {
    Invoices(custid);
  };

  //sort functionality
  const DataSort = () => {
    setgetInvoices([...getInvoices].reverse());
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
      ) : (
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
                </Stack>
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
                          label={`Partially Paid  (${partiallPaid.length})`}
                          {...a11yProps(2)}
                          onClick={handlePartiallyPaid}
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
                                            Invoice Id
                                          </InputLabel>
                                          <OutlinedInput
                                            fullWidth
                                            id="Total"
                                            placeholder="Invoice id"
                                            multiline
                                            {...register("invoiceId")}
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
                                          <InputLabel
                                            className="dotremove"
                                            id="demo-select-small"
                                          ></InputLabel>
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
                                            size="small"
                                            placeholder="Total"
                                            multiline
                                            {...register("total")}
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
                                            <MenuItem value="All">All</MenuItem>
                                            <MenuItem value="Pending">
                                              Pending
                                            </MenuItem>
                                            <MenuItem value="Paid">
                                              Paid
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
                                            type="submit"
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
                      </PopupState> */}
                      <FormControl>
                        <OutlinedInput
                          onChange={(e) => searchItems(e)}
                          id="name"
                          type="search"
                          name="name"
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
                            <TableCell width={250}>CUSOMER ID</TableCell>
                            <TableCell width={250}>User Name</TableCell>
                            <TableCell width={250}>INVOICE ID</TableCell>
                            <TableCell width={350}>INVOICE DATE</TableCell>
                            <TableCell width={350}>INVOICE DUE DATE</TableCell>
                            <TableCell width={250}>STATUS</TableCell>
                            <TableCell width={250}>
                              AMOUNT{" (" + qatar_currency + ")"}
                            </TableCell>
                            <TableCell width={250}>CREDIT REQUEST</TableCell>
                            <TableCell width={350} className="action-th">
                              ACTION
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {DATA.currentData() && DATA.currentData() ? (
                            DATA.currentData().map((item: any) => (
                              <TableRow
                                hover
                                tabIndex={-1}
                                role="checkbox"
                                className="boder-bottom"
                              >
                                {/* <TableCell padding="checkbox">
                                <Checkbox />
                              </TableCell> */}

                                <TableCell
                                  component="th"
                                  scope="row"
                                  padding="none"
                                >
                                  {item?.sageCustomerId || item?.sageParentId}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  padding="none"
                                >
                                  {item?.name}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  padding="none"
                                >
                                  <Link
                                    href={`/user/invoices/viewinvoice/${item.invid}`}
                                  >
                                    <TableCell align="left">
                                      {item?.invoiceId ||
                                        item?.tuition_invoice_id}
                                    </TableCell>
                                  </Link>
                                </TableCell>
                                <TableCell align="left">
                                  <b style={{ whiteSpace: "nowrap" }}>
                                    {moment(
                                      item.createdDate,
                                      "DD/MM/YYYY"
                                    ).format("ll")}
                                  </b>
                                </TableCell>
                                <TableCell align="left">
                                  {moment(
                                    item.invoiceDate,
                                    "DD/MM/YYYY"
                                  ).format("ll")}
                                </TableCell>
                                <TableCell align="left">
                                  {item?.status === "Pending" ? (
                                    <span style={{ color: "blue" }}>
                                      UnPaid
                                    </span>
                                  ) : item?.status === "Paid" ? (
                                    <span
                                      style={{
                                        color: "#02C509",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Paid
                                    </span>
                                  ) : item?.status === "Partially paid" ? (
                                    <span style={{ color: "red" }}>
                                      Partially Paid
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  <b>
                                    {item.amount}.00{" "}
                                    {" (" + qatar_currency + ")"}
                                  </b>
                                </TableCell>
                                <TableCell>
                                  {item.status !== "draft" ? (
                                    <div className="btn credit-request">
                                      {item?.amount !== 0 ? (
                                        <div className="btn">
                                          {item.isRequested === 1 ? (
                                            <Button
                                              size="small"
                                              variant="outlined"
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
                                              variant="outlined"
                                              onClick={() =>
                                                handleReqkOpen(item)
                                              }
                                            >
                                              <b>Credit Request</b>
                                            </Button>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="btn">
                                          {
                                            <Button
                                              size="small"
                                              variant="outlined"
                                              sx={{ width: 135 }}
                                              disabled
                                              style={{
                                                backgroundColor: "#D1D2D2",
                                                color: "whitesmoke",
                                              }}
                                            >
                                              <b>Credit Request</b>
                                            </Button>
                                          }
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className="action-td action"
                                >
                                  <div className="btn">
                                    {item?.status === "Paid" ? (
                                      <BootstrapTooltip title="Download Invoice Receipt">
                                        <Button className="idiv">
                                          <Image
                                            onClick={() =>
                                              DownloadReceipt(
                                                item,
                                                "",
                                                "customer-side"
                                              )
                                            }
                                            src="/file-text.png"
                                            alt="Invoice Receipt"
                                            width={35}
                                            height={35}
                                          />
                                        </Button>
                                      </BootstrapTooltip>
                                    ) : (
                                      ""
                                    )}
                                    &nbsp;
                                    <BootstrapTooltip title="Download Invoice">
                                      <Button className="idiv">
                                        <Image
                                          onClick={() =>
                                            DownloadInvoice(
                                              item,
                                              "",
                                              "customer-side"
                                            )
                                          }
                                          src="/download-y.svg"
                                          alt="Invoice"
                                          title="Invoice"
                                          width={35}
                                          height={35}
                                        />
                                      </Button>
                                    </BootstrapTooltip>
                                    &nbsp;
                                    <Button className="idiv">
                                      <Link
                                        href={`/user/invoices/viewinvoice/${item.invid}`}
                                      >
                                        <Image
                                          src="/view.png"
                                          alt="View Invoice"
                                          width={35}
                                          height={35}
                                        />
                                      </Link>
                                    </Button>
                                    &nbsp;
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
                  {getInvoices == "" ? <h3>No Record found</h3> : ""}
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
                        style={{ width: "50px", height: "40px" }}
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </TableContainer>
              </Card>
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
                      <Stack style={{ marginTop: "15px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="name">
                                Customer Name
                              </InputLabel>
                              <OutlinedInput
                                type="text"
                                id="name"
                                fullWidth
                                size="small"
                                value={recievedPay.name}
                                disabled
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Stack spacing={1}>
                              <InputLabel htmlFor="name">
                                Received On
                              </InputLabel>
                              <OutlinedInput
                                defaultValue={moment(
                                  recievedPay.invoiceDate,
                                  "DD/MM/YYYY"
                                ).format("ll")}
                                type="text"
                                id="name"
                                disabled
                                placeholder="Date..."
                                fullWidth
                                size="small"
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
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
                              >
                                <MenuItem value="All"></MenuItem>
                                <MenuItem value="CBQ">Credit Card</MenuItem>
                                <MenuItem value="QPay">Debit Card</MenuItem>
                                <MenuItem value="Amex">Amex</MenuItem>
                                {/* <MenuItem value="Cash">Cash</MenuItem> */}
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
                                value={
                                  commmonfunctions.formatePrice(
                                    applyCreditNoteAmount
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
                      onClick={() => handleCreate(recievedPay.invid)}
                      disabled={creditPopupError || applyPaymentPopupError}
                    >
                      Pay
                    </Button>
                  </DialogActions>
                </BootstrapDialog>
              </div>
              <ToastContainer />
            </div>
            <MainFooter />
          </Box>
        </Box>
      )}
      {CreditReqFormOpen ? (
        <RequestFormCmp
          open={RequestFormCmp}
          reqDet={reqDetails}
          closeDialog={closePoP}
        />
      ) : (
        ""
      )}
    </>
  );
}
