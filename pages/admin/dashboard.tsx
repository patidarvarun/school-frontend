import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableContainer,
  TableHead,
  Button,
  Box,
  styled,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MiniDrawer from "../sidebar";
import commmonfunctions from "../../commonFunctions/commmonfunctions";
import { useRouter } from "next/router";
import MainFooter from "../commoncmp/mainfooter";
import moment from "moment";
import Loader from "../commoncmp/myload";
import { qatar_currency } from "../../helper/config";

export default function Dashboard(this: any) {
  const router = useRouter();
  const [dashboardData, setDashBoardData] = React.useState<any>("");
  const [roleid, setroleid] = React.useState<any>("");
  const [myload, setmyload] = React.useState(true);
  const [permit, setPermit] = React.useState(true);

  setTimeout(() => {
    setmyload(false);
  }, 1500);

  React.useEffect(() => {
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
    permitfn()
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const dashBoardDataResponse =
        await commmonfunctions.CallculateDashBoardData();
      setDashBoardData(dashBoardDataResponse);
    } catch (error: any) {
      console.log("error => ", error.message);
    }
  };
  const sendViewAllCustomer = () => {
    router.push("/admin/customer/customerslist");
  };
  const sendViewCreditNote = () => {
    router.push("/admin/creditnotes/creditnoteslist");
  };
  const viewCreditNoteById = (id: any) => {
    router.push(`/admin/creditnotes/viewcreditnotes/${id}`);
  };
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const permitfn = () => {
    if (roleid == 1) {
      setPermit(false);
    } else {
      setPermit(true);
    }
  }
  return (
    <>
      {myload ? (
        <Loader />
      ) : roleid === 1 || roleid !== 2 ? (
        <Box sx={{ display: "flex" }}>
          <MiniDrawer />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div className="dashboardBar">
              <div className="dashboardbar">
                <div>
                  <span className="dashboardsmallHeading">Home</span>&nbsp;
                  <span>&gt;</span> &nbsp;{" "}
                  <span className="secondHeading">Dashboard</span>
                  <h1 className="dashboardGtitle">DASHBOARD</h1>
                </div>
              </div>
              <div className="dashboardmidBar">
                <div className="dashboardcontent">
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Item className="dashboard-box">
                          <div>
                            <div className="dmain">
                              <div>
                                <h1 className="dhead">
                                  {dashboardData?.totalCustomer
                                    ? dashboardData?.totalCustomer
                                    : 0}
                                </h1>
                              </div>
                              <div className="svg">
                                <PeopleAltIcon
                                  className="dimg"
                                  color="primary"
                                ></PeopleAltIcon>
                              </div>
                            </div>
                            <div className="Dtotal">
                              {" "}
                              &nbsp;
                              <h2 className="dh1">TOTAL CUSTOMERS</h2>
                            </div>
                          </div>
                        </Item>
                      </Grid>
                      <Grid item xs={3}>
                        <Item className="dashboard-box">
                          <div>
                            <div className="dmain">
                              <h1 className="dhead">
                                {dashboardData?.pendingInvoice
                                  ? dashboardData?.pendingInvoice
                                  : 0}
                              </h1>
                            </div>
                            <div className="Dtotal">
                              {" "}
                              &nbsp;
                              <h2 className="dh1">PENDING INVOICES</h2>
                            </div>
                          </div>
                        </Item>
                      </Grid>
                      <Grid item xs={3}>
                        <Item className="dashboard-box">
                          <div>
                            <div className="dmain">
                              <h1 className="dhead">
                                {commmonfunctions.formatePrice(
                                  dashboardData?.pendingInvoiceAmount
                                    ? dashboardData?.pendingInvoiceAmount
                                    : 0
                                )}{" "}
                                {"(" + qatar_currency + ")"}
                              </h1>
                            </div>
                            <div className="Dtotal">
                              {" "}
                              &nbsp;
                              <h2 className="dh1">TOTAL OUTSTANDING AMOUNT</h2>
                            </div>
                          </div>
                        </Item>
                      </Grid>
                      <Grid item xs={3}>
                        <Item className="dashboard-box">
                          <div>
                            <div className="dmain">
                              <div>
                                <h1 className="dhead">
                                  {commmonfunctions.formatePrice(
                                    dashboardData?.totalCredit_FromSageCreditNotes
                                      ? dashboardData?.totalCredit_FromSageCreditNotes
                                      : 0
                                  )}{" "}
                                  {" (" + qatar_currency + ")"}
                                </h1>
                              </div>
                            </div>
                            <div className="Dtotal">
                              {" "}
                              &nbsp;
                              <h2 className="dh1">TOTAL CREDITED AMOUNT</h2>
                            </div>
                          </div>
                        </Item>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
                <div className="dGraph">
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={8} md={7} className="data-table-box">
                        <Item className="dtable-box">
                          <div className="dtable">
                            <Grid container spacing={2}>
                              <Grid
                                item
                                xs={8}
                                md={12}
                                className="data-table-inner"
                              >
                                <Item className="data-table-inner-item box-shadow padding-le-ri-zero">
                                  <div className="Dcredit">
                                    <h3
                                      className="lcr"
                                      style={{ marginBottom: "0" }}
                                    >
                                      Latest Credit Report
                                    </h3>
                                    {dashboardData?.creditRequestData?.length ===
                                      0 ? (
                                      <Button
                                        className="dview"
                                        variant="text"
                                        disabled
                                      >
                                        View All
                                      </Button>
                                    ) : (
                                      <Button
                                        className="dview"
                                        variant="text"
                                        onClick={() => {
                                          sendViewCreditNote();
                                        }}
                                        disabled={roleid === 1 ? false : permit}
                                      >
                                        View All
                                      </Button>
                                    )}
                                  </div>
                                  <Container>
                                    <Card className="box-show-no border-round">
                                      <TableContainer sx={{ minWidth: 800 }}>
                                        <Table className="dasboard-table">
                                          <TableHead>
                                            <TableRow>
                                              {/* <TableCell padding="checkbox">
                                                <Checkbox />
                                              </TableCell> */}
                                              <TableCell>ID</TableCell>
                                              <TableCell>CUSTOMER</TableCell>
                                              <TableCell>DATE</TableCell>
                                              <TableCell>
                                                TOTAL
                                                {"(" + qatar_currency + ")"}
                                              </TableCell>
                                              <TableCell>
                                                BALANCE
                                                {"(" + qatar_currency + ")"}
                                              </TableCell>
                                            </TableRow>
                                          </TableHead>
                                          {dashboardData &&
                                            dashboardData?.creditRequestData_FromSageCreditNotes?.map(
                                              (creditRequest: any, key: any) => {
                                                const date =
                                                  creditRequest?.createdAt;
                                                const dateprint =
                                                  date?.split(" ")[0];
                                                return (
                                                  <TableBody key={key}>
                                                    <TableRow
                                                      hover
                                                      tabIndex={-1}
                                                      role="checkbox"
                                                    >
                                                      {/* <TableCell padding="checkbox">
                                                        <Checkbox />
                                                      </TableCell> */}
                                                      <TableCell
                                                        component="th"
                                                        scope="row"
                                                        padding="none"
                                                      >
                                                        <TableCell
                                                          style={{
                                                            cursor: "pointer",
                                                            color: "blue",
                                                          }}
                                                          align="left"
                                                          onClick={() => {
                                                            viewCreditNoteById(
                                                              creditRequest?.creditRequestId || creditRequest?.creditNoteId
                                                            );
                                                          }}
                                                        >
                                                          CRD-
                                                          {
                                                            creditRequest?.creditRequestId || creditRequest?.creditNoteId
                                                          }
                                                        </TableCell>
                                                      </TableCell>
                                                      <TableCell
                                                        className="dname"
                                                        align="left"
                                                      >
                                                        {creditRequest?.name}
                                                      </TableCell>
                                                      <TableCell
                                                        className="demail"
                                                        align="left"
                                                      >
                                                        {moment(
                                                          dateprint,
                                                          "YYYY/MM/DD"
                                                        ).format("ll")}
                                                      </TableCell>

                                                      <TableCell
                                                        className="active"
                                                        align="left"
                                                      >
                                                        {commmonfunctions.formatePrice(
                                                          creditRequest?.requestedAmount
                                                        )}
                                                        {"(" +
                                                          qatar_currency +
                                                          ")"}
                                                      </TableCell>

                                                      <TableCell align="left">
                                                        {commmonfunctions.formatePrice(
                                                          creditRequest?.creditAmount
                                                        )}
                                                        {"(" +
                                                          qatar_currency +
                                                          ")"}
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableBody>
                                                );
                                              }
                                            )}
                                        </Table>
                                        {dashboardData?.creditRequestData
                                          ?.length == 0 ? (
                                          <h3>No Record Found</h3>
                                        ) : (
                                          ""
                                        )}
                                      </TableContainer>
                                    </Card>
                                  </Container>
                                </Item>
                              </Grid>
                            </Grid>
                          </div>
                        </Item>
                      </Grid>
                      <Grid item xs={8} md={5} className="data-table-inner">
                        <Item className="box-shadow padding-le-ri-zero">
                          <div className="Dcredit">
                            <h3 className="lcr">Latest Customers</h3>
                            {dashboardData?.leatestCustomer == 0 ? (
                              <Button className="dview" variant="text" disabled>
                                View All
                              </Button>
                            ) : (
                              <Button
                                className="dview"
                                variant="text"
                                onClick={() => {
                                  sendViewAllCustomer();
                                }}
                                disabled={roleid === 1 ? false : permit}
                              >
                                View All
                              </Button>
                            )}
                          </div>
                          <div className="padding-22">
                            {dashboardData &&
                              dashboardData?.leatestCustomer?.map(
                                (customer: any, key: any) => {
                                  return (
                                    <div className="Ddiv1" key={key}>
                                      <div id="dimage">
                                        <Avatar
                                          alt="Remy Sharp"
                                          src="/image.png"
                                          sx={{ width: 50, height: 50 }}
                                        />
                                      </div>
                                      <div id="dinfo">
                                        <div className="diinfo">
                                          <span className="dname">
                                            {customer?.name}
                                          </span>{" "}
                                          <span className="email">
                                            {customer?.email1}
                                          </span>
                                        </div>
                                      </div>
                                      <div id="dstatus">
                                        <span
                                          className="dactive"
                                          style={{
                                            color:
                                              customer?.status == 0
                                                ? "red"
                                                : "rgb(2 197 9)",
                                          }}
                                        >
                                          {customer?.status == 0
                                            ? "InActive"
                                            : "Active"}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </div>
                          {dashboardData?.leatestCustomer == 0 ? (
                            <h3 style={{ color: "black" }}>
                              <b>No Record Found</b>
                            </h3>
                          ) : (
                            ""
                          )}
                        </Item>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              </div>
            </div>
            <MainFooter />
          </Box>
        </Box>
      ) : (
        ""
      )}
    </>
  );
}
