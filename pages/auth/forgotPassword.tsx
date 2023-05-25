import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { api_url, auth_token } from "../../helper/config";
import axios from "axios";
import { Alert, CircularProgress, Stack } from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import Head from "next/head";
import AuthHeader from "../commoncmp/authheader";
import AuthRightTemplate from "../commoncmp/authrighttemplate";
import Footer from "../commoncmp/footer";
import { AddLogs } from "../../helper/activityLogs";

const theme = createTheme();

const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

type FormValues = {
  email1: string;
};

export default function ForgotPasswordPage() {
  const [emailerr, setemailerr] = React.useState("");
  const [emailSuccess, setemailSuccess] = React.useState("");
  const [spinner, setShowspinner] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  async function getSageCustomerId(idd: any) {
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${idd}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        AddLogs(
          idd,
          `Forgot Password Link Send - #CUS-${data?.data?.data[0]?.customerId}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setShowspinner(true);
    setBtnDisabled(true);
    const reqData = { email1: data.email1 };
    await axios({
      method: "POST",
      url: `${api_url}/forgotpassword`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data) => {
        if (data.status === 200) {
          setShowspinner(false);
          setBtnDisabled(false);
          getSageCustomerId(data?.data?.data[0]?.id);
          setemailSuccess("Link Send Successfully Please Check Your Email ");
          reset();
          setTimeout(() => {
            setemailSuccess("");
          }, 5000);
        }
      })
      .catch((error) => {
        setShowspinner(false);
        setBtnDisabled(false);
        setemailerr("Email Not Registered!");
        setTimeout(() => {
          setemailerr("");
        }, 5000);
      });
  };

  return (
    <>
      <Head>
        <title>QATAR INTERNATIONAL SCHOOL - QIS</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            className="header-main"
            item
            xs={12}
            sm={12}
            md={12}
            sx={{
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
              background: "#F0F3FF",
            }}
          >
            <div className="login-center">
               <AuthHeader />
            <Box
              className="forgotPasswordAlignment"
              sx={{
                maxWidth: "400px",
                width: "100%",
                marginLeft: "2px",
              }}
            >
              <Typography
                className="forgotPasswordAlignmentFont"
                sx={{
                  fontSize: "35px",
                  fontWeight: "900",
                  color: "#333333",
                }}
              >
                <span style={{ color: "#26CEB3" }}>Forgot</span> Your Password
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                {emailerr !== "" ? (
                  <Alert
                    severity="error"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    The email is Not Registered with us !
                  </Alert>
                ) : (
                  ""
                )}
                {emailSuccess !== "" ? (
                  <Alert
                    severity="success"
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    Reset Password Link Send Successfully.
                  </Alert>
                ) : (
                  ""
                )}
                <Box sx={{ mt: 1 }}>
                  <Typography>Email Address</Typography>
                  <TextField
                    style={{ marginTop: "8px" }}
                    fullWidth
                    size="small"
                    placeholder="Email Address..."
                    {...register("email1", {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    })}
                  />
                  <Typography style={style}>
                    {errors?.email1?.type === "required" && (
                      <div>Email field is required *</div>
                    )}
                  </Typography>
                  <Typography style={style}>
                    {errors?.email1?.type === "pattern" && (
                      <div>Please Enter Valid Email *</div>
                    )}
                  </Typography>
                  <Button
                    style={{ backgroundColor: "#1A70C5", fontWeight: "900" }}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={btnDisabled}
                  >
                    Submit
                    <Typography
                      style={{ fontSize: "2px", paddingLeft: "10px" }}
                    >
                      {spinner === true ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        ""
                      )}
                    </Typography>
                  </Button>
                  <Stack style={{ alignItems: "start" }}>
                    <Link
                      href="/"
                      style={{
                        color: "#1A70C5",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                    >
                      <BiArrowBack /> Back to Login
                    </Link>
                  </Stack>
                </Box>
              </form>
            </Box>
            </div>
            {/* <Box>
          <Footer />
            </Box> */}
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
