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
import { api_url, auth_token } from "../../../../helper/config";
import { AddLogs } from "../../../../helper/activityLogs";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";

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
    rolename: string;
};

export default function AddRole({
    open,
    closeDialog
}: {
    open: any;
    closeDialog: any;
}) {
    const [opens, setOpen] = React.useState(open);
    const [spinner, setshowspinner] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(false);
const [userUniqueId, setUserUniqId] = React.useState<any>();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>();

    useEffect(() => {
        commmonfunctions.VerifyLoginUser().then(res => {
          setUserUniqId(res?.id)
        });
      }, []);
    

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setshowspinner(true);
        setBtnDisabled(true);
        const reqData = {
            name: data.rolename,
        };
        await axios({
            method: "POST",
            url: `${api_url}/addRole`,
            data: reqData,
            headers: {
                Authorization: auth_token,
            },
        })
            .then((data) => {
                if (data) {
                    toast.success("Role Created Successfully !");
                    reset();
                    setshowspinner(false);
                    setBtnDisabled(false);
                    closeDialogs();
                }
            })
            .catch((error) => {
                toast.error("Name Already Registred !");
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
                    Add New Role
                </BootstrapDialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent dividers>
                        <Grid>
                            <Stack>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="name">
                                                Role Name<span className="err_str">*</span>
                                            </InputLabel>
                                            <OutlinedInput
                                                type="text"
                                                id="name"
                                                fullWidth
                                                size="small"
                                                {...register("rolename", {
                                                    required: true,
                                                    validate: (value) => { return !!value.trim() }
                                                })}
                                            />
                                            {errors.rolename?.type === "required" && (
                                                <span style={style}>Field is Required *</span>
                                            )}
                                            {errors.rolename?.type === "validate" && (
                                                <span style={style}>Customer Type can't be blank *</span>
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
