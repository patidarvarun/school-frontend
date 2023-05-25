import {
  Card,
  Button,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  CardContent,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import MiniDrawer from "../../../sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "@emotion/styled";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { api_url, auth_token } from "../../../../helper/config";
import UserService from "../../../../commonFunctions/servives";
import { useRouter } from "next/router";
import AddRole from "./addrole";
import MainFooter from "../../../commoncmp/mainfooter";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../../helper/activityLogs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const Item = styled(Paper)(({ theme }) => ({
  p: 10,
}));

const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

type FormValues = {
  name: string;
  email: string;
  number: number;
  roleid: number;
  previlegs: Array<string>;
};

export default function AddNewUser() {
  const router = useRouter();
  const [spinner, setshowspinner] = React.useState(false);
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [roles, setroles] = React.useState<any>([]);
  let permitions: {
    Dashboard?: any;
    Invoices?: any;
    SalesInvoices?: any;
    Activites?: any;
    Customers?: any;
    Cumposers?: any;
    CreditNote?: any;
    UserManagement?: any;
    AcceptPayment?: any;
    CreditRequest?: any;
    Reports?: any;
  }[] = [];
  const [onDashboard, setonDashboard] = React.useState(false);
  const [roleid, setroleid] = React.useState<FormValues | any>("");
  const [typeError, setTypeError] = React.useState<FormValues | any>("");
  const [Dashboardchecked, setDashboardchecked] = React.useState<any>({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });
  if (onDashboard) {
    permitions.push({
      Dashboard: Dashboardchecked,
    });
  }
  const [onInvoice, setonInvoice] = React.useState(false);
  const [Invoicechecked, setInvoicechecked] = React.useState<any>({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });
  if (onInvoice) {
    permitions.push({
      Invoices: Invoicechecked,
    });
  }
  const [onActivity, setonActivity] = React.useState(false);
  const [Activitychecked, setActivitychecked] = React.useState<any>({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });
  if (onActivity) {
    permitions.push({
      Activites: Activitychecked,
    });
  }
  const [onCustomer, setonCustomer] = React.useState(false);
  const [Customerchecked, setCustomerchecked] = React.useState<any>({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });
  if (onCustomer) {
    permitions.push({
      Customers: Customerchecked,
    });
  }
  const [onComposer, setonComposer] = React.useState(false);
  const [Composerchecked, setComposerchecked] = React.useState<any>({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });
  if (onComposer) {
    permitions.push({
      Cumposers: Customerchecked,
    });
  }
  const [onSalesInvoice, setonSalesInvoice] = React.useState(false);
  const [SalesInvoicechecked, setSalesInvoicechecked] = React.useState<any>({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });
  if (onSalesInvoice) {
    permitions.push({
      SalesInvoices: SalesInvoicechecked,
    });
  }
  const [onCreditNote, setonCreditNote] = React.useState(false);
  const [CreditNotechecked, setCreditNotechecked] = React.useState<any>({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });
  if (onCreditNote) {
    permitions.push({
      CreditNote: CreditNotechecked,
    });
  }
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const [onUserManagement, setonUserManagement] = React.useState(false);
  const [UserManagemenChecked, setUserManagemenChecked] = React.useState<any>({
    canView: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
  });
  if (onUserManagement) {
    permitions.push({
      UserManagement: UserManagemenChecked,
    });
  }

  const [onAcceptPayment, setonAcceptPayment] = React.useState(false);
  const [AcceptPaymentChecked, setAcceptPaymentChecked] = React.useState<any>({
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  });
  if (onAcceptPayment) {
    permitions.push({
      AcceptPayment: AcceptPaymentChecked,
    });
  }

  const [onCreditRequest, setonCreditRequest] = React.useState(false);
  const [CreditRequestCheck, setCreditRequestCheck] = React.useState<any>({
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  });
  if (onAcceptPayment) {
    permitions.push({
      CreditRequest: CreditRequestCheck,
    });
  }

  const [onReports, setonReports] = React.useState(false);
  const [ReportsCheck, setReportsCheck] = React.useState<any>({
    canView: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
  });
  if (onAcceptPayment) {
    permitions.push({
      Reports: ReportsCheck,
    });
  }
  let logintoken: any;
  React.useEffect(() => {
    UserService.GetRoles().then((response) => setroles(response));
    // verify user login and previlegs
    logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId === 1) {
      } else if (res.roleId > 1 && res.roleId !== 2) {
        commmonfunctions.ManageUserManagement().then((res) => {
          if (!res) {
            router.push("/userprofile");
          } else if (res.canAdd !== true) {
            router.push("/userprofile");
          } else {

          }
        });
      }
    });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setshowspinner(true);
    setBtnDisabled(true);
    if (roleid === "") {
      setTypeError("Type field is required!");
    } else {
      setTypeError("");
    }
    const reqData = {
      name: data.name,
      email1: data.email,
      phone1: data.number,
      roleId: data.roleid,
      previlegs: permitions,
      status: 1,
      userRole: "user",
      parentId: 0,
    };
    console.log("reqData", reqData)
    await axios({
      method: "POST",
      url: `${api_url}/addUser`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        if (data) {
          toast.success("User Added Successfully !");
          reset();
          setroleid("");
          setshowspinner(false);
          setBtnDisabled(false);
          setTimeout(() => {
            router.push("/admin/usermanagement/users");
          }, 1000);
        }
      })
      .catch((error) => {
        toast.error("Email Allready Registred !");
        setshowspinner(false);
        setBtnDisabled(false);
      });
  };

  const [newRoleOpen, setnewRoleOpen] = React.useState(false);
  //open close popup boxes
  function handleNewCustomerOpen() {
    setnewRoleOpen(true);
  }
  const closePoP = (data: any) => {
    setnewRoleOpen(false);
    UserService.GetRoles().then((response) => setroles(response));
  };

  const handleType = (data: any) => {
    if (data) {
      setroleid(data);
      setTypeError("");
    } else {
      setTypeError("Type field is required");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <div className="guardianBar">
            {/*bread cump */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              style={{ padding: "8px", marginBottom: "15px" }}
            >
              <Stack>
                <Stack spacing={3}>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link
                      key="1"
                      color="inherit"
                      href="/admin/usermanagement/users"
                      style={{ color: "#1A70C5", textDecoration: "none" }}
                    >
                      Home
                    </Link>
                    <Link
                      key="2"
                      color="inherit"
                      href="/admin/usermanagement/addnewuser"
                      style={{ color: "#7D86A5", textDecoration: "none" }}
                    >
                      My Account
                    </Link>
                  </Breadcrumbs>
                </Stack>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: "bold", color: "#333333" }}
                >
                  NEW USER ADD
                </Typography>
              </Stack>
              <Link
                href="/admin/usermanagement/users"
                style={{ color: "#1A70C5", textDecoration: "none" }}
              >
                <Button variant="contained" startIcon={<ArrowBackIcon />}>
                  {" "}
                  <b>Back To List</b>
                </Button>
              </Link>
            </Stack>
            {/*bread cump */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Item style={{ padding: "15px" }}>
                    <Typography>
                      <b>User Info</b>
                    </Typography>
                    <Stack style={{ marginTop: "20px" }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="name">
                              User Name <span className="err_str">*</span>
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
                            {errors.name?.type === "required" && (
                              <span style={style}>Field is Required *</span>
                            )}
                            {errors.name?.type === "validate" && (
                              <span style={style}>Name can't be blank *</span>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Price">
                              Email id <span className="err_str">*</span>
                            </InputLabel>
                            <OutlinedInput
                              type="text"
                              id="name"
                              fullWidth
                              size="small"
                              {...register("email", {
                                required: true,
                                pattern:
                                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                                validate: (value) => {
                                  return !!value.trim();
                                },
                              })}
                            />
                            {errors.email?.type === "required" && (
                              <span style={style}>Field is Required *</span>
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
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="Price">
                              Phone Number
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
                            {errors.number?.type === "required" && (
                              <span style={style}>Field is Required *</span>
                            )}
                            {errors.number?.type === "pattern" && (
                              <span style={style}>Enter Valid Number *</span>
                            )}
                            {errors.number?.type === "minLength" && (
                              <span style={style}>Enter Valid Number *</span>
                            )}
                            {errors.number?.type === "maxLength" && (
                              <span style={style}>Enter Valid Number *</span>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="name">
                              Role <span className="err_str">*</span>
                            </InputLabel>
                            <FormControl fullWidth>
                              <Select
                                labelId="demo-simple-select-label"
                                size="small"
                                value={roleid}
                                id="type1"
                                {...register("roleid", {
                                  required: "Role is Required *",
                                })}
                                onChange={(e) => handleType(e.target.value)}
                              >
                                <MenuItem value={0} disabled>Select Role</MenuItem>
                                {roles &&
                                  roles.map((data: any, key: any) => {
                                    return (
                                      <MenuItem key={key} value={data.id}>
                                        {data.name}
                                      </MenuItem>
                                    );
                                  })}
                              </Select>
                            </FormControl>
                            {errors.roleid?.type && (
                              <span style={style}>
                                {roleid === "" ? errors?.roleid?.message : ""}
                              </span>
                            )}
                          </Stack>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          style={{ paddingTop: "0px" }}
                        >
                          <Stack
                            style={{ width: "auto", float: "right" }}
                            textAlign={"end"}
                            onClick={handleNewCustomerOpen}
                          >
                            <span
                              style={{
                                color: "#26CEB3",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              Create New Role
                            </span>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} style={{ paddingTop: "0px" }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={btnDisabled}
                          >
                            <b>SAVE</b>
                            <span
                              style={{ fontSize: "2px", paddingLeft: "10px" }}
                            >
                              {spinner === true ? (
                                <CircularProgress color="inherit" />
                              ) : (
                                ""
                              )}
                            </span>
                          </Button>{" "}
                          <Link
                            style={{ color: "red", textDecoration: "none" }}
                            href="/admin/usermanagement/users"
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              style={{
                                marginRight: "30px",
                                backgroundColor: "#F95A37",
                              }}
                            >
                              <b>CANCEL</b>
                            </Button>
                          </Link>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Typography>
                        <b
                          style={{
                            fontSize: "20px",
                            marginBottom: "15px",
                            display: "inline-block",
                          }}
                        >
                          Manage Permillage for this user
                        </b>
                      </Typography>
                      <Box sx={{ width: "100%" }} style={{ marginTop: "10px" }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              DASHBOARD
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onDashboard ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onDashboard}
                            onChange={(e) => setonDashboard(e.target.checked)}
                            name="dashboard"
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {onDashboard ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Dashboardchecked.canView}
                                    onChange={(e) =>
                                      setDashboardchecked({
                                        ...Dashboardchecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Dashboardchecked.canAdd}
                                    onChange={(e) =>
                                      setDashboardchecked({
                                        ...Dashboardchecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Dashboardchecked.canEdit}
                                    onChange={(e) =>
                                      setDashboardchecked({
                                        ...Dashboardchecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Dashboardchecked.canDelete}
                                    onChange={(e) =>
                                      setDashboardchecked({
                                        ...Dashboardchecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              INVOICE
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onInvoice ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onInvoice}
                            onChange={(e) => setonInvoice(e.target.checked)}
                            inputProps={{ "aria-label": "controlled" }}
                            name="invoices"
                          />
                        </Stack>
                        {onInvoice ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Invoicechecked.canView}
                                    onChange={(e) =>
                                      setInvoicechecked({
                                        ...Invoicechecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Invoicechecked.canAdd}
                                    onChange={(e) =>
                                      setInvoicechecked({
                                        ...Invoicechecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Invoicechecked.canEdit}
                                    onChange={(e) =>
                                      setInvoicechecked({
                                        ...Invoicechecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Invoicechecked.canDelete}
                                    onChange={(e) =>
                                      setInvoicechecked({
                                        ...Invoicechecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              SALES INVOICE
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onSalesInvoice ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onSalesInvoice}
                            onChange={(e) =>
                              setonSalesInvoice(e.target.checked)
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {onSalesInvoice ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={SalesInvoicechecked.canView}
                                    onChange={(e) =>
                                      setSalesInvoicechecked({
                                        ...SalesInvoicechecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={SalesInvoicechecked.canAdd}
                                    onChange={(e) =>
                                      setSalesInvoicechecked({
                                        ...SalesInvoicechecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={SalesInvoicechecked.canEdit}
                                    onChange={(e) =>
                                      setSalesInvoicechecked({
                                        ...SalesInvoicechecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={SalesInvoicechecked.canDelete}
                                    onChange={(e) =>
                                      setSalesInvoicechecked({
                                        ...SalesInvoicechecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              ACTIVITY
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onActivity ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onActivity}
                            onChange={(e) => setonActivity(e.target.checked)}
                            inputProps={{ "aria-label": "controlled" }}
                            name="activity"
                          />
                        </Stack>
                        {onActivity ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Activitychecked.canView}
                                    onChange={(e) =>
                                      setActivitychecked({
                                        ...Activitychecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Activitychecked.canAdd}
                                    onChange={(e) =>
                                      setActivitychecked({
                                        ...Activitychecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Activitychecked.canEdit}
                                    onChange={(e) =>
                                      setActivitychecked({
                                        ...Activitychecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Activitychecked.canDelete}
                                    onChange={(e) =>
                                      setActivitychecked({
                                        ...Activitychecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              CUSTOMER
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onCustomer ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onCustomer}
                            onChange={(e) => setonCustomer(e.target.checked)}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {onCustomer ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Customerchecked.canView}
                                    onChange={(e) =>
                                      setCustomerchecked({
                                        ...Customerchecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Customerchecked.canAdd}
                                    onChange={(e) =>
                                      setCustomerchecked({
                                        ...Customerchecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Customerchecked.canEdit}
                                    onChange={(e) =>
                                      setCustomerchecked({
                                        ...Customerchecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Customerchecked.canDelete}
                                    onChange={(e) =>
                                      setCustomerchecked({
                                        ...Customerchecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              COMPOSER
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onComposer ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onComposer}
                            onChange={(e) => setonComposer(e.target.checked)}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {onComposer ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Composerchecked.canView}
                                    onChange={(e) =>
                                      setComposerchecked({
                                        ...Composerchecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Composerchecked.canAdd}
                                    onChange={(e) =>
                                      setComposerchecked({
                                        ...Composerchecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Composerchecked.canEdit}
                                    onChange={(e) =>
                                      setComposerchecked({
                                        ...Composerchecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={Composerchecked.canDelete}
                                    onChange={(e) =>
                                      setComposerchecked({
                                        ...Composerchecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              CREDIT NOTE
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onCreditNote ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onCreditNote}
                            onChange={(e) => setonCreditNote(e.target.checked)}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {onCreditNote ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={CreditNotechecked.canView}
                                    onChange={(e) =>
                                      setCreditNotechecked({
                                        ...CreditNotechecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={CreditNotechecked.canAdd}
                                    onChange={(e) =>
                                      setCreditNotechecked({
                                        ...CreditNotechecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={CreditNotechecked.canEdit}
                                    onChange={(e) =>
                                      setCreditNotechecked({
                                        ...CreditNotechecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={CreditNotechecked.canDelete}
                                    onChange={(e) =>
                                      setCreditNotechecked({
                                        ...CreditNotechecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              USER MANAGEMENT
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onUserManagement ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onUserManagement}
                            onChange={(e) =>
                              setonUserManagement(e.target.checked)
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {onUserManagement ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={UserManagemenChecked.canView}
                                    onChange={(e) =>
                                      setUserManagemenChecked({
                                        ...UserManagemenChecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={UserManagemenChecked.canAdd}
                                    onChange={(e) =>
                                      setUserManagemenChecked({
                                        ...UserManagemenChecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={UserManagemenChecked.canEdit}
                                    onChange={(e) =>
                                      setUserManagemenChecked({
                                        ...UserManagemenChecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={UserManagemenChecked.canDelete}
                                    onChange={(e) =>
                                      setUserManagemenChecked({
                                        ...UserManagemenChecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )}

                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              Accept Payment
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onAcceptPayment ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onAcceptPayment}
                            onChange={(e) =>
                              setonAcceptPayment(e.target.checked)
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {/* {onAcceptPayment ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={AcceptPaymentChecked.canView}
                                    onChange={(e) =>
                                      setAcceptPaymentChecked({
                                        ...AcceptPaymentChecked,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={AcceptPaymentChecked.canAdd}
                                    onChange={(e) =>
                                      setAcceptPaymentChecked({
                                        ...AcceptPaymentChecked,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={AcceptPaymentChecked.canEdit}
                                    onChange={(e) =>
                                      setAcceptPaymentChecked({
                                        ...AcceptPaymentChecked,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={AcceptPaymentChecked.canDelete}
                                    onChange={(e) =>
                                      setAcceptPaymentChecked({
                                        ...AcceptPaymentChecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )} */}


                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              Credit Resuests
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onCreditRequest ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onCreditRequest}
                            onChange={(e) =>
                              setonCreditRequest(e.target.checked)
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {/* {onCreditRequest ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={CreditRequestCheck.canView}
                                    onChange={(e) =>
                                      setCreditRequestCheck({
                                        ...CreditRequestCheck,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={CreditRequestCheck.canAdd}
                                    onChange={(e) =>
                                      setCreditRequestCheck({
                                        ...CreditRequestCheck,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={CreditRequestCheck.canEdit}
                                    onChange={(e) =>
                                      setCreditRequestCheck({
                                        ...CreditRequestCheck,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={AcceptPaymentChecked.canDelete}
                                    onChange={(e) =>
                                      setAcceptPaymentChecked({
                                        ...AcceptPaymentChecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )} */}

                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{
                            backgroundColor: "#F0F4FF",
                            padding: "10px",
                            marginTop: "15px",
                            borderRadius: "5px",
                          }}
                        >
                          <Stack>
                            <Stack spacing={3} className="customer-title">
                              Reports
                            </Stack>
                            <span style={{ color: "#333333" }}>
                              {onReports ? (
                                <span style={{ color: "#1976d2" }}>ON</span>
                              ) : (
                                "OFF"
                              )}
                            </span>
                          </Stack>
                          <Switch
                            checked={onReports}
                            onChange={(e) =>
                              setonReports(e.target.checked)
                            }
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Stack>
                        {/* {onReports ? (
                          <Stack direction="row" style={{ marginTop: "10px" }}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={ReportsCheck.canView}
                                    onChange={(e) =>
                                      setReportsCheck({
                                        ...ReportsCheck,
                                        canView: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can View"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={ReportsCheck.canAdd}
                                    onChange={(e) =>
                                      setReportsCheck({
                                        ...ReportsCheck,
                                        canAdd: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Add"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={ReportsCheck.canEdit}
                                    onChange={(e) =>
                                      setReportsCheck({
                                        ...ReportsCheck,
                                        canEdit: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Edit"
                              />
                            </FormGroup>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={AcceptPaymentChecked.canDelete}
                                    onChange={(e) =>
                                      setAcceptPaymentChecked({
                                        ...AcceptPaymentChecked,
                                        canDelete: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Can Delete"
                              />
                            </FormGroup>
                          </Stack>
                        ) : (
                          ""
                        )} */}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </form>
          </div>
          <MainFooter />
        </Box>
      </Box>
      {newRoleOpen ? <AddRole open={newRoleOpen} closeDialog={closePoP} /> : ""}
      <ToastContainer />
    </>
  );
}
