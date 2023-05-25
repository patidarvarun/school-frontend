import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { api_url, auth_token } from "../../../../helper/config";
import { ToastContainer, toast } from "react-toastify";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../../helper/activityLogs";
const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};
type FormValues = {
  message: string;
  status: number;
  updatedBy: number;
};

export default function DeleteFormDialog({
  id,
  open,
  closeDialog,
}: {
  id: any;
  open: any;
  closeDialog: any;
}) {
  const [opens, setOpen] = React.useState(open);
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();


  React.useEffect(() => {
    commmonfunctions.VerifyLoginUser().then(res => {
      setUserUniqId(res?.id)
    });
  }, []);


  async function getSageCustomerId() {
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${id}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        AddLogs(userUniqueId, `Delete Credit Notes - #CUS-${(data?.data?.data[0]?.customerId)}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const reqData = {
      message: data.message,
      status: 3,
      updatedBy: 1,
      approvedBy: 1
    };
    await axios({
      method: "put",
      url: `${api_url}/editCreditNotes/${id}`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data) => {
        if (data) {
          getSageCustomerId();
          toast.success("Delete Credit Notes Successfully !");
          reset();
          closeDialogs();
        }
      })
      .catch((error) => {
        console.log('@@@@@@@@', error);
        toast.error(" Internal Server Error !");
      });
  };
  const closeDialogs = () => {
    closeDialog(false);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={closeDialog} className="delete-popup">
        <DialogTitle>Delete Credit Notes</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent style={{ paddingBottom: "0" }}>
            <DialogContentText>
              Are you sure want to Delete <b>“Credit Notes”</b> from the
              records.
            </DialogContentText>
            <Grid>
              <Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={1} style={{ marginTop: "15px" }}>
                      <InputLabel htmlFor="name">Add Note</InputLabel>
                      <OutlinedInput
                        className="comment"
                        type="text"
                        id="name"
                        fullWidth
                        {...register("message", {
                          required: true,
                          validate: (value) => {
                            return !!value.trim();
                          },
                        })}
                      />
                      {errors.message?.type === "required" && (
                        <span style={style}>Field is Required *</span>
                      )}
                      {errors.message?.type === "validate" && (
                        <span style={style}>Name can't be blank *</span>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} style={{ color: "red" }}>
              Cancel
            </Button>
            <Button type="submit" style={{ color: "#66BB6A" }}>
              ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ToastContainer />
    </>
  );
}
