import * as React from "react";
import {
  Box,
  Button,
  TableRow,
  TablePagination,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  DialogActions,
} from "@mui/material";
import MiniDrawer from "../sidebar";
import MainFooter from "../commoncmp/mainfooter";
import axios from "axios";
import { api_url } from "../../helper/config";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmBox from "../commoncmp/confirmbox";

interface Column {
  id: "id" | "name" | "days" | "action";
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "id", label: "Id", minWidth: 170 },
  { id: "name", label: "Event Name", minWidth: 100 },
  {
    id: "days",
    label: "Days",
    minWidth: 170,
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 200,
    align: "left",
  },
];

const ChasingList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [opendelete, setOpenDelete] = React.useState(false);
  const [triggerNumber, setTriggerNumber] = React.useState<number>(1);
  const [days, setDays] = React.useState<number>(1);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [chasingEvents, setChasingEvents] = React.useState<any>([]);
  const [chasingTrigger, setChasingTrigger] = React.useState<any>([]);
  const [selectedRow, setSelectedRow] = React.useState<any>('');
  const [selectedRowForDelete, setSelectedRowForDelete] = React.useState<any>('');

//   open chasing add modal
  const handleClickOpen = () => {
    setOpen(!open);
  };


  const handleChange = (event: any) => {
    if (event.target.name === "trigger_id") {
      setTriggerNumber(parseInt(event.target.value));
    } else if (event.target.name === "days") {
      setDays(parseInt(event.target.value));
    }
  };

  // get all chasing triggers
  const getChasingTrigger = async () => {
    await axios({
      method: "GET",
      url: `${api_url}/getChasingTrigger`,
    })
      .then((res: any) => {
        if (res.status === 200) {
          setChasingTrigger(res.data);
        }
      })
      .catch((error: any) => {
      });
  };

  // save chasing trigger
  const addChasingTrigger = async () => {
    const reqData = { trigger_id: triggerNumber, days: days, time: 0 };
    await axios({
      method: "POST",
      url: `${api_url}/addChasingTrigger`,
      data: reqData,
    })
      .then((res: any) => {
        if (res.status === 201) {
          toast.success("Event added successfully");
          handleClickOpen();
		  getChasingEvents();
        }
      })
      .catch((error: any) => {
        toast.error("Failed to add event");
      });
  };

