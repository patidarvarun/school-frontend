import {
  Card,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Grid,
  CardContent,
  InputLabel,
  OutlinedInput,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import MiniDrawer from "./sidebar";
import commmonfunctions from "../commonFunctions/commmonfunctions";
import MainFooter from "./commoncmp/mainfooter";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { api_url, auth_token } from "../helper/config";
import Loader from "./commoncmp/myload";
import { Visibility, VisibilityOff } from "@mui/icons-material";
type FormValues = {
  name: string;
  email: string;
  number: number;
  password: string;
};
const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

export default function ViewCustomer() {
  const router = useRouter();
  const [userDet, setUserDet] = useState<any>([]);
  const [editformOpen, seteditformOpen] = React.useState(false);
  const [spinner, setshowspinner] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [myload, setmyload] = React.useState(true);
  setTimeout(() => {
    setmyload(false);
  }, 1500);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>();

  let logintoken: any;
  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
        router.push("/");
      }
    });
    const logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null || logintoken === "") {
      router.push("/");
    }
    if (logintoken) {
      commmonfunctions.GetuserDet(logintoken).then(response => {
        setUserDet(response);
        setValue("name", response && response.name);
        setValue("email", response && response.email1);
        setValue("number", response && response.phone1);
        setValue("password", '');
      })
    }
  }, []);

  //edit form open
  function handleEditFormOpen() {
    seteditformOpen(true);
  }

  function closeeditform() {
    seteditformOpen(false);
    setValue("password", '');
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setshowspinner(true);
    setBtnDisabled(true);
    const reqData = {
      name: data.name,
      email1: data.email,
      phone1: data.number,
      password: data.password
    };
    await axios({
      method: "put",
      url: `${api_url}/edituser/${userDet?.id}`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        if (data) {
          toast.success("User updated successfully!");
          setshowspinner(false);
          setBtnDisabled(false);
          seteditformOpen(false)
          setValue("password", '');
        }
      })
      .catch((error) => {
        toast.error("Email Already Registred !");
        setshowspinner(false);
        setBtnDisabled(false);
      });
  };

  const validatePassword = (value: any) => {
    if (value) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/; // Password must contain at least one letter, one number, and be at least 8 characters long
      return regex.test(value) || "Password must contain at least one letter, one number, and be at least 8 characters long";
    }
  };

  return (
    <>
      {myload ? (
        <Loader />
      ) : (
        <Box sx={{ display: "flex" }}>
          <MiniDrawer />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <div className="guardianBar">
              {/*bread cump */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                style={{ padding: "8px", marginBottom: "25px" }}
              >
                <Stack>
                  <Stack spacing={3}>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                      <Link
                        key="1"
                        color="inherit"
                        href="/customer/customerslist"
                        style={{ color: "#1A70C5", textDecoration: "none" }}
                      >
                        Home
                      </Link>
                      <Link
                        key="2"
                        color="inherit"
                        href="/"
                        style={{ color: "#7D86A5", textDecoration: "none" }}
                      >
                        User Profile
                      </Link>
                    </Breadcrumbs>
                  </Stack>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ fontWeight: "bold", color: "#333333" }}
                  >
                    USER PROFILE
                  </Typography>
                </Stack>
              </Stack>
              {/*bread cump */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  {" "}
                  <Card
                    sx={{ minWidth: 275 }}
                    className="box-shadow"
                    style={{ borderRadius: "5px" }}
                  >
                    <CardContent>
                      <Stack style={{ padding: "8px" }}>
                        <Box sx={{ display: "flex" }}>
                          <div id="profileImage">
                            <span id="fullName">
                              {" "}
                              {userDet &&
                                userDet.name &&
                                userDet.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <CardContent sx={{ flex: 1 }} className="text-grey">
                            <Typography component="h4" variant="h4">
                              {userDet && userDet.name}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="text.secondary"
                            >
                              {userDet && userDet?.id}
                            </Typography>
                            <Typography variant="subtitle1">
                              {userDet?.email1}
                            </Typography>
                            <Typography variant="subtitle1">
                              {userDet?.phone1}
                            </Typography>
                          </CardContent>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={8}>
                  <Grid item xs={12} md={12}>
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{ padding: "8px" }}
                        >
                          <Stack>
                            <Typography
                              variant="h5"
                              gutterBottom
                              style={{
                                fontWeight: "bold",
                                color: "#333333",
                              }}
                            >
                              <b>Details</b>
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography
                              style={{ color: "#1A70C5", cursor: "pointer" }}
                              onClick={handleEditFormOpen}
                            >
                              <b>Edit Details</b>
                            </Typography>
                          </Stack>
                        </Stack>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Box sx={{ width: "100%" }}>
                            <Grid item xs={12}>
                              <Stack style={{ marginTop: "20px" }}>
                                <Grid container spacing={3}>
                                  {editformOpen === false ? (
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <InputLabel htmlFor="name">
                                          Name
                                        </InputLabel>
                                        <OutlinedInput
                                          type="text"
                                          id="name"
                                          fullWidth
                                          size="small"
                                          {...register("name")}
                                          disabled
                                        />
                                      </Stack>
                                    </Grid>
                                  ) : (
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <InputLabel htmlFor="name">
                                          Name{" "}
                                          <span className="err_str">*</span>
                                        </InputLabel>
                                        <OutlinedInput
                                          type="text"
                                          id="name"
                                          fullWidth
                                          size="small"
                                          {...register("name", {
                                            required: true,
                                            validate: (value) => {
                                              return !!value.trim();
                                            },
                                          })}
                                        />
                                      </Stack>
                                      {errors.name?.type === "required" && (
                                        <span style={style}>
                                          Field is Required *
                                        </span>
                                      )}
                                      {errors.name?.type === "validate" && (
                                        <span style={style}>
                                          Field can't be blank *
                                        </span>
                                      )}
                                    </Grid>
                                  )}
                                  {editformOpen === false ? (
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <InputLabel htmlFor="Price">
                                          Email id
                                        </InputLabel>
                                        <OutlinedInput
                                          type="text"
                                          id="name"
                                          fullWidth
                                          size="small"
                                          {...register("email")}
                                          disabled
                                        />
                                      </Stack>
                                    </Grid>
                                  ) : (
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <InputLabel htmlFor="Price">
                                          Email id{" "}
                                          <span className="err_str">*</span>
                                        </InputLabel>
                                        <OutlinedInput
                                          type="text"
                                          id="name"
                                          fullWidth
                                          size="small"
                                          {...register("email", {
                                            required: true,
                                            pattern: /^\S+@\S+$/i,
                                            validate: (value) => {
                                              return !!value.trim();
                                            },
                                          })}
                                        />
                                      </Stack>
                                      {errors.email?.type === "required" && (
                                        <span style={style}>
                                          Field is Required *
                                        </span>
                                      )}
                                      {errors.email?.type === "pattern" && (
                                        <span style={style}>
                                          Please enter a valid email address *
                                        </span>
                                      )}
                                      {errors.email?.type === "validate" && (
                                        <span style={style}>
                                          Please enter a valid email address *
                                        </span>
                                      )}
                                    </Grid>
                                  )}
                                  {editformOpen === false ? (
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <InputLabel htmlFor="Price">
                                          Phone no
                                        </InputLabel>
                                        <OutlinedInput
                                          type="text"
                                          id="name"
                                          fullWidth
                                          size="small"
                                          {...register("number")}
                                          disabled
                                        />
                                      </Stack>
                                    </Grid>
                                  ) : (
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <InputLabel htmlFor="Price">
                                          Phone no{" "}
                                          {/* <span className="err_str">*</span> */}
                                        </InputLabel>
                                        <OutlinedInput
                                          type="text"
                                          id="name"
                                          fullWidth
                                          size="small"
                                          {...register("number")}
                                        // {...register("number", {
                                        //   required: true,
                                        //   pattern: /^[0-9+-]+$/,
                                        //   minLength: 10,
                                        //   maxLength: 10,
                                        // })}
                                        />
                                      </Stack>
                                      {errors.number?.type === "required" && (
                                        <span style={style}>
                                          Field is Required *
                                        </span>
                                      )}
                                      {errors.number?.type === "pattern" && (
                                        <span style={style}>
                                          Enter Valid Number *
                                        </span>
                                      )}
                                      {errors.number?.type === "minLength" && (
                                        <span style={style}>
                                          Enter Valid Number *
                                        </span>
                                      )}
                                      {errors.number?.type === "maxLength" && (
                                        <span style={style}>
                                          Enter Valid Number *
                                        </span>
                                      )}
                                    </Grid>
                                  )}
                                  {editformOpen === true && (
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1}>
                                        <InputLabel htmlFor="Price">
                                          Password
                                        </InputLabel>
                                        <OutlinedInput
                                          type={showPassword ? 'text' : 'password'}
                                          id="name"
                                          fullWidth
                                          size="small"
                                          {...register("password", {
                                            validate: validatePassword
                                          })}
                                          endAdornment={
                                            <InputAdornment position="end">
                                              <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                              >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                              </IconButton>
                                            </InputAdornment>
                                          }

                                        />
                                      </Stack>
                                      {errors.password &&
                                        <span style={style}>
                                          {errors.password.message}
                                        </span>
                                      }
                                    </Grid>
                                  )}
                                  {editformOpen === true ? (
                                    <Grid
                                      item
                                      xs={12}
                                      style={{ paddingTop: "20px" }}
                                    >
                                      <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={btnDisabled}
                                      >
                                        <b>SAVE & UPDATE</b>
                                        <span
                                          style={{
                                            fontSize: "2px",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {spinner === true ? (
                                            <CircularProgress color="inherit" />
                                          ) : (
                                            ""
                                          )}
                                        </span>
                                      </Button>{" "}
                                      <Button
                                        type="submit"
                                        variant="contained"
                                        style={{
                                          marginRight: "30px",
                                          backgroundColor: "#F95A37",
                                        }}
                                        onClick={closeeditform}
                                      >
                                        <b>CANCEL</b>
                                      </Button>
                                    </Grid>
                                  ) : (
                                    ""
                                  )}
                                </Grid>
                              </Stack>
                            </Grid>
                          </Box>
                        </form>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <MainFooter />
          </Box>
        </Box>
      )}
      <ToastContainer />
    </>
  );
}
