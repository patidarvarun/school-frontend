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
import { api_url, auth_token } from "../../../helper/config";
import styled from "@emotion/styled";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useForm, SubmitHandler } from "react-hook-form";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
// import { AddLogs } from "../../../helper/activityLogs";

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
  name: string;
};

export default function EditType({
  id,
  open,
  closeDialogedit,
}: {
  id: any;
  open: any;
  closeDialogedit: any;
}) {
  const [opens, setOpen] = React.useState(open);
  const [spinner, setshowspinner] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [userUniqueId, setUserUniqId] = React.useState<any>();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    getTypeDet();
  }, []);

  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then(res => {
      setUserUniqId(res?.id)
    });
  }, []);

  //get customers type det
  const getTypeDet = async () => {
    const url = `${api_url}/getTypeDet/${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      setValue("name", res.data[0].name);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setshowspinner(true);
    setBtnDisabled(true);
    const reqData = {
      name: data.name,
    };
    await axios({
      method: "PUT",
      url: `${api_url}/editType/${id}`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data) => {
        if (data) {
          toast.success("Customer Type Updated Successfully");
          reset();
          setshowspinner(false);
          setBtnDisabled(false);
          closeDialogs();
        }
      })
      .catch((error) => {
        toast.error("Name Already Registered !");
        setshowspinner(false);
        setBtnDisabled(false);
      });
  };

  const closeDialogs = () => {
    closeDialogedit(false);
    setOpen(false);
  };

  return (
    <>
      <BootstrapDialog
        onClose={closeDialogs}
        aria-labelledby="customized-dialog-title"
        open={opens}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={closeDialogs}
        >
          Edit Customer Type
        </BootstrapDialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid>
              <Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="ename">
                        Customer Name<span className="err_str">*</span>
                      </InputLabel>
                      <OutlinedInput
                        type="text"
                        id="ename"
                        fullWidth
                        size="small"
                        {...register("name", {
                          required: true,
                          validate: (value) => { return !!value.trim() }
                        })}
                      />
                      {errors.name?.type === "required" && (
                        <span style={style}>Field is Required *</span>
                      )}
                      {errors.name?.type === "validate" && (
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
              name="editsubmit"
              variant="contained"
              size="small"
              sx={{ width: 150 }}
              autoFocus
              disabled={btnDisabled}
            >
              <b>Update</b>
              <span style={{ fontSize: "2px", paddingLeft: "10px" }}>
                {spinner === true ? <CircularProgress color="inherit" /> : ""}
              </span>
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
      <ToastContainer />
    </>
  );
}
