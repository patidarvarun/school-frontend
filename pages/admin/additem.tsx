import { CircularProgress, MenuItem, Select, styled, SelectChangeEvent } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Grid, InputLabel, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { api_url } from "../../helper/config";
import { useForm, SubmitHandler } from "react-hook-form";
import Typography from "@mui/material/Typography";
import { Button, OutlinedInput } from "@mui/material";
import Paper from "@mui/material/Paper";
import commmonfunctions from "../../commonFunctions/commmonfunctions";
import { AddLogs } from "../../helper/activityLogs";
// import { SelectChangeEvent } from '@mui/material/Select';


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
const style1 = {
  marginLeft: "151px",
  color: "red",
  fontSize: "12px",
  fontWeight: "bold",
};
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
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
  productLineId: string;
}

interface Data {
  name: string;
  price: number;
}

function createData(
  name: string,

  price: number
): Data {
  return {
    name,

    price,
  };
}

const rows = [
  createData("Cupcake", 305),
  createData("Donut", 452),
  createData("Eclair", 262),
  createData("Frozen yoghurt", 159),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Dessert (100g serving)",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Protein (g)",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
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

export function AddItem({
  start,
  closeD,
  productLineIds,
}: {
  start: any;
  closeD: any;
  productLineIds: any;
}) {
  let localUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [popup, setSecondPop] = useState(start);
  const [item, setItem] = useState<FormValues | any>([]);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [userUniqueId, setUserUniqId] = useState<any>();
  const [spinner, setshowspinner] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [productLineId, setproductLineId] = useState<any>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const style = {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
  };

  useEffect(() => {
    commmonfunctions.VerifyLoginUser().then((res) => {
      setUserUniqId(res?.id);
    });

    // getProductLines();
  }, []);

  // const getProductLines = async() => {
  //   await axios({
  //     method: "GET",
  //     url: `${api_url}/getProdctLineIds`,
  //     headers: {
  //       Authorization: auth_token,
  //     },
  //   })
  //     .then((res) => {
  //       console.log("getProductLines", res);
  //       setproductLineIds(res?.data?.data);
  //     })
  //     .catch((err) => { });
  // }

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const BootstrapButton = styled(Button)({
    backgroundColor: "#1A70C5",
    color: "#FFFFFF",
    margin: "7px",
    "&:hover": {
      backgroundColor: "#1A70C5",
    },
  });

  const onclose = () => {
    closeD(false);
    setSecondPop(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setproductLineId(event.target.value as string);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    setshowspinner(true);
    setBtnDisabled(true);
    let reqData = {
      name: data.name,
      price: data.price,
      description: data.description,
      itemtype: data.productLineId,
    };

    await axios({
      method: "POST",
      url: `${api_url}/createItem`,
      data: reqData,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        AddLogs(userUniqueId, `Item Added  id - #${res?.data?.itemid}`);
        getItem();
        reset();
        setshowspinner(false);
        setBtnDisabled(false);
        toast.success("Item Added Successfully !");
        setTimeout(() => {
          closeD(res);
        }, 1500);
      })
      .catch((err) => { });
  };
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

  return (
    <>
      <BootstrapDialog
        onClose={onclose}
        aria-labelledby="customized-dialog-title"
        className="new-item"
        open={popup}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onclose}>
          New Item
        </BootstrapDialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="dialogss">
            <Grid>
              <Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={14}>
                    <Stack spacing={1}>
                      <div className="display">
                        <div className="label">
                          <InputLabel htmlFor="name">Name :</InputLabel>
                        </div>
                        <div>
                          <OutlinedInput
                            type="text"
                            id="name"
                            placeholder="Name"
                            fullWidth
                            {...register("name", {
                              required: true,
                            })}
                          />
                          <Typography style={style}>
                            {errors.name ? (
                              <span>Feild is Required **</span>
                            ) : (
                              ""
                            )}
                          </Typography>
                        </div>
                      </div>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
              <Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={14}>
                    <Stack spacing={1}>
                      <div className="display">
                        <div className="label">
                          <InputLabel htmlFor="name">Price :</InputLabel>
                        </div>
                        <div>
                          <OutlinedInput
                            type="number"
                            id="name"
                            placeholder="price"
                            fullWidth
                            {...register("price", {
                              required: true,
                            })}
                          />
                          <Typography style={style}>
                            {errors.price ? (
                              <span>Feild is Required **</span>
                            ) : (
                              ""
                            )}
                          </Typography>
                        </div>
                      </div>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
              <Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                      <div className="display">
                        <div className="label">
                          <InputLabel htmlFor="itemtype">
                            Item Type :
                          </InputLabel>
                        </div>
                        <Select
                          style={{ width: "235px" }}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={productLineId}
                          defaultValue={productLineId}
                          size="small"
                          {...register("productLineId", {
                            required: "Item type is Required *",
                          })}
                          onChange={handleChange}
                        >
                          <MenuItem value={""}>Select Item</MenuItem>
                          {productLineIds.map((prodLine: any) => {
                            console.log("prodLine", prodLine);
                            console.log(
                              "prodLine.product_line_id",
                              prodLine?.product_line_id
                            );
                            return (
                              <MenuItem value={`${prodLine?.product_line_id}`}>
                                {prodLine?.product_line_id}
                              </MenuItem>
                            );
                          })}

                          {/* <MenuItem value={"school_fee"}>School Fee</MenuItem>
                          <MenuItem value={"admission_fee"}>Admission</MenuItem>
                          <MenuItem value={"exam_fee"}>Exam Fee</MenuItem> */}
                          {/* <MenuItem value={"activities"}>Activities</MenuItem> */}
                        </Select>
                      </div>
                    </Stack>
                  </Grid>
                </Grid>
                {errors.productLineId?.type && (
                  <span style={style1}>
                    {productLineId === "" ? errors?.productLineId?.message : ""}
                  </span>
                )}
              </Stack>
              <Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={14}>
                    <Stack spacing={1}>
                      <div className="display">
                        <div className="label">
                          <InputLabel htmlFor="description">
                            Description :
                          </InputLabel>
                        </div>
                        <div>
                          <TextField
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            fullWidth
                            {...register("description", {
                              required: true,
                            })}
                          />
                          <Typography style={style}>
                            {errors.price ? (
                              <span>Feild is Required **</span>
                            ) : (
                              ""
                            )}
                          </Typography>
                        </div>
                      </div>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              autoFocus
              disabled={btnDisabled}
            >
              Create Item
              <span style={{ fontSize: "2px", paddingLeft: "10px" }}>
                {spinner === true ? <CircularProgress color="inherit" /> : ""}
              </span>
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
      <ToastContainer />
    </>
  );
}
export default function AddItems() {
  return (
    <></>
  )
}
