import {
  Card,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Grid,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import MiniDrawer from "../../../sidebar";
import { api_url, auth_token, qatar_currency } from "../../../../helper/config";
import { useRouter } from "next/router";
import MainFooter from "../../../commoncmp/mainfooter";
import moment from "moment";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import UserService from "../../../../commonFunctions/servives";
import axios from 'axios';

export default function ViewCreditNotes(props: any) {
  const [creditNoteDet, setcreditNoteDet] = React.useState<any>([]);
  const [creditNoteMsg, setcreditNoteMsg] = React.useState<any>([]);
  const [creditball, setcreditball] = React.useState(0);
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const [apprball, setapprball] = React.useState<any>([]);
  const [items, setitems] = React.useState<any>([]);
  const router = useRouter();
  const { id } = router.query;

  // verify user login and previlegs
  let logintoken: any;
  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
      fetchBallance(res?.id)
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
      }
    });
    logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId === 2) {
      } else {
        router.push("/");
      }
    });
    fetchData();
  }, []);
  
  //get credit notes
  const url = `${api_url}/getCreditNotesDetails/${id}`;
  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const json = await response.json();
      setcreditNoteDet(json.data.result[0]);
      setcreditNoteMsg(json.data.results);
      setapprball(json?.data?.appramt[0]);
      fetchItemms(json.data.result[0].invoiceId);
    } catch (error: any) {
      console.log("error", error);
    }
  };
  //get credit ballance
  const fetchBallance = async (id:any) => {
    UserService.fetchCreditBallance(id).then((res: any) => {
      setcreditball(res?.creditBal_FromSageCreditNotes);
    });
  };

  //get items
  const fetchItemms = async (itemId: any) => {
    UserService.getItems(itemId).then((res: any) => {
      setitems(res);
    });
  };

  const TotalValuesSum = () => {
    const sum = items.reduce(
      (total: any, obj: any) => total + obj["item_total_price"],
      0
    );
    return sum;
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
              style={{ padding: "8px", marginBottom: "25px" }}
            >
              <Stack>
                <Stack spacing={3}>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link
                      key="1"
                      color="inherit"
                      href="/creditnotes/creditnotes"
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
                      View Credit Notes
                    </Link>
                  </Breadcrumbs>
                </Stack>
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ fontWeight: "bold", color: "#333333" }}
                >
                  VIEW CREDIT NOTE
                </Typography>
              </Stack>
              <Stack>
                <Typography style={{ color: "#F95A37" }}>
                  <span style={{ fontSize: "14PX" }}>BALANCE </span>{" "}
                  <b style={{ fontSize: "26px" }}>
                    {" "}
                    {creditball ? creditball : 0} {" (" + qatar_currency + ")"}
                  </b>
                </Typography>
              </Stack>
            </Stack>
            {/*bread cump */}
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Grid item xs={12} md={12}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        style={{}}
                      >
                        <CardContent style={{ padding: "0", width: "100%" }}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            style={{}}
                          >
                            <Stack>
                              <Typography
                                variant="h3"
                                gutterBottom
                                style={{
                                  fontWeight: "bold",
                                  color: "#333333",
                                }}
                              >
                                Credit Note Details
                              </Typography>
                            </Stack>
                          </Stack>
                          <Stack style={{}}>
                            <Box sx={{ display: "flex" }}>
                              <div
                                id="profileImage"
                                className="customer-profile"
                              >
                                <span id="fullName">A</span>
                              </div>
                              <CardContent
                                sx={{ flex: 1 }}
                                className="text-grey"
                              >
                                <Typography component="h4" variant="h4">
                                  {creditNoteDet?.name}
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  color="text.secondary"
                                >
                                  {creditNoteDet?.sageCustomerId ||
                                    creditNoteDet?.sageParentId}
                                </Typography>
                                <Typography component="h4">
                                  {creditNoteDet?.email1}
                                </Typography>
                                <Typography component="h4">
                                  {creditNoteDet?.phone1}
                                </Typography>
                                <Typography
                                  component="h4"
                                  className="status-title"
                                  style={{ display: "flex" }}
                                >
                                  Status:
                                  <Stack direction="row">
                                    {creditNoteDet?.status === 4 ? (
                                      <Stack
                                        style={{
                                          color: "#02C509",
                                          marginLeft: "5px",
                                        }}
                                      >
                                        <b>Approved</b>
                                      </Stack>
                                    ) : creditNoteDet?.status === 0 ? (
                                      <Stack
                                        style={{
                                          marginLeft: "5px",
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <b>Pending</b>
                                      </Stack>
                                    ) : creditNoteDet?.status === 2 ? (
                                      <Stack
                                        style={{
                                          marginLeft: "5px",
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <b>Reject</b>
                                      </Stack>
                                    ) : (
                                      ""
                                    )}
                                  </Stack>
                                </Typography>
                              </CardContent>
                            </Box>
                          </Stack>
                          <Stack style={{ padding: "0px 8px" }}>
                            <Typography className="date-box">
                              <span>Cretaed Date :</span>{" "}
                              {creditNoteDet?.createdAt === null
                                ? ""
                                : moment(
                                    creditNoteDet?.createdAt,
                                    "YYYY-MM-DD"
                                  ).format("MMM DD, YYYY")}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            style={{ padding: "5px 8px" }}
                          >
                            <Stack>
                              <Typography
                                variant="subtitle1"
                                className="purchase-box"
                              >
                                {/* <span> Purchase order :</span> 2342354235 */}
                              </Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
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
                            Credit Request Reason
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography style={{ padding: "8px" }}>
                        {creditNoteMsg[0]?.message}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid item xs={8}>
                <Grid item xs={12} md={12}>
                  <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack>
                          <Typography
                            variant="h5"
                            gutterBottom
                            style={{ fontWeight: "bold", color: "#333333" }}
                          >
                            Credit Invoice
                          </Typography>
                          <Typography variant="h6" style={{ color: "#26CEB3" }}>
                            {creditNoteDet?.sageInvoiceId}
                          </Typography>
                        </Stack>
                        <Stack direction="row">
                          {creditNoteDet?.status === 4 ? (
                            <Stack style={{ color: "#02C509" }}>
                              <b>Approved</b>
                            </Stack>
                          ) : creditNoteDet?.status === 0 ? (
                            <Stack
                              style={{
                                marginLeft: "20px",
                                color: "red",
                                cursor: "pointer",
                              }}
                            >
                              <b>Pending</b>
                            </Stack>
                          ) : creditNoteDet?.status === 2 ? (
                            <Stack
                              style={{
                                marginLeft: "20px",
                                color: "red",
                                cursor: "pointer",
                              }}
                            >
                              <b>Reject</b>
                            </Stack>
                          ) : (
                            ""
                          )}
                        </Stack>
                      </Stack>
                      <Table
                        className="invoice-table"
                        style={{ marginTop: "20px" }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography>Activity / Item</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>Description</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>item Unit</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>Quantity</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                Rate {" (" + qatar_currency + ")"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                Amount {" (" + qatar_currency + ")"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {items?.length > 0
                            ? items.map((item: any) => (
                                <TableRow hover tabIndex={-1}>
                                  <TableCell align="left">
                                    {item?.item_name}
                                  </TableCell>
                                  <TableCell align="left">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: item?.item_description,
                                      }}
                                    ></div>
                                  </TableCell>
                                  <TableCell align="left">
                                    {item?.item_unit}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item?.quantity}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item?.item_price}{" "}
                                    {" (" + qatar_currency + ")"}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item?.item_total_price}{" "}
                                    {" (" + qatar_currency + ")"}
                                  </TableCell>
                                </TableRow>
                              ))
                            : ""}
                             <TableRow hover tabIndex={1}>
                            <TableCell align="left" colSpan={4}></TableCell>
                            <TableCell
                              align="left"
                              style={{ fontWeight: "600" }}
                            >
                              AMOUNT &nbsp;
                              {creditNoteDet &&
                              creditNoteDet?.invoiceStatus === "Paid"
                                ? "PAID"
                                : "DUE"}
                            </TableCell>
                            <TableCell align="left">
                              {creditNoteDet &&
                              creditNoteDet?.invoiceStatus === "Paid"
                                ? creditNoteDet?.amount
                                : creditNoteDet?.amount_due}{" "}
                              (QAR)
                            </TableCell>
                          </TableRow>
                          <TableRow hover tabIndex={2}>
                            <TableCell align="left" colSpan={4}></TableCell>
                            <TableCell
                              align="left"
                              style={{ fontWeight: "600" }}
                            >
                              SUBTOTAL
                            </TableCell>
                            <TableCell align="left">
                            {TotalValuesSum()} {" (" + qatar_currency + ")"}
                            </TableCell>
                          </TableRow>
                          <TableRow hover tabIndex={3}>
                            <TableCell align="left" colSpan={4}></TableCell>
                            <TableCell
                              align="left"
                              style={{ fontWeight: "600" }}
                            >
                              TOTAL
                            </TableCell>
                            <TableCell align="left">
                            {TotalValuesSum()} {" (" + qatar_currency + ")"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
                {creditNoteDet?.status !== 0 ? (
                  <Grid item xs={12} md={12} style={{ marginTop: "20px" }}>
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack>
                            <Typography
                              variant="h6"
                              gutterBottom
                              style={{ fontWeight: "bold", color: "#333333" }}
                            >
                              Credit{" "}
                              {creditNoteDet?.status === 4 ? (
                                <span>Approved</span>
                              ) : creditNoteDet?.status === 2 ? (
                                <span>Reject</span>
                              ) : (
                                ""
                              )}
                            </Typography>
                          </Stack>
                        </Stack>
                        {creditNoteDet?.status === 4 ? (
                          <Table
                            className="invoice-table"
                            style={{ marginTop: "20px" }}
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography>Date</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Document</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    Amount {" (" + qatar_currency + ")"}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow hover tabIndex={-1}>
                                <TableCell align="left">
                                  {moment(apprball?.createdAt).format(
                                    "ll"
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  {creditNoteDet?.sageInvoiceId}
                                </TableCell>
                                <TableCell align="left">
                                  {apprball?.amount}{" "}
                                  {" (" + qatar_currency + ")"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        ) : (
                          ""
                        )}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          style={{ padding: "8px" }}
                        >
                          <Stack>
                            <Typography
                              variant="h6"
                              gutterBottom
                              style={{
                                fontWeight: "bold",
                                color: "#333333",
                              }}
                            >
                              Admin Comments
                            </Typography>
                          </Stack>
                        </Stack>
                        {creditNoteMsg.slice(1).map((data: any) => {
                          return (
                            <Typography style={{ padding: "8px" }}>
                              {data.message}
                            </Typography>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </div>
          <MainFooter />
        </Box>
      </Box>
    </>
  );
}
