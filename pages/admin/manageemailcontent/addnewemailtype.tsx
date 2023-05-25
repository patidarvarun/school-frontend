import {
    Button,
    Stack,
    IconButton,
    DialogTitle,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    InputLabel,
    OutlinedInput,
    CircularProgress,
} from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "@emotion/styled";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useForm, SubmitHandler } from "react-hook-form";
import { api_url, auth_token } from "../../../helper/config";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";

const style = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
};

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
                    <GridCloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
type FormValues = {
    emailtype: string;
};

export default function AddEmailType({
    open,
    closeDialog
}: {
    open: any;
    closeDialog: any;
}) {
    const [opens, setOpen] = React.useState(open);
    const [spinner, setshowspinner] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setshowspinner(true);
        setBtnDisabled(true);
        const reqData = {
            emailtype: data.emailtype,
        };
        await axios({
            method: "POST",
            url: `${api_url}/addemailtype`,
            data: reqData,
            headers: {
                Authorization: auth_token,
            },
        })
            .then((data) => {
                if (data) {
                    toast.success("Email Type  Created Successfully");
                    reset();
                    setshowspinner(false);
                    setBtnDisabled(false);
                    closeDialogs();
                }
            })
            .catch((error) => {
                toast.error("Email Type Already Registred");
                setshowspinner(false);
                setBtnDisabled(false);
            });
    };
    const closeDialogs = () => {
        closeDialog(false);
        setOpen(false);
    };

    return (
        <>
            <BootstrapDialog
                onClose={closeDialog}
                aria-labelledby="customized-dialog-title"
                open={opens}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={closeDialogs}
                >
                    Add New Email Type
                </BootstrapDialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>
                        <Grid>
                            <Stack>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="name">
                                                Email Type<span className="err_str">*</span>
                                            </InputLabel>
                                            <OutlinedInput
                                                type="text"
                                                id="name"
                                                fullWidth
                                                size="small"
                                                {...register("emailtype", {
                                                    required: true,
                                                    validate: (value) => { return !!value.trim() }
                                                })}
                                            />
                                            {errors.emailtype?.type === "required" && (
                                                <span style={style}>Field is Required *</span>
                                            )}
                                            {errors.emailtype?.type === "validate" && (
                                                <span style={style}>email Type can't be blank *</span>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Grid>
                    </DialogContent>
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
                                {spinner === true ? <CircularProgress color="inherit" /> : ""}
                            </span>
                        </Button>
                    </DialogActions>
                </form>
            </BootstrapDialog>
        </>
    );
}
