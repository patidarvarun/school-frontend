import {
  Card,
  Table,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  FormControl,
  TableContainer,
  TableHead,
  Button,
  Breadcrumbs,
  Box,
  Pagination,
  OutlinedInput,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { Stack } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MiniDrawer from "../../../pages/sidebar";
import axios from "axios";
import Select from "@mui/material/Select";
import "react-datepicker/dist/react-datepicker.css";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { api_url, auth_token, qatar_currency } from "../../../helper/config";
import MainFooter from "../../commoncmp/mainfooter";
import RequestFormCmp from "./requestFormCmp";
import Image from "next/image";
import ReceiptSalesPDFService from "../../../commonFunctions/receptSalesOrder";
import Loader from "../../commoncmp/myload";
import UserService from "../../../commonFunctions/servives";
import PDFService from "../../../commonFunctions/invoicepdf";

const style = {
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export interface FormValues {
  message: string;
}

function usePagination(data: any, itemsPerPage: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);
  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }
  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }
  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }
  function jump(page: any) {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  }
  return { next, prev, jump, currentData, currentPage, maxPage };
}

export default function UserInvoices() {
  const [getSalesInvoices, setgetSalesInvoices] = useState<any>([]);
  const [searchdata, setsearchdata] = useState([]);
  const [searchquery, setsearchquery] = useState("");
  const [value, setValue] = useState(0);
  const [reqDet, setreqDet] = useState<any>([]);
  const [custid, setcustid] = useState<any>([]);
  const router = useRouter();
  const [CreditReqFormOpen, setCreditReqFormOpen] = useState(false);
  const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [roleid, setroleid] = React.useState<any>("");
  const [myload, setmyload] = React.useState(true);
  setTimeout(() => {
    setmyload(false);
  }, 700);

  // verify user login and previlegs
  useEffect(() => {
    let logintoken: any;
    commmonfunctions.VerifyLoginUser().then((res) => {
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
      }
      const idds = res?.id;
      getChilds(res?.id, idds);
      if (res && res?.id) {
        setcustid(res?.id);
        getSalesOrdersByUser(res.id);
      }
    });
    logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      setroleid(res.roleId);
      if (res.roleId === 2) {
      } else {
        router.push("/userprofile");
      }
    });
  }, []);

  //get invoices by user id
  const getSalesOrdersByUser = async (id: any) => {
    await axios({
      method: "get",
      url: `${api_url}/getSalesOrdersByUser/${id}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        setgetSalesInvoices(
          res?.data?.data.filter((a: any) => a.isRequested !== 2)
        );
        setsearchdata(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getChilds = async (id: any, cuUId: any) => {
    UserService.getChilds(id).then((response: any[]) => {
      //get child ids
      let ids: any[] = [];
      response.map((dt: any) => {
        ids.push(dt.id)
      })
      const invids = ids.concat(cuUId);
      setcustid(invids);
      getSalesOrdersByUser(invids);
    })
  }

  // pagination;
  const [row_per_page, set_row_per_page] = useState(5);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  let [page, setPage] = React.useState(1);
  const PER_PAGE = row_per_page;
  const count = Math.ceil(getSalesInvoices?.length / PER_PAGE);
  const DATA = usePagination(getSalesInvoices, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  // searching functionality
  const searchItems = (e: any) => {
    setsearchquery(e.target.value);
    if (e.target.value === "") {
      setgetSalesInvoices(searchdata);
    } else {
      const filterres = getSalesInvoices.filter((item: any) => {
        return (
          item.activity_name
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          `${item?.amount}`.includes(e.target.value)
        );
      });
      const dtd = filterres;
      setgetSalesInvoices(dtd);
    }
  };

  //Credit Request
  const handleClickOpen = (item: any) => {
    console.log(item);
    setreqDet(item);
    setCreditReqFormOpen(true);
  };

  const closePoP = (data: any) => {
    setCreditReqFormOpen(false);
    getSalesOrdersByUser(custid);
  };

  //generate receipt
  const ReceiptPdf = async (item: any, receipt_title: string) => {
    ReceiptSalesPDFService.ReceiptPDF(item, receipt_title);
  };

  const SimpleInvpdf = async (item: any, receipt_title: string, isSide: string) => {
    PDFService.generateSimplePDF(item, receipt_title, isSide);
  };

  return (
    <>
      {
        myload ? (
          <Loader />
        ) : (<Box sx={{ display: "flex" }}>
          <MiniDrawer />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div className="guardianBar">
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
                        href="/"
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
                        Sales Invoice
                      </Link>
                    </Breadcrumbs>
                  </Stack>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ fontWeight: "bold", color: "#333333" }}
                  >
                    SALES INVOICE
                  </Typography>
                </Stack>
              </Stack>
              <Card
                style={{ margin: "10px", padding: "15px" }}
                className="box-shadow"
              >
                <TableContainer>
                  <Stack
                    style={{ marginBottom: "10px" }}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Tabs
                        value={value}
                        onChange={handleChanges}
                        aria-label="basic tabs example"
                      >
                        <Tab
                          className="filter-list"
                          label={`All (${getSalesInvoices.length})`}
                          {...a11yProps(0)}
                        />
                      </Tabs>
                    </Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      className="fimport-export-box"
                    >
                      <FormControl>
                        <OutlinedInput
                          onChange={(e) => searchItems(e)}
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Search"
                          value={searchquery}
                        />
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {/* <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell> */}
                        <TableCell width={300}>SALES ORDER ID</TableCell>
                        <TableCell width={300}>USER NAME</TableCell>
                        <TableCell width={300}>ACTIVITY NAME</TableCell>
                        <TableCell width={200}>STATUS</TableCell>
                        <TableCell width={200}>AMOUNT {" (" + qatar_currency + ")"}</TableCell>
                        <TableCell width={200}>INVOICE ID</TableCell>
                        <TableCell className="action-th" width={200}>
                          ACTION
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {DATA.currentData() && DATA.currentData() ? (
                        DATA.currentData().map((item: any) => (
                          <TableRow
                            hover
                            tabIndex={-1}
                            role="checkbox"
                            className="boder-bottom"
                          >
                            {/* <TableCell padding="checkbox">
                              <Checkbox />
                            </TableCell> */}
                            <TableCell component="th" scope="row" padding="none">
                              <Link
                                href={`/user/salesinvoices/viewsalesinvoice/${item.id}`}
                              >
                                <TableCell align="left">
                                  {item.sales_order_id}
                                </TableCell>
                              </Link>
                            </TableCell>
                            <TableCell width={300}>{item.name}</TableCell>
                            <TableCell width={300}>{item.actname
                            }</TableCell>
                            <TableCell align="left">
                              {item?.status === "Paid" ? (
                                <span
                                  style={{ color: "#02C509", fontWeight: "bold" }}
                                >
                                  Paid
                                </span>
                              ) : (
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  {item?.status}
                                </span>
                              )}
                            </TableCell>
                            <TableCell align="left">
                              <b>{item.amount}.00{" (" + qatar_currency + ")"}</b>
                            </TableCell>
                            <TableCell align="left">
                              <b>{item.invoiceId}</b>
                            </TableCell>
                            <TableCell align="left" className="action-td">
                              <div className="btn credit-request">
                                {item?.amount !== 0 ? (
                                  <div className="btn">
                                    {item.isRequested === 1 ? (
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        style={{}}
                                        disabled
                                        sx={{ width: 135 }}
                                      >
                                        <b>Requested</b>
                                      </Button>
                                    ) : (
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleClickOpen(item)}
                                      >
                                        <b>Credit Request</b>
                                      </Button>
                                    )}
                                  </div>
                                ) : (
                                  <div className="btn">
                                    {
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        disabled
                                        style={{}}
                                      >
                                        <b>Credit Request</b>
                                      </Button>
                                    }
                                  </div>
                                )}
                                &nbsp; &nbsp;
                                <Button className="idiv">
                                  <Image
                                    onClick={() =>
                                      SimpleInvpdf(item, "", "")
                                    }
                                    src="/download-y.svg"
                                    alt="Picture of the author"
                                    width={35}
                                    height={35}
                                  />
                                </Button>
                                <Button className="idiv">
                                  <Image
                                    onClick={() =>
                                      ReceiptPdf(item, "SALES")
                                    }
                                    src="/file-text.png"
                                    alt="Picture of the author"
                                    width={35}
                                    height={35}
                                  />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <h3>No Record found</h3>
                      )}
                    </TableBody>
                  </Table>
                  {getSalesInvoices == "" ? <h3>No Record found</h3> : ""}
                  <Stack
                    style={{
                      marginBottom: "10px",
                      marginTop: "10px",
                      justifyContent: "end",
                      alignItems: "center",
                    }}
                    direction="row"
                  >
                    <Pagination
                      count={count}
                      page={page}
                      color="primary"
                      onChange={handlePageChange}
                    />
                    <FormControl>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue={5}
                        onChange={handlerowchange}
                        size="small"
                      >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </TableContainer>
              </Card>
              <ToastContainer />
            </div>
            <MainFooter />
          </Box>
        </Box>)}
      {CreditReqFormOpen ? (
        <RequestFormCmp
          open={RequestFormCmp}
          reqDet={reqDet}
          closeDialog={closePoP}
        />
      ) : (
        ""
      )}
    </>
  );
}
