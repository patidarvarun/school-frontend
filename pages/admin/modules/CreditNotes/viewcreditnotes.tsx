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
  InputLabel,
  OutlinedInput,
  Button,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect } from "react";
import MiniDrawer from "../../../sidebar";
import DeleteFormDialog from "./deletedialougebox";
import { api_url, auth_token, qatar_currency } from "../../../../helper/config";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../../helper/activityLogs";
import UserService from "../../../../commonFunctions/servives";
import moment from "moment";
import ApproveCompForm from "./approvecmp";
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
export default function ViewCreditNotes(props: any) {
  const [creditNoteDet, setcreditNoteDet] = React.useState<any>([]);
  const [creditNoteMsg, setcreditNoteMsg] = React.useState<any>([]);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [rejectOpen, setrejectOpen] = React.useState(false);
  const [approveOpen, setapproveOpen] = React.useState(false);
  const [roleid, setroleid] = React.useState(0);
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const [apprball, setapprball] = React.useState<any>([]);
  const [creditball, setcreditball] = React.useState(0);
  const [items, setitems] = React.useState<any>([]);
  const router = useRouter();
  const { userId } = router.query;

  // verify user login and previlegs
  let logintoken: any;
  useEffect(() => {
    logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      if (res.roleId == 1) {
        setroleid(res.roleId);
        //router.push("/userprofile");
      }
    });
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });
  }, [userUniqueId]);

  useEffect(() => {
    router.replace(`/admin/creditnotes/viewcreditnotes/${userId}`);
    if (userId !== undefined && props?.id !== undefined) {
      fetchData();
    }
  }, [router.isReady]);

  const url = `${api_url}/getCreditNotesDetails/${userId ? userId : props?.id}`;
  //get credit notes
  const fetchData = async () => {
    console.log("fetch data");
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

      let response1 = await axios.get(
        `${api_url}/getuserdetails/${json.data.result[0].customerId}`,
        {
          headers: {
            Authorization: auth_token,
          },
        }
      );
      let getCusId =
        response1?.data?.data[0]?.parentId === 0
          ? response1?.data?.data[0]?.id
          : response1?.data?.data[0]?.parentId;
      fetchBallance(getCusId);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  //get items
  const fetchItemms = async (itemId: any) => {
    UserService.getItems(itemId).then((res: any) => {
      setitems(res);
    });
  };

  //get credit ballance
  const fetchBallance = async (id: any) => {
    const apiurl = `${api_url}/creditballance/${id}`;
    try {
      const response = await fetch(apiurl, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const json = await response.json();
      setcreditball(json.creditBal_FromSageCreditNotes);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  async function getSageCustomerId() {
    await axios({
      method: "GET",
      url: `${api_url}/getSageCustomerid/${props.id}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        AddLogs(
          userUniqueId,
          `Credit Notes Updated - #CUS-${data?.data?.data[0]?.customerId}`
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    const reqData = {
      message: data.message,
      status: 2,
      updatedBy: 1,
      approvedBy: 1,
      invoiceId: creditNoteDet?.invoiceId,
      salesOrderId: creditNoteDet?.salesOrderid,
      customerId: creditNoteDet?.customerId,
      creditRequestId: creditNoteDet?.creditReqId,
      amount: 0,
    };
    await axios({
      method: "put",
      url: `${api_url}/editCreditNotes/${props.id}`,
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
          setrejectOpen(false);
          router.push("/admin/creditnotes/creditnotelisting");
        }
      })
      .catch((error) => {
        toast.error(" Internal Server Error !");
      });
  };

  //open close delete popup boxes
  function handleDeleteOpen() {
    setDeleteOpen(true);
    setrejectOpen(false);
    setapproveOpen(false);
  }
  const closePoP = (data: any) => {
    setDeleteOpen(false);
  };

  //reject open form
  function handleRejectOpen() {
    setrejectOpen(true);

    if (router.asPath.includes(`#reject`)) {
      router.replace(`${router.asPath}`);
    } else {
      if (router.asPath.includes("#approve")) {
        router.replace(
          `/admin/creditnotes/viewcreditnotes/${router.query.userId}/#reject`
        );
      } else {
        router.replace(`${router.asPath}/#reject`);
      }
    }
    setapproveOpen(false);
  }
  function closeRejectForm() {
    setrejectOpen(false);
    router.push(`${router.asPath}`);
  }

  //approve form open
  function handleApproveOpen() {
    setapproveOpen(true);
    setrejectOpen(false);

    if (router.asPath.includes("#approve")) {
      router.replace(`${router.asPath}`);
    } else {
      if (router.asPath.includes("#reject")) {
        router.replace(
          `/admin/creditnotes/viewcreditnotes/${router.query.userId}/#approve`
        );
      } else {
        router.replace(`${router.asPath}/#approve`);
      }
    }
  }

  const closePoPapprove = (data: any) => {
    setapproveOpen(false);
    router.push(`${router.asPath}`);
  };

  const TotalValuesSum = () => {
    const sum = items.reduce(
      (total: any, obj: any) => total + obj["item_total_price"],
      0
    );
    return sum;
  };

  const payamountPass =
    creditNoteMsg && creditNoteMsg.length > 1
      ? creditNoteMsg[1]
      : { message: "", amount: creditNoteMsg[0]?.amount };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />
        <ToastContainer/>
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
                      href="/admin/creditnotes/creditnoteslist"
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
                {creditNoteDet?.status === 4 ? (
                  ""
                ) : (
                  <Stack direction="row">
                    {roleid === 1 && creditNoteDet?.status === 1 && (
                      <Stack
                        onClick={handleApproveOpen}
                        style={{ color: "#02C509", cursor: "pointer" }}
                      >
                        <b>Approved By Admin</b>
                      </Stack>
                    )}
                    {creditNoteDet?.status === 0 && (
                      <Stack
                        onClick={handleApproveOpen}
                        style={{ color: "#02C509", cursor: "pointer" }}
                      >
                        <b>Approved</b>
                      </Stack>
                    )}
                    {creditNoteDet?.status !== 2 &&
                      creditNoteDet?.status !== 3 && (
                        <Stack
                          onClick={handleRejectOpen}
                          style={{
                            marginLeft: "20px",
                            color: "red",
                            cursor: "pointer",
                          }}
                        >
                          <b>Reject</b>
                        </Stack>
                      )}
                    {creditNoteDet?.status !== 3 && (
                      <Stack
                        onClick={handleDeleteOpen}
                        style={{
                          marginLeft: "20px",
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        <b>Delete</b>
                      </Stack>
                    )}
                  </Stack>
                )}
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
                        style={{ padding: "8px" }}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            style={{ padding: "0px" }}
                          >
                            <Stack style={{ padding: "0" }}>
                              <Typography
                                variant="h3"
                                gutterBottom
                                style={{ fontWeight: "bold", color: "#333333" }}
                              >
                                Credit Note Details
                              </Typography>
                            </Stack>
                          </Stack>
                          <Stack style={{ padding: "8px" }}>
                            <Box sx={{ display: "flex" }}>
                              <div id="profileImage">
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
                                    style={{ display: "flex" }}
                                  >
                                    Status:
                                    <Stack direction="row">
                                      {creditNoteDet?.status === 0 ? (
                                        <span
                                          style={{
                                            color: "#FF4026",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          Pending
                                        </span>
                                      ) : creditNoteDet?.status === 1 ? (
                                        <span
                                          style={{
                                            color: "#02C509",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          Approved
                                        </span>
                                      ) : creditNoteDet?.status === 2 ? (
                                        <span
                                          style={{
                                            color: "#FF4026",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          Reject
                                        </span>
                                      ) : creditNoteDet?.status === 3 ? (
                                        <span
                                          style={{
                                            color: "#FF4026",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          Deleted
                                        </span>
                                      ) : creditNoteDet?.status === 4 &&
                                        creditNoteDet?.isComplete !== 1 ? (
                                        <span
                                          style={{
                                            color: "#FF4026",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          Appr By Admin
                                        </span>
                                      ) : creditNoteDet?.status === 4 &&
                                        creditNoteDet?.isComplete === 1 ? (
                                        <span
                                          style={{
                                            color: "#02C509",
                                            fontWeight: "bold",
                                            marginLeft: "5px",
                                          }}
                                        >
                                          Appr By Admin
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </Stack>
                                  </Typography>
                                </div>
                              </CardContent>
                            </Box>
                          </Stack>
                          <Stack style={{ padding: "8px" }}>
                            <Typography className="date-box">
                              <span>Created Date :</span>{" "}
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
                            style={{ padding: "8px" }}
                          >
                            <Stack>
                              <Typography variant="subtitle1">
                                {/* purchase order : 2342354235 */}
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
                            Note by Customer
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography style={{ padding: "8px 8px 0px 8px" }}>
                        Credit request : &ensp; {creditNoteMsg[0]?.amount}
                      </Typography>
                      <Typography
                        style={{ marginBottom: "5px", padding: "0px 8px" }}
                      >
                        Credit comment : {creditNoteMsg[0]?.message}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                {creditNoteMsg.length > 1 ? (
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
                              Note by Admin
                            </Typography>
                          </Stack>
                        </Stack>
                        {creditNoteMsg.slice(1).map((data: any) => {
                          return (
                            <>
                              <Typography
                                style={{ padding: "8px 8px 0px 8px" }}
                              >
                                Credit request : &ensp; {data.amount}
                              </Typography>
                              <Typography
                                style={{
                                  marginBottom: "5px",
                                  padding: "0px 8px",
                                }}
                              >
                                Credit comment : {data.message}
                              </Typography>
                              <hr />
                            </>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  ""
                )}
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
                            Line Items
                          </Typography>
                        </Stack>
                      </Stack>
                      <Table
                        className="invoice-table"
                        style={{ marginTop: "20px" }}
                      >
                        <TableHead>
                          <TableRow>
                            {/* <TableCell>
                              <Typography>Invoice Id</Typography>
                            </TableCell> */}
                            <TableCell>
                              <Typography>Item / Activity</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>Description</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>Item Unit</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>Quantity</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                Rate{" (" + qatar_currency + ")"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>
                                Amount{" (" + qatar_currency + ")"}
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
                                    {item?.item_price}
                                    {" (" + qatar_currency + ")"}
                                  </TableCell>
                                  <TableCell align="left">
                                    {item?.item_total_price}
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
                              {TotalValuesSum()}
                              {" (" + qatar_currency + ")"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12} style={{ marginTop: "20px" }}>
                  {creditNoteDet?.status === 4 ? (
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
                              {creditNoteDet?.status === 4 ? (
                                <span>Credit Approved</span>
                              ) : creditNoteDet?.status === 2 ? (
                                <span>Credit Reject</span>
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
                                  {moment(apprball?.createdAt).format("ll")}
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
                      </CardContent>
                    </Card>
                  ) : (
                    ""
                  )}
                </Grid>
                {rejectOpen ? (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    id="reject"
                    style={{ marginTop: "20px" }}
                  >
                    <Card sx={{ minWidth: 275 }}>
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
                                Reason for reject this request
                              </Typography>
                            </Stack>
                          </Stack>
                          <Table style={{ marginTop: "20px" }}>
                            <Stack>
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
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
                                      {...register("message", {
                                        required: true,
                                      })}
                                    />
                                    {errors.message?.type === "required" && (
                                      <span style={style}>
                                        Field is Required *
                                      </span>
                                    )}
                                  </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                  >
                                    <b>SAVE</b>
                                  </Button>
                                  <Button
                                    variant="contained"
                                    style={{
                                      marginLeft: "10px",
                                      backgroundColor: "#F95A37",
                                    }}
                                    onClick={closeRejectForm}
                                  >
                                    <b>CANCEL</b>
                                  </Button>
                                </Grid>
                              </Grid>
                            </Stack>
                          </Table>
                        </CardContent>
                      </form>
                    </Card>
                  </Grid>
                ) : (
                  ""
                )}

                {approveOpen ? (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    id="approve"
                    style={{ marginTop: "20px" }}
                  >
                    <Card sx={{ minWidth: 275 }}>
                      <ApproveCompForm
                        id={props.id}
                        closeDialog={closePoPapprove}
                        roleid={roleid}
                        status={
                          creditNoteDet?.status === 0
                            ? 1
                            : creditNoteDet?.status === 1 && 4
                        }
                        custId={creditNoteDet?.customerId}
                        creditReqId={creditNoteDet?.creditReqId}
                        invoiceId={creditNoteDet?.invoiceId}
                        salesOrderid={creditNoteDet?.salesOrderid}
                        approvedBy={userUniqueId}
                        payamount={payamountPass}
                      />
                    </Card>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </div>
        </Box>
      </Box>
      <DeleteFormDialog
        id={props.id}
        open={deleteOpen}
        closeDialog={closePoP}
      />
    </>
  );
}
