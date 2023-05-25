import {
  Card,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Grid,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MiniDrawer from "../../../sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { api_url, auth_token, qatar_currency } from "../../../../helper/config";
import EditCustomer from "../editcustomer";
import MainFooter from "../../../commoncmp/mainfooter";
import moment from "moment";
import UserService from "../../../../commonFunctions/servives";
import { BiShow } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import commmonfunctions from "../../../../commonFunctions/commmonfunctions";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ViewCustomer() {
  const [value, setValue] = React.useState(0);
  const [userDet, setUserDet] = useState<any>([]);
  const [invoice, setUserinvoice] = useState<any>([]);
  const [OutstandingAmy, setOutstandingAmy] = useState<any>([]);
  const [closeinvoice, setCloseinvoice] = useState<any>([]);
  const [editCustOpen, seteditCustOpen] = React.useState(false);
  const [editid, seteditid] = useState<any>(0);
  const [creditball, setcreditball] = React.useState(0);
  const [totalinv, settotalinv] = React.useState(2);
  const [totalcrdt, settotalcrdt] = React.useState(2);
  const [btnahow, setbtnahow] = React.useState(false);
  const [btnacrdthow, setbtnacrdthow] = React.useState(false);
  const [useraddr, setuseraddr] = React.useState<any>([]);
  const [creditNotes, setcreditNotes] = React.useState<any>([]);
  const [childs, setchilds] = React.useState([]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const router = useRouter();
  const { customerId } = router.query;

  useEffect(() => {
    getUserDet();
    fetchBallance();
    fetchCreditNotes();
  }, [customerId]);

  //get user details
  const getUserDet = async () => {
    try {
      const response = await fetch(`${api_url}/getuserdetails/${customerId}`, {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      });
      const res = await response.json();
      setUserDet(res.data[0]);
      const addr = JSON.parse(res.data[0]?.address);
      setuseraddr(addr);
      getChilds(res.data[0].id)
    } catch (error) {
      console.log("error", error);
    }
  };
  //get user invoice like pending invoice
  const getUserInvoice = async (ids: any) => {
    const response = await fetch(`${api_url}/getInvoicebyUser/${ids}`, {
      method: "GET",
      headers: {
        Authorization: auth_token,
      },
    });
    const res = await response.json();
    setUserinvoice(res);
    let invoiceDue =
      res &&
      res.reduce((sum: any, item: any) => sum + item?.amount, 0);
    setOutstandingAmy(invoiceDue);
  };
  //get user close invoice
  const getUserCloseInvoice = async (ids: any) => {
    const response = await fetch(
      `${api_url}/getInvoicebyUser/${ids}?key=close`,
      {
        method: "GET",
        headers: {
          Authorization: auth_token,
        },
      }
    );
    const res = await response.json();
    setCloseinvoice(res);
  };

  //get credit ballance 
  const fetchBallance = async () => {
    const apiurl = `${api_url}/creditballance/${customerId}`;
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
  //get credit notes
  const fetchCreditNotes = async () => {
    const apiurl = `${api_url}/creditballanceByUser/${customerId}`;
    try {
      const response = await fetch(apiurl, {
        method: "GET",
        headers: {
          Authorization: auth_token ,
        },
      });
      const json = await response.json();
      setcreditNotes(json.data);
    } catch (error: any) {
      console.log("error", error);
    }
  };
  //get childs
  const getChilds = async (id: any) => {
    UserService.getChilds(id).then((response) => {
      setchilds(response);
      //get child ids
      let ids: any[] = [];
      response.map((dt: any) => {
        ids.push(dt.id);
      });
      const custids = ids.concat(customerId);
      getUserInvoice(custids);
      getUserCloseInvoice(custids)
    })
  }
  //edit customer
  function handleEditCustomerOpen(id: any) {
    console.log(id);
    seteditCustOpen(true);
    seteditid(id);
  }
  const closeEditPoP = (data: any) => {
    seteditCustOpen(false);
    getUserDet();
  };
  //handle view all
  function handleView() {
    settotalinv(invoice.length);
    setbtnahow(true);
  }
  //handle view less
  function handleViewLess() {
    settotalinv(2);
    setbtnahow(false);
  }
  //habdle crdt show
  function handlecrdtView() {
    settotalcrdt(creditNotes.length);
    setbtnacrdthow(true);
  }
  //handle view less
  function handlecrdtViewLess() {
    settotalcrdt(2);
    setbtnacrdthow(false);
  }


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
                      href="/admin/customer/customerslist"
                      style={{ color: "#1A70C5", textDecoration: "none" }}
                    >
                      Home
                    </Link>
                    <Link
                      key="2"
                      color="inherit"
                      href="/admin/customer/customerslist"
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
                  VIEW CUSTOMER
                </Typography>
              </Stack>
              <Stack>
                <Typography style={{ color: "#F95A37" }}>
                  <span style={{ fontSize: "14PX" }}><b>Pending Amount</b></span>{" "}
                  <b style={{ fontSize: "26px" }}> {commmonfunctions.formatePrice(OutstandingAmy)}  {" (" + qatar_currency + ")"}</b>
                </Typography>
                <Typography style={{ color: "rgba(125, 134, 165, 0.6)" }}>
                  <span style={{ fontSize: "14PX" }}><b>CREDITS</b></span>
                  <b style={{ fontSize: "26px" }}> {commmonfunctions.formatePrice(creditball)} {" (" + qatar_currency + ")"}</b>
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
                        <div id="profileImage"><span id="fullName"> {userDet && userDet.name && userDet.name.charAt(0).toUpperCase()}</span></div>
                        <CardContent sx={{ flex: 1 }} className="text-grey">
                          <Typography component="h4" variant="h4">
                            {userDet && userDet.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                          >
                            {userDet && userDet.sageCustomerId || userDet.sageParentId}
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
                    {useraddr && useraddr.add1 != "" && JSON.stringify(useraddr) !== "{}" ? (<Stack style={{ padding: "8px" }} className="text-grey">
                      <Typography><b>Address : </b></Typography>
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
                    {/* <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      style={{ padding: "8px" }}
                    >
                      <Stack>
                        <Typography variant="subtitle1">
                          In My Network:
                        </Typography>
                      </Stack>
                      <Stack>
                        <Typography
                          style={{
                            border: "1px solid gray",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                          }}
                        >
                          No
                        </Typography>
                      </Stack>
                    </Stack> */}
                    <Stack style={{ padding: "8px" }}>
                      <Typography>Cretaed Date :  {userDet && moment(userDet?.createdAt).format(
                        "MMM DD, YYYY"
                      )}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
                {childs.length > 0 ? (<Card
                  sx={{ minWidth: 275 }}
                  className="box-shadow"
                  style={{ borderRadius: "5px", marginTop: "20px" }}
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
                                    href={`/admin/customer/viewcustomer/${item.id}`}
                                    style={{
                                      color: "#26CEB3",
                                    }}
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
                            Invoice
                          </Typography>
                        </Stack>
                        <Stack>
                          {btnahow === false ? (<Typography style={{ color: "#1A70C5", cursor: "pointer" }} onClick={handleView}>
                            <b>VIEW ALL</b>
                          </Typography>) : (<Typography style={{ color: "#1A70C5", cursor: "pointer" }} onClick={handleViewLess}>
                            <b>VIEW LESS</b>
                          </Typography>)}
                        </Stack>
                      </Stack>
                      <Box sx={{ width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                          >
                            <Tab label="OPEN INVOICES" {...a11yProps(0)} />
                            <Tab label="CLOSED INVOICES" {...a11yProps(1)} />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                          <Table style={{ marginTop: "20px" }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography>INVOICES</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>INV DATE</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>DUE DATE</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>STATUS</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>AMOUNT {" (" + qatar_currency + ")"}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            {invoice.length > 0 ? (
                              invoice.slice(0, totalinv).map((item: any) => (
                                <TableBody>
                                  <TableRow hover tabIndex={-1}>
                                    <TableCell align="left">
                                      <Link href={`/admin/viewInvoice/${item.id}`}>
                                        {item?.invoiceId || item?.tuition_invoice_id}
                                      </Link>
                                    </TableCell>
                                    <TableCell align="left">
                                      {moment(item?.createdDate, "DD/MM/YYYY").format(
                                        "ll"
                                      )}
                                    </TableCell>
                                    <TableCell align="left">
                                      {moment(item?.invoiceDate, "DD/MM/YYYY").format(
                                        "ll"
                                      )}
                                    </TableCell>
                                    <TableCell align="left">
                                      <TableCell align="left">
                                        {
                                          item.status === "Pending" ? (
                                            <span style={{ color: "blue" }}>UnPaid</span>
                                          ) : ""}
                                      </TableCell>
                                    </TableCell>
                                    <TableCell align="left">
                                      {commmonfunctions.formatePrice(item.amount)} {" (" + qatar_currency + ")"}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              ))
                            ) : (
                              <h3>No record found</h3>
                            )}
                          </Table>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                          <Table style={{ marginTop: "20px" }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <Typography>INVOICES</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>INV DATE</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>DUE DATE</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>TOTAL </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>BALANCE {" (" + qatar_currency + ")"}</Typography>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            {closeinvoice.length > 0 ? (
                              closeinvoice.slice(0, totalinv).map((item: any) => (
                                <TableBody>
                                  <TableRow hover tabIndex={-1}>
                                    <TableCell align="left">
                                      <Link href={`/admin/viewInvoice/${item.id}`}>
                                        {item?.invoiceId || item?.tuition_invoice_id}
                                      </Link>
                                    </TableCell>
                                    <TableCell align="left">
                                      {moment(item?.createdDate, "DD/MM/YYYY").format(
                                        "ll"
                                      )}
                                    </TableCell>
                                    <TableCell align="left">
                                      {moment(item?.invoiceDate, "DD/MM/YYYY").format(
                                        "ll"
                                      )}
                                    </TableCell>
                                    <TableCell align="left">
                                      {item.status === "Paid" ? (
                                        <span style={{ color: "green" }}>Paid</span>) :
                                        ""}
                                    </TableCell>
                                    <TableCell align="left">
                                      {commmonfunctions.formatePrice(item.amount)} {" (" + qatar_currency + ")"}
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              ))
                            ) : (
                              <h3>No record found</h3>
                            )}
                          </Table>
                        </TabPanel>
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
                            Open Credit Notes
                          </Typography>
                        </Stack>
                        <Stack>
                          {btnacrdthow === false ? (<Typography style={{ color: "#1A70C5", cursor: "pointer" }} onClick={handlecrdtView}>
                            <b>VIEW ALL</b>
                          </Typography>) : (<Typography style={{ color: "#1A70C5", cursor: "pointer" }} onClick={handlecrdtViewLess}>
                            <b>VIEW LESS</b>
                          </Typography>)}
                        </Stack>
                      </Stack>
                      <Table style={{ marginTop: "20px" }}>
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
                              <Typography>TOTAL</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>BALANCE</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {creditNotes.slice(0, totalcrdt).map((item: any, key: any) => {
                            return (<TableRow hover tabIndex={-1}>
                              <TableCell align="left">
                                <Link href={`/admin/creditnotes/viewcreditnotes/${item.id}`}>
                                  CRD-{item?.id}
                                </Link>
                              </TableCell>
                              <TableCell align="left">{moment(item?.createdAt).format("DD/MM/YYYY")}</TableCell>
                              {/* <TableCell align="left"></TableCell> */}
                              <TableCell align="left">{item?.amount}</TableCell>
                              <TableCell align="left">{item?.amount}</TableCell>
                            </TableRow>)
                          })}
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
      {editCustOpen ? (
        <EditCustomer
          id={editid}
          open={editCustOpen}
          closeDialogedit={closeEditPoP}
        />
      ) : (
        ""
      )}
    </>
  );
}
