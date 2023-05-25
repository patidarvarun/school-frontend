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
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import Head from "next/head";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { api_url, auth_token } from "../../helper/config";
import AuthHeader from "../commoncmp/authheader";
import AuthRightTemplate from "../commoncmp/authrighttemplate";
import Footer from "../commoncmp/footer";
const theme = createTheme();

const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

export default function changePassword() {
  const router = useRouter();
  const { key } = router.query;
  let token = key;
  const [spinner, setShowspinner] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);

 const formSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is Required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Password should have at least 8 character and contain one uppercase, one lowercase, one number and one special character"
      ),
    confirmpassword: Yup.string()
      .required("Confirm Password is Required")
      .oneOf(
        [Yup.ref("password")],
        "Password and Confirm Password does not match"
      ),
  });

  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors }: any = formState;
  async function onSubmit(data: any, e: any) {
    e.preventDefault();
    setShowspinner(true);
    setBtnDisabled(true);
    const reqData = { token: token, password: data.password };
    await axios({
      method: "POST",
      url: `${api_url}/resetpassword`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setShowspinner(false);
          setBtnDisabled(false);
          toast.success("Password Reset Successfully Please Login !");
          const redirect = () => {
            router.push("/");
          };
          setTimeout(redirect, 3000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Reset passowrd link Expired !");
        setShowspinner(false);
        setBtnDisabled(false);
      });
  }

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
              //backgroundImage: "url(https://source.unsplash.com/random)",
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
                  marginLeft: 1,
                }}
              >
                <Typography
                  className="forgotPasswordAlignmentFont"
                  style={{
                    fontSize: "35px",
                    fontWeight: "900",
                    color: "#333333",
                  }}
                >
                  <span style={{ color: "#42D5CD" }}>RESET </span>
                  PASSWORD
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ mt: 3 }}>
                    <Typography>New Password</Typography>
                    <TextField
                      style={{ marginTop: "8px" }}
                      fullWidth
                      size="small"
                      type="password"
                      placeholder="********"
                      {...register("password", {
                        required: true,
                      })}
                    />
                    <Typography style={style}>
                      {errors.password?.message}
                    </Typography>
                    <Typography style={{ marginTop: "15px" }}>
                      Confirm Password
                    </Typography>
                    <TextField
                      style={{ marginTop: "8px" }}
                      fullWidth
                      size="small"
                      type="password"
                      placeholder="********"
                      {...register("confirmpassword", {
                        required: true,
                      })}
                    />
                    <Typography style={style}>
                      {errors.confirmpassword?.message}
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
                  </Box>
                </form>
              </Box>
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
      <ToastContainer />
    </>
  );
}
