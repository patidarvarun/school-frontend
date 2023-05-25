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
  Button,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MiniDrawer from "../sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { qatar_currency } from "../../helper/config";
import MainFooter from "../commoncmp/mainfooter";
import moment from "moment";
import jwt_decode from "jwt-decode";
import IconButton from "@mui/material/IconButton";
import commmonfunctions from "../../commonFunctions/commmonfunctions";
import Loader from "../commoncmp/myload";
import { FiEdit } from "react-icons/fi";
import { BiShow } from "react-icons/bi";
import UserService from "../../commonFunctions/servives";
import EditCustomer from "../commoncmp/editcustomercCmp";
import { handleBackToAdmin } from "../../commonFunctions/loginUserSwaping";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ViewCustomer() {
  const [value, setValue] = React.useState(0);
  const [userDet, setUserDet] = useState<any>([]);
  const [childs, setchilds] = React.useState([]);
  const [invoiceData, setGetinvoice] = useState<any>([]);
  const [invoiceChildData, setinvoiceChildData] = useState<any>([]);
  const [creditdata, setCredituserData] = useState<any>([]);
  const [CreditNoteChilddata, setCreditNoteChilddata] = useState<any>([]);
  const [creditball, setcreditball] = React.useState(0);
  const [btnahow, setbtnahow] = React.useState(false);
  const [useraddr, setuseraddr] = React.useState<any>([]);
  const [customerId, setCustomerId] = React.useState<any>([]);
  const [edirId, setedirId] = React.useState<any>([]);
  const [editCustOpen, seteditCustOpen] = React.useState(false);
  const [purchasedActivity, setPurchasedActivity] = React.useState<any>([]);
  const [purchChildact, setpurchChildact] = React.useState<any>([]);
  const [userUniqueId, setUserUniqId] = React.useState<any>();
  const [roleid, setroleid] = React.useState<any>("");
  const router = useRouter();
  const [myload, setmyload] = React.useState(true);

  setTimeout(() => {
    setmyload(false);
  }, 1000);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const verifyLoginUser = async () => {
    let login_token: any;
    login_token = (localStorage.getItem("QIS_loginToken"));
    commmonfunctions.GivenPermition().then((res) => {
      setroleid(res.roleId);
      if (res.roleId !== 2) {
        router.push("/userprofile");
      }
    });
    if (login_token) {
      const decoded: any = jwt_decode(login_token);
      setCustomerId(decoded?.id);
      fetchBallance(decoded?.id);
      getUserDet(decoded?.id);
      getChilds(decoded?.id);
      getUserInvoice(decoded?.id);
      getUserClildInv(decoded?.id);
      getCreditData(decoded?.id);
      getChildCreditNoteFromParentId(decoded?.id);
      getActivityPurchasedlist(decoded?.id);
      getActpurctClild(decoded?.id);
    }
  };

  // get user details
  const getUserDet = async (id: any) => {
    UserService.GetUserDet(id).then((response) => {
      setUserDet(response);
      const addr = JSON.parse(response?.address);
      setuseraddr(addr);
    })
  };

  //get childs
  const getChilds = async (id: any) => {
    UserService.getChilds(id).then((response) => {
      setchilds(response);
    })
  }

  //get user invoices List
  const getUserInvoice = (id: any) => {
    UserService.getUserInvoiceList(id).then((res: any) => {
      setGetinvoice(res);
    });
  }
  const getUserClildInv = (id: any) => {
    UserService.getChilds(id).then((response) => {
      //get child ids
      let ids: any[] = [];
      response.map((dt: any) => {
        ids.push(dt.id)
      })
      setTimeout(() => {
        UserService.getUserInvoiceList(ids).then((res: any) => {
          setinvoiceChildData(res);
        });
      }, 1000);
    })
  }

  const invdt = invoiceData.concat(invoiceChildData);
  let invoiceDue =
    invdt &&
    invdt.reduce((sum: any, item: any) => sum + item?.amount, 0);

  //get open credit notes
  const getCreditData = async (id: any) => {
    UserService.getCreditNotes(id).then((res: any) => {
      setCredituserData(res?.data);
    });
  };
  const getChildCreditNoteFromParentId = async (id: any) => {
    UserService.getChilds(id).then((response) => {
      //get child ids
      let ids: any[] = [];
      response.map((dt: any) => {
        ids.push(dt.id)
      })
      setTimeout(() => {
        UserService.getCreditNotes(ids).then((res: any) => {
          setCreditNoteChilddata(res.data);
        });
      }, 1000);
    })
  }
  const CreditNote = creditdata.concat(CreditNoteChilddata);

  //get purchase current activity
  const getActivityPurchasedlist = async (id: any) => {
    UserService.getActvtPchdlist(id).then((res: any) => {
      setPurchasedActivity(res.data);
    });
  };

  const getActpurctClild = async (id: any) => {
    UserService.getChilds(id).then((response) => {
      //get child ids
      let ids: any[] = [];
      response.map((dt: any) => {
        ids.push(dt.id)
      })
      setTimeout(() => {
        UserService.getActvtPchdlist(ids).then((res: any) => {
          setpurchChildact(res.data);
        });
      }, 1000);
    })
  }
  const Actpurcht = purchasedActivity.concat(purchChildact);
  //get credit ballance
  const fetchBallance = async (id: any) => {
    UserService.fetchCreditBallance(id).then((res: any) => {
      setcreditball(res.creditBal_FromSageCreditNotes);
    })
  };

  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });
    verifyLoginUser();
  }, [customerId]);

  useEffect(() => {
    localStorage.removeItem("invoiceid");
    localStorage.removeItem("cbqRefrenceNumber");
    localStorage.removeItem("price");
    localStorage.removeItem("sageCustomerId");
  });

  const handleInvoiceListView = () => {
    router.push("/user/invoices/invoiceslist/ci");
  };

  const handleCreditNotesList = () => {
    router.push("/user/creditinvoices/creditinvoicelist");
  };

  const handleActivityList = () => {
    router.push("/user/invoices/invoiceslist/ci");
  };

  const handleEditCustomerOpen = (id: any) => {
    setedirId(id);
    seteditCustOpen(true);
  }

  const closeEditPoP = (data: any) => {
    seteditCustOpen(false);
    //getUser();
  };

  const handleViewCustomerOpen = (id: any) => {
    getUserDet(id);
    getUserInvoice(id);
    getActivityPurchasedlist(id);
    getCreditData(id);
  }


  return (
    <>
      {
        myload ? (
          <Loader />) : roleid === 2 ? (
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
                            href="/user/dashboard"
                            style={{ color: "#1A70C5", textDecoration: "none" }}
                          >
                            Home
                          </Link>
                          <Link
                            key="2"
                            color="inherit"
                            href="/user/dashboard"
                            style={{ color: "#7D86A5", textDecoration: "none" }}
                          >
                            Dashboard
                          </Link>
                        </Breadcrumbs>
                      </Stack>
                      <Typography
                        variant="h5"
                        gutterBottom
                        style={{ fontWeight: "bold", color: "#333333" }}
                      >
                        DASHBOARD
                      </Typography>
                    </Stack>

                  </Stack>
                  {/*bread cump */}
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
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
                                Profile
                              </Typography>
                            </Stack>
                            <Stack>
                              <Typography
                                style={{ color: "#1A70C5", cursor: "pointer" }}
                                onClick={() => handleEditCustomerOpen(customerId)}
                              >
                                <b>EDIT</b>
                              </Typography>
                            </Stack>
                          </Stack>
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
                                  {userDet?.sageCustomerId || userDet?.sageParentId}
                                </Typography>
                                <Typography variant="subtitle1">
                                  {userDet.email1}
                                </Typography>
                                <Typography variant="subtitle1">
                                  {userDet.phone1}
                                </Typography>
                              </CardContent>
                            </Box>
                          </Stack>
                          {useraddr && useraddr.add1 !== "" && JSON.stringify(useraddr) !== "{}" ? (<Stack style={{ padding: "8px" }} className="text-grey">
                            <Typography><b>Address:</b></Typography>
                            {useraddr && useraddr?.add1 ? (<Typography>
                              Addr1: {" "}
                              {useraddr?.add1}
                            </Typography>) : ""}

                            {useraddr && useraddr?.add2 ? (<Typography>
                              Addr2: {" "}
                              {useraddr?.add2}
                            </Typography>) : ""}
                            <span>
                              {useraddr && useraddr?.city === ""
                                ? ""
                                : useraddr && useraddr?.city + ", "}

                              {useraddr && useraddr?.state === ""
                                ? ""
                                : useraddr && useraddr?.state + ", "}

                              {useraddr && useraddr?.postalcode === ""
                                ? ""
                                : useraddr && useraddr?.postalcode}
                            </span>
                          </Stack>) : ""}
                          <Stack style={{ padding: "8px" }}>
                            <Typography>
                              Created date : {" "}
                              {userDet?.createdAt === null
                                ? ""
                                : moment(userDet?.createdAt, "YYYY-MM-DD").format(
                                  "MMM DD, YYYY"
                                )}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                      {childs.length > 0 ? (<Card
                        sx={{ minWidth: 275 }}
                        className="box-shadow"
                        style={{ borderRadius: "5px", marginTop: "20px", overflow: "auto", width: "100%" }}
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
                                Childs
                              </Typography>
                            </Stack>
                          </Stack>
                          <Table className="table-box">
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography>ID</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>NAME</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography width={100}>EMAIL</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>STATUS</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>Action</Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {childs?.length > 0 ? (
                                childs.map((item: any) => (
                                  <TableRow hover tabIndex={-1}>
                                    <TableCell align="left">
                                      {item.customerId}
                                    </TableCell>
                                    <TableCell align="left">
                                      {item.name}
                                    </TableCell>
                                    <TableCell align="left" width={100}>
                                      {item.email1}
                                    </TableCell>
                                    <TableCell align="left">
                                      {item.status === 1 ? (
                                        <span style={{ color: "#02C509" }}>
                                          ACTIVE
                                        </span>
                                      ) : (
                                        <span style={{ color: "#FF4026" }}>
                                          INACTIVE
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell align="left">
                                      <IconButton className="action-view">
                                        <Link
                                          href={`#`}
                                          style={{
                                            color: "#26CEB3",
                                          }}
                                          onClick={() =>
                                            handleViewCustomerOpen(item.id)
                                          }
                                        >
                                          <BiShow />
                                        </Link>
                                      </IconButton>
                                      <IconButton
                                        className="action-edit"
                                        onClick={() =>
                                          handleEditCustomerOpen(item.id)
                                        }
                                      >
                                        <FiEdit />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <h3>No record found</h3>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>) : ""}
                    </Grid>
                    <Grid item xs={7}>
                      <Grid item xs={12} md={12} style={{ marginTop: "2px" }}>
                        <Card sx={{ minWidth: 275 }}>
                          <CardContent>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              style={{ padding: "8px 0" }}
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
                                  Account Summery
                                </Typography>
                              </Stack>
                            </Stack>
                            <Stack
                              style={{
                                marginTop: "1px",
                                display: "flex",
                                flexDirection: "unset",
                                alignItems: "center",
                                color: "rgba(0,0,0,0.6)",
                              }}
                            >
                              <div
                                style={{
                                  padding: "8px 0",
                                  fontSize: "18px",
                                }}
                              >
                                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                  Invoice Due :{" "}
                                  <span style={{ color: "#26CEB3" }}>
                                    {commmonfunctions.formatePrice(invoiceDue && invoiceDue)}{" (" + qatar_currency + ")"}
                                  </span>
                                </span>
                              </div>
                              <div style={{ marginLeft: "50px", fontSize: "18px", fontWeight: "bold" }}>
                                Credit Balance : <span style={{ color: "#f95a37" }}>{commmonfunctions.formatePrice(creditball && creditball)}{" (" + qatar_currency + ")"}</span>
                              </div>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                      <br />
                      <Grid item xs={12} md={12}>
                        <Card sx={{ minWidth: 275 }}>
                          <CardContent>
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              style={{ padding: "0 0px" }}
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
                                  Invoice
                                </Typography>
                              </Stack>
                              <Stack>
                                {btnahow === false ? (
                                  <Typography
                                    style={{ color: "#1A70C5", cursor: "pointer" }}
                                    onClick={handleInvoiceListView}
                                  >
                                    <b style={{ fontSize: "15px" }}>VIEW ALL</b>
                                  </Typography>
                                ) : (
                                  <Typography
                                    style={{ color: "#1A70C5", cursor: "pointer" }}
                                  // onClick={handleViewLess}
                                  >
                                    <b style={{ fontSize: "15px" }}>VIEW LESS</b>
                                  </Typography>
                                )}
                              </Stack>
                            </Stack>
                            <Box sx={{ width: "100%" }}>
                              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                                <p className="pendingcss">UnPaid INVOICES</p>
                              </Box>
                              <div style={{ padding: "0 0px" }}>
                                <TabPanel value={value} index={0}>
                                  <Table
                                    className="table-box"
                                    style={{
                                      marginTop: "25px",
                                      border: "1px solid #ccc",
                                    }}
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>
                                          <Typography>INVOICES</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography> DATE</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography>STATUS</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Typography>BALANCE {"(" + qatar_currency + ")"}</Typography>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    {invdt?.length > 0 ? (
                                      invdt.slice(0, 4)
                                        .map((item: any) =>
                                          item.status === "Pending" ? (
                                            <TableBody>
                                              <TableRow hover tabIndex={-1}>
                                                <TableCell align="left">
                                                  <Link
                                                    href={`/user/invoices/viewinvoice/${item.invid}`}
                                                  >
                                                    {item?.invoiceId || item?.tuition_invoice_id}
                                                  </Link>
                                                </TableCell>
                                                <TableCell align="left">
                                                  {moment(
                                                    item?.invoiceDate,
                                                    "DD/MM/YYYY"
                                                  ).format("MMM DD, YYYY")}
                                                </TableCell>
                                                <TableCell align="left">
                                                  {item.status === "Pending"
                                                    ? <span style={{ color: "#3498db" }}>UnPaid</span>
                                                    : item.status}
                                                </TableCell>
                                                <TableCell align="left">
                                                  {commmonfunctions.formatePrice(item.amount)}{" (" + qatar_currency + ")"}
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          ) : (
                                            ""
                                          )
                                        )
                                    ) : (
                                      <h3>No record found</h3>
                                    )}
                                  </Table>
                                </TabPanel>
                              </div>
                            </Box>
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
                              style={{ padding: "8px 0" }}
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
                                  Open Credit Notes
                                </Typography>
                              </Stack>
                              <Stack>
                                <Typography
                                  style={{ color: "#1A70C5", cursor: "pointer" }}
                                  onClick={handleCreditNotesList}
                                >
                                  <b style={{ fontSize: "15px" }}>VIEW ALL</b>
                                </Typography>
                              </Stack>
                            </Stack>
                            <Table className="table-box">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography>CREDIT NOTE</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography>DATE</Typography>
                                  </TableCell>
                                  {/* <TableCell>
                                    <Typography>STATUS</Typography>
                                  </TableCell> */}
                                  <TableCell>
                                    <Typography>TOTAL{" (" + qatar_currency + ")"}</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography>BALANCE {" (" + qatar_currency + ")"}</Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {CreditNote?.length > 0 ? (
                                  CreditNote.slice(0, 4).map((item: any) => (
                                    <TableRow hover tabIndex={-1}>
                                      <TableCell align="left">
                                        <Link
                                          href={`/user/creditinvoices/creditinvoiceview/${item.id}`}
                                        >
                                          CRD-{item?.id}
                                        </Link>
                                      </TableCell>
                                      <TableCell align="left">
                                        {moment(item?.createdAt).format(
                                          "MMM DD,YYYY"
                                        )}
                                      </TableCell>
                                      {/* <TableCell align="left">
                                        {item?.status === 4
                                          ? <span style={{ color: "#02C509" }}>APPROVED</span>
                                          : ""}
                                      </TableCell> */}
                                      <TableCell align="left">
                                        {commmonfunctions.formatePrice(item?.amount)}{" (" + qatar_currency + ")"}
                                      </TableCell>
                                      <TableCell align="left">
                                        {commmonfunctions.formatePrice(item?.amount)}{" (" + qatar_currency + ")"}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <h3>No record found</h3>
                                )}
                              </TableBody>
                            </Table>
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
                              style={{ padding: "8px 0" }}
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
                                  Current Activity
                                </Typography>
                              </Stack>
                              <Stack>
                                <Typography
                                  style={{ color: "#1A70C5", cursor: "pointer" }}
                                  onClick={handleActivityList}
                                >
                                  <b style={{ fontSize: "15px" }}>VIEW ALL</b>
                                </Typography>
                              </Stack>
                            </Stack>
                            <Table className="table-box">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <Typography>INVOICES</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography>ACTIVITY NAME</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography>DATE</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography>TYPE</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography>AMOUNT {" (" + qatar_currency + ")"}</Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Actpurcht?.length > 0 ? (
                                  Actpurcht
                                    ?.slice(0, 4)
                                    .map((item: any) => (
                                      <TableRow hover tabIndex={-1}>
                                        <TableCell align="left">
                                          <Link
                                            href={`/user/invoices/viewinvoice/${item.id}`}
                                          >
                                            {item?.sales_order_Id}
                                          </Link>
                                        </TableCell>
                                        <TableCell align="left">
                                          {item?.activityname}
                                        </TableCell>
                                        <TableCell align="left">
                                          {moment(item?.createDate).format(
                                            "MMM DD,YYYY"
                                          )}
                                        </TableCell>
                                        <TableCell align="left">
                                          {item?.status === "Paid" ? <span style={{ color: "#02C509" }}>PAID</span> : ""}
                                        </TableCell>
                                        <TableCell align="left">
                                          {commmonfunctions.formatePrice(item?.amount)}{" (" + qatar_currency + ")"}
                                        </TableCell>
                                      </TableRow>
                                    ))
                                ) : (
                                  <h3>No record found</h3>
                                )}
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
            </Box >) : ""
      }
      {editCustOpen ? (
        <EditCustomer
          id={edirId}
          open={editCustOpen}
          closeDialogedit={closeEditPoP}
        />
      ) : (
        ""
      )}
      <ToastContainer />

    </>
  );
}
