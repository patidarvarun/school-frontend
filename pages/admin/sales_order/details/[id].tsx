import {
  Card,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Grid,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MiniDrawer from "../../../sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { api_url, auth_token, qatar_currency } from "../../../../helper/config";
import moment from "moment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MainFooter from "../../../commoncmp/mainfooter";

export default function ViewCustomer() {
  const [userDet, setUserDet] = useState<any>([]);
  const router = useRouter();
  const { id } = router.query;

  const getUserDet = async () => {
    try {
      const response = await fetch(`${api_url}/getSalesOrdersDetails/${id}`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      setUserDet(res.data[0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUserDet();
  }, []);

  let description =
    userDet && userDet?.activity_short_description?.replace(/&nbsp;/g, " ");
  let removeTags = description && description?.replace(/(<([^>]+)>)/gi, "");

  console.log("userDet", userDet && userDet);

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
                      View Customers
                    </Link>
                  </Breadcrumbs>
                </Stack>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: "bold", color: "#333333" }}
                >
                  VIEW SALES ORDER
                </Typography>
              </Stack>
              <Stack>
                <div className="buycss" style={{ textAlign: "end" }}>
                  <Link
                    href="/admin/sales_order/list/sale"
                    style={{ color: "#1A70C5", textDecoration: "none" }}
                  >
                    <Button variant="contained" startIcon={<ArrowBackIcon />}>
                      {" "}
                      Back To List
                    </Button>
                  </Link>
                </div>
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
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      style={{ padding: "8px" }}
                    >
                      <Stack>
                        <Typography
                          variant="h3"
                          gutterBottom
                          style={{ fontWeight: "bold", color: "#333333" }}
                        >
                          Sales Order Detail
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack style={{ padding: "8px" }}>
                      <Box sx={{ display: "flex" }}>
                        <div id="profileImage">
                          <span id="fullName">
                            {" "}
                            {userDet &&
                              userDet.user_name &&
                              userDet.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <CardContent sx={{ flex: 1 }} className="text-grey">
                          <Typography component="h4" variant="h4">
                            {userDet && userDet.user_name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                          >
                            {userDet?.sageCustomerId || userDet?.sageParentId}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                          >
                            Email : {userDet && userDet.user_email1}
                          </Typography>
                          <Typography component="h4">
                            {userDet?.phone1}
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <Typography
                              component="h4"
                              className="status-title"
                            >
                              Status:
                            </Typography>
                            <Typography
                              component="span"
                              className="status-box"
                            >
                              Paid
                            </Typography>
                          </div>
                        </CardContent>
                      </Box>
                      <Stack style={{ padding: "8px" }}>
                        <Typography className="date-box">
                          <span>Cretaed Date :</span> {userDet?.user_create_Date === null
                            ? ""
                            : moment(userDet?.user_create_Date, "YYYY-MM-DD").format(
                              "MMM DD, YYYY"
                            )}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        style={{ padding: "8px" }}
                      >
                        <Stack>
                          <Typography variant="subtitle1">
                            purchase order : 2342354235
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={8}>
                <Grid item xs={12} md={12} style={{ marginTop: "20px" }}>
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
                            Line Items
                          </Typography>
                        </Stack>
                      </Stack>
                      <Table
                        style={{ marginTop: "20px" }}
                        className="invoice-table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography>INVOICE ID</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>Activity</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>Rate {" (" + qatar_currency + ")"}</Typography>
                            </TableCell>

                            <TableCell>
                              <Typography>Amount {" (" + qatar_currency + ")"}</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow hover tabIndex={-1}>
                            <TableCell
                              align="left"
                              className="invcss"
                              style={{ fontWeight: "500" }}
                            >
                              INV-{userDet && userDet?.id}
                            </TableCell>
                            <TableCell align="left">
                              <span style={{ fontWeight: "500" }}>
                                {userDet && userDet?.activity_name}
                                {/* <Button
                                  className="btndetail"
                                  variant="contained"
                                  size="small"
                                >
                                  Service
                                </Button> */}
                              </span>{" "}
                              <br />
                              {/* <p style={{ marginTop: "4px" }}>
                                {removeTags && removeTags}
                              </p> */}
                            </TableCell>

                            <TableCell align="left"></TableCell>
                            <TableCell align="left">
                              {userDet && userDet?.activity_price}{" (" + qatar_currency + ")"}
                            </TableCell>
                          </TableRow>
                          <TableRow hover tabIndex={2}>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left"></TableCell>
                            <TableCell
                              align="left"
                              style={{ fontWeight: "600" }}
                            >
                              CREDIT BALANCE:
                            </TableCell>
                            <TableCell align="left">
                              {userDet?.transaction_amount === 0 &&
                                userDet?.amount !== 0
                                ? `-${userDet?.amount}`
                                : userDet?.amount !== 0 &&
                                  userDet?.transaction_amount !== 0
                                  ? `${Math?.abs(
                                    userDet?.activity_price -
                                    userDet?.transaction_amount
                                  )}`
                                  : "0"} {" (" + qatar_currency + ")"}
                              {/* {userDet?.activity_price-userDet?.amount === 0 ? "$0" : `-$${userDet?.activity_price-userDet?.amount}`} */}
                            </TableCell>
                          </TableRow>
                          <TableRow hover tabIndex={1}>
                            <TableCell align="left"></TableCell>

                            <TableCell align="left"></TableCell>
                            <TableCell
                              align="left"
                              style={{ fontWeight: "600" }}
                            >
                              SUBTOTAL
                            </TableCell>
                            <TableCell align="left">
                              {userDet && userDet?.amount}{" (" + qatar_currency + ")"}
                            </TableCell>
                          </TableRow>
                          <TableRow hover tabIndex={2}>
                            <TableCell align="left"></TableCell>

                            <TableCell align="left"></TableCell>
                            <TableCell
                              align="left"
                              style={{ fontWeight: "600" }}
                            >
                              TOTAL
                            </TableCell>
                            <TableCell align="left">
                              {userDet && userDet?.amount}{" (" + qatar_currency + ")"}
                            </TableCell>
                          </TableRow>

                          <TableRow hover tabIndex={2}>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left"></TableCell>
                            <TableCell
                              align="left"
                              style={{ fontWeight: "600" }}
                            >
                              PAYMENT METHOD
                            </TableCell>
                            <TableCell align="left">
                              {userDet && userDet?.transaction_paymentMethod}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <MainFooter />
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
}
