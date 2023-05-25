import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  InputAdornment,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { api_url, auth_token } from "../../../helper/config";
import AddCustomer from "../../commoncmp/getCustomer";
import AddActivity from "../../commoncmp/getActivity";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import styled from "@emotion/styled";
// import commmonfunctions from ".../commonFunctions/commmonfunctions";
import Script from "next/script";
import getwayService from "../../../services/gatewayService";
import cyberSourceSecureConfig from "../../../helper/cyberSourceSecureConfig";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../helper/activityLogs";
import { useRouter } from "next/router";
const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

//dialog box
const BootstrapDialog = styled(Dialog)(({ theme }) => ({}));
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className: any;
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

type FormValues = {
  name: string;
  payment: number;
  date: string;
  amount: string;
  email1: string;
  email2: string;
  number: number;
  printUs: string;
  parentId: number;
  userRole: String;
  agegroup: number;
  pregeneratedid: string;
};

export default function AddSalesOrder({
  open,
  closeDialog,
}: {
  open: any;
  closeDialog: any;
}) {
  const [value, setValue] = React.useState(0);
  const [spinner, setshowspinner] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [opens, setOpen] = React.useState(open);
  const [custtype, setcusttype] = React.useState<any>([]);
  const [customerId, setCustomerId] = React.useState<any>("");
  const [parentid, setparentid] = React.useState(0);
  const [parentname, setparentname] = React.useState<any>("");
  const [activityId, setActivityId] = React.useState<any>("");
  const [parentsid, setparentsid] = React.useState(0);
  const [parentsname, setparentsname] = React.useState<any>("");
  const [creditAmount, setCreditAmount] = React.useState<any>("");
  const [price, setPrice] = React.useState<any>("");
  const [customerError, setCustomerError] = React.useState<any>("");
  const [activityError, setActivityError] = React.useState<any>("");
  const [paymentPayMethod, setPaymentPayMethod] = React.useState<any>("");
  const [Check, setCheck] = React.useState(false);
  const [userUniqueId, setUserUniqId] = React.useState<any>();

  let datee = Date();
  const todayDate = moment(datee).format("DD/MM/YYYY");
  const todaysDate = moment(datee).format("MMM DD,YYYY");
  const [orderId, setorderId] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [creditNoteId, setcreditNoteId] = React.useState<any>("");
  const [cyberSignature, setCyberSignature] = useState("");
  const [unsignfiled, setUnsignfiled] = useState("");
  const [sageCustomerId, setsageCustomerId] = useState("");
  const [itemID, setItemId] = useState("");
  var Checkout: any;
  let creditBalance: any;
  let sageintacctInvoiceID: any = "";
  let dbInvoiceID: any = "";
  // let sageCustomerId :any = "";
  const router = useRouter();
  const currentDateTime = new Date().toISOString().split(".")[0] + "Z";

  React.useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });
  }, []);

  const handlePaymentName = async (data: any) => {
    const Checkout: any = (window as any).Checkout;
    console.log("currentDateTime=>", currentDateTime);
    setPaymentPayMethod(data);
    console.log("currentDateTime =>", currentDateTime);
    setUnsignfiled("");
    if (data === "CBQ") {
      //     const params : any ={
      //       access_key:"cfc1af4483773756a54a990e585ce7c5",
      //       profile_id:"70647EEB-EDE3-4859-9DD9-6E4605C9FABE",
      //       req_profile_id:"70647EEB-EDE3-4859-9DD9-6E4605C9FABE",
      //       ots_profileid:"70647EEB-EDE3-4859-9DD9-6E4605C9FABE",
      //       merchant_id:"cbq_qis_qar",
      //       transaction_uuid:"6401b9f5e7bb8",
      //       signed_field_names:"access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency",
      //       unsigned_field_names:"",
      //       signed_date_time:currentDateTime,
      //       locale:"en",
      //       transaction_type:"sale,create_payment_token",
      //       reference_number:"1250",
      //       amount:"70",
      //       currency:"QAR",
      //       submit:"Submit"

      // }
      let data: any = {
        access_key: process.env.CBQ_ACCESS_KEY,
        profile_id: process.env.CBQ_PROFILE_ID,
        req_profile_id: process.env.CBQ_PROFILE_ID,
        ots_profileid: process.env.CBQ_PROFILE_ID,
        merchant_id: process.env.CBQ_MERCHANT_ID,
        transaction_uuid: "6401e70",
        signed_field_names:
          "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,amount,currency",
        unsigned_field_names: "",
        signed_date_time: currentDateTime,
        locale: "en",
        transaction_type: process.env.CBQ_TRANSACTION_TYPE,
        // 'reference_number': refrensh__number,
        reference_number: "1429",
        amount: "300",
        currency: process.env.CURRENCY_CODE,
        submit: "Submit",
      };
      let signature = await cyberSourceSecureConfig.sign(data);
      console.log("signature =>", signature);

      setCyberSignature(signature);
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

  async function getSageCustomerId() {
    // let reqData = { isDeleted: 1 };
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${customerId}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Payment debit id - #CUS-${data?.data?.data[0]?.customerId}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const insertRemainingNotesAmount = async () => {
    // setAmount(creditBalance)
    // setPrice(creditBalance)
    console.log("price =>", creditBalance);
    const reqData = {
      customerId: customerId,
      Amount: creditBalance,
      amountMode: 0,
    };
    await axios({
      method: "PUT",
      url: `${api_url}/insertAmount`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        if (data) {
          getSageCustomerId();
          console.log("@@@@@@@@");
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
      //  creditNoteId = res?.CreditRequestId
      console.log("CreditRequestId =>", res?.CreditRequestId);
      setcreditNoteId(res?.CreditRequestId);
      setCreditAmount(res?.creditBal);
    } catch (error: any) {
      console.log("error", error.message);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const Checkout: any = (window as any).Checkout;
    let sageintacctorderID: any = "";

    if (customerId !== "" && activityId !== "") {
      setshowspinner(true);
      setBtnDisabled(true);

      console.log(
        "price",
        price,
        Check,
        "Check",
        "totalPrice",
        totalPrice,
        "creditBalance",
        creditBalance,
        "paymentPayMethod",
        paymentPayMethod
      );

      // let amountttt= price > creditBalance ? totalPrice : creditBalance === price ? 0 : price;

      if (Check === true) {
        const reqData = {
          amount: price,
          status: "Paid",
          userId: customerId,
          activityId: activityId,
          transactionId: "Trh4354654457",
          orderId: 46,
          createdBy: customerId,
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
              insertRemainingNotesAmount();
              if (data?.status === 200) {
                setorderId(data.data.sageIntacctorderID);
                sageintacctorderID = data.data.sageIntacctorderID;
                // setAmount(creditBalance)
              }
              const unique = keyGen(5);
              const reqData1 = {
                totalAmount: totalPrice,
                paidAmount: totalPrice,
                transactionId: `case-${unique} `,
                amexorderId: data?.data?.sageIntacctorderID,
                paymentMethod:
                  paymentPayMethod === "" ? "Cash" : paymentPayMethod,
                idForPayment: data?.data?.sageIntacctorderID,
                creditNotesId: creditNoteId,
              };
              transactionSave(reqData1);
              setshowspinner(false);
              setBtnDisabled(false);
              AddLogs(
                userUniqueId,
                `Sales order created id - #SAL-${data?.data?.sageIntacctorderID}`
              );
              toast.success("Sales Order Create Successfully !");
              closeDialog(false);
              setTimeout(() => {
                setOpen(false);
              }, 2000);
            }
          })
          .catch((error) => {
            // toast.error(error?.message);
            console.log("error", error);
            setshowspinner(false);
            setBtnDisabled(false);
          });
      } else {
        const reqData = {
          amount: price,
          status: "Paid",
          userId: customerId,
          activityId: activityId,
          transactionId: "Trh4354654457",
          orderId: 46,
          createdBy: customerId,
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
              // insertRemainingNotesAmount();
              if (data?.status === 200) {
                setorderId(data.data.sageIntacctorderID);
                sageintacctorderID = data.data.sageIntacctorderID;
                // setAmount(creditBalance)
              }
              const unique = keyGen(5);
              const reqData1 = {
                totalAmount: price,
                paidAmount: price,
                transactionId: `case-${unique} `,
                amexorderId: data?.data?.sageIntacctorderID,
                paymentMethod:
                  paymentPayMethod === "" ? "Cash" : paymentPayMethod,
                idForPayment: data?.data?.sageIntacctorderID,
                creditNotesId: null,
              };

              transactionSave(reqData1);
              setshowspinner(false);
              setBtnDisabled(false);
              AddLogs(
                userUniqueId,
                `Sales order created id - #SAL-${data?.data?.sageIntacctorderID}`
              );
              toast.success("Sales Order Create Successfully !");
              closeDialog(false);
              setTimeout(() => {
                setOpen(false);
              }, 2000);
            }
          })
          .catch((error) => {
            // toast.error(error?.message);
            console.log("error", error);
            setshowspinner(false);
            setBtnDisabled(false);
          });
      }
    } else {
      if (customerId === "") {
        setCustomerError("Customer field is Required *");
      } else {
        setCustomerError("");
      }
      if (activityId === "") {
        setActivityError("Activity field is Required *");
      } else {
        setActivityError("");
      }
    }
    await createInvoice();
    let orderamount = Check ? Math?.abs(price - creditBalance) : price;
    console.log("orderamount =>", orderamount);
    // payment getway
    if (paymentPayMethod === "Amex" && orderamount > 0) {
      if (price === 0) {
        toast.error("amount will not be $0 for AMFX payment method");
      } else {
        var requestData = {
          apiOperation: "CREATE_CHECKOUT_SESSION",
          order: {
            id: sageintacctorderID,
            amount: orderamount,
            currency: "QAR",
            description: "Orderd",
          },
          interaction: {
            // "returnUrl":`${process.env.NEXT_PUBLIC_REDIRECT_URL}/?orderid=${orderId}&paymentMethod=${paymentMethod}`,
            returnUrl: `${process.env.NEXT_PUBLIC_AMEX_SALES_ORDER_REDIRECT_URL}/?orderid=${sageintacctorderID}&paymentMethod=${paymentPayMethod}&creditNoteId=${creditNoteId}&sageintacctInvoiceID=${sageintacctInvoiceID}&dbInvoiceID=${dbInvoiceID}&SageCustomerid=${customerId}`,
            // cancelUrl: `${process.env.NEXT_PUBLIC_AMEX_SALES_ORDER_CANCEL_URL}`,
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
              // setSessionId(result?.data.session.id)
              // setsuccessIndicator(result?.data.successIndicator);
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

    if (paymentPayMethod === "Amex" && Check === true && orderamount === 0) {
      try {
        const rendomTransactionId = keyGen(5);
        let reqData = {
          totalAmount: price,
          paidAmount: price,
          transactionId: `case-${rendomTransactionId} `,
          amexorderId: sageintacctorderID,
          paymentMethod: "Cash",
          idForPayment: sageintacctorderID,
          creditNotesId: creditNoteId,
        };
        transactionSave(reqData);
      } catch (error: any) {
        console.log("Error ", error.message);
      }
    }

    if (paymentPayMethod === "CBQ") {
      console.log(
        `/checkpayment/cbq/?amount=${orderamount}&refrenceNumber=${sageintacctInvoiceID}&invoiceid=${dbInvoiceID}&sageCustomerId=${sageCustomerId}`
      );
      router.push(
        `/checkpayment/cbq/?amount=${orderamount}&refrenceNumber=${sageintacctInvoiceID}&invoiceid=${dbInvoiceID}&sageCustomerId=${sageCustomerId}`
      );
      // toast.info(`As of Now This payment method is not supported ${paymentPayMethod} !`);
    }

    if (paymentPayMethod === "QPay") {
      toast.info(
        `As of Now This payment method is not supported ${paymentPayMethod} !`
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

  const transactionSave = async (data: any) => {
    await axios({
      method: "POST",
      url: `${api_url}/createTransaction`,
      data: data,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((result: any) => {
        AddLogs(
          userUniqueId,
          `Sales order transaction id - #${data?.transactionId}`
        );
        console.log("transaction ");
      })
      .catch((error: any) => {
        console.log("error =>", error);
      });
  };

  const createInvoice = async () => {
    const invoiceStatus =
      paymentPayMethod === "Amex" || paymentPayMethod === "Case"
        ? "Paid"
        : "Pending";
    const dates = new Date();
    const invoiceDate = moment(dates).format("DD/MM/YYYY");
    const createdDate = moment(dates).format("DD/MM/YYYY");
    const requestedData = {
      itemId: [itemID],
      quantity: ["1"],
      amount: price,
      status: invoiceStatus,
      createdDate: createdDate,
      createdBy: customerId,
      invoiceDate: invoiceDate,
      customerId: customerId,
      invoiceNo: keyGen(10),
    };
    console.log(requestedData, "requestedInvoice");
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
          console.log("res =>", res);
          sageintacctInvoiceID = res?.data.sageIntacctInvoiceID;
          dbInvoiceID = res?.data.data.insertId;
          // setARInvoiceId(res?.data.sageIntacctInvoiceID)
          // toast.success("Invoice created Successfully !");
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err, "error");
        }
      });
  };

  const closeDialogs = () => {
    closeDialog(false);
    setOpen(false);
  };

  const Getdata = (item: any) => {
    console.log("customer ", item);
    if (item) {
      getCustomerNotes(item.id);
      setCustomerId(item.id);
      setsageCustomerId(item.customerId);
    } else {
      setCustomerId("");
    }
  };

  const GetActivitydata = (item: any) => {
    console.log("activity =>", item);
    if (item) {
      setItemId(item.Iid);
      setActivityId(item.id);
      setPrice(item.price);
    } else {
      setActivityId("");
      setCheck(false);
      setPrice(0);
    }
  };

  const style = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
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

  return (
    <>
      <Script
        src="https://amexmena.gateway.mastercard.com/static/checkout/checkout.min.js"
        data-error="errorCallback"
        data-cancel="cancelCallback"
        strategy="beforeInteractive"
      >
        {" "}
      </Script>
      <BootstrapDialog
        onClose={closeDialog}
        aria-labelledby="customized-dialog-title"
        open={opens}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={closeDialogs}
        >
          New Sales Order
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TabPanel value={value} index={0} className="new-sale">
                <Grid className="">
                  <Stack style={{ marginTop: "5px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">Customer Name</InputLabel>
                          <AddCustomer
                            Data={Getdata}
                            PId={parentid}
                            pname={parentname}
                          />
                          {customerId !== "" && customerError ? (
                            <span style={style}></span>
                          ) : (
                            customerError && (
                              <span style={style}>
                                Customer field is Required *
                              </span>
                            )
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack style={{ marginTop: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">Service</InputLabel>
                          <AddActivity
                            Data={GetActivitydata}
                            PId={parentsid}
                            pname={parentsname}
                          />
                          {activityId !== "" && activityError ? (
                            <span style={style}></span>
                          ) : (
                            activityError && (
                              <span style={style}>
                                Activity field is Required *
                              </span>
                            )
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">Date</InputLabel>
                          <OutlinedInput
                            type="text"
                            id="date"
                            value={todaysDate && todaysDate}
                            disabled
                            fullWidth
                            size="small"
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Stack style={{ marginTop: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="name">
                            Amount<span className="err_str"></span>
                          </InputLabel>
                          <OutlinedInput
                            type="text"
                            id="amount"
                            disabled
                            value={price && price}
                            startAdornment={
                              <InputAdornment position="end">$</InputAdornment>
                            }
                            placeholder=" Service amount"
                            fullWidth
                            size="small"
                          />
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
                              disabled={
                                (totalPrice === 0 && price === 0) ||
                                (Check === true && creditAmount > price)
                                  ? true
                                  : false
                              }
                              // {...register("payment")}
                              onChange={(e) =>
                                handlePaymentName(e.target.value)
                              }
                            >
                              <MenuItem value={"Cash"}>Cash</MenuItem>
                              <MenuItem value={"Amex"}>Amex</MenuItem>
                              <MenuItem value={"QPay"}>
                                QPay Debit-Card
                              </MenuItem>
                              <MenuItem value={"CBQ"}>CBQ Credit-Card</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Stack style={{ marginTop: "20px" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                          {price === 0 || creditAmount === 0 ? (
                            ""
                          ) : price > 0 ? (
                            <Checkbox
                              onChange={(e) => setCheck(e.target.checked)}
                              className="checkbox132"
                            />
                          ) : (
                            ""
                          )}
                          {customerId === "" || creditAmount === 0
                            ? ""
                            : `Want to use credit balance :$${creditAmount}`}
                          <div>
                            <h5 className="apply">Apply Payment</h5>
                          </div>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="name"></InputLabel>
                            <p>
                              Sales invoice amount :{" "}
                              {price === "" ? "$0.00" : "$" + price}
                            </p>
                          </Stack>
                          <Stack spacing={1} style={hideshowstyle}>
                            <InputLabel htmlFor="name"></InputLabel>
                            <div className="iadiv">
                              <div className="hh red">
                                Total Credit Balance:
                              </div>
                              <div>
                                $
                                {creditAmount === price
                                  ? creditAmount
                                  : creditAmount > price
                                  ? price
                                  : creditAmount}
                              </div>
                            </div>
                          </Stack>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="name"></InputLabel>
                            {Check != true ? (
                              <p>
                                Total amount :{" "}
                                {price === "" ? "$0.00" : "$" + price}
                              </p>
                            ) : (
                              <p>
                                Total amount : $
                                {price === 0
                                  ? "0.00"
                                  : price < creditAmount
                                  ? "0.00"
                                  : Math?.abs(creditAmount - price)}
                              </p>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Stack>
                </Grid>
              </TabPanel>
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  sx={{ width: 150 }}
                  autoFocus
                  disabled={btnDisabled}
                >
                  <b>Create</b>
                  <span style={{ fontSize: "2px", paddingLeft: "10px" }}>
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
    </>
  );
}
