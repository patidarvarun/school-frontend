import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TableHead,
  Button,
  Breadcrumbs,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Menu,
  Grid,
  InputLabel,
  Autocomplete,
  OutlinedInput,
  IconButton,
  Tab,
} from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiFilterAlt, BiShow } from "react-icons/bi";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { api_url, auth_token } from "../../../helper/config";
import MiniDrawer from "../../sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Image from "next/image";
import MainFooter from "../../commoncmp/mainfooter";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { useRouter } from "next/router";
import Loader from "../../commoncmp/myload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CSVDownload } from "react-csv";
import UserService from "../../../commonFunctions/servives";
import FilterListIcon from '@mui/icons-material/FilterList';
import CachedIcon from '@mui/icons-material/Cached';

//pagination function
function usePagination(data: any, itemsPerPage: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);
  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data?.slice(begin, end);
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

//filter form values
type FormValues = {
  startdate: Date;
  enddate: Date;
  customerId: number;
  invoice: string;
  receipt: string;
  payment: string;
};

export default function ReportList() {
  const [reports, setReports] = useState<any>([]);
  const [searchquery, setsearchquery] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [paymentmethod, setpaymentmethod] = useState<any>("");
  const [startdate, setstartdate] = useState<FormValues | any>(null);
  const [enddate, setenddate] = useState<any>(null);
  const router = useRouter();
  const [roleid, setroleid] = React.useState<any>("");
  const [myload, setmyload] = React.useState(true);
  const [OpenCSV, setOpenCSV] = React.useState(false);
  const [custpermit, setcustpermit] = useState<any>([]);
  const [receiptNumbers, setreceiptNumbers] = useState<FormValues | any>([]);
  const [receiptNumber, setreceiptNumber] = useState<any>("");
  const [RId, setRId] = useState<any>("");
  const [INVIDs, setINVIDs] = useState<FormValues | any>([]);
  const [INVID, setINVID] = useState<FormValues | any>("");
  const [invid, setinvid] = useState<any>("");
  const [user, setUser] = useState<FormValues | any>([]);
  const [userID, setUserId] = useState<FormValues | any>("");
  const [UID, setUId] = useState<any>("");
  const [paymentMethod, setPaymentMethod] = useState<any>("All");
  const [All, setAll] = useState<any>(0);
  const [loader, setLoadar] = useState(true);


  setTimeout(() => {
    setmyload(false);
  }, 2000);

  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
      }
    });
    const logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    commmonfunctions.GivenPermition().then((res) => {
      setroleid(res.roleId);
      if (res.roleId == 1) {
        setroleid(res.roleId);
        //router.push("/userprofile");
      } else if (res.roleId > 1 && res.roleId !== 2) {
        commmonfunctions.ManageReports().then((res) => {
          if (!res) {
            router.push("/userprofile");
          } else {
            setcustpermit(res);
          }
        });
      } else {
        router.push("/userprofile");
      }
    });
    fetchData();
    getUser();
    getinvoiceds();
    getreceiptnums();
  }, []);

  //get reports
  const url = `${api_url}/getReports`;
  const fetchData = async () => {
    setLoadar(true);
    await axios({
      method: "POST",
      url: url,
      headers: {
        Authorization: auth_token,
      },
    }).then((res: any) => {
      setAll(res.data.data?.length);
      setReports(res.data.data);
      setsearchdata(res.data.data);
      setLoadar(false)
    }).catch((error: any) => {
      console.log("error", error);
    })
  };

  //get users
  const getUser = () => {
    UserService.getUser().then((res: any) => {
      setUser(res?.users);
    });
  };

  //get invoices
  const getinvoiceds = () => {
    UserService.getinvoiceds().then((res: any) => {
      setINVIDs(res);
    });
  };
  //get receipt numbers
  const getreceiptnums = () => {
    UserService.getreceiptnumbers().then((res: any) => {
      setreceiptNumbers(res);
    });
  };

  //searching functionality
  const handleSearch = (e: any) => {
    setsearchquery(e.target.value);
    setPage(1);
    DATA.jump(1);
    if (e.target.value === "") {
      setReports(searchdata);
    } else {
      const filterres = searchdata.filter((item: any) => {
        return (
          item?.rct_number?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.invoice_id?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.name
            ?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.email
            ?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.customerId
            ?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.parentId
            ?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.paymentMethod
            ?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.generated_trx_id
            ?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          `${item?.paidAmount}`
            ?.toLowerCase().includes(e.target.value.toLowerCase()) ||
          item?.check_no
            ?.toLowerCase().includes(e.target.value.toLowerCase())
        );
      });
      const dtd = filterres;
      setReports(dtd);
    }
  };
  //filter data
  const filterApply = async (e: any) => {
    setLoadar(true);
    e.preventDefault();
    const reqData = {
      receiptNo: RId,
      invoiceId: invid,
      customerId: UID,
      paymentmethod: paymentMethod == "All" ? '' : paymentMethod,
      startDate:
        startdate !== null ? moment(startdate, "DD MM YYYY").format("YYYY-MM-DD") : startdate,
      endDate:
        enddate !== null ? moment(enddate, "DD MM YYYY").format("YYYY-MM-DD") : enddate,
    };
    await axios({
      method: "POST",
      url: `${api_url}/getReports`,
      data: reqData,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res: any) => {
        if (res.status === 200) {
          setReports(res.data.data);
          setsearchdata(res.data.data);
          setLoadar(false);
        }
      })
      .catch((error: any) => {
        console.log(error);
        setLoadar(false);
      });
  };

  //reset filter value
  function ResetFilterValue() {
    setPaymentMethod("All");
    setUId("");
    setUserId("")
    setRId("");
    setreceiptNumber("")
    setinvid("")
    setINVID("");
    setstartdate(null);
    setenddate(null);
    fetchData();
  }

  //pagination
  const [row_per_page, set_row_per_page] = useState(5);
  function handlerowchange(e: any) {
    set_row_per_page(e.target.value);
  }
  let [page, setPage] = useState(1);
  const PER_PAGE = row_per_page;
  const count = Math.ceil(reports.length / PER_PAGE);
  const DATA = usePagination(reports, PER_PAGE);
  const handlePageChange = (e: any, p: any) => {
    setPage(p);
    DATA.jump(p);
  };

  //download invoice
  const DownloadInvoice = async (item: any, title: string, isSide: string) => {
    const invoiceid = item?.invoice_id;
    const reqData = {
      id: item.id,
      invoiceId: invoiceid,
      isSide: isSide
    }
    UserService.DownloadInvoices(reqData).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceid}.pdf`);
      document.body.appendChild(link);
      link.click();
      return false;
    });
  }
  //download invoice
  const DownloadReceipt = async (item: any, title: string, isSide: string) => {
    const reqData = {
      RCTNumber: item?.rct_number,
      isSide: isSide,
      transactionId: item?.transactionId
    }
    UserService.DownloadReceipt(reqData).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${item?.rct_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      return false;
    });
  }

  //refresh fuctionality
  const Refresh = () => {
    fetchData();
  }

  //sorting functionality
  const DataSort = () => {
    setReports([...reports].reverse());
  }

  //export to csv excel file
  const [mydata, setmydata] = useState<any>([]);
  //const [myload, setmyload] = useState(false);
  function ExportCSV() {
    let datas: {
      rct_number: string;
      invoice_id: string;
      name: string;
      email: number;
      paidAmount: number;
      transaction_date: string;
      generated_trx_id: string;
      paymentMethod: string;
      checkNo: string;
      authorizationCode: string;
      referenceNo: string;
    }[] = [];
    reports.map((item: any) => {
      console.log(item)
      datas.push({
        rct_number: item?.rct_number,
        invoice_id: item.invoice_id,
        name: item.name,
        email: item.email,
        paidAmount: item.paidAmount,
        transaction_date: moment(item?.transaction_date
          , "YYYY-MM-DD").format(
            "MMM DD, YYYY"
          ),
        generated_trx_id
          : item.generated_trx_id,
        paymentMethod: item.paymentMethod,
        checkNo: item?.check_no != "null" ? item.check_no : "",
        authorizationCode: item?.authorization_code != "null" ? item.authorization_code : "",
        referenceNo: item.item?.reference_no != "null" ? item.reference_no : "",
      });
    });
    setmydata(datas)
    setOpenCSV(true);
    setTimeout(() => {
      setOpenCSV(false);
    }, 500);
  }
  const headers = [
    { label: "RECEIPT NUMBER", key: "rct_number" },
    { label: "INVOICE ID", key: "invoice_id" },
    { label: "CUSTOMER NAME", key: "name" },
    { label: "CUSTOMER EMAIL", key: "email" },
    { label: "AMOUNT ", key: "paidAmount" },
    { label: "PAY DATE", key: "transaction_date" },
    { label: "TRANSACTION ID", key: "generated_trx_id" },
    { label: "PAYMENT METHOD", key: "paymentMethod" },
    { label: "Check No", key: "checkNo" },
    { label: "Authorization Code", key: "authorizationCode" },
    { label: "Reference No", key: "referenceNo" },
  ];

  return (
    <>
      {OpenCSV && mydata.length > 0 ? (
        <CSVDownload data={mydata} headers={headers} target="_blank" />
      ) : (
        ""
      )}
      {
        myload ? (
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
                  style={{ padding: "8px", marginBottom: "15px" }}
                >
                  <Stack>
                    <Stack spacing={3}>
                      <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link
                          key="1"
                          color="inherit"
                          href="/admin/dashboard"
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
                          Reports
                        </Link>
                      </Breadcrumbs>
                    </Stack>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ fontWeight: "bold", color: "#333333" }}
                    >
                      REPORTS
                    </Typography>
                  </Stack>
                </Stack>
                {/*bread cump */}
                <Card
                  style={{ margin: "10px", padding: "15px" }}
                  className="box-shadow"
                >
                  <TableContainer>
                    {/*bread cump */}
                    <Stack
                      style={{ marginBottom: "10px" }}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Tab
                          className="filter-list"
                          label={`All(${All})`}
                          style={{ color: "#0675e3", fontWeight: "bold" }}
                        />
                      </Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        className="fimport-export-box"
                      >
                        <MenuItem onClick={DataSort}>
                          <span style={{ color: "#1a70c5", fontWeight: "600", marginTop: "8px" }}><FilterListIcon /></span>
                          &nbsp; <span style={{ color: "#1a70c5", fontWeight: "600", marginRight: "10px" }}>Sort</span>
                        </MenuItem>
                        <MenuItem onClick={Refresh}>
                          <span style={{ color: "#1a70c5", fontWeight: "600", marginTop: "8px" }}><CachedIcon /></span>
                          &nbsp; <span style={{ color: "#1a70c5", fontWeight: "600", marginRight: "10px" }}>REFRESH</span>
                        </MenuItem>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <Box>
                              <MenuItem {...bindTrigger(popupState)}>
                                <BiFilterAlt />
                                &nbsp; Filter
                              </MenuItem>
                              <Menu {...bindMenu(popupState)}>
                                <Container>
                                  <Grid style={{ width: "1030px" }}>
                                    <Typography variant="h5">
                                      <b>Filter</b>
                                    </Typography>
                                    <form
                                    //onSubmit={handleSubmit(onSubmit)}
                                    >
                                      <Stack style={{ marginTop: "10px" }}>
                                        <Grid container spacing={2}>
                                          <Grid item xs={4} lg={4} md={4}>
                                            <Stack spacing={1}>
                                              <InputLabel htmlFor="receipt">
                                                Receipt No.
                                              </InputLabel>
                                              <FormControl fullWidth>
                                                <Autocomplete
                                                  id="combo-box-demo"
                                                  value={receiptNumber === "" ? null : receiptNumber}
                                                  options={receiptNumbers}
                                                  getOptionLabel={(option: any) =>
                                                    option.refrenceId
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder="Search by receipt number..."
                                                    />
                                                  )}
                                                  onChange={(event, newValue) => {
                                                    setRId(newValue?.refrenceId);
                                                    setreceiptNumber(newValue);
                                                  }}
                                                />
                                              </FormControl>
                                            </Stack>
                                          </Grid>
                                          <Grid item xs={12} lg={4}>
                                            <Stack spacing={1}>
                                              <InputLabel htmlFor="invoice">
                                                Invoice Id
                                              </InputLabel>
                                              <FormControl fullWidth>
                                                <Autocomplete
                                                  id="combo-box-demo"
                                                  value={INVID === "" ? null : INVID}
                                                  options={INVIDs}
                                                  getOptionLabel={(option: any) =>
                                                    option.invoiceId !== null ? option.invoiceId : option.tuition_invoice_id
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder="Search by invoiceid..."
                                                    />
                                                  )}
                                                  onChange={(event, newValue) => {
                                                    setinvid(newValue?.invoiceId || newValue?.tuition_invoice_id);
                                                    setINVID(newValue);
                                                  }}
                                                />
                                              </FormControl>
                                            </Stack>
                                          </Grid>
                                          <Grid item xs={12} lg={4}>
                                            <Stack spacing={1}>
                                              <InputLabel htmlFor="Customer">
                                                Customer Name (Id)
                                              </InputLabel>
                                              <FormControl fullWidth>
                                                <Autocomplete
                                                  id="combo-box-demo"
                                                  value={userID === "" ? null : userID}
                                                  options={user}
                                                  getOptionLabel={(option: any) =>
                                                    option.name +
                                                    ` (${option.isParentId !== null
                                                      ? "Parent - " + option.isParentId
                                                      : "Child - " + option.customerId
                                                    })`
                                                  }
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder="Search by customer name or id..."
                                                    />
                                                  )}
                                                  onChange={(event, newValue) => {
                                                    setUId(newValue?.id)
                                                    setUserId(newValue);
                                                  }}
                                                />
                                              </FormControl>
                                            </Stack>
                                          </Grid>
                                          <Grid item xs={12} lg={4}>
                                            <Stack spacing={1}>
                                              <InputLabel htmlFor="payment">
                                                Payment Method
                                              </InputLabel>
                                              <FormControl fullWidth>
                                                <Select
                                                  labelId="demo-simple-select-label"
                                                  id="demo-simple-select"
                                                  size="small"
                                                  onChange={(e: any) =>
                                                    setPaymentMethod(e.target.value)
                                                  }
                                                  value={paymentMethod}
                                                >
                                                  <MenuItem value={"All"}>
                                                    All
                                                  </MenuItem>
                                                  <MenuItem value={"Cash"}>Cash</MenuItem>
                                                  <MenuItem value={"Credit Card"}>Credit Card</MenuItem>
                                                  <MenuItem value={"Printed Check"}>Printed Check</MenuItem>
                                                  {/* <MenuItem value={"QPay"}>Debit Card</MenuItem> */}
                                                </Select>
                                              </FormControl>
                                            </Stack>
                                          </Grid>
                                          <Grid item xs={12} lg={4}>
                                            <Stack spacing={1}>
                                              <InputLabel htmlFor="startdate">
                                                Date Range (Start Date)
                                              </InputLabel>
                                              <DatePicker
                                                className="myDatePicker"
                                                id="startdate"
                                                selected={startdate}
                                                dateFormat="MM/dd/yyyy"
                                                placeholderText="Start Date"
                                                onChange={(date: any) =>
                                                  setstartdate(date)
                                                }
                                              />
                                            </Stack>
                                          </Grid>
                                          <Grid item xs={12} lg={4}>
                                            <Stack spacing={1}>
                                              <InputLabel htmlFor="enddate">
                                                End Date
                                              </InputLabel>
                                              <DatePicker
                                                className="myDatePicker"
                                                id="enddate"
                                                selected={enddate}
                                                dateFormat="MM/dd/yyyy"
                                                placeholderText="End Date"
                                                onChange={(date: any) =>
                                                  setenddate(date)
                                                }
                                              />
                                            </Stack>
                                          </Grid>
                                          <Grid
                                            item
                                            xs={12}
                                            style={{ marginBottom: "10px", marginTop: "20px" }}
                                            className="filtercss"
                                          >
                                            <div onClick={popupState.close}>
                                              <Button
                                                size="small"
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                sx={{ width: 150 }}
                                                // onClick={popupState.close}
                                                onClick={(e) => filterApply(e)}
                                              >
                                                <b>Apply Filter</b>
                                                <span
                                                  style={{
                                                    fontSize: "2px",
                                                    paddingLeft: "10px",
                                                  }}
                                                ></span>
                                              </Button>
                                            </div>
                                            &nbsp;&nbsp;
                                            <div
                                              onClick={popupState.close}
                                              className="resetfiltercss"
                                            >
                                              <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                sx={{ width: 150 }}
                                                onClick={ResetFilterValue}
                                              >
                                                <b>Reset Filter</b>
                                                <span
                                                  style={{
                                                    fontSize: "2px",
                                                    paddingLeft: "10px",
                                                  }}
                                                ></span>
                                              </Button>
                                            </div>
                                          </Grid>
                                        </Grid>
                                      </Stack>
                                    </form>
                                  </Grid>
                                </Container>
                              </Menu>
                            </Box>
                          )}
                        </PopupState>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <Box>
                              <MenuItem {...bindTrigger(popupState)} onClick={ExportCSV}>
                                Export
                                <KeyboardArrowDownIcon />
                              </MenuItem>
                            </Box>
                          )}
                        </PopupState>
                        <FormControl>
                          <TextField
                            placeholder="Search..."
                            size="small"
                            value={searchquery}
                            type="search..."
                            onInput={(e) => handleSearch(e)}
                          />
                        </FormControl>
                      </Stack>
                    </Stack>
                    {loader ? (
                      <Loader />
                    ) : (
                      <div style={{ width: "100%", overflow: "auto" }} >
                        <Table style={{ marginTop: "20px", width: "100px", display: "table-caption" }}>
                          <TableHead>
                            <TableRow>
                              {/* <TableCell padding="checkbox">
                            <Checkbox
                            //onChange={handleCheck}
                            />
                          </TableCell> */}
                              <TableCell>
                                <Typography width={150}>RECEIPT NO.</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={130}>INVOICE ID</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={100}>CUSTOMER ID</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={200}>CUSTOMER NAME</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={250}>CUSTOMER EMAIL</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={100}>AMOUNT</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={120}>PAY DATE</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={100}>TRX ID</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={150}>PAYMENT METHOD</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={100}>Check No</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={150}>Authorization Code</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography width={150}>Reference No</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>ACTION</Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {DATA.currentData() &&
                              DATA.currentData().map((item: any, key: any) => {
                                return (
                                  <TableRow
                                    key={key}
                                    hover
                                    tabIndex={-1}
                                    role="checkbox"
                                    className="boder-bottom"
                                  >
                                    {/* <TableCell padding="checkbox">
                                  <Checkbox />
                                </TableCell> */}
                                    <TableCell align="left">{item?.rct_number}</TableCell>
                                    <TableCell align="left">{item?.invoice_id}</TableCell>
                                    <TableCell align="left">{item?.parentId || item?.customerId}</TableCell>
                                    <TableCell align="left">{item?.name}</TableCell>
                                    <TableCell align="left">{item?.email}</TableCell>
                                    <TableCell align="left">{commmonfunctions.formatePrice(item?.paidAmount)}</TableCell>
                                    <TableCell align="left"> {moment(item?.transaction_date
                                      , "YYYY-MM-DD").format(
                                        "MMM DD, YYYY"
                                      )}</TableCell>
                                    <TableCell align="left">{item?.generated_trx_id}</TableCell>
                                    <TableCell align="left">{item?.paymentMethod}</TableCell>
                                    <TableCell align="left">{item?.check_no != "null" ? item.check_no : ""}</TableCell>
                                    <TableCell align="left">{item?.authorization_code != "null" ? item.authorization_code : ""}</TableCell>
                                    <TableCell align="left">{item?.reference_no != "null" ? item.reference_no : ""}</TableCell>
                                    <TableCell align="left">
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        className="action"
                                      >
                                        <Button className="idiv">
                                          <Image
                                            src="/file-text.png"
                                            alt="Receipt Invoice"
                                            title="Receipt Invoice"
                                            width={35}
                                            height={35}
                                            onClick={() =>
                                              DownloadReceipt(item, "", "admin_side")
                                            }
                                          />
                                        </Button>
                                        <Button className="idiv">
                                          <Image
                                            onClick={() => DownloadInvoice(item, "", "admin_side")}
                                            src="/download.svg"
                                            alt="Picture of the author"
                                            width={35}
                                            height={35}
                                          />
                                        </Button>
                                        <IconButton className="action-view">
                                          <Link
                                            href={`/admin/viewInvoice/${item.id}`}
                                            title="View Customer"
                                            style={{
                                              color:
                                                "#26CEB3",
                                            }}
                                          >
                                            <BiShow />
                                          </Link>
                                        </IconButton>
                                      </Stack>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    {reports == "" ? <h3>No Record found</h3> : ""}
                    <Stack
                      style={{ marginBottom: "10px", marginTop: "10px" }}
                      direction="row"
                      alignItems="right"
                      justifyContent="space-between"
                    >
                      <Pagination
                        className="pagination"
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
                          style={{ width: "50px", height: "40px", marginRight: "10px" }}
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </TableContainer>
                </Card>
              </div>
              <MainFooter />
            </Box>
          </Box>)}
      <ToastContainer />
    </>
  );
}
