import {
  Breadcrumbs,
  CircularProgress,
  TableHead,
  styled,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Grid, InputLabel, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import MiniDrawer from "../../sidebar";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { api_url, auth_token, base_url, qatar_currency } from "../../../helper/config";
import moment from "moment";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Button, OutlinedInput } from "@mui/material";
import Paper from "@mui/material/Paper";
import AddCustomer from "../customer/addNewCustomer";
import { AddItem } from "../additem";
import Link from "next/link";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import commmonfunctions from "../../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../../helper/activityLogs";
import UserService from "../../../commonFunctions/servives";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export interface FormValues {
  status: Number;
  res: String;
  startDate: String;
  endDate: String;
  Total: String;
  sort: String;
  customer: String;
  sdata: String;
  option: String;
  firstName: String;
  name: String;
  price: String;
  description: any;
  customerName: string;
  date: string;
  Customername: string;
}
interface Data {
  name: string;
  price: number;
}
function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

const BootstrapButton = styled(Button)({
  backgroundColor: "#1A70C5",
  color: "#FFFFFF",
  margin: "7px",
  "&:hover": {
    backgroundColor: "#1A70C5",
  },
});

export default function Guardians() {
  const [opens, setOpens] = useState(false);
  const [userID, setUserId] = useState<FormValues | any>([]);
  const [Invoicedates, setInvoiceDate] = useState(null);
  const [value, setValue] = useState<any>({ id: null, title: null });
  const [user, setUser] = useState<FormValues | any>([]);
  const [dollerOpen, setDollerOpen] = useState(false);
  const [popup, setSecondPop] = useState(false);
  const [inputValue, setInputValue] = useState<FormValues | any>([]);
  const [id, setId] = useState<FormValues | any>([]);
  const [error, setError] = useState<FormValues | any>([]);
  const [invoiceno, setInvoiceNo] = useState();
  const [invoice, setInvoice] = useState<FormValues | any>([]);
  const [notes, handlenotes] = useState<FormValues | any>([]);
  const [item, setItem] = useState<FormValues | any>([]);
  const [userUniqueId, setUserUniqId] = useState<any>();
  const [product, setProduct] = useState<FormValues | any>([]);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [spinner, setShowspinner] = useState(false);
  const [savebtnspinner, setsavebtnspinner] = useState(false);
  const [productLineIds, setproductLineIds] = useState<any>([]);
  const router = useRouter();
  const { invoiceId } = router.query;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (router.isReady) {
      commmonfunctions.VerifyLoginUser().then((res) => {
        setUserUniqId(res?.id);
      });
      getItems();
      getItem();
      invoiceDataById();
      getUser();
      getProductLines();
      router.push(`/admin/editInvoice/${invoiceId}`);
    }
  }, [router.isReady]);

  setSecondPop;
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const arr = [];
    arr.push(id);
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
    getItem();
  };

  const style = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const handleCloses = () => {
    setDollerOpen(false);
  };
  const onclose = () => {
    setSecondPop(false);
  };

  //get items
  const getItem = async () => {
    await axios({
      method: "GET",
      url: `${api_url}/getItems`,

      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        setItem(res?.data.data);
      })
      .catch((err) => { });
  };

  const getProductLines = async () => {
    await axios({
      method: "GET",
      url: `${api_url}/getProdctLineIds`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        setproductLineIds(res?.data?.data);
      })
      .catch((err) => { });
  }

  //get customers details by invoice id
  async function getCustomerIDByInvoice() {
    await axios({
      method: "GET",
      url: `${api_url}/getcustomeridByinvoiceid/${invoice[0]?.tuition_invoice_id}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((data: any) => {
        // AddLogs(
        //   userUniqueId,
        //   `Invoice updated id - #CUS-${data?.data?.data[0]?.customerId}`
        // );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //get users
  const getUser = async () => {
    await axios({
      method: "POST",
      url: `${api_url}/getuser`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        setUser(res?.data.data.users);
      })
      .catch((err) => { });
  };

  //invoice data by invoice id
  const invoiceDataById = async () => {
    await axios({
      method: "POST",
      url: `${api_url}/getInvoice/${invoiceId}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        setInvoice(res?.data.data);
        setValue({
          id: res?.data.data[0].id,
          title: res?.data.data[0].name,
          notes: res?.data.data[0].note
        });
        if (res) {
          axios({
            method: "POST",
            url: `${api_url}/getItembyid/${res?.data.data[0]?.id}`,
            headers: {
              "content-type": "multipart/form-data",
            },
          })
            .then((res) => {
              setProduct(res?.data.data);
            })
            .catch((err) => { });
        }
        setUser(res?.data.data);
        setInvoiceNo(res?.data?.invoiceNo);
      })
      .catch((err) => { console.log(err) });
  };

  //handle save & issue functionality
  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    setsavebtnspinner(true);
    var itemId: any[] = [];
    const dates = new Date();
    var invoiceDatesss = "";
    if (Invoicedates) {
      invoiceDatesss = moment(Invoicedates).format("DD/MM/YYYY");
    } else {
      invoiceDatesss = invoice[0]?.invoiceDate;
    }
    for (let row of product) {
      itemId.push(row.id);
    }
    const createdDate = moment(dates).format("DD/MM/YYYY");
    const requestedData = {
      title: "AdminSideInvoice",
      itemId: itemId,
      amount: price,
      status: "Pending",
      createdDate: invoice[0]?.createdDate,
      invoiceDate: invoiceDatesss,
      customerId: userID.id ? userID.id : invoice[0]?.customerId,
      invoiceNo: invoiceno ? invoiceno : invoice[0]?.tuition_invoice_id,
      updatedAt: createdDate,
      updatedBy: userUniqueId,
      note: notes,
      invoiceItems: product
    };
    await axios({
      method: "POST",
      url: `${api_url}/editInvoice/${invoiceId}`,
      data: requestedData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (res) {
          const item = {
            id: res?.data?.data[0]?.id,
            invoiceId: res?.data?.sageIntacctInvoiceID ? res?.data?.sageIntacctInvoiceID : res?.data?.data?.invoiceId
          }
          DownloadInvoice(item,
            "",
            "admin_side");
          toast.success("Invoice updated Successfully !");
          setTimeout(() => {
            setsavebtnspinner(false);
            router.push("/admin/invoices/invoice");
          }, 800);
        } else {
          toast.error("something wents wrong server error !");
          setShowspinner(false);
        }
      })
      .catch((err) => {
        if (err) {
          setsavebtnspinner(false);
          setError(err?.response?.data?.message);
        }
      });
  };

  //automatically download invoice after invoice created 
  const DownloadInvoice = async (item: any, title: string, isSide: string) => {
    const invoiceid = item?.tuition_invoice_id || item?.invoiceId;
    const reqData = {
      id: item.id,
      invoiceId: invoiceid,
      isSide: isSide,
    };
    UserService.DownloadInvoices(reqData).then((response: any) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoiceid}.pdf`);
      document.body.appendChild(link);
      link.click();
      return false;
    });
  };

  //handle draft functionality
  const handleDraft = async () => {
    setShowspinner(true);
    var itemId: any[] = [];
    const dates = new Date();
    var invoiceDatesss = "";
    if (Invoicedates) {
      invoiceDatesss = moment(Invoicedates).format("DD/MM/YYYY");
    } else {
      invoiceDatesss = invoice[0]?.invoiceDate;
    }
    for (let row of product) {
      itemId.push(row.id);
    }
    const createdDate = moment(dates).format("DD/MM/YYYY");
    const requestedData = {
      title: "AdminSideInvoice",
      itemId: itemId,
      amount: price,
      status: "Draft",
      createdDate: invoice[0]?.createdDate,
      invoiceDate: invoiceDatesss,
      customerId: userID.id ? userID.id : invoice[0]?.customerId,
      invoiceNo: invoiceno ? invoiceno : invoice[0]?.tuition_invoice_id,
      updatedAt: createdDate,
      updatedBy: userUniqueId,
      note: notes,
      invoiceItems: product
    };
    await axios({
      method: "POST",
      url: `${api_url}/editInvoice/${invoiceId}`,
      data: requestedData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (res) {
          toast.success("Invoice updated Successfully !");
          setShowspinner(false);
          setTimeout(() => {
            router.push("/admin/invoices/invoice");
          }, 700);
        } else {
          toast.error("something wents wrong server error !");
          setShowspinner(false);
        }
      })
      .catch((err) => {
        if (err) {
          setShowspinner(false);
          setError(err?.response?.data?.message);
          console.log(err.response.data.message, "error");
        }
      });
  };

  var option: { id: number; title: string }[] = [];
  user &&
    user.map((data: any, key: any) => {
      return option.push({
        id: data.id,
        title: data.name,
      });
    });

  const searchItems = (e: any) => {
    if (e.target.value === "") {
      // setUsers(searchdata);
      getItem();
    } else {
      const filterres = item.filter((item: any) => {
        return item.name.toLowerCase().includes(e.target.value.toLowerCase());
      });
      const dtd = filterres;
      setItem(dtd);
    }
  };

  const handleItem = () => {
    setDollerOpen(true);
  };
  const getItems = async () => {
    invoiceDataById();
  };

  const handleCreate = async () => {
    let requested = {
      id: selected,
    };
    await axios({
      method: "POST",
      url: `${api_url}/getItembyid`,
      data: requested,

      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        const merged = [...product, ...res?.data.data];
        setProduct(merged);
        handleCloses();
      })
      .catch((err) => { });
  };

  var price = 0;
  for (let d of product) {
    price = price + d.item_total_price;
  }
  const handleNew = () => {
    setSecondPop(true);
  };

  const handleClickOpen = () => {
    setOpens(true);
  };
  const handleClose = (data: any) => {
    if (data === false) {
      getUser();
      setOpens(false);
      let gg = user.filter((a: any) => a.id === 47);
    } else {
      setId(data);
      getUser();
      setTimeout(() => {
        setOpens(false);
      }, 3000);
    }
  };
  let gg = user.filter((a: any) => a.id === id);

  const handlePopup = (stats: any) => {
    if (stats === false) {
      getItem();
      setSecondPop(false);
    } else {
      getItem();
      setSecondPop(false);
    }
  };

  function openDelete(item: any) {
    console.log(item);
    let gg = product.filter((a: any) => a.id !== item);
    setProduct(gg);
  }

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="guardianBar">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                        Edit Invoices
                      </Link>
                    </Breadcrumbs>
                  </Stack>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ fontWeight: "bold", color: "#333333" }}
                  >
                    EDIT INVOICES
                  </Typography>
                </Stack>
                <div className="cinvoice">
                  <div
                    className="buycss"
                    style={{
                      textAlign: "end",
                      marginTop: "7px",
                      marginRight: "10px",
                    }}
                  >
                    <Link
                      href="/admin/invoices/invoice"
                      style={{ color: "#1A70C5", textDecoration: "none" }}
                    >
                      <Button variant="contained" startIcon={<ArrowBackIcon />}>
                        {" "}
                        <b>Back To List</b>
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <BootstrapButton
                      onClick={handleDraft}
                      type="button"
                      className="grey-button"
                    >
                      Save as Draft{" "}
                      <Typography
                        style={{ fontSize: "2px", paddingLeft: "10px" }}
                      >
                        {spinner === true ? (
                          <CircularProgress color="inherit" />
                        ) : (
                          ""
                        )}
                      </Typography>
                    </BootstrapButton>

                    <BootstrapButton type="submit">
                      Save & issue{" "}
                      <Typography
                        style={{ fontSize: "2px", paddingLeft: "10px" }}
                      >
                        {savebtnspinner === true ? (
                          <CircularProgress color="inherit" />
                        ) : (
                          ""
                        )}
                      </Typography>
                    </BootstrapButton>
                  </div>
                </div>
              </Stack>
              {/*bread cump */}
              <div className="midBar">
                <div className="guardianList" style={{ padding: "50px" }}>
                  <div className="required">
                    <Typography style={style}></Typography>
                  </div>
                  <div className="aititle">
                    <div className="iatitle flex">
                      <div className="invoive-img">
                        {" "}
                        <Image
                          className="iaimg"
                          src="/favicon.ico"
                          alt="Picture of the author"
                          width={65}
                          height={62}
                        />
                      </div>
                      <div className="invoice-name-detail">
                        <span className="iahead">
                          Qatar International School
                        </span>
                        <span className="line">
                          Qatar international school W.L.L
                        </span>
                        <span className="line">
                          United Nations St, West Bay, P.O. Box: 5697
                        </span>
                        <span className="line">Doha, Qatar</span>
                      </div>
                    </div>
                    <div className="itele">
                      <span className="Tline">Telephone: 443434343</span>
                      <span className="Tline">Website: www.qis.org</span>
                      <span className="Tline">Email: qisfinance@qis.org</span>
                    </div>
                  </div>
                  <div className="icenter">
                    <div className="invoice">
                      <span className="iainvoice">Invoice</span>
                    </div>
                  </div>
                  <div className="ickks">
                    <div className="ickk">
                      <InputLabel htmlFor="name">
                        Customer <span className="err_str">*</span>
                      </InputLabel>
                      <Autocomplete
                        disabled
                        style={{ width: 300 }}
                        fullWidth
                        value={value}
                        inputValue={inputValue}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                          setUserId(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        options={option}
                        getOptionLabel={(option) => option.title || ""}
                        isOptionEqualToValue={(option, title) =>
                          option.title === value.title
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Find or create a parent"
                          />
                        )}
                        noOptionsText={
                          <Button onClick={handleClickOpen}>
                            {inputValue === "" ? (
                              "Please enter 1 or more character"
                            ) : (
                              <span>
                                Add &nbsp;<b>{inputValue}</b>&nbsp;as a new
                                parent
                              </span>
                            )}
                          </Button>
                        }
                      />
                      <Typography style={style}>
                        {errors.Customername ? (
                          <span>Feild is Required **</span>
                        ) : (
                          ""
                        )}
                      </Typography>
                    </div>
                    <div className="invoicedateField">
                      <InputLabel></InputLabel>
                      <OutlinedInput
                        type="text"
                        id="name"
                        placeholder="# Generate If blank"
                        fullWidth
                        onChange={(e: any) => setInvoiceNo(e.target.value)}
                        value={!invoiceno ? invoice[0]?.tuition_invoice_id : invoiceno}
                        disabled
                      />
                      <InputLabel id="demo-select-small"></InputLabel>
                      &nbsp; &nbsp;
                      <DatePicker
                        className="myDatePicker"
                        selected={Invoicedates}
                        onChange={(date: any) => setInvoiceDate(date)}
                        name="startDate"
                        dateFormat="MM/dd/yyyy"
                        placeholderText={invoice[0]?.invoiceDate}
                      />
                    </div>
                  </div>
                  <div className="invoiceItem">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 500 }} aria-label="simple table" className="invoice-table">
                        <TableHead>
                          <TableRow>
                            <TableCell>ITEM NAME</TableCell>
                            <TableCell>DESCRIPTION</TableCell>
                            <TableCell>ITEM UNIT</TableCell>
                            <TableCell>QUANTITY</TableCell>
                            <TableCell>Rate {"(" + qatar_currency + ")"}</TableCell>
                            <TableCell>Amount {"(" + qatar_currency + ")"}</TableCell>
                            {/* <TableCell>Action</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {product.map((row: any, key: any) => (
                            <TableRow id={key}>
                              <TableCell>{row?.item_name}</TableCell>
                              <TableCell>{row?.item_unit}</TableCell>
                              <TableCell>{row?.item_unit}</TableCell>
                              <TableCell>{row?.quantity}</TableCell>
                              <TableCell>{commmonfunctions.formatePrice(row?.item_price)} {"(" + qatar_currency + ")"}</TableCell>
                              <TableCell>{commmonfunctions.formatePrice(row.item_total_price)} {"(" + qatar_currency + ")"}</TableCell>
                              {/* <TableCell>
                                <IconButton
                                  className="action-delete"
                                  style={{ color: "#F95A37" }}
                                  onClick={() => openDelete(row.id)}
                                >
                                  <RiDeleteBin5Fill />
                                </IconButton>
                              </TableCell> */}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    &nbsp;&nbsp;
                    {/* <div>
                      <BootstrapButton
                        className="itembtn"
                        onClick={handleItem}
                        type="button"
                      >
                        Add items
                      </BootstrapButton>
                    </div> */}
                  </div>
                  &nbsp;&nbsp;
                  <div className="invoiceSubTotal">
                    <div>
                      <InputLabel id="demo-select-small">Notes:</InputLabel>
                      <OutlinedInput
                        className="invoiceNote"
                        size="medium"
                        type="text"
                        id="name"
                        disabled
                        onChange={(e: any) => handlenotes(e.target.value)}
                        value={!invoiceno ? ((invoice[0]?.note) != "undefined" ? invoice[0]?.note : "") : notes}

                      />
                    </div>
                    <div className="invoiceTotalamount blank-td" >
                      <div className="sdiv">
                        <div className="sidiv">Subtotal</div>
                        <div>&nbsp;{commmonfunctions.formatePrice(price)} {"(" + qatar_currency + ")"}</div>
                      </div>
                      <div className="sdiv">
                        <div className="sidiv">Total</div>
                        <div>&nbsp;{commmonfunctions.formatePrice(price)} {"(" + qatar_currency + ")"}</div>
                      </div>
                      <div className="sdiv">
                        <div className="sidiv">Balance Due</div>
                        <div>&nbsp;{commmonfunctions.formatePrice(price)} {"(" + qatar_currency + ")"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <BootstrapDialog
                  onClose={handleCloses}
                  aria-labelledby="customized-dialog-title"
                  open={dollerOpen}
                >
                  <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleCloses}
                  >
                    Add Items
                  </BootstrapDialogTitle>
                  <DialogContent dividers>
                    <Box sx={{ width: "100%" }}>
                      <div className="hhh">
                        <div className="invoiceInput">
                          <OutlinedInput
                            onChange={(e) => searchItems(e)}
                            type="text"
                            id="name"
                            placeholder="Search"
                            fullWidth
                            size="small"
                          />
                        </div>
                        <div>
                          <Button onClick={handleNew}>New</Button>
                        </div>
                      </div>
                      <Paper className="table-outer" sx={{ width: "100%", mb: 2 }}>
                        <TableContainer>
                          <Table
                            sx={{ minWidth: 550 }}
                            aria-labelledby="tableTitle"
                            size="small"
                          >
                            <TableBody>
                              {item &&
                                item.map((row: any) => {
                                  const isItemSelected = isSelected(row.id);
                                  const labelId = `enhanced-table-checkbox-${row.id}`;
                                  return (
                                    <TableRow
                                      hover
                                      onClick={(event) =>
                                        handleClick(event, row.id)
                                      }
                                      role="checkbox"
                                      aria-checked={isItemSelected}
                                      tabIndex={-1}
                                      key={row.name}
                                      selected={isItemSelected}
                                    >
                                      {/* <TableCell padding="checkbox"></TableCell> */}
                                      <TableCell
                                        component="th"
                                        id={labelId}
                                        scope="row"
                                        padding="none"
                                      >
                                        <div className="table">
                                          <div>{row.name}</div>
                                          <div>{row.price}</div>
                                        </div>
                                      </TableCell>
                                      {isItemSelected ? (
                                        <span className="selectss">
                                          selected
                                        </span>
                                      ) : (
                                        <span className="plus">+</span>
                                      )}
                                      {/* <TableCell align="right">{row.protein}</TableCell> */}
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {item == "" ? <h3>No records found</h3> : ""}
                      </Paper>
                      <div>
                        {selected.length > 0 ? (
                          <Typography
                            sx={{ flex: "1 1 100%" }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                          >
                            {selected.length} selected
                          </Typography>
                        ) : (
                          <Typography
                            sx={{ flex: "1 1 100%" }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                          ></Typography>
                        )}
                      </div>
                    </Box>{" "}
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      autoFocus
                      onClick={handleCreate}
                    >
                      Create
                    </Button>
                  </DialogActions>
                </BootstrapDialog>
              </div>
            </form>
            {popup ? <AddItem start={true} closeD={handlePopup} productLineIds={productLineIds} /> : ""}
            {opens ? <AddCustomer open={true} closeDialog={handleClose} /> : ""}
          </div>
        </Box>
      </Box>
    </>
  );
}
