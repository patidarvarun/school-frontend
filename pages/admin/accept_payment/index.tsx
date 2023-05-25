import {
  Card,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  FormControl,
  TextField,
  Menu,
  MenuItem,
  Grid,
  InputLabel,
  Container,
  Select,
  IconButton,
  OutlinedInput,
  CircularProgress,
  Pagination,
  Tabs,
  Tab,
  Modal,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import MiniDrawer from "../../sidebar";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { CSVDownload } from "react-csv";
import Loader from "../../commoncmp/myload";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import MainFooter from "../../commoncmp/mainfooter";
import UserService from "../../../commonFunctions/servives";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import moment from "moment";
import { api_url, auth_token, qatar_currency } from "../../../helper/config";

import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import GlobalStyles from "@mui/material/GlobalStyles";
import { RiDeleteBin5Fill } from "react-icons/ri";
import getwayService from "../../../services/gatewayService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Script from "next/script";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

//pagination function
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

//filter form values
type FormValues = {
  amount: Number;
  check: Number;
  customerType: Number;
  phoneNumber: Number;
  contactName: String;
  sorting: Number;
  ParentId: String;
  status: Number;
  res: String;
  startDate: String;
  endDate: String;
  receiveDate: String;
  paymentDate: String;
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
  invoice_array: Array<string>;
};

const style: any = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const styleinvoice: any = {
  bgcolor: "background.paper",
  color: "red",
  boxShadow: 24,
  p: 4,
};
const stylepTag = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

export default function AcceptPayment() {
  const [users, setUsers] = useState<any>([]);
  const [invoiceData, setinvoiceData] = useState<any>([]);
  const [UserId, setUserId] = useState<any>();
  const [custtype, setcusttype] = useState<any>([]);
  const [tabFilterData, settabFilterData] = useState<any>([]);
  const [All, setAll] = useState(0);
  const [active, setactive] = useState(0);
  const [inActive, setinActive] = useState(0);
  const [searchquery, setsearchquery] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [deleteConfirmBoxOpen, setdeleteConfirmBoxOpen] = React.useState(false);
  const [newCustOpen, setnewCustOpen] = React.useState(false);
  const [editCustOpen, seteditCustOpen] = React.useState(false);
  const [editid, seteditid] = useState<any>(0);
  const [value, setValue] = React.useState(0);
  const [custType, setCustType] = useState<any>(0);
  const [custStatus, setcustStatus] = useState<any>(2);
  const [sort, setsort] = useState<any>(0);
  const [conctName, setconctName] = useState<any>("");
  const [phoneNum, setphoneNum] = useState<any>("");
  const [pId, setpId] = useState<any>(0);
  const [inputValue, setInputValue] = useState<FormValues | any>([]);
  const [parentId, setparentId] = useState<any>("");
  const [checked, setChecked] = React.useState(false);
  const [isChecked, setIsChecked] = useState<any>(false);
  const [OpenCSV, setOpenCSV] = React.useState(false);
  const [custpermit, setcustpermit] = useState<any>([]);
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const [roleid, setroleid] = useState(0);
  const [share, setShare] = useState(false);
  const [spinner, setshowspinner] = React.useState(false);
  const router = useRouter();
  const [applyCreditNoteAmount, setApplyCreditNoteAmount] = useState<any>(0);
  const [myloadar, setmyloadar] = React.useState(true);
  const [loader, setLoadar] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | false>("");
  const [expanded1, setExpanded1] = React.useState<string | false>("panel2");
  const [expanded2, setExpanded2] = React.useState<string | false>("panel3");
  const [paymentMethod, setPaymentMethod] = useState<any>("");
  const [error, setError] = useState<FormValues | any>([]);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("lg");
  const [customerTotalCreditNoteBalance, setCustomerTotalCreditNoteBalance] =
    useState(0);
  const [arr, setarr] = React.useState<any>([]);
  var Checkout: any;

  const [userinfo, setUserInfo] = useState<any>({
    id: [],
  });
  const [accordianLoader, setAccordianLoadar] = React.useState(false);
  const [receiveDate, setReceiveDate] = useState<any>(new Date());
  const [paymentDate, setPaymentDate] = useState<any>(new Date());
  const [checkedItems, setCheckedItems] = useState<any>({});
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [newInvoiceData, setNewInvoiceData] = useState<any>([]);
  const [receivedAmount, setReceivedAmount] = useState<any>(0);

  // const [cardType, setCardType] = useState<any>("Visa");
  const [handlePaymentValue, setHandlePaymentValue] = useState<any>("");
  const [openThank, setOpenThank] = useState(false);
  const [creditPopupError, setCreditPopupError] = useState<any>("");
  const [topPaymentAmount, setTopPaymentAmount] = useState<any>();
  const handleThanksOpen = () => setOpenThank(true);
  const handleThanksClose = () => setOpenThank(false);
  var creditNoteNewId: any;
  const outlinedRef: any = useRef(null);
  const inputRefs = useRef<any>([]);
  const inputRefsForPayment = useRef<any>([]);

  const autoC = useRef<any>(null);
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const handlePanelChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded1: boolean) => {
      setExpanded1(newExpanded1 ? panel : false);
    };
  const handlePanelChange2 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded2: boolean) => {
      setExpanded2(newExpanded2 ? panel : false);
    };
  setTimeout(() => {
    setmyloadar(false);
  }, 700);

  // verify user login and previlegs
  let logintoken: any;
  React.useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
        router.push("/");
      }
    });
    logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId == 1) {
        setroleid(res.roleId);
        //router.push("/userprofile");
      } else if (res.roleId > 1 && res.roleId !== 2) {
        commmonfunctions.ManageAcceptPayment().then((res) => {
          if (!res) {
            router.push("/userprofile");
          } else {
            setcustpermit(res);
          }
        });
      } else {
        router.push("/userprofile");
      }
    });
    getUser();
    UserService.getType().then((response) => setcusttype(response));
  }, []);

  const getUser = () => {
    UserService.getUser().then((res: any) => {
      setUsers(res?.users.filter((dt: any) => dt.status === 1));
    });
  };

  const DownloadReceipt = async (item: any, title: string, isSide: string) => {
    const reqData = {
      RCTNumber: item?.refrenceId,
      isSide: isSide,
      transactionId: item?.transactionId,
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
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancled = () => {
    setNewInvoiceData([]);
    setinvoiceData([]);
    setSelectedRows([]);
    setReceivedAmount("");
    setCreditPopupError("");
    setIsChecked(!isChecked);
    setOpen(false);
    setUserId("");
    setCustomerTotalCreditNoteBalance(0);
    setInputValue([]);
    setshowspinner(false);
    setPaymentMethod("");
    setTopPaymentAmount("");
    let ele = autoC.current.getElementsByClassName(
      "MuiAutocomplete-clearIndicator"
    )[0];
    if (ele) ele.click();
  };

  const handleChangeCustomer = (value: any) => {
    setNewInvoiceData([]);
    setinvoiceData([]);
    setUserId(value);
    setIsChecked(!isChecked);
    let getCusId = value?.parentId === 0 ? value?.id : value?.parentId;

    if (getCusId === undefined) {
      console.log("error");
    } else {
      getCustomerNotes(getCusId);
    }
    if (value) {
      setError("");
    }
  };

  // pagination;
  const [row_per_page, set_row_per_page] = useState(5);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  let [page, setPage] = React.useState(1);
  const PER_PAGE = row_per_page;
  const count = Math.ceil(invoiceData.length / PER_PAGE);
  const DATA = usePagination(invoiceData, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("@@@@@@@@@@", data);
  };

  const deleteTempId = async (id: any) => {
    try {
      await axios({
        method: "DELETE",
        url: `${api_url}/deleteTempTransaction/${id}`,
      }).then(async (data) => {
        handleThanksOpen();
        setTimeout(() => {
          setshowspinner(false);
          handleThanksClose();
          toast.success("Payment Successfully !");
          handleCancled();
        }, 5000);
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  let insertedId: any;
  let receiveDate1 = moment(receiveDate).format("MM/DD/YYYY");
  let paymentDate1 = moment(paymentDate).format("MM/DD/YYYY");

  const handleSubmitt = async () => {
    const Checkout: any = (window as any).Checkout;
    const rendomTransactionId = keyGen(5);
    if (paymentMethod === "") {
      toast.error("Please select payment method !");
    } else {
      setshowspinner(true);
      if (paymentMethod === "Cash") {
        const reqData = {
          transaction_id: `Cash-${rendomTransactionId}`,
          invoice_array: newInvoiceData,
        };
        await getwayService.saveTempTransaction(
          reqData,
          async function (result: any) {
            insertedId = result?.data?.data?.insertId;
          }
        );

        let getResponse = await axios.get(
          `${api_url}/getTempTransaction/${insertedId}`
        );
        let loopdata = getResponse.data.data.invoice_array;

        for (let i = 0; i < loopdata.length; i++) {
          const sageintacctInvoiceid =
            loopdata[i].invoiceId || loopdata[i].tuition_invoice_id;
          const customeridd = loopdata[i].sageCustomerId;
          const dbinvoiceid = loopdata[i].id;
          const creditAmount = loopdata[i].creditsToApply;
          const dbcustomerId = loopdata[i].customerId;
          const unPaidAmount = loopdata[i].outstandingAmount;
          const due_amount = loopdata[i].amount_due;
          const TotalInvoiceprice = loopdata[i].amount;
          const paymentApplyAmount = loopdata[i].paymentAmount;

          const dataforRemaingAmount: any = {
            customerId: dbcustomerId,
            sageCustomerId: parseInt(customeridd),
            invoiceId: dbinvoiceid,
            sageinvoiceId: sageintacctInvoiceid,
            Amount: creditAmount,
            amountMode: 0,
          };

          if (creditAmount === null) {
            console.log("#########");
          } else {
            await insertRemainingNotesAmount(dataforRemaingAmount);
          }
          let reqData = {
            totalAmount:
              loopdata[i].paymentAmount === null &&
                loopdata[i].creditsToApply === null
                ? loopdata[i].amount
                : loopdata[i].paymentAmount === null &&
                  loopdata[i].creditsToApply !== null
                  ? 0
                  : loopdata[i].paymentAmount,
            paidAmount:
              loopdata[i].paymentAmount === null &&
                loopdata[i].creditsToApply === null
                ? loopdata[i].amount
                : loopdata[i].paymentAmount === null &&
                  loopdata[i].creditsToApply !== null
                  ? 0
                  : loopdata[i].paymentAmount,
            transactionId: getResponse.data.data.transaction_id,
            amexorderId:
              loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
            paymentMethod: "Cash",
            idForPayment:
              loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
            creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
          };
          let additionData = {
            customerID: loopdata[i].customerId,
            itemId: loopdata[i].itemId,
            sageCustomerId: loopdata[i].sageCustomerId,
          };
          let invoiceupdateData = {
            totalPaidAmount: TotalInvoiceprice,
            unPaidAmount: unPaidAmount,
            due_amount: due_amount,
            creditNotePrice: creditAmount,
            paymentApplyAmount: paymentApplyAmount,
          };

          console.log(reqData, "creditAmount", creditAmount);
          console.log(
            "unPaidAmount",
            unPaidAmount,
            additionData,
            "dataforRemaingAmount",
            dataforRemaingAmount
          );

          // return false;

          await transactionSaveInDB(reqData, additionData, creditAmount);
          await updateInvoiceAfterPay(loopdata[i].id, invoiceupdateData);
        }
        await deleteTempId(insertedId);
      } else if (paymentMethod === "Amex" && topPaymentAmount === 0) {
        const reqData = {
          transaction_id: `Cash-${rendomTransactionId}`,
          invoice_array: newInvoiceData,
        };
        await getwayService.saveTempTransaction(
          reqData,
          async function (result: any) {
            insertedId = result?.data?.data?.insertId;
          }
        );

        let getResponse = await axios.get(
          `${api_url}/getTempTransaction/${insertedId}`
        );
        let loopdata = getResponse.data.data.invoice_array;

        for (let i = 0; i < loopdata.length; i++) {
          let reqData = {
            totalAmount: loopdata[i].amount,
            paidAmount: loopdata[i].amount,
            transactionId: getResponse.data.data.transaction_id,
            amexorderId:
              loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
            paymentMethod: "Cash",
            idForPayment:
              loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
            creditNotesId: null,
          };
          let additionData = {
            customerID: loopdata[i].customerId,
            itemId: loopdata[i].itemId,
            sageCustomerId: loopdata[i].sageCustomerId,
          };
          // await transactionSaveInDB(reqData, additionData);
          // await updateInvoiceAfterPay(loopdata[i].id);
        }
        await deleteTempId(insertedId);
      } else if (paymentMethod === "Amex" && topPaymentAmount !== 0) {
        const reqData = {
          transaction_id: `amex-${rendomTransactionId}`,
          invoice_array: newInvoiceData,
        };
        await getwayService.saveTempTransaction(
          reqData,
          async function (result: any) {
            insertedId = result?.data?.data?.insertId;
          }
        );
        let getResponse = await axios.get(
          `${api_url}/getTempTransaction/${insertedId}`
        );
        let orderId = getResponse.data.data.transaction_id;

        var requestData = {
          apiOperation: "CREATE_CHECKOUT_SESSION",
          order: {
            id: orderId,
            amount: topPaymentAmount,
            currency: "QAR",
            description: "Orderd",
          },
          interaction: {
            returnUrl: `${process.env.NEXT_PUBLIC_AMEX_SUCCESS_RETURN_URL
              }?tempTransactionId=${insertedId}&paymentMethod=${paymentMethod}&invoiceTitle=${"INVOICES"}`,
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
      if (paymentMethod === "Check") {
        if (handlePaymentValue === "") {
          toast.error("Check number is required !");
          setshowspinner(false);
        } else {
          const reqData = {
            transaction_id: `check-${rendomTransactionId}`,
            invoice_array: newInvoiceData,
          };
          await getwayService.saveTempTransaction(
            reqData,
            async function (result: any) {
              insertedId = result?.data?.data?.insertId;
            }
          );

          let getResponse = await axios.get(
            `${api_url}/getTempTransaction/${insertedId}`
          );
          let loopdata = getResponse.data.data.invoice_array;
          for (let i = 0; i < loopdata.length; i++) {
            const sageintacctInvoiceid =
              loopdata[i].invoiceId || loopdata[i].tuition_invoice_id;
            const customeridd = loopdata[i].sageCustomerId;
            const dbinvoiceid = loopdata[i].id;
            const creditAmount = loopdata[i].creditsToApply;
            const dbcustomerId = loopdata[i].customerId;
            const unPaidAmount = loopdata[i].outstandingAmount;
            const due_amount = loopdata[i].amount_due;
            const TotalInvoiceprice = loopdata[i].amount;
            const paymentApplyAmount = loopdata[i].paymentAmount;

            const dataforRemaingAmount: any = {
              customerId: dbcustomerId,
              sageCustomerId: parseInt(customeridd),
              invoiceId: dbinvoiceid,
              sageinvoiceId: sageintacctInvoiceid,
              Amount: creditAmount,
              amountMode: 0,
            };

            if (creditAmount === null) {
              console.log("#########");
            } else {
              await insertRemainingNotesAmount(dataforRemaingAmount);
            }
            let reqData = {
              totalAmount:
                loopdata[i].paymentAmount === null &&
                  loopdata[i].creditsToApply === null
                  ? loopdata[i].amount
                  : loopdata[i].paymentAmount === null &&
                    loopdata[i].creditsToApply !== null
                    ? 0
                    : loopdata[i].paymentAmount,
              paidAmount:
                loopdata[i].paymentAmount === null &&
                  loopdata[i].creditsToApply === null
                  ? loopdata[i].amount
                  : loopdata[i].paymentAmount === null &&
                    loopdata[i].creditsToApply !== null
                    ? 0
                    : loopdata[i].paymentAmount,
              transactionId: getResponse.data.data.transaction_id,
              amexorderId:
                loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
              paymentMethod: "Check",
              idForPayment:
                loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
              creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
              check_no: handlePaymentValue,
            };
            let additionData = {
              customerID: loopdata[i].customerId,
              itemId: loopdata[i].itemId,
              sageCustomerId: loopdata[i].sageCustomerId,
            };
            let invoiceupdateData = {
              totalPaidAmount: TotalInvoiceprice,
              unPaidAmount: unPaidAmount,
              due_amount: due_amount,
              creditNotePrice: creditAmount,
              paymentApplyAmount: paymentApplyAmount,
            };

            console.log(reqData, "creditAmount", creditAmount);
            console.log(
              "unPaidAmount",
              unPaidAmount,
              additionData,
              "dataforRemaingAmount",
              dataforRemaingAmount
            );

            // return false;

            await transactionSaveInDB(reqData, additionData, creditAmount);
            await updateInvoiceAfterPay(loopdata[i].id, invoiceupdateData);
          }
          await deleteTempId(insertedId);
        }
      }
      if (paymentMethod === "Credit Card") {
        if (handlePaymentValue === "") {
          toast.error("Authorization code is required !");
          setshowspinner(false);
        } else {
          const reqData = {
            transaction_id: `creditcard-${rendomTransactionId}`,
            invoice_array: newInvoiceData,
          };
          await getwayService.saveTempTransaction(
            reqData,
            async function (result: any) {
              insertedId = result?.data?.data?.insertId;
            }
          );

          let getResponse = await axios.get(
            `${api_url}/getTempTransaction/${insertedId}`
          );
          let loopdata = getResponse.data.data.invoice_array;
          for (let i = 0; i < loopdata.length; i++) {
            const sageintacctInvoiceid =
              loopdata[i].invoiceId || loopdata[i].tuition_invoice_id;
            const customeridd = loopdata[i].sageCustomerId;
            const dbinvoiceid = loopdata[i].id;
            const creditAmount = loopdata[i].creditsToApply;
            const dbcustomerId = loopdata[i].customerId;
            const unPaidAmount = loopdata[i].outstandingAmount;
            const due_amount = loopdata[i].amount_due;
            const TotalInvoiceprice = loopdata[i].amount;
            const paymentApplyAmount = loopdata[i].paymentAmount;

            const dataforRemaingAmount: any = {
              customerId: dbcustomerId,
              sageCustomerId: parseInt(customeridd),
              invoiceId: dbinvoiceid,
              sageinvoiceId: sageintacctInvoiceid,
              Amount: creditAmount,
              amountMode: 0,
            };

            if (creditAmount === null) {
              console.log("#########");
            } else {
              await insertRemainingNotesAmount(dataforRemaingAmount);
            }
            let reqData = {
              totalAmount:
                loopdata[i].paymentAmount === null &&
                  loopdata[i].creditsToApply === null
                  ? loopdata[i].amount
                  : loopdata[i].paymentAmount === null &&
                    loopdata[i].creditsToApply !== null
                    ? 0
                    : loopdata[i].paymentAmount,
              paidAmount:
                loopdata[i].paymentAmount === null &&
                  loopdata[i].creditsToApply === null
                  ? loopdata[i].amount
                  : loopdata[i].paymentAmount === null &&
                    loopdata[i].creditsToApply !== null
                    ? 0
                    : loopdata[i].paymentAmount,
              transactionId: getResponse.data.data.transaction_id,
              amexorderId:
                loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
              paymentMethod: "Credit Card",
              idForPayment:
                loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
              creditNotesId: creditNoteNewId ? creditNoteNewId : "null",
              authorization_code: handlePaymentValue,
            };
            let additionData = {
              customerID: loopdata[i].customerId,
              itemId: loopdata[i].itemId,
              sageCustomerId: loopdata[i].sageCustomerId,
            };
            let invoiceupdateData = {
              totalPaidAmount: TotalInvoiceprice,
              unPaidAmount: unPaidAmount,
              due_amount: due_amount,
              creditNotePrice: creditAmount,
              paymentApplyAmount: paymentApplyAmount,
            };

            console.log(reqData, "creditAmount", creditAmount);
            console.log(
              "unPaidAmount",
              unPaidAmount,
              additionData,
              "dataforRemaingAmount",
              dataforRemaingAmount
            );

            // return false;

            await transactionSaveInDB(reqData, additionData, creditAmount);
            await updateInvoiceAfterPay(loopdata[i].id, invoiceupdateData);
          }
          await deleteTempId(insertedId);
        }
      }
      if (paymentMethod === "CBQ" && topPaymentAmount === 0) {
        try {
          const reqData1 = {
            transaction_id: `Cash-${rendomTransactionId}`,
            invoice_array: newInvoiceData,
          };
          await getwayService.saveTempTransaction(
            reqData1,
            async function (result: any) {
              insertedId = result?.data?.data?.insertId;
            }
          );

          let getResponse = await axios.get(
            `${api_url}/getTempTransaction/${insertedId}`
          );
          let loopdata = getResponse.data.data.invoice_array;

          for (let i = 0; i < loopdata.length; i++) {
            let reqData = {
              totalAmount: loopdata[i].amount,
              paidAmount: loopdata[i].amount,
              transactionId: getResponse.data.data.transaction_id,
              amexorderId:
                loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
              paymentMethod: "Cash",
              idForPayment:
                loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
              creditNotesId: null,
            };
            let additionData = {
              customerID: loopdata[i].customerId,
              itemId: loopdata[i].itemId,
              sageCustomerId: loopdata[i].sageCustomerId,
            };
            // await transactionSaveInDB(reqData, additionData);
            // await updateInvoiceAfterPay(loopdata[i].id);
          }
          await deleteTempId(insertedId);
        } catch (error: any) {
          console.log("Error ", error.message);
        }
      }
      if (paymentMethod === "CBQ" && topPaymentAmount !== 0) {
        const reqData = {
          transaction_id: `cbq-${rendomTransactionId}`,
          invoice_array: newInvoiceData,
        };
        await getwayService.saveTempTransaction(
          reqData,
          async function (result: any) {
            insertedId = result?.data?.data?.insertId;
          }
        );
        let getResponse = await axios.get(
          `${api_url}/getTempTransaction/${insertedId}`
        );
        let orderId = getResponse.data.data.transaction_id;

        localStorage.setItem("user", "admin");
        localStorage.setItem("invoiceTitle", "INVOICES");
        localStorage.setItem("tempTransactionId", insertedId);
        setTimeout(() => {
          router.push(
            `/checkpayment/cbq/?amount=${topPaymentAmount}&refrenceNumber=${orderId}&tempTransactionId=${insertedId}`
          );
        }, 2000);
      }
      if (paymentMethod === "QPay" && topPaymentAmount === 0) {
        try {
          const reqData1 = {
            transaction_id: `Cash-${rendomTransactionId}`,
            invoice_array: newInvoiceData,
          };
          await getwayService.saveTempTransaction(
            reqData1,
            async function (result: any) {
              insertedId = result?.data?.data?.insertId;
            }
          );

          let getResponse = await axios.get(
            `${api_url}/getTempTransaction/${insertedId}`
          );
          let loopdata = getResponse.data.data.invoice_array;

          for (let i = 0; i < loopdata.length; i++) {
            let reqData = {
              totalAmount: loopdata[i].amount,
              paidAmount: loopdata[i].amount,
              transactionId: getResponse.data.data.transaction_id,
              amexorderId:
                loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
              paymentMethod: "Cash",
              idForPayment:
                loopdata[i].invoiceId || loopdata[i].tuition_invoice_id,
              creditNotesId: null,
            };
            let additionData = {
              customerID: loopdata[i].customerId,
              itemId: loopdata[i].itemId,
              sageCustomerId: loopdata[i].sageCustomerId,
            };
            // await transactionSaveInDB(reqData, additionData);
            // await updateInvoiceAfterPay(loopdata[i].id);
          }
          await deleteTempId(insertedId);
        } catch (error: any) {
          console.log("Error ", error.message);
        }
      }
      if (paymentMethod === "QPay" && topPaymentAmount !== 0) {
        localStorage.setItem("user", "admin");
        const reqData = {
          transaction_id: `qpay-${rendomTransactionId}`,
          invoice_array: newInvoiceData,
        };
        await getwayService.saveTempTransaction(
          reqData,
          async function (result: any) {
            insertedId = result?.data?.data?.insertId;
          }
        );
        let getResponse = await axios.get(
          `${api_url}/getTempTransaction/${insertedId}`
        );
        localStorage.setItem("tempTransactionId", insertedId);
        let orderId = getResponse.data.data.transaction_id;

        let data = {
          amount: topPaymentAmount,
          PUN: orderId,
        };
        await getwayService.redirectQPayPayment(data);
      }
    }
  };

  const transactionSaveInDB = async (
    data1: any,
    otherData: any,
    creditAmount: any
  ) => {
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
      // setShowSuccess(true);
      let item = {
        refrenceId: result.referenceNumber,
        transactionId:
          result &&
          result.insetTransatction &&
          result.insetTransatction?.insertId,
      };
      DownloadReceipt(item, "", "admin_side");
      setTimeout(callBack_func, 5000);
      async function callBack_func() {
        // setShowSuccess(false);
        if (paymentMethod === "Cash") {
          await getwayService.getARInoviceRecordNumber(
            data1.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: otherData.sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Cash",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                ARreceiveONDate: receiveDate1,
                ARpaymentONDate: paymentDate1,
              };
              console.log("data1 for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {
                  console.log("ok", result);
                }
              );
              if (creditAmount !== null) {
                const ARdata1 = {
                  customerId: otherData.sageCustomerId,
                  amount: creditAmount,
                  ARpaymentMethod: "Cash",
                  referenceNumber: result.referenceNumber,
                  ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                  ARreceiveONDate: receiveDate1,
                  ARpaymentONDate: paymentDate1,
                };
                console.log("dataCredit for apply pay =>", ARdata1);
                await getwayService.createAndApplyPaymentARInvoice(
                  ARdata1,
                  async function (result: any) {
                    console.log("ok", result);
                  }
                );
              }
            }
          );
        }
        if (paymentMethod === "Check") {
          await getwayService.getARInoviceRecordNumber(
            data1.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: otherData.sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Printed Check",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                ARreceiveONDate: receiveDate1,
                ARpaymentONDate: paymentDate1,
                ARCheckNo: handlePaymentValue,
              };
              console.log("data1 for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {
                  console.log("ok", result);
                }
              );
              if (creditAmount !== null) {
                const ARdata1 = {
                  customerId: otherData.sageCustomerId,
                  amount: creditAmount,
                  ARpaymentMethod: "Cash",
                  referenceNumber: result.referenceNumber,
                  ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                  ARreceiveONDate: receiveDate1,
                  ARpaymentONDate: paymentDate1,
                };
                console.log("dataCredit for apply pay =>", ARdata1);
                await getwayService.createAndApplyPaymentARInvoice(
                  ARdata1,
                  async function (result: any) {
                    console.log("ok", result);
                  }
                );
              }
            }
          );
        }
        if (paymentMethod === "Credit Card") {
          await getwayService.getARInoviceRecordNumber(
            data1.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: otherData.sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Credit Card",
                referenceNumber: result.referenceNumber,
                ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                ARreceiveONDate: receiveDate1,
                ARpaymentONDate: paymentDate1,
                ARAuthCode: handlePaymentValue,
                // ARCardType: cardType,
              };
              console.log("data1 for apply pay =>", ARdata);
              await getwayService.createAndApplyPaymentARInvoice(
                ARdata,
                async function (result: any) {
                  console.log("ok", result);
                }
              );
              if (creditAmount !== null) {
                const ARdata1 = {
                  customerId: otherData.sageCustomerId,
                  amount: creditAmount,
                  ARpaymentMethod: "Cash",
                  referenceNumber: result.referenceNumber,
                  ARinvoiceRecordNumber: ARRecordNumberResult["RECORDNO"],
                  ARreceiveONDate: receiveDate1,
                  ARpaymentONDate: paymentDate1,
                };
                console.log("dataCredit for apply pay =>", ARdata1);
                await getwayService.createAndApplyPaymentARInvoice(
                  ARdata1,
                  async function (result: any) {
                    console.log("ok", result);
                  }
                );
              }
            }
          );
        }
        if (paymentMethod === "Amex") {
          await getwayService.getARInoviceRecordNumber(
            data1.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: otherData.sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Cash",
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
        if (paymentMethod === "CBQ") {
          await getwayService.getARInoviceRecordNumber(
            data1.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: otherData.sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Cash",
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
        if (paymentMethod === "QPay") {
          await getwayService.getARInoviceRecordNumber(
            data1.idForPayment,
            async function (ARRecordNumberResult: any) {
              const ARdata = {
                customerId: otherData.sageCustomerId,
                amount: result.amount,
                ARpaymentMethod: "Cash",
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
      }
    });
  };

  const updateInvoiceAfterPay = async (invoiceId: any, invoiceData: any) => {
    try {
      let totalInvoicesAmount = invoiceData.totalPaidAmount;
      let dueInvoiceAmount = invoiceData.due_amount;
      let creditToApply = invoiceData.creditNotePrice;
      let applyPaymentAmount = invoiceData.paymentApplyAmount;
      let outstandingAmountDue = invoiceData.unPaidAmount;
      let statuss = "";
      let amount_duee = 0;

      console.log(
        "####totalInvoicesAmount",
        totalInvoicesAmount,
        "dueInvoiceAmount",
        dueInvoiceAmount,
        "creditToApply",
        creditToApply,
        "applyPaymentAmount",
        applyPaymentAmount,
        "outstandingAmountDue",
        outstandingAmountDue
      );

      if (creditToApply === null && applyPaymentAmount === null) {
        if (totalInvoicesAmount === outstandingAmountDue) {
          // console.log("1@@@@@@@@@@@@11");
          statuss = "Paid";
          amount_duee = 0;
        }
      } else if (creditToApply !== null && applyPaymentAmount === null) {
        if (totalInvoicesAmount === creditToApply) {
          // console.log("1@@@@@@@@@@@@22");

          statuss = "Paid";
          amount_duee = 0;
        } else {
          // console.log("1@@@@@@@@@@@@33");
          statuss = "Partially paid";
          amount_duee = outstandingAmountDue;
        }
      } else if (creditToApply === null && applyPaymentAmount !== null) {
        if (totalInvoicesAmount === applyPaymentAmount) {
          // console.log("1@@@@@@@@@@@@44");
          statuss = "Paid";
          amount_duee = 0;
        } else {
          //  console.log("1@@@@@@@@@@@@55");
          statuss = "Partially paid";
          amount_duee = outstandingAmountDue;
        }
      } else if (creditToApply !== null && applyPaymentAmount !== null) {
        let addPayment = creditToApply + applyPaymentAmount;
        if (addPayment === totalInvoicesAmount) {
          // console.log("1@@@@@@@@@@@@66", addPayment);
          statuss = "Paid";
          amount_duee = 0;
        } else {
          // console.log("1@@@@@@@@@@@@77");
          statuss = "Partially paid";
          amount_duee = outstandingAmountDue;
        }
      }
      let requestedData = {
        note: null,
        status: statuss,
        amount_due: amount_duee,
      };
      console.log("############", requestedData);

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

  const handleOpen = () => {
    if (isChecked === true) {
      setIsChecked(isChecked);
    } else {
      setIsChecked(isChecked);
    }
    handleClickOpen();
    if (UserId === "" || UserId === null) {
      console.log("Empty");
    } else {
      getInvoiceByCustomerId();
    }
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

      // setCustomerTotalCreditNoteBalance(res?.creditBal);

      setCustomerTotalCreditNoteBalance(res?.creditBal_FromSageCreditNotes);
      setApplyCreditNoteAmount(res?.creditBal_FromSageCreditNotes);
    } catch (error: any) {
      console.log("error", error.message);
    }
  };

  const getInvoiceByCustomerId = async () => {
    if (UserId === undefined) {
      console.log("c");
    } else {
      setLoadar(true);
      const response = await fetch(`${api_url}/getInvoiceByStatus`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      console.log("@@@@@@@@@@@@@@", res);
      setinvoiceData(res?.data);
    }
    setLoadar(false);
  };

  var price = 0;
  for (let d of invoiceData) {
    price = price + Number(d.amount);
  }

  const handleRowSelection = (event: any, id: any) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId: any) => rowId !== id));
    }
  };

  const handleSelectAllRows = (event: any) => {
    if (isChecked === false) {
      setSelectedRows([]);
      setIsChecked(true);
    } else {
      setSelectedRows(invoiceData.map((row: any) => row));
      setIsChecked(false);
    }
  };

  var amount = 0;
  for (let d of selectedRows) {
    amount = amount + Number(d.amount);
  }

  //   var topPaymentAmount = 0;
  //   for (let d of newInvoiceData) {
  //     topPaymentAmount = topPaymentAmount + Number(d.amount);
  //   }

  const handleInvoiceData = () => {
    const updatedData = selectedRows.map((row: any, i: any) => {
      const manageAmountDue = row.amount_due > 0 ? row.amount_due : row.amount;
      return {
        ...row,
        creditsAvailable: customerTotalCreditNoteBalance,
        creditsToApply: null,
        outstandingAmount: manageAmountDue,
        amount: manageAmountDue,
        paymentAmount: null,
        txnamount: row.amount,
        isEditing: false,
        isEditingForPayment: false,
      };
    });
    setNewInvoiceData(updatedData);
    handleClose();
  };

  function openDelete(id: any) {
    let selectedInvoice = newInvoiceData.filter((a: any) => a.id !== id);
    setNewInvoiceData(selectedInvoice);
    setSelectedRows(selectedInvoice);
  }

  const handleOpenInvoices = () => {
    handleClickOpen();
  };
  const handleReceiveDate = (date: any) => {
    setReceiveDate(date);
  };

  const handlePaymentDate = (date: any) => {
    setPaymentDate(date);
  };

  const distributeAmount = (e: any) => {
    if (e.key === "Enter" && e.target.name === "amount") {
      setCreditPopupError("");
      outlinedRef?.current?.blur();
      const updatedData = newInvoiceData.map((row: any, i: any) => {
        return {
          ...row,
          paymentAmount: null,
          creditsToApply: null,
          creditsAvailable: customerTotalCreditNoteBalance,
        }; // Update the specific property
      });

      const updatedArray = [...updatedData];
      let remainingAmount = topPaymentAmount;

      for (let i = 0; i < updatedArray.length; i++) {
        const currentObject = updatedArray[i];
        const amountToDistribute = Math.min(
          currentObject.amount,
          remainingAmount
        );
        currentObject.paymentAmount = amountToDistribute;
        remainingAmount -= amountToDistribute;

        if (remainingAmount <= 0) {
          break;
        }
      }

      // Update the outstanding amount based on the transaction and payment amounts
      for (const obj of updatedArray) {
        if (obj.amount === obj.paymentAmount) {
          obj.outstandingAmount = 0;
        } else {
          obj.outstandingAmount = obj.amount - obj.paymentAmount;
        }
      }

      setNewInvoiceData(updatedArray);
    }
  };

  const handleOnChangeInputs = (e: any, dataitem: any) => {
    if (e.target.name === "Credit to apply") {
      const updatedData = newInvoiceData.map((row: any, i: any) => {
        if (row.id === dataitem.id && e.target.value) {
          return { ...row, creditsToApply: parseInt(e.target.value) }; // Update the specific property
        } else if (row.id === dataitem.id && !e.target.value) {
          return { ...row, creditsToApply: null }; // Update the specific property
        } else {
          return { ...row }; // Update remaining property
        }
      });
      setNewInvoiceData(updatedData);
    } else if (e.target.name === "Payment Amount") {
      const updatedData = newInvoiceData.map((row: any, i: any) => {
        if (row.id === dataitem.id && e.target.value) {
          return { ...row, paymentAmount: parseInt(e.target.value) }; // Update the specific property
        } else if (row.id === dataitem.id && !e.target.value) {
          return { ...row, paymentAmount: null }; // Update the specific property
        } else {
          return { ...row }; // Update remaining property
        }
      });
      setNewInvoiceData(updatedData);
    }
  };
  // handle Receive Payment Modal
  const handleReceivePaymentAccordingToUs = (
    e: any,
    dataitem: any,
    key: any
  ) => {
    arr.push({ [key]: e.target.value });
    const lastDuplicates = findLastDuplicates(arr);
    const addingNumber = sumNumbers(lastDuplicates);
    console.log(
      "##############",
      dataitem.amount_due,
      typeof dataitem.amount_due
    );
    let creditBal = dataitem.creditsAvailable;
    const transactionAmount =
      dataitem.amount_due > 0 ? dataitem.amount_due : dataitem.amount;
    let OutstandingAmount: any;

    if (
      e.target.name === "Credit to apply" &&
      customerTotalCreditNoteBalance &&
      e.key === "Enter"
    ) {
      e.preventDefault();
      if (inputRefs.current) {
        handleToggleEdit(key, dataitem.amount);
      }
      if (e.target.value && !dataitem?.paymentAmount) {
        console.log(
          "iffffffffffffffff e.target.value && dataitem?.paymentAmount"
        );
        if (addingNumber < parseInt(e.target.value)) {
          console.log("ifffffffffffffffffff");
          setCreditPopupError(
            "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
          );
          const updatedData = newInvoiceData.map((row: any, i: any) => {
            const addingNumberSubsToCreditAvailable =
              customerTotalCreditNoteBalance - addingNumber;
            if (row.id === dataitem.id) {
              return {
                ...row,
                creditsAvailable: addingNumberSubsToCreditAvailable,
                creditsToApply: parseInt(e.target.value),
              }; // Update the specific property
            } else {
              return { ...row };
            }
          });
          setNewInvoiceData(updatedData);
        } else if (transactionAmount < parseInt(e.target.value)) {
          console.log(" else  ifffffffffffffffffff");
          setCreditPopupError(
            "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
          );
          const updatedData = newInvoiceData.map((row: any, i: any) => {
            if (row.id === dataitem.id) {
              return {
                ...row,
                creditsAvailable: customerTotalCreditNoteBalance,
                outstandingAmount: transactionAmount,
                creditsToApply: parseInt(e.target.value),
              }; // Update the specific property
            }
            return row;
          });
          setNewInvoiceData(updatedData);
        } else {
          if (addingNumber > customerTotalCreditNoteBalance) {
            console.log(
              "second else------------------------------------------------------------- fiiiiiiiiiii"
            );
            setCreditPopupError(
              "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
            );
            console.log("innn");
            const updatedData = newInvoiceData.map((row: any, i: any) => {
              const addingNumberSubsToCreditAvailable =
                dataitem.creditsAvailable - addingNumber;
              if (row.id === dataitem.id) {
                return {
                  ...row,
                  creditsAvailable: addingNumberSubsToCreditAvailable,
                  outstandingAmount: transactionAmount,
                  creditsToApply: parseInt(e.target.value),
                }; // Update the specific property
              } else {
                return {
                  ...row,
                  creditsAvailable: addingNumberSubsToCreditAvailable,
                };
              }
            });
            setNewInvoiceData(updatedData);
          } else if (addingNumber < customerTotalCreditNoteBalance) {
            console.log("else ifff");
            const calculateRemainingData =
              customerTotalCreditNoteBalance - addingNumber;
            OutstandingAmount = transactionAmount - parseInt(e.target.value);
            const updatedData = newInvoiceData.map((row: any, i: any) => {
              if (row.id === dataitem.id) {
                return {
                  ...row,
                  creditsAvailable: calculateRemainingData,
                  outstandingAmount: OutstandingAmount,
                  creditsToApply: parseInt(e.target.value),
                }; // Update the specific property
              } else {
                return { ...row, creditsAvailable: calculateRemainingData }; // Update remaining property
              }
            });

            setNewInvoiceData(updatedData);
            setCreditPopupError("");
          } else {
            console.log("elsee");

            const creditedAmount = customerTotalCreditNoteBalance - addingNumber;
            OutstandingAmount = transactionAmount - parseInt(e.target.value);
            const updatedData = newInvoiceData.map((row: any, i: any) => {
              if (row.id === dataitem.id) {
                return {
                  ...row,
                  creditsAvailable: creditedAmount,
                  outstandingAmount: OutstandingAmount,
                  creditsToApply: parseInt(e.target.value),
                }; // Update the specific property
              }
              else {
                return {
                  ...row,
                  creditsAvailable: creditedAmount,
                }
              }
            });

            setNewInvoiceData(updatedData);
            setCreditPopupError("");
          }
        }
      } else if (e.target.value && dataitem?.paymentAmount) {
        console.log("e.target.value && dataitem?.paymentAmount");
        const updatedData = newInvoiceData.map((row: any, i: any) => {
          const creditedAmount = row.creditsAvailable - addingNumber;
          if (addingNumber > row.creditsAvailable) {
            console.log("ifffffffffffffffffff", addingNumber);
            const addingNumberSubsToCreditAvailable =
              customerTotalCreditNoteBalance - addingNumber;
            const addCreditsAndpaymentAmount =
              dataitem.amount -
              (parseInt(e.target.value) + dataitem?.paymentAmount);

            console.log(
              addingNumberSubsToCreditAvailable,
              "addingNumberSubsToCreditAvailable",
              addingNumber
            );
            if (addCreditsAndpaymentAmount.toString().includes("-")) {
              setCreditPopupError(
                "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
              );
            } else {
              setCreditPopupError("");
            }
            if (row.id === dataitem.id) {
              return {
                ...row,
                creditsToApply: parseInt(e.target.value),
                creditsAvailable: addingNumberSubsToCreditAvailable,
                outstandingAmount: addCreditsAndpaymentAmount,
              }; // Update the specific property
            } else {
              return {
                ...row,
                creditsAvailable: addingNumberSubsToCreditAvailable,
              }; // Update the specific property
            }
          } else {
            const calculationAmounts =
              dataitem.amount -
              (dataitem.paymentAmount + dataitem.creditsToApply);
            console.log(calculationAmounts, "calculationAmount");
            if (calculationAmounts < 0) {
              setCreditPopupError(
                "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
              );

              if (row.id === dataitem.id) {
                return {
                  ...row,
                  outstandingAmount: calculationAmounts,
                }; // Update the specific property
              } else {
                return { ...row }; // Update the specific property
              }
            } else if (calculationAmounts > 0 || calculationAmounts === 0) {
              setCreditPopupError("");
              if (row.id === dataitem.id) {
                return {
                  ...row,
                  creditsAvailable: creditedAmount,
                  outstandingAmount: calculationAmounts,
                  creditsToApply: parseInt(e.target.value),
                }; // Update the specific property
              } else {
                return { ...row, creditsAvailable: creditedAmount }; // Update the specific property
              }
            }
          }
        });
        setNewInvoiceData(updatedData);
      } else {
        console.log("outewr else");
        const creditedAmount = customerTotalCreditNoteBalance - addingNumber;
        const calculationAmountsOfPaymentAmount =
          dataitem.amount - dataitem.paymentAmount;
        const calculationAmounts =
          dataitem.amount - (dataitem.paymentAmount + dataitem.creditsToApply);
        const updatedData = newInvoiceData.map((row: any, i: any) => {
          if (calculationAmountsOfPaymentAmount.toString().includes("-")) {
            setCreditPopupError(
              "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
            );
          } else {
            setCreditPopupError("");
          }

          if (row.id === dataitem.id) {
            return {
              ...row,
              creditsAvailable: creditedAmount,
              outstandingAmount: calculationAmounts,
              // creditsToApply: parseInt(e.target.value),
            }; // Update the specific property
          } else {
            return { ...row, creditsAvailable: creditedAmount }; // Update the specific property
          }
        });
        setNewInvoiceData(updatedData);
      }
    } else if (e.target.name === "Payment Amount" && e.key === "Enter") {
      setCreditPopupError("");
      e.preventDefault();
      if (inputRefsForPayment.current) {
        handleToggleEditForPayment(key, dataitem.amount);
      }
      if (dataitem.creditsToApply) {
        console.log("dataitem.creditsToApply");
        const updatedData = newInvoiceData.map((row: any, i: any) => {
          const calculationAmounts =
            dataitem.amount -
            (dataitem.paymentAmount + dataitem.creditsToApply);

          console.log(calculationAmounts, "calculationAmount paymount");
          if (calculationAmounts.toString().includes("-")) {
            setCreditPopupError(
              "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
            );
            if (row.id === dataitem.id) {
              return {
                ...row,
                outstandingAmount: calculationAmounts,
              }; // Update the specific property
            } else {
              return { ...row }; // Update the specific property
            }
          } else {
            if (row.id === dataitem.id) {
              return {
                ...row,
                outstandingAmount: calculationAmounts,
              }; // Update the specific property
            } else {
              return { ...row }; // Update the specific property
            }
          }
        });

        setNewInvoiceData(updatedData);
      } else if (!dataitem.creditsToApply) {
        console.log("dataitem.!!!!!!!!!!!!!!!!!creditsToApply");
        const updatedData = newInvoiceData.map((row: any, i: any) => {
          const greaterCheck = parseInt(e.target.value) > row.amount;
          console.log(greaterCheck, "rrrrrrrrrrrr greather check");
          const calculationAmounts =
            dataitem.amount -
            (dataitem.paymentAmount + dataitem.creditsToApply);

          if (greaterCheck) {
            if (row.id === dataitem.id) {
              setCreditPopupError(
                "Calculation of the (Payment amount/Credits to apply) must be less than or equals to txn amount"
              );
              return {
                ...row,
                outstandingAmount: calculationAmounts,
              }; // Update the specific property
            } else {
              return { ...row }; // Update the specific property
            }
          } else {
            setCreditPopupError("");
            if (row.id === dataitem.id) {
              return {
                ...row,
                outstandingAmount: calculationAmounts,
                // paymentAmount: parseInt(e.target.value),
              }; // Update the specific property
            } else {
              return { ...row }; // Update the specific property
            }
          }
        });
        setNewInvoiceData(updatedData);
        console.log(updatedData, "444444444 calPaymentAmount");
      }
    }
  };

  const handleToggleEdit = (index: any, outstandingAmountChecking: any) => {
    if ((outstandingAmountChecking !== 0 && customerTotalCreditNoteBalance)) {
      const newData = [...newInvoiceData];
      newData[index].isEditing = !newData[index].isEditing;
      setNewInvoiceData(newData);
      if (newData[index].isEditing) {
        setTimeout(() => {
          if (inputRefs.current[index]) {
            inputRefs.current[index].focus();
          }
        }, 0);
      }
    }
  };

  const handleToggleEditForPayment = (index: any, outstandingAmountChecking: any) => {
    if (outstandingAmountChecking !== 0) {
      const newData = [...newInvoiceData];
      newData[index].isEditingForPayment = !newData[index].isEditingForPayment;
      setNewInvoiceData(newData);
      if (newData[index].isEditingForPayment) {
        setTimeout(() => {
          if (inputRefsForPayment.current[index]) {
            inputRefsForPayment.current[index].focus();
          }
        }, 0);
      }
    }
  };

  const findLastDuplicates = (array: any) => {
    const duplicates = array.reduce((acc: any, obj: any, index: any) => {
      const key = Object.keys(obj)[0];
      if (
        key &&
        array.findIndex((o: any) => Object.keys(o)[0] === key) !== index
      ) {
        acc[key] = obj;
      }
      return acc;
    }, {});

    return Object.values(duplicates);
  };

  const sumNumbers = (array: any) => {
    const sum = array.reduce((total: any, obj: any) => {
      const value: any = Object.values(obj)[0];
      if (!isNaN(parseInt(value))) {
        return total + parseInt(value);
      }
      return total;
    }, 0);

    return sum;
  };

  const TotalValuesSum = (identifier: any) => {
    const sum = newInvoiceData.reduce(
      (total: any, obj: any) => total + obj[identifier],
      0
    );
    return sum;
  };

  const totalInvoiceDueAmount =
    newInvoiceData &&
    newInvoiceData?.reduce(
      (total: any, currentItem: any) =>
        (total = total + currentItem.outstandingAmount),
      0
    );

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
          console.log(data?.data?.data?.insertId, "@@@@@@@@@", data);
          // setCustomerCreditNoteRequestId(data?.data?.data?.insertId);
          creditNoteNewId = data?.data?.data?.insertId;
          // getSageId(reqData?.customerId);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  function removeCommas(str: any) {
    while (str.search(",") >= 0) {
      str = (str + "").replace(',', '');
    }
    return str;
  };

  console.log("newDatanewData", newInvoiceData);
  // console.log(newInvoiceData, "newInvoiceData");
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
        <Box component="main" sx={{ flexGrow: 1 }}>
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
                      href="/admin/customer/customerslist"
                      style={{ color: "#7D86A5", textDecoration: "none" }}
                    >
                      Payments
                    </Link>
                  </Breadcrumbs>
                </Stack>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: "bold", color: "#333333" }}
                >
                  PAYMENT
                </Typography>
              </Stack>
              {(custpermit && custpermit.canAdd === true) || roleid === 1 ? (
                <React.Fragment>
                  <Stack
                    style={{
                      display: "flex",
                      gap: "20px",
                      flexDirection: "row",
                    }}
                  >
                    {" "}
                    <Button
                      className="button-new"
                      variant="contained"
                      size="small"
                      sx={{ width: 50 }}
                      onClick={handleCancled}
                    >
                      <b>RESET</b>
                    </Button>
                    <Button
                      className="button-new"
                      variant="contained"
                      disabled={
                        newInvoiceData &&
                          newInvoiceData?.length !== 0 &&
                          !creditPopupError
                          ? false
                          : true
                      }
                      size="small"
                      sx={{ width: 150 }}
                      onClick={handleSubmitt}
                    >
                      <b>Pay</b>
                      <span style={{ fontSize: "2px", paddingLeft: "10px" }}>
                        {spinner === true ? (
                          <CircularProgress color="inherit" />
                        ) : (
                          ""
                        )}
                      </span>
                    </Button>
                  </Stack>
                </React.Fragment>
              ) : (
                ""
              )}
            </Stack>
            {/* {accordianLoader && <Loader/>} */}
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>Payment Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid>
                  <form onSubmit={handleSubmitt} className="form-filter">
                    <Grid container spacing={3}>
                      <Grid className="filterdd" item xs={12} md={4}>
                        <Stack spacing={1} sx={{}}>
                          <InputLabel id="demo-select-small">
                            Customer
                          </InputLabel>
                          <Autocomplete
                            // style={{ width: 300 }}
                            fullWidth
                            inputValue={inputValue}
                            // className="custome-text"
                            onChange={(event, value) =>
                              handleChangeCustomer(value)
                            }
                            ref={autoC}
                            onInputChange={(event, newInputValue) => {
                              setInputValue(newInputValue);
                            }}
                            options={users}
                            getOptionLabel={(option: any) =>
                              option.name +
                              ` (${option.isParentId !== null
                                ? "Parent - " + option.isParentId
                                : "Child - " + option.customerId
                              })`
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Find or create a customer"
                              />
                            )}
                            noOptionsText={
                              <Button
                              // onClick={handleClickOpen}
                              >
                                {inputValue === "" ? (
                                  "Please enter 1 or more character"
                                ) : (
                                  <span></span>
                                )}
                              </Button>
                            }
                          />
                          <Typography style={style}>
                            <span>
                              {error === "customer field is required"
                                ? error
                                : ""}{" "}
                            </span>
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-select-small">
                            Amount (QAR)
                          </InputLabel>
                          <OutlinedInput
                            fullWidth
                            // disabled

                            id="amount"
                            value={topPaymentAmount}
                            placeholder="0.00"
                            {...register("amount")}
                            onChange={(e) =>
                              setTopPaymentAmount(removeCommas(e.target.value))
                            }
                            inputRef={outlinedRef}
                            onKeyDown={(e) => distributeAmount(e)}
                          />
                          {/* <Typography style={styleinvoice}>
                            <span>
                              {totalInvoiceDueAmount < topPaymentAmount ? (
                                <p>
                                  Please select less amount of your invoice due amount.
                                </p>
                              ) : (
                                ""
                              )}
                            </span>
                          </Typography> */}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Stack spacing={1}>
                          <InputLabel id="demo-select-small">
                            Payment method
                          </InputLabel>
                          <Select
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={paymentMethod}
                            label="Status"
                            onClick={() => {
                              setHandlePaymentValue("");
                            }}
                          >
                            <MenuItem value="Check">Check</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Cash">Cash</MenuItem>
                          </Select>
                        </Stack>
                      </Grid>
                      {paymentMethod === "Cash" ? (
                        ""
                      ) : paymentMethod === "Check" ? (
                        <Grid item xs={12} md={4}>
                          <Stack style={{ marginTop: "8px" }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12}>
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
                            </Grid>
                          </Stack>
                        </Grid>
                      ) : paymentMethod === "Record transfer" ? (
                        <Grid item xs={12} md={4}>
                          <Stack style={{ marginTop: "8px" }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12}>
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
                              </Grid>
                            </Grid>
                          </Stack>
                        </Grid>
                      ) : paymentMethod === "Credit Card" ? (
                        <Grid item xs={12} md={4}>
                          <Stack style={{ marginTop: "8px" }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12}>
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
                              </Grid>
                            </Grid>
                          </Stack>
                        </Grid>
                      ) : (
                        ""
                      )}
                      <br></br>
                    </Grid>
                  </form>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <br></br>
            <Dialog
              fullWidth={fullWidth}
              maxWidth={maxWidth}
              className="popupp"
              open={open}
              onClose={handleClose}
            >
              <DialogTitle className="paymentHeadingg">
                Select invoices
              </DialogTitle>
              {loader && <Loader />}
              <DialogContent>
                <DialogContentText>
                  <div style={{ display: "flex", border: "1px solid grey" }}>
                    <span style={{ display: "flex" }}>
                      &emsp;<p className="nameheading1">Customer name</p>
                      <p className="nameheading2">
                        {UserId === 0 ? "" : UserId?.name}
                      </p>
                    </span>
                    <span style={{ display: "flex" }}>
                      <p className="nameheading1">Credit Note</p>
                      <p className="nameheading2">
                        {customerTotalCreditNoteBalance === 0
                          ? 0.0
                          : customerTotalCreditNoteBalance}{" "}
                        (QAR)
                      </p>
                    </span>
                    <span style={{ display: "flex" }}>
                      <p className="nameheading1">Selected invoices total</p>
                      <p className="nameheading2">
                        {" "}
                        {commmonfunctions.formatePrice(
                          Number(amount && amount)
                        )}{" "}
                        (QAR)
                      </p>
                    </span>
                  </div>
                </DialogContentText>
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
                        <TableCell padding="checkbox">
                          <input
                            type="checkbox"
                            checked={!isChecked}
                            onChange={(event) => handleSelectAllRows(event)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography width={100}>INVOICE ID</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={200}>CUSTOMER NAME</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={250}>CUSTOMER ID</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={130}>INVOICE DATE</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={150}>DUE DATE</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={150}>AMOUNT(QAR)</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography width={150}>DUE AMOUNT(QAR)</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {DATA.currentData() &&
                        DATA.currentData().map((dataitem: any, key: any) => {
                          return (
                            <>
                              <TableRow
                                hover
                                tabIndex={-1}
                                role="checkbox"
                                key={dataitem.id}
                                className="boder-bottom"
                              >
                                <TableCell padding="checkbox">
                                  <input
                                    type="checkbox"
                                    onChange={(event) =>
                                      handleRowSelection(event, dataitem)
                                    }
                                    checked={selectedRows.includes(dataitem)}
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <Link
                                    href={`/admin/viewInvoice/${dataitem.id}`}
                                  >
                                    {dataitem.tuition_invoice_id ||
                                      dataitem.invoiceId}
                                  </Link>
                                </TableCell>
                                <TableCell align="left">
                                  {dataitem.name}
                                </TableCell>
                                <TableCell align="left">
                                  {dataitem.sageCustomerId}
                                </TableCell>
                                <TableCell align="left">
                                  {moment(
                                    dataitem.createdDate,
                                    "DD/MM/YYYY"
                                  ).format("MMM DD, YYYY")}
                                </TableCell>
                                <TableCell align="left">
                                  {moment(
                                    dataitem.invoiceDate,
                                    "DD/MM/YYYY"
                                  ).format("MMM DD, YYYY")}
                                </TableCell>
                                <TableCell align="left">
                                  {commmonfunctions.formatePrice(
                                    Number(dataitem?.amount)
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  {commmonfunctions.formatePrice(
                                    Number(
                                      dataitem?.amount_due === null
                                        ? dataitem?.amount
                                        : dataitem?.amount_due
                                    )
                                  )}
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                    </TableBody>
                  </Table>

                  <div className="popupDiv" style={{ display: "flex" }}>
                    <span style={{ display: "flex" }}>
                      <h3>Total</h3>
                    </span>
                    <span style={{ display: "flex" }}>
                      &emsp;
                      <h5>
                        {" "}
                        {commmonfunctions.formatePrice(
                          Number(price && price)
                        )}{" "}
                        (QAR)
                      </h5>
                    </span>{" "}
                  </div>

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
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  disabled={invoiceData?.length === 0 ? true : false}
                  onClick={handleInvoiceData}
                >
                  Add
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="outlined" onClick={handleCancled}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            {UserId && UserId !== null && newInvoiceData?.length === 0 ? (
              <React.Fragment>
                <Button variant="outlined" onClick={handleOpen}>
                  Show invoices
                </Button>
                <br />
                <br />
              </React.Fragment>
            ) : UserId && UserId !== null && newInvoiceData?.length !== 0 ? (
              ""
            ) : (
              ""
            )}

            {newInvoiceData && newInvoiceData?.length !== 0 ? (
              <React.Fragment>
                <Accordion
                  expanded={expanded2 === "panel3"}
                  onChange={handlePanelChange2("panel3")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography>Additional Information</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid>
                      <form
                        // onSubmit={handleSubmit(onSubmit)}
                        className="form-filter"
                      >
                        <Grid container spacing={3}>
                          <Grid className="filterdd" item xs={12} md={3}>
                            <Stack spacing={1} sx={{}}>
                              <InputLabel id="demo-select-small">
                                Date received
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
                          <Grid item xs={12} md={3}>
                            <Stack spacing={1} sx={{}}>
                              <InputLabel id="demo-select-small">
                                Payment date
                              </InputLabel>
                              <DatePicker
                                className="myDatePicker"
                                selected={paymentDate}
                                onChange={(date: any) =>
                                  handlePaymentDate(date)
                                }
                                name="paymentDate"
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Date"
                              />
                            </Stack>
                          </Grid>
                          <br></br>
                        </Grid>
                      </form>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <br></br>
                <Accordion
                  expanded={expanded1 === "panel2"}
                  onChange={handlePanelChange("panel2")}
                >
                  <AccordionSummary
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                  >
                    <Typography>Invoices Selected For Payment</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid>
                      <form

                        className="form-filter"
                      >
                        <br />
                        <div className="addinvoice">
                          {creditPopupError && (
                            <Button
                              variant="outlined"
                              style={stylepTag}
                              color="error"
                              sx={{ float: "left" }}
                            >
                              {creditPopupError}
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            onClick={handleOpenInvoices}
                          >
                            Select invoices
                          </Button>
                        </div>
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
                                <TableCell width={50}></TableCell>
                                <TableCell>
                                  <Typography width={100}>
                                    Invoice key
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography width={200}>Customer</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography width={130}>
                                    Txn amount
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography width={130}>
                                    Amount due
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography width={150}>
                                    Credits available
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography width={150}>
                                    Credits to apply
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography width={150}>
                                    Payment amount
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography width={150}>
                                    Outstanding amount
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Typography width={150}>ACTION</Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {newInvoiceData &&
                                newInvoiceData?.map(
                                  (dataitem: any, key: any) => {
                                    return (
                                      <>
                                        <TableRow
                                          hover
                                          tabIndex={-1}
                                          role="checkbox"
                                          key={dataitem.id}
                                          className="boder-bottom"
                                        >
                                          <TableCell>{key + 1}</TableCell>
                                          <TableCell align="left">
                                            <Link
                                              href={`/admin/viewInvoice/${dataitem.id}`}
                                            >
                                              {" "}
                                              {dataitem.tuition_invoice_id ||
                                                dataitem.invoiceId}
                                            </Link>
                                          </TableCell>
                                          <TableCell align="left">
                                            {dataitem.name}
                                          </TableCell>
                                          <TableCell align="left">
                                            {commmonfunctions.formatePrice(
                                              Number(dataitem?.txnamount)
                                            )}
                                          </TableCell>
                                          <TableCell align="left">
                                            {commmonfunctions.formatePrice(
                                              Number(dataitem?.amount)
                                            )}
                                          </TableCell>
                                          <TableCell align="left">
                                            {commmonfunctions.formatePrice(
                                              Number(dataitem?.creditsAvailable)
                                            )}
                                          </TableCell>

                                          <TableCell align="left">
                                            {dataitem.isEditing ? (
                                              <OutlinedInput
                                                fullWidth
                                                id="name"
                                                type="number"
                                                name="Credit to apply"
                                                size="small"
                                                value={dataitem.creditsToApply}
                                                onChange={(e) =>
                                                  handleOnChangeInputs(
                                                    e,
                                                    dataitem
                                                  )
                                                }
                                                onKeyDown={(e) =>
                                                  handleReceivePaymentAccordingToUs(
                                                    e,
                                                    dataitem,
                                                    key
                                                  )
                                                }
                                                onBlur={() =>
                                                  handleToggleEdit(key, dataitem.amount)
                                                }
                                                inputRef={(ref) =>
                                                  (inputRefs.current[key] = ref)
                                                }
                                                disabled={customerTotalCreditNoteBalance === 0 || dataitem.amount === 0 ? true : false}
                                              />
                                            ) : (
                                              <Typography
                                                variant="body1"
                                                component="div"
                                                onClick={() =>
                                                  handleToggleEdit(key, dataitem.amount)
                                                }
                                              >
                                                {dataitem.creditsToApply
                                                  ? dataitem.creditsToApply
                                                  : 0}
                                              </Typography>
                                            )}
                                          </TableCell>

                                          <TableCell align="left">
                                            {dataitem.isEditingForPayment ? (
                                              <OutlinedInput
                                                fullWidth
                                                id="name"
                                                type="number"
                                                name="Payment Amount"
                                                size="small"
                                                value={dataitem.paymentAmount}
                                                onChange={(e) =>
                                                  handleOnChangeInputs(
                                                    e,
                                                    dataitem
                                                  )
                                                }
                                                onKeyDown={(e) =>
                                                  handleReceivePaymentAccordingToUs(
                                                    e,
                                                    dataitem,
                                                    key
                                                  )
                                                }
                                                onBlur={() =>
                                                  handleToggleEditForPayment(
                                                    key, dataitem.amount
                                                  )
                                                }
                                                inputRef={(ref) =>
                                                (inputRefsForPayment.current[
                                                  key
                                                ] = ref)
                                                }
                                                disabled={dataitem.amount === 0 ? true : false}
                                              />
                                            ) : (
                                              <Typography
                                                variant="body1"
                                                component="div"
                                                onClick={() =>
                                                  handleToggleEditForPayment(
                                                    key, dataitem.amount
                                                  )
                                                }
                                              >
                                                {dataitem.paymentAmount
                                                  ? dataitem.paymentAmount
                                                  : 0}
                                              </Typography>
                                            )}
                                          </TableCell>
                                          <TableCell align="left">
                                            {commmonfunctions.formatePrice(
                                              dataitem.outstandingAmount
                                            )}{" "}
                                            {" (" + qatar_currency + ")"}
                                          </TableCell>

                                          <TableCell
                                            className="action"
                                            align="left"
                                          >
                                            <IconButton
                                              className="action-delete"
                                              style={{ color: "#F95A37" }}
                                              onClick={() =>
                                                openDelete(dataitem.id)
                                              }
                                            >
                                              <RiDeleteBin5Fill />
                                            </IconButton>
                                          </TableCell>
                                        </TableRow>
                                      </>
                                    );
                                  }
                                )}
                              <TableRow
                                sx={{ borderTop: "2px solid #cbcbcb " }}
                              >
                                <TableCell></TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  Total
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  {commmonfunctions.formatePrice(
                                    Number(TotalValuesSum("txnamount"))
                                  )}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  {commmonfunctions.formatePrice(
                                    Number(TotalValuesSum("amount"))
                                  )}{" "}
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  {commmonfunctions.formatePrice(
                                    Number(TotalValuesSum("creditsToApply"))
                                  )}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  {commmonfunctions.formatePrice(
                                    Number(TotalValuesSum("paymentAmount"))
                                  )}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  {commmonfunctions.formatePrice(
                                    Number(TotalValuesSum("outstandingAmount"))
                                  )}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </form>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </React.Fragment>
            ) : (
              ""
            )}
            {/* </Card> */}
          </div>
          <MainFooter />
        </Box>
      </Box>
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
    </>
  );
}
