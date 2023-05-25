import {
  TableHead,
  styled,
  Breadcrumbs,
  CircularProgress,
  Modal,
} from "@mui/material";
import { InputLabel, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import MiniDrawer from "../sidebar";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { api_url, auth_token, qatar_currency } from "../../helper/config";
import moment from "moment";
import Image from "next/image";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Button, OutlinedInput } from "@mui/material";
import Paper from "@mui/material/Paper";
import AddCustomer from "./customer/addNewCustomer";
import { AddItem } from "./additem";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MainFooter from "../commoncmp/mainfooter";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Checkbox from "@mui/material/Checkbox";
import commmonfunctions from "../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../helper/activityLogs";
import UserService from "../../commonFunctions/servives";
import { Search } from "@mui/icons-material";

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
  invoiceItems: any;
  cart: {
    name: string;
    amount: String;
    description: String;
    unit: String;
    quantity: String;
    totalamount: String;
    totalprice: String;
    product_line_id: string
  }[];
}
interface Data {
  name: string;
  price: number;
}


export default function Guardians() {

  const [opens, setOpens] = useState(false);
  const [userID, setUserId] = useState<FormValues | any>([]);
  const [itemError, setItemError] = useState("");
  const [Invoicedates, setInvoiceDate] = useState(null);
  const [user, setUser] = useState<FormValues | any>([]);
  const [dollerOpen, setDollerOpen] = useState(false);
  const [popup, setSecondPop] = useState(false);
  const [inputValue, setInputValue] = useState<FormValues | any>([]);
  const [id, setId] = useState<FormValues | any>([]);
  const [error, setError] = useState<FormValues | any>([]);
  const [Dateerror, setDateError] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  const [invoiceno, setInvoiceNo] = useState<FormValues | any>([]);
  const [notes, handlenotes] = useState<FormValues | any>([]);
  const [item, setItem] = useState<FormValues | any>([]);
  const [product, setProduct] = useState<FormValues | any>([]);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [userUniqueId, setUserUniqId] = useState<any>();
  const [searchquery, setsearchquery] = useState("");
  const [searchdata, setsearchdata] = useState([]);
  const [spinner, setShowspinner] = useState(false);
  const [savebtnspinner, setsavebtnspinner] = useState(false);
  const [productLineIds, setproductLineIds] = useState<any>([]);
  const router = useRouter();


  //token verify
  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });
    commmonfunctions.VerifyLoginUser().then((res) => {
      if (res.exp * 1000 < Date.now()) {
        localStorage.removeItem("QIS_loginToken");
        router.push("/");
      }
    });
    const logintoken = localStorage.getItem("QIS_loginToken");
    if (logintoken === undefined || logintoken === null) {
      router.push("/");
    }
    invoiceNo();
    getUser();
    getItem();
    getProductLines();
    // setFocus(`cart.${1}.quantity`, { shouldSelect: true })
  }, []);

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  setSecondPop;
  const handleClick = (id: string) => {
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
    if (newSelected.length === 0) {
      setItemError("Item field is required");
    } else {
      setItemError("");
    }
    getItem();
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const BootstrapButton = styled(Button)({
    backgroundColor: "#1A70C5",
    color: "#FFFFFF",
    margin: "7px",
    "&:hover": {
      backgroundColor: "#1A70C5",
    },
  });

  const handleCloses = () => {
    setDollerOpen(false);
    setFilter('');
  };

  const onclose = () => {
    setSecondPop(false);
  };

  const style = {
    color: "#F95A37",
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "20px",
  };

  //get users
  const getUser = () => {
    UserService.getUser().then((res: any) => {
      setUser(res?.users.filter((dt: any) => dt.status === 1));
    });
  };

  //get items
  const getItem = async () => {
    UserService.getItem().then((res: any) => {
      setItem(
        res.filter(
          (dt: any) =>
            dt.product_line_id !== "activities" &&
            dt.product_line_id !== "Activities" &&
            dt.product_line_id !== null &&
            dt.product_line_id !== ""
        )
      );
      setsearchdata(
        res.filter(
          (dt: any) =>
            dt.product_line_id !== "activities" &&
            dt.product_line_id !== "Activities" &&
            dt.product_line_id !== null &&
            dt.product_line_id !== ""
        )
      );
    });
  };

  //handle save & issues functionality
  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    setsavebtnspinner(true);
    const dates = new Date();
    const invoiceDate = moment(Invoicedates).format("DD/MM/YYYY");
    const createdDate = moment(dates).format("DD/MM/YYYY");
    if (selected.length < 1) {
      setItemError("Item field is required");
      setsavebtnspinner(false);
    } else {
      setItemError("");
    }
    if (invoiceDate === "Invalid date") {
      setDateError("Invoice Date field is required");
      setsavebtnspinner(false);
    } else {
      setDateError("");
    }
    const requestedData = {
      title: "AdminSideInvoice",
      itemId: selected,
      amount: price,
      status: "Pending",
      createdDate: createdDate,
      createdBy: userUniqueId,
      invoiceDate: invoiceDate,
      customerId: userID.id,
      invoiceNo: invoiceno,
      note: notes,
      invoiceItems: product,
    };
    await axios({
      method: "POST",
      url: `${api_url}/createTuitionInvoice`,
      data: requestedData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (!res) {
          setsavebtnspinner(false);
          toast.error("something wents wrong server error !");
        } else {
          AddLogs(
            userUniqueId,
            `Invoice created id - #${res?.data?.sageIntacctInvoiceID}`
          );
          toast.success("Invoice created Successfully !");
          const item = {
            id: res?.data?.data?.insertId,
            invoiceId: res?.data?.sageIntacctInvoiceID
          }
          DownloadInvoice(item,
            "",
            "admin_side");
          reset();
          setTimeout(() => {
            setsavebtnspinner(false);
            router.push("/admin/invoices/invoice");
          }, 1000);
        }
      })
      .catch((err) => {
        setsavebtnspinner(false);
        if (err) {
          setError(err?.response?.data?.message);
        }
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  };

  //handle draft functionality
  const handleDraft = async () => {
    setShowspinner(true);
    const dates = new Date();
    var invoiceDatesss;
    if (Invoicedates != "") {
      invoiceDatesss = moment(Invoicedates).format("DD/MM/YYYY");
    } else {
    }
    const createdDate = moment(dates).format("DD/MM/YYYY");
    if (selected.length < 1) {
      setItemError("Item field is required");
      setShowspinner(false);
    } else {
      setItemError("");
    }
    if (invoiceDatesss === "Invalid date") {
      setDateError("Invoice Date field is required");
      setShowspinner(false);
    } else {
      setDateError("");
    }
    if (!Dateerror && !itemError) {
      const requestedData = {
        title: "AdminSideInvoice",
        itemId: selected,
        amount: price,
        status: "Draft",
        createdDate: createdDate,
        createdBy: userUniqueId,
        invoiceDate: invoiceDatesss == "Invalid date" ? "" : invoiceDatesss,
        customerId: userID?.id,
        invoiceNo: invoiceno,
        note: notes,
        invoiceItems: product,
      };
      await axios({
        method: "POST",
        url: `${api_url}/createTuitionInvoice`,
        data: requestedData,
        headers: {
          "content-type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (!res) {
            toast.error("something wents wrong server error !");
            setShowspinner(false);
          } else {
            AddLogs(
              userUniqueId,
              `Invoice created id - #${res?.data?.sageIntacctInvoiceID}`
            );
            toast.success("Invoice created Successfully !");
            setTimeout(() => {
              router.push("/admin/invoices/invoice");
            }, 1000);
          }
        })
        .catch((err) => {
          if (err) {
            setShowspinner(false);
            setError(err?.response?.data?.message);
          }
          setTimeout(() => {
            setError('');
          }, 3000);
        });
    }
  };

  //*********** */ handle add, edit row functionality start
  const handleItem = () => {
    setDollerOpen(true);
  };

  const handleProductDataUpdate = (data: any) => {
    let dt: any = [];
    data.map((d: any, k: any) => {
      dt.push({
        id: d.id,
        name: d.name,
        description: d.description,
        unit: "Each",
        quantity: "1",
        amount: d.amount,
        totalprice: (d?.quantity ? d?.quantity : 1) * d.amount,
        itemID: d.itemID,
        product_line_id: d.product_line_id
      });
    });
    setProduct(dt);
  };

  const handleCreate = async () => {
    await axios({
      method: "get",
      url: `${api_url}/getItemsForCreateInvoice/${selected}`,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        handleProductDataUpdate(res?.data?.data);
        handleCloses();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  var price = 0;
  for (let d of product) {
    price = price + Number(d.totalprice);
  }

  const handleQuantityUpdate = (e: any, index: any, identifier: string) => {
    if (identifier === "quantity") {
      const dt = product.map((data: any, i: any) => {
        const amountVerify = data.amount * e.target.value;
        if (index == i) {
          return Object.assign(data, {
            quantity: e.target.value,
            totalprice: amountVerify,
          });
        } else {
          return data;
        }
      });
      setProduct(dt);
    } else if (identifier === "price") {
      if (/\D/g.test(e.target.value)) {
        e.target.value = e.target.value.replace(/\D/g, "");
      }
      const dt = product.map((data: any, i: any) => {
        const amountVerify = data.quantity * e.target.value;
        if (index == i) {
          return Object.assign(data, {
            amount: e.target.value,
            totalprice: amountVerify,
          });
        } else {
          return data;
        }
      });
      setProduct(dt);
    } else if (identifier === "description") {
      const dt = product.map((data: any, i: any) => {
        if (index == i) {
          return Object.assign(data, { description: e.target.value });
        } else {
          return data;
        }
      });
      setProduct(dt);
    }
  };
  //*************end add edit row functionality

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
    } else {
      setId(data);
      getUser();
      setTimeout(() => {
        setOpens(false);
      }, 3000);
    }
  };

  const handlePopup = (stats: any) => {
    if (stats === false) {
      getItem();
      setSecondPop(false);
    } else {
      getItem();
      setSecondPop(false);
    }
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

  const invoiceNo = async () => {
    await axios({
      method: "GET",
      url: `${api_url}/getInvoiceNo`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        setInvoiceNo(res?.data?.invoiceNo);
      })
      .catch((err) => { });
  };

  const handleChange = (value: any) => {
    setUserId(value);
    if (value) {
      setError("");
    }
  };

  const handleDate = (date: any) => {
    setInvoiceDate(date);
    if (date) {
      setDateError("");
    } else {
      setDateError("Invoice Date field is required");
    }
  };

  const handleInvoice = (data: any) => {
    if (data) {
      setInvoiceError("");
      setInvoiceNo(data);
    } else {
      setInvoiceError("Invoice no is required");
    }
  };

  function openDelete(item: any) {
    let gg = product.filter((a: any) => a.id !== item.id);
    setProduct(gg);
    const arr = selected.filter((it) => it !== item.id);
    setSelected(arr);
  }

  const [filter, setFilter] = useState("");
  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const filteredRows = searchdata.filter(
    (row: any) =>
      row?.name.toLowerCase().includes(filter.toLowerCase()) ||
      row?.itemID?.toLowerCase().includes(filter?.toLowerCase())
  );

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

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="guardianBar">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                        href="/admin/invoices/invoice"
                        style={{ color: "#1A70C5", textDecoration: "none" }}
                      >
                        Home
                      </Link>
                      <Link
                        key="2"
                        color="inherit"
                        href="/admin/addinvoice"
                        style={{ color: "#7D86A5", textDecoration: "none" }}
                      >
                        Create Invoices
                      </Link>
                    </Breadcrumbs>
                  </Stack>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ fontWeight: "bold", color: "#333333" }}
                  >
                    Create Invoices
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
              <div className="midBar">
                <div className="guardianList" style={{ padding: "50px" }}>
                  <div
                    className="required"
                    style={{ textAlign: "right" }}
                  ></div>
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
                      <span
                        className="iainvoice"
                        style={{ fontFamily: "Arial" }}
                      >
                        Invoice
                      </span>
                    </div>
                  </div>
                  <div className="ickks">
                    <div className="ickk">
                      <InputLabel htmlFor="name">
                        Customer <span className="err_str">*</span>
                        <div
                          className="required"
                          style={{ textAlign: "right" }}
                        ></div>
                      </InputLabel>
                      <Autocomplete
                        style={{ width: 300 }}
                        fullWidth
                        inputValue={inputValue}
                        className="custome-text"
                        onChange={(event, value) => handleChange(value)}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
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
                            variant="outlined"
                            placeholder="Find or create a customer"
                          />
                        )}
                        noOptionsText={
                          <Button onClick={handleClickOpen}>
                            {inputValue === "" ? (
                              "Please enter 1 or more character"
                            ) : (
                              <span>
                                Add &nbsp;<b>{inputValue}</b>&nbsp;as a customer
                              </span>
                            )}
                          </Button>
                        }
                      />
                      <Typography style={style}>
                        <span>
                          {error === "customer field is required" ? error : ""}{" "}
                        </span>
                      </Typography>
                    </div>
                    <div className="invoicedateField">
                      <InputLabel></InputLabel>
                      <OutlinedInput
                        type="text"
                        id="name"
                        placeholder="# Generate If blank"
                        fullWidth
                        onChange={(e: any) => handleInvoice(e.target.value)}
                        value={invoiceno}
                        style={{ width: "300px" }}
                      />
                      <Typography style={style}>
                        <span style={style}>
                          {error === "please enter unique invoice no" ? error : ""}{" "}
                          {invoiceError}
                        </span>
                      </Typography>
                      <InputLabel id="demo-select-small"></InputLabel>
                      <DatePicker
                        className="myDatePicker"
                        selected={Invoicedates}
                        onChange={(date: any) => handleDate(date)}
                        name="Date"
                        dateFormat="MM/dd/yyyy"
                        placeholderText="Date"
                        minDate={new Date()}
                      />
                      <Typography style={style}>
                        <span>{Dateerror ? Dateerror : ""} </span>
                      </Typography>
                    </div>
                  </div>
                  <div className="invoiceItem">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 500 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Item Description</TableCell>
                            <TableCell>Item Unit</TableCell>
                            <TableCell>Item Quantity</TableCell>
                            <TableCell>
                              Item Price {"(" + qatar_currency + ")"}
                            </TableCell>
                            <TableCell>
                              Total Price {"(" + qatar_currency + ")"}
                            </TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {product.length > 0 &&
                            product.map((field: any, index: any) => (
                              <TableRow className="boder-bottom" key={field.id}>
                                <TableCell>
                                  <OutlinedInput
                                    type="text"
                                    id="itemname"
                                    placeholder="Item Name..."
                                    fullWidth
                                    name={`cart.${index}.name`}
                                    value={field.name}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell>
                                  <OutlinedInput
                                    type="text"
                                    id="itemdesc"
                                    placeholder="Item Description..."
                                    fullWidth
                                    name={`cart.${index}.description`}
                                    value={field.description?.replace(/<(.|\n)*?>/g, '')}
                                    onChange={(e) =>
                                      handleQuantityUpdate(
                                        e,
                                        index,
                                        "description"
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <OutlinedInput
                                    type="text"
                                    id="itemunit"
                                    placeholder="Item Unit..."
                                    fullWidth
                                    disabled
                                    name={`cart.${index}.unit`}
                                    value={field.unit}
                                    inputProps={{ readOnly: true }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <OutlinedInput
                                    type="number"
                                    id="itemquantity"
                                    placeholder="Item quantity..."
                                    fullWidth
                                    inputProps={{ min: 1 }}
                                    name={`cart.${index}.quantity`}
                                    value={field.quantity}
                                    onChange={(e) =>
                                      handleQuantityUpdate(e, index, "quantity")
                                    }
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <OutlinedInput
                                    type="text"
                                    id="name"
                                    placeholder="price"
                                    fullWidth
                                    name={`cart.${index}.amount`}
                                    value={field.amount}
                                    onChange={(e) =>
                                      handleQuantityUpdate(e, index, "price")
                                    }
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <OutlinedInput
                                    type="text"
                                    id="itemTotalPrice"
                                    placeholder="total price"
                                    fullWidth
                                    name={`cart.${index}.totalprice`}
                                    value={field.totalprice}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell className="action">
                                  <IconButton
                                    className="action-delete"
                                    style={{ color: "#F95A37" }}
                                    onClick={() => openDelete(field)}
                                  >
                                    <RiDeleteBin5Fill />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div>
                      <Modal
                        open={dollerOpen}
                        onClose={handleCloses}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className="search-model"
                      >
                        <Box className="customized-dialog-title">
                          <h2
                            className="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-ryi2t6"
                            id="customized-dialog-title"
                          >
                            Add Items{" "}
                            <Button onClick={handleCloses}>
                              <CloseIcon />
                            </Button>
                          </h2>
                          <Box
                            sx={{ width: "100%" }}
                            className="popup-content-box"
                          >
                            <div className="hhh">
                              <form noValidate autoComplete="off">
                                <TextField
                                  id="filter"
                                  variant="outlined"
                                  placeholder="Search"
                                  value={filter}
                                  onChange={handleFilterChange}
                                  InputProps={{
                                    endAdornment: (
                                      <Search color="action" fontSize="small" />
                                    ),
                                  }}
                                />
                              </form>
                              <div>
                                <Button onClick={handleNew}>New</Button>
                              </div>
                            </div>

                            <TableContainer component={Paper}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="left"></TableCell>
                                    <TableCell>Item Code</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Item Type</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {filteredRows.length > 0 ? (
                                    filteredRows.map((row: any, index: any) => {
                                      const isItemSelected = isSelected(row.id);
                                      const labelId = `enhanced-table-checkbox-${row.id}`;
                                      return (
                                        <TableRow
                                          key={index}
                                          id={index}
                                          hover
                                          onClick={() =>
                                            handleClick(row.id)
                                          }
                                          role="checkbox"
                                          aria-checked={isItemSelected}
                                          tabIndex={-1}
                                          selected={isItemSelected}
                                        >
                                          <TableCell>
                                            <Checkbox
                                              color="primary"
                                              checked={isItemSelected}
                                              inputProps={{
                                                "aria-labelledby": labelId,
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>{row.itemID}</TableCell>
                                          <TableCell>{row.name}</TableCell>
                                          <TableCell>
                                            {commmonfunctions.formatePrice(
                                              row.price
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {row.product_line_id}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={5} align="center">
                                        Record Not Found
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <div></div>
                          </Box>{" "}
                          <div className="fixed-button">
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
                            <Button variant="contained" onClick={handleCreate} disabled={selected.length > 0 ? false : true}>
                              Add Item
                            </Button>
                          </div>
                        </Box>
                      </Modal>
                    </div>
                    &nbsp;&nbsp;
                    <div>
                      <BootstrapButton
                        className="itembtn btn"
                        onClick={handleItem}
                        type="button"
                      >
                        Add items
                      </BootstrapButton>
                    </div>
                    <Typography style={style}>
                      <span>{itemError ? itemError : ""} </span>
                    </Typography>
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
                        onChange={(e: any) => handlenotes(e.target.value)}
                        value={notes}
                      />
                    </div>
                    <div className="invoiceTotalamount">
                      <div className="sdiv">
                        <div className="sidiv">Subtotal</div>
                        <div>
                          &nbsp;{commmonfunctions.formatePrice(price)}{" "}
                          {" (" + qatar_currency + ")"}
                        </div>
                      </div>
                      <div className="sdiv">
                        <div className="total">
                          <div className="sidiv">Total</div>
                          <div>
                            &nbsp;{commmonfunctions.formatePrice(price)}{" "}
                            {" (" + qatar_currency + ")"}
                          </div>
                        </div>
                      </div>
                      <div className="sdiv">
                        <div className="sidiv">Balance Due</div>
                        <div>
                          &nbsp;{commmonfunctions.formatePrice(price)}
                          {" (" + qatar_currency + ")"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {popup ? (
              <AddItem
                start={true}
                closeD={handlePopup}
                productLineIds={productLineIds}
              />
            ) : (
              ""
            )}

            {opens ? <AddCustomer open={true} closeDialog={handleClose} /> : ""}
          </div>
          <MainFooter />
        </Box>
      </Box>
    </>
  );
}
