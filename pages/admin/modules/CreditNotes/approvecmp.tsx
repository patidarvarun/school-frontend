import {
  Button,
  CardContent,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Table,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api_url, auth_token } from "../../../../helper/config";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../../helper/activityLogs";


type FormValues = {
  message: string;
  status: number;
  amount: number;
  updatedBy: number;
  customerId: number;
  amountMode: number;
  creditRequestId: number;
  payamount:number;
};
const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};
export default function ApproveCompForm({
  id,
  roleid,
  closeDialog,
  custId,
  creditReqId,
  invoiceId,
  salesOrderid,
  approvedBy,
  payamount,
  status,
}: {
  id: any;
  roleid: any;
  closeDialog: any;
  custId: any;
  creditReqId: any;
  invoiceId: any;
  salesOrderid: any;
  approvedBy: any;
  payamount:any;
  status: any;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [amount,setAmount] = React.useState<any>(payamount && payamount?.amount)
  const [message,setMessage] = React.useState<any>(payamount && payamount?.message)
  const [userUniqueId, setUserUniqId] = React.useState<any>();

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
      .then((data:any) => {
        AddLogs(userUniqueId,`Edit Credit Notes - #CUS-${(data?.data?.data[0]?.customerId)}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if( data.amount > payamount){
      toast.error("You can not enter an amount that is more than the invoice amount");
    }else{
      const reqData = {
      amount: data.amount,
      message: data.message,
      status: status,
      customerId: custId,
      amountMode: 1,
      creditRequestId: creditReqId,
      updatedBy: 1,
      invoiceId: invoiceId,
      salesOrderId: salesOrderid,
      approvedBy: approvedBy,
      amountReqMsg:data.amount
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
          toast.success("Credit Notes Updated Successfully !");
          reset();
          closeDialogs();
          router.push("/admin/creditnotes/creditnotelisting");
        }
      })
      .catch((error) => {
        toast.error(" Internal Server Error !");
      });
    }
  };
  const closeDialogs = () => {
    closeDialog(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <Stack>
              <Typography
                variant="h5"
                style={{
                  fontWeight: "bold",
                  color: "#333333",
                }}
              >
                How much you want to credit back?
              </Typography>
            </Stack>
          </Stack>
          <Table style={{ marginTop: "20px" }}>
            <Stack>
              <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name">AMOUNT</InputLabel>
                
                    <OutlinedInput
                      type="text"
                      id="name"
                      fullWidth
                      value={amount}
                      size="small"
                      {...register("amount", {
                        required: true,
                      })}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    {errors.amount?.type === "required" && (
                      <span style={style}>Field is Required *</span>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={12} className="delete-popup">
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name">
                      Your comments on this request{" "}
                    </InputLabel>
                    <OutlinedInput
                      className="comment"
                      type="text"
                      id="name"
                      fullWidth
                      size="small"
                      value={message}
                      {...register("message", {
                        required: true,
                      })}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    {errors.message?.type === "required" && (
                      <span style={style}>Field is Required *</span>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    <b>SAVE</b>
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#F95A37",
                    }}
                    onClick={closeDialogs}
                  >
                    <b>CANCEL</b>
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Table>
        </CardContent>
      </form>
      <ToastContainer />
    </>
  );
}
