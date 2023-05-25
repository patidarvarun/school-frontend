import * as React from "react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputLabel,
    OutlinedInput,
    Stack,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { api_url, auth_token } from "../../helper/config";
import { toast } from "react-toastify";
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

export default function EditCustomer({
    id,
    open,
    closeDialogedit,

}: {
    id: any;
    open: any;
    closeDialogedit: any;
}) {

    const [spinner, setshowspinner] = React.useState(false);
    const [btnDisabled, setBtnDisabled] = React.useState(false);
    const [opens, setOpen] = React.useState(open);

    React.useEffect(() => {
        getUserDet();
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>();

    //get user details
    const getUserDet = async () => {
        try {
            const response = await fetch(`${api_url}/getuserdetails/${id}`, {
                method: "GET",
                headers: {
                    Authorization: auth_token,
                },
            });
            const res = await response.json();
            console.log(res?.data[0])
            setValue("name", res.data[0].name);
            setValue("email1", res.data[0].email1);
            setValue("number", res.data[0].phone1);
            const addr = JSON.parse(res.data[0]?.address);
            setValue("address1", addr?.add1);
            setValue("address2", addr?.add2);
            setValue("city", addr?.city);
            setValue("state", addr?.state);
            setValue("postalcode", addr?.postalcode);

        } catch (error) {
            console.log("error", error);
        }
    };
    // submit data
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setshowspinner(true);
        setBtnDisabled(true);
        const address = {
            add1: data.address1,
            add2: data.address2,
            city: data.city,
            state: data.state,
            postalcode: data.postalcode,
        };
        const reqData = {
            name: data.name,
            phone1: data.number,
            email1: data.email1,
            useraddress: address,
        };
        await axios({
            method: "PUT",
            url: `${api_url}/edituser/${id}`,
            data: reqData,
            headers: {
                Authorization: auth_token,
            },
        })
            .then((data) => {
                if (data.status === 200) {
                    setshowspinner(false);
                    setBtnDisabled(false);
                    getUserDet();
                    toast.success("Customer Detail Updated Successfully !");
                    closeDialogs();
                }
            })
            .catch((err) => {
                toast.error("Somthing went wrong !");
                setshowspinner(false);
                setBtnDisabled(false);
            });
    };

    const closeDialogs = () => {
        closeDialogedit(false);
        setOpen(false);
    };

    return (
        <BootstrapDialog
            onClose={closeDialogs}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={closeDialogs}
                >
                    Edit Details
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid>
                        <Stack>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">
                                            Name <span className="err_str"></span>
                                        </InputLabel>
                                        <OutlinedInput
                                            type="text"
                                            id="name"
                                            {...register("name", {
                                                required: true,
                                                validate: (value) => { return !!value.trim() }
                                            })}
                                        />
                                        {errors.name?.type === "required" && (
                                            <span style={style}>Field is Required *</span>
                                        )}
                                        {errors.name?.type === "validate" && (
                                            <span style={style}>Field can't be blank *</span>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack style={{ marginTop: "20px" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">Email</InputLabel>
                                        <OutlinedInput
                                            placeholder="Email..."
                                            fullWidth
                                            size="small"
                                            {...register("email1", {
                                                required: true,
                                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            })}
                                        />
                                        {errors.email1?.type === "required" && (
                                            <span style={style}>Field is Required *</span>
                                        )}
                                        {errors.email1?.type === "pattern" && (
                                            <span style={style}>
                                                Please enter a valid email address *
                                            </span>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">Phone</InputLabel>
                                        <OutlinedInput
                                            type="text"
                                            id="phone"
                                            placeholder="Phone..."
                                            fullWidth
                                            size="small"
                                            {...register("number", {
                                                required: true,
                                                minLength: 10,
                                                maxLength: 10,
                                            })}
                                        />
                                        {errors.number?.type === "validate" && (
                                            <span style={style}>Field can't be blank *</span>
                                        )}
                                        {errors.number?.type === "minLength" && (
                                            <span style={style}>
                                                Phone number must be in 10 digit*
                                            </span>
                                        )}
                                        {errors.number?.type === "maxLength" && (
                                            <span style={style}>
                                                Phone number must be in 10 digit*
                                            </span>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack style={{ marginTop: "20px" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">Address 1</InputLabel>
                                        <OutlinedInput
                                            type="text"
                                            id="name"

                                            placeholder="Address1..."
                                            fullWidth
                                            size="small"
                                            {...register("address1")}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">Address 2</InputLabel>
                                        <OutlinedInput
                                            type="text"
                                            id="name"

                                            placeholder="Address2..."
                                            fullWidth
                                            size="small"
                                            {...register("address2")}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                        <Stack style={{ marginTop: "20px" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">City</InputLabel>
                                        <OutlinedInput
                                            type="text"
                                            id="name"

                                            placeholder="City..."
                                            fullWidth
                                            size="small"
                                            {...register("city")}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">State</InputLabel>
                                        <OutlinedInput
                                            type="text"
                                            id="name"

                                            placeholder="State..."
                                            fullWidth
                                            size="small"
                                            {...register("state")}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="name">
                                            Zip/Postal Code
                                        </InputLabel>
                                        <OutlinedInput
                                            type="text"
                                            id="name"

                                            placeholder="Postal Code..."
                                            fullWidth
                                            size="small"
                                            {...register("postalcode")}
                                        />
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
                        <b>Update</b>
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
        </BootstrapDialog>
    );
}
