import {
    Button,
    Dialog,
    DialogTitle,
    Grid,
    IconButton,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import styled from "@emotion/styled";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import { api_url, auth_token, qatar_currency } from "../../../helper/config";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../helper/activityLogs";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
}));

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

type FormValues = {
    message: string;
};

const style = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
};

export default function RequestFormCmp({
    open,
    reqDet,
    closeDialog
}: {
    open: any;
    reqDet: any;
    closeDialog: any

}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>();
    const [userUniqueId, setUserUniqId] = React.useState<any>();

    async function getSageCustomerId() {
        await axios({
            method: "GET",
            url: `${api_url}/getSageCustomerid/${reqDet?.userId}`,
            headers: {
                Authorization: auth_token,
            },
        })
            .then((data: any) => {
                AddLogs(userUniqueId, `Credit Request created by - #CUS-${(data?.data?.data[0]?.customerId)}`);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const reqData = {
            userId: reqDet && reqDet.userId ? reqDet?.userId : reqDet?.customerId,
            sageinvoiceId: reqDet && reqDet.tuition_invoice_id ? reqDet.tuition_invoice_id : reqDet && reqDet?.sales_order_id ? reqDet?.sales_order_id : reqDet.sageinvoiceId,
            invoiceId: reqDet.id ? reqDet.id : reqDet.invoiceId,
            status: 0,
            amount: reqDet?.amount,
            message: data.message,
            createdBy: reqDet.createdBy || userUniqueId
        };
        await axios({
            method: "POST",
            url: `${api_url}/addCreditNotes`,
            data: reqData,
            headers: {
                Authorization: auth_token,
            },
        })
            .then((res) => {
                if (res) {
                    getSageCustomerId();
                    toast.success("Credit Request Created Successfull !");
                    reset();
                    closeDialogs();
                }
            })
            .catch((error) => {
                toast.error("Inter Server Error!",);
                console.log("error", error);
            });
    };

    React.useEffect(() => {
        commmonfunctions.VerifyLoginUser().then(res => {
            setUserUniqId(res?.id)
        });
    }, []);


    const closeDialogs = () => {
        closeDialog(false);
    };

    return (
        <>
            <BootstrapDialog
                onClose={closeDialogs}
                aria-labelledby="customized-dialog-title"
                open={open}
            > <form onSubmit={handleSubmit(onSubmit)}>
                    <BootstrapDialogTitle
                        id="customized-dialog-title"
                        onClose={closeDialogs}
                    >
                        Credit Request
                    </BootstrapDialogTitle>
                    <DialogContent dividers className="popup">
                        <Grid>
                            <Stack style={{ marginTop: "8px" }}>
                                <Grid container spacing={2}>
                                    <Stack spacing={1} paddingLeft={"20px"}>
                                        <Typography variant="h5" style={{ color: "#26CEB3" }}>{reqDet?.sageinvoiceId || reqDet?.sales_order_id}</Typography>
                                    </Stack>
                                </Grid>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                style={{ padding: "8px", marginBottom: "15px" }}
                            >
                                <Stack>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        style={{ fontWeight: "bold", color: "#333333" }}
                                    >
                                        {reqDet?.actname}
                                    </Typography>
                                </Stack>
                                <b>{reqDet?.amount}.00 {" (" + qatar_currency + ")"}</b>
                            </Stack>
                            <Stack style={{ marginTop: "10px" }}>
                                <Grid container spacing={2} paddingLeft={"20px"}>
                                    <InputLabel id="demo-select-small" style={{ marginBottom: "10px" }}>
                                        Reason for Credit Request <span className="err_str">*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        id="name"
                                        fullWidth
                                        {...register("message", {
                                            required: true,
                                        })}
                                    />
                                </Grid>
                            </Stack>
                            {errors.message?.type === "required" && (
                                <span style={style}>Field is Required *</span>
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={closeDialogs}
                            size="small"
                            style={{ color: "#F44336" }}
                        >
                            <b>Cancel</b>
                        </Button>
                        <Button
                            type="submit"
                            name="submit"
                            size="small"
                            style={{ color: "#66BB6A" }}
                        >
                            <b>OK</b>
                        </Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
            <ToastContainer />
        </>
    );
}
