import * as React from "react";
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
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import getwayService from "../../services/gatewayService"
import { api_url, auth_token } from "../../helper/config";
import { AddLogs } from "../../helper/activityLogs";
import commmonfunctions from "../../commonFunctions/commmonfunctions";
import moment from "moment";
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
    status: number;
    customertype: number;
    email1: string;
    email2: string;
    number: number;
    contactName: string;
    printUs: string;
    parentId: number;
    userRole: String;
    agegroup: number;
    attentionto: number;
    alternatenumber: number;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalcode: number;
};

export default function PaymentPopup({
    open,
    closeDialog,
    custDt,
    invoiceStatus
}: {
    open: any;
    closeDialog: any;
    custDt: any,
    invoiceStatus: any
}) {
    const [customerCreditNoteRequestId, setCustomerCreditNoteRequestId] = React.useState(null);
    const [isChecked, setIsChecked] = React.useState(false);
    const [paymentMethod, setPaymentMethod] = React.useState('Cash');
    const [finalAmountToPay, setFinalAmountToPay] = React.useState(0);
    const [applyCreditNoteAmount, setApplyCreditNoteAmount] = React.useState(0);
    const [userUniqueId, setUserUniqId] = React.useState<any>();
    const [recievedPay, setRecieved] = React.useState<FormValues | any>([]);
    const [opens, setOpen] = React.useState(open);
    const closeDialogs = () => {
        closeDialog(false);
        setOpen(false);
    };

    React.useEffect(() => {
        commmonfunctions.VerifyLoginUser().then(res => {
            setUserUniqId(res?.id)
        });
        setRecieved(custDt);
    }, []);

    // if (custDt.status == "paid") {
    //     setOpen(false);
    //     toast.success("Already Paid!");
    // } else {
    //     setRecieved(custDt);
    //     setOpen(true);
    // }
    // setorderId(item.invoiceId);
    // setInvoiceAmount(item.amount);
    // setInvoiceStatus(item.status);
    // setFinalAmountToPay(item.amount);
    // setCustomerId(item.customerId);
    // getCustomerNotes(item.customerId);



    const handleCheckBoxClick = async (e: any) => {
        console.log("event =>", e.target.checked);
        setIsChecked(e.target.checked);
        if (e.target.checked === true) {
            // let applyCreditNoteAmout = customerTotalCreditNoteBalance > InvoiceAmount ? InvoiceAmount : customerTotalCreditNoteBalance;
            // let creditNoteRemaingAmount = customerTotalCreditNoteBalance > InvoiceAmount ? customerTotalCreditNoteBalance - InvoiceAmount : 0;
            // setApplyCreditNoteAmount(applyCreditNoteAmout);
            // let actualPay = customerTotalCreditNoteBalance > InvoiceAmount ? 0 : InvoiceAmount - customerTotalCreditNoteBalance;
            // setFinalAmountToPay(actualPay)

            // console.log("creditNoteRemaingAmount =>", creditNoteRemaingAmount);
            // setCustomerCreditNoteRemaingAmount(creditNoteRemaingAmount);
        } else {
            // setApplyCreditNoteAmount(0);
            // setFinalAmountToPay(InvoiceAmount);
            // setCustomerCreditNoteRequestId(null);
        }
    }

    const handleCreate = async (id: any) => {

        // console.log(process.env.NEXT_PUBLIC_REDIRECT_URL,"Checkout =>",(window as any).Checkout);
        const Checkout: any = (window as any).Checkout
        const creditNotesId = isChecked ? customerCreditNoteRequestId : null

        console.log("payment method => ", paymentMethod, "isChcked =>", isChecked, "finaltopay =>", finalAmountToPay);

        if (paymentMethod === "Amex" && finalAmountToPay > 0) {
            if (finalAmountToPay === 0) {
                toast.error("amount will not be $0 for Amex payment method");
            } if (invoiceStatus === "draft") {
                toast.error("Invoice has status with Draft,Only Pending invoice Can Pay ");
            }
            else {
                console.log(custDt.customerId, "customerId", applyCreditNoteAmount, "=======> ", creditNotesId);
                var requestData = {
                    "apiOperation": "CREATE_CHECKOUT_SESSION",
                    "order": {
                        "id": custDt.invoiceId,
                        "amount": finalAmountToPay,
                        "currency": "QAR",
                        "description": "Orderd",
                    },
                    "interaction": {
                        // "returnUrl":`${process.env.NEXT_PUBLIC_REDIRECT_URL}/?orderid=${orderId}&paymentMethod=${paymentMethod}`,
                        "returnUrl": `${process.env.NEXT_PUBLIC_AMEX_INVOICE_REDIRECT_URL}/?orderid=${custDt.invoiceId}&paymentMethod=${paymentMethod}&creditNoteId=${creditNotesId}&remaingAmount=${applyCreditNoteAmount}&customerID=${custDt.customerId}`,
                        "cancelUrl": `${process.env.NEXT_PUBLIC_AMEX_INVOICE_CANCEL_URL}`,
                        "operation": "PURCHASE",
                        "merchant": {
                            "name": "QATAR INTERNATIONAL SCHOOL - ONLINE 634",
                            "address": {
                                "line1": "200 Sample St",
                                "line2": "1234 Example Town"
                            }
                        }
                    }
                }
                await getwayService.getSession(requestData, async function (result: any) {
                    if (result?.data?.result === "SUCCESS") {
                        // setSessionId(result?.data.session.id)
                        // setsuccessIndicator(result?.data.successIndicator);
                        await Checkout.configure({
                            session: {
                                id: result?.data.session.id
                            }
                        });
                        await Checkout.showPaymentPage();
                    }
                })
            }
        }
        if (paymentMethod === "Cash") {
            try {
                const dataforRemaingAmount: any = {
                    customerId: custDt.customerId,
                    Amount: applyCreditNoteAmount,
                    amountMode: 0,
                }

                const rendomTransactionId = keyGen(5);
                let amount = finalAmountToPay > 0 ? finalAmountToPay : custDt.amount
                let reqData = {
                    totalAmount: amount,
                    paidAmount: amount,
                    transactionId: `case-${rendomTransactionId} `,
                    amexorderId: custDt.invoiceId,
                    paymentMethod: "Cash",
                    idForPayment: custDt.invoiceId,
                    creditNotesId: customerCreditNoteRequestId
                };

                await transactionSaveInDB(reqData);
                await insertRemainingNotesAmount(dataforRemaingAmount);
                await updateInvoiceAfterPay(id)
                //handleCloses();
            } catch (error: any) {
                console.log("Error ", error.message);
            }
        }
        if (paymentMethod === "Amex" && finalAmountToPay === 0) {

            try {
                const dataforRemaingAmount: any = {
                    customerId: custDt.customerId,
                    Amount: applyCreditNoteAmount,
                    amountMode: 0,
                }
                const rendomTransactionId = keyGen(5);
                let reqData = {
                    totalAmount: finalAmountToPay,
                    paidAmount: finalAmountToPay,
                    transactionId: `case-${rendomTransactionId} `,
                    amexorderId: custDt.invoiceId,
                    paymentMethod: "Cash",
                    idForPayment: custDt.invoiceId,
                    creditNotesId: customerCreditNoteRequestId
                };
                await transactionSaveInDB(reqData);
                await insertRemainingNotesAmount(dataforRemaingAmount);
                await updateInvoiceAfterPay(id)
                setOpen(false);
            } catch (error: any) {
                console.log("Error ", error.message);
            }
        }
        if (paymentMethod === "QPay") {
            toast.info(`As of Now This payment method is not supported ${paymentMethod} !`);
        }

        if (paymentMethod === "CBQ") {
            toast.info(`As of Now This payment method is not supported ${paymentMethod} !`);
        }

    }

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

    const transactionSaveInDB = async (data: any) => {
        getwayService.transactionDataSaveInDB(data, function (result: any) {
            console.log("final result =>", result);
            //setShowSuccess(true)
            setTimeout(callBack_func, 5000);
            function callBack_func() {
                //setShowSuccess(false)
                document.location.href = `${process.env.NEXT_PUBLIC_AMEX_INVOICE_REDIRECT_URL}`;
            }

        });
    }

    const insertRemainingNotesAmount = async (reqData: any) => {
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
                    AddLogs(userUniqueId, `Debit amount id - #CUS${(reqData?.customerId)}`);
                    console.log("@@@@@@@@");
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const updateInvoiceAfterPay = async (invoiceId: any) => {
        try {
            // let requestedData = {
            //     note: note ? note : null,
            // };
            await axios({
                method: "PUT",
                url: `${api_url}/updateInvoice/${invoiceId}`,
                // data: requestedData,
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
                .then((res) => {
                    //setNote("");
                    // console.log('$$$$$$ress',res);
                    // AddLogs(userUniqueId, `Payment created id - (${(invoiceId)})`);
                    toast.success("Payment Successfully !");
                    setTimeout(() => {
                        //handleCloses();
                    }, 1000);
                })
                .catch((err) => { });
        } catch (error: any) {
            console.log("error => ", error.message);
        }
    }

    return (
        <BootstrapDialog
            onClose={closeDialogs}
            aria-labelledby="customized-dialog-title"
            open={opens}
        >
            <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={closeDialogs}
            >
                Receive Payment
            </BootstrapDialogTitle>
            <DialogContent dividers className="popup">
                <Grid>
                    <Stack>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">
                                        Customer <span className="err_str">*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        defaultValue={recievedPay.name}
                                        type="text"
                                        id="name"
                                        placeholder="Customer Name..."
                                        fullWidth
                                        size="small"
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
                                        Received On <span className="err_str">*</span>
                                    </InputLabel>
                                    <OutlinedInput
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
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">
                                        Payment  Method <span className="err_str">*</span>
                                    </InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        defaultValue="Cash"
                                        size="small"
                                        onChange={(e) => { setPaymentMethod(e.target.value) }}
                                    >
                                        <MenuItem value="All"></MenuItem>
                                        <MenuItem value="CBQ">CBQ</MenuItem>
                                        {/* <MenuItem value="QPay">QPay</MenuItem> */}
                                        <MenuItem value="Amex">AMEX</MenuItem>
                                        <MenuItem value="Cash">Cash</MenuItem>
                                    </Select>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                    <Stack style={{ marginTop: "15px" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">Reference</InputLabel>
                                    <OutlinedInput
                                        //onChange={(e) => setNote(e.target.value)}
                                        type="text"
                                        id="name"
                                        placeholder="Enter note"
                                        fullWidth
                                        size="small"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">
                                        Amount <span className="err_str">*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        disabled
                                        defaultValue={recievedPay.amount}
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
                    {/* <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Want to use credit balance $100"
                className="want"
              />
            </FormGroup> */}
                    {/* <div>
              <h5 className="apply">Apply Payment</h5>
            </div>
            <div className="iadiv">
              <div className="hh">Invoice Amount:</div>
              <div>${recievedPay.amount}.00</div>
            </div>
            <div className="iadiv">
              <div className="hh red">Total Credit Balance:</div>
              <div>$0.00</div>
            </div> */}
                    <Stack style={{ marginTop: "20px" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>

                                {/* {customerTotalCreditNoteBalance != 0 && <>
                                    <Checkbox
                                        onChange={(e) => { handleCheckBoxClick(e) }}
                                        className="checkbox132"
                                    />
                                    Want to use credit balance :${customerTotalCreditNoteBalance}.00
                                </>} */}

                                <div>
                                    <h5 className="apply">Apply Payment</h5>
                                </div>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name"></InputLabel>
                                    {/* <p>Sales invoice amount : ${InvoiceAmount}.00 </p> */}
                                </Stack>
                                <Stack spacing={1} >
                                    <InputLabel htmlFor="name"></InputLabel>
                                    <div className="iadiv">
                                        <div className="hh red">Total Credit Balance:</div>
                                        {/* <div> ${applyCreditNoteAmount}.00 </div> */}
                                    </div>
                                </Stack>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name"></InputLabel>
                                    {/* <p> Total amount :${finalAmountToPay}.00 </p> */}

                                </Stack>
                            </Grid>
                        </Grid>
                    </Stack>
                </Grid>
                {/* <div className="total-amount">
            <div className="hh">Total Amount:</div>
            <div>${recievedPay.amount}.00</div>
          </div> */}
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    autoFocus
                // onClick={() => handleCreate(recievedPay.id)}
                >
                    Receive
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