//   open chasing update modal
  const handleClickOpenUpdate = (row:any) => {
    setOpenUpdate(!openUpdate);

	const getTriggerId = chasingTrigger.filter((res:any)=>{
		return  row?.name === res.name && Object.assign({row, [row?.name]:res.id});
	})

	const new_obj = { ...row, name: getTriggerId[0]?.id }
	setTriggerNumber(parseInt(getTriggerId.length > 0 ? getTriggerId[0]?.id : 1));
	setDays(parseInt(getTriggerId.length > 0 ? row?.days : 1));
	setSelectedRow(new_obj);
  };

    // update chasing event
	const updateChasingTrigger = async (id:any) => {
		const reqData = { trigger_id: triggerNumber, days: days, time: 0 };
		await axios({
		  method: "PUT",
		  url: `${api_url}/updateChasingEvent/${id}`,
		  data: reqData,
		})
		  .then((res: any) => {
			if (res.status === 200) {
			  toast.success("Event updated successfully");
			  handleClickOpenUpdate('');
			  getChasingEvents();
			}
		  })
		  .catch((error: any) => {
			toast.error("Failed to update event");
		  });
	  };

	  //   open chasing delete modal
  const handleClickOpenDelete = (row:any) => {
    setOpenDelete(!opendelete);
	setSelectedRowForDelete(row);
  };


	// delete chasing event
		const deleteChasingTrigger = async () => {
			await axios({
			  method: "DELETE",
			  url: `${api_url}/deleteChasingEvent/${selectedRowForDelete?.id}`,
			})
			  .then((res: any) => {
				if (res.status === 200) {
				  toast.success("Event deleted successfully");
				  handleClickOpenDelete('')
				  getChasingEvents();
				}
			  })
			  .catch((error: any) => {
				toast.error("Failed to delete event");
			  });
		  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // get all chasing triggers
  const getChasingEvents = async () => {
    await axios({
      method: "GET",
      url: `${api_url}/getChasingEvents`,
    })
      .then((res: any) => {
        if (res.status === 200) {
          setChasingEvents(res.data);
        }
      })
      .catch((error: any) => {
        
      });
  };

  React.useEffect(() => {
    getChasingEvents();
    getChasingTrigger();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="dashboardBar">
            <div className="dashboardbar">
              <div>
                <span className="dashboardsmallHeading">Home</span>&nbsp;
                <span>&gt;</span> &nbsp;{" "}
                <span className="secondHeading">Chasing</span>
                <h1 className="dashboardGtitle">CHASING</h1>
              </div>
            </div>
            <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
              <TableContainer>
                <Button
                  sx={{ float: "right" }}
                  onClick={handleClickOpen}
                  variant="contained"
                >
                  + Enable Chasing
                </Button>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chasingEvents
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row: any) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                          >
                            <TableCell key={row.id}>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.days}</TableCell>
                            <TableCell>
                              <>
                                {" "}
                                <Button
                                  className="idiv"
                                  onClick={() => handleClickOpenUpdate(row)}
                                >
                                  <Image
                                    src="/edit.svg"
                                    alt="Edit Chasing"
                                    title="Edit Chasing"
                                    width={35}
                                    height={35}
                                  />
                                </Button>
                                <Button className="idiv"  onClick={() => handleClickOpenDelete(row)}>
                                  <Image
                                    src="/delete.png"
                                    alt="delete Chasing"
                                    title="delete Chasing"
                                    width={35}
                                    height={35}
                                  />
                                </Button>
                              </>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={chasingEvents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
            <ToastContainer />

            {/* Add Chasing Modal Start */}
            <Dialog open={open} onClose={handleClickOpen}>
              <DialogTitle>Enable Chasing</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Email Sending Depends on your chasing select.
                </DialogContentText>

                <TableContainer
                  component={Paper}
                  sx={{ marginTop: "30px", width: "100%" }}
                >
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>TRIGGER</TableCell>
                        <TableCell align="left">Days</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <FormControl fullWidth>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={`${triggerNumber}`}
                              name="trigger_id"
                              onChange={handleChange}
                            >
                              {chasingTrigger.map((chasingItem: any) => {
                                return (
                                  <MenuItem
                                    key={chasingItem.id}
                                    value={chasingItem.id}
                                  >
                                    {chasingItem.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="left">
                          <OutlinedInput
                            type="number"
                            id="date-number"
                            fullWidth
                            size="small"
                            inputProps={{ min: 1 }}
                            name="days"
                            value={days}
                            onChange={handleChange}
                            sx={{ mt: 2.5 }}
                          />{" "}
                          {triggerNumber === 2 || triggerNumber === 4
                            ? "days before"
                            : "days after"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickOpen} variant="contained">
                  Cancel
                </Button>
                <Button
                  onClick={addChasingTrigger}
                  variant="contained"
                  disabled={Number.isNaN(days) ? true : false}
                >
                  SAVE
                </Button>
              </DialogActions>
            </Dialog>

			{/* Update Chasing Modal Start */}
			<Dialog open={openUpdate} onClose={handleClickOpenUpdate}>
              <DialogTitle>Update Chasing</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Email Sending Depends on your chasing select.
                </DialogContentText>

                <TableContainer
                  component={Paper}
                  sx={{ marginTop: "30px", width: "100%" }}
                >
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>TRIGGER</TableCell>
                        <TableCell align="left">Days</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <FormControl fullWidth>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={`${triggerNumber? triggerNumber : selectedRow.name}`}
                              name="trigger_id"
                              onChange={handleChange}
                            >
                              {chasingTrigger.map((chasingItem: any) => {
                                return (
                                  <MenuItem
                                    key={chasingItem.id}
                                    value={chasingItem.id}
                                  >
                                    {chasingItem.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell align="left">
                          <OutlinedInput
                            type="number"
                            id="date-number"
                            fullWidth
                            size="small"
                            inputProps={{ min: 1 }}
                            name="days"
                            value={days? days : selectedRow.days}
                            onChange={handleChange}
                            sx={{ mt: 2.5 }}
                          />{" "}
                          {triggerNumber === 2 || triggerNumber === 4
                            ? "days before"
                            : "days after"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClickOpenUpdate} variant="contained">
                  Cancel
                </Button>
                <Button
                  onClick={() => updateChasingTrigger(selectedRow.id)}
                  variant="contained"
                  disabled={Number.isNaN(days) ? true : false}
                >
                  UPDATE
                </Button>
              </DialogActions>
            </Dialog>

			{/* delete chasing event */}
			<ConfirmBox open={opendelete} closeDialog={handleClickOpenDelete} littleTitle={selectedRowForDelete.name} deleteFunction={deleteChasingTrigger}/>

          </div>
          <MainFooter />
        </Box>
      </Box>
    </>
  );
};

export default ChasingList;
