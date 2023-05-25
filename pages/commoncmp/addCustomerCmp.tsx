import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddNewParent from "../admin/customer/addNewParent";
import UserService from "../../commonFunctions/servives";

export default function AddCustomerCmp({ Data, PId, pname }: { Data: any, PId: any, pname: any }) {
  console.log("AddCustomerCmp", Data)

  const [users, setUsers] = useState<any>([]);
  const [opens, setOpens] = React.useState(false);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<any>({ id: PId, title: pname });
  useEffect(() => {
    getUser();
  }, []);
  const getUser = () => {
    UserService.getUser().then((res: any) => {
      setUsers(res.filter((dt: any) => dt.roleId === 2 && dt.parentId === 0));
    });
  }
  const option: { id: number; title: string; email: string }[] = [];
  users &&
    users.map((data: any, key: any) => {
      return option.push({
        id: data.id,
        title: data.name,
        email: data.email1
      });
    });
  const handleClickOpen = () => {
    setOpens(true);
  };
  const closePoP = (item: any) => {
    setOpens(false);
    getUser();
  };

  return (
    <>
      <Autocomplete
        size="small"
        value={value}
        inputValue={inputValue}
        onChange={(event, newValue) => {
          setValue(newValue);
          Data(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={option}
        getOptionLabel={(option) => option.title || ""}
        isOptionEqualToValue={(option, title) => option.title === value.title}
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
                Add &nbsp;<b>{inputValue}</b>&nbsp;as a new parent
              </span>
            )}
          </Button>
        }
      />
      {opens ? (
        <AddNewParent open={true} closeDialog={closePoP} name={inputValue} />
      ) : (
        ""
      )}
    </>
  );
}

export function AddParentCmp({ Data, PId, pname }: { Data: any, PId: any, pname: any }) {
  console.log("AddParentCmp", Data)
  const [users, setUsers] = useState<any>([]);
  const [opens, setOpens] = React.useState(false);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<any>({ id: PId, title: pname });


  useEffect(() => {
    getUser();
  }, []);
  const getUser = () => {
    UserService.getParentUser().then((res: any) => {
      setUsers(res);

      // res &&
      // res.map((data: any, key: any) =>(

      //   // (option.length == 0) ?
      //   //   option.push({
      //   //    id: data.id,
      //   //    title: (data.name + " ("+data.parentId+") "),
      //   //    email: data.email1
      //   //  })
      //   // :
      //   //   option.filter((user:any)=> user.id != data.id?
      //   //   option.push({
      //   //    id: data.id,
      //   //    title: (data.name + " ("+data.parentId+") "),
      //   //    email: data.email1
      //   //  }):"")

      //   option.push({
      //     id: data.id,
      //     title: (data.name + " ("+data.parentId+") "),
      //     email: data.email1
      //   })


      // ))
    })
  }
  let option: { id: number; title: string; email: string }[] = (users && users) ;



  // console.log(" option value ", option)

  const handleClickOpen = () => {
    setOpens(true);
  };
  const closePoP = (item: any) => {
    setOpens(false);
    getUser();
  };

  return (
    <>
      <Autocomplete

        size="small"
        value={value}
        inputValue={inputValue}
        onChange={(event, newValue) => {
          setValue(newValue);
          Data(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={option}
        getOptionLabel={(option) => option.title || ""}
        isOptionEqualToValue={(option, title) => option?.title === value?.title}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.title}
            </li>
          );
        }}
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
                Add &nbsp;<b>{inputValue}</b>&nbsp;as a new parent
              </span>
            )}
          </Button>
        }
      />
      {opens ? (
        <AddNewParent open={true} closeDialog={closePoP} name={inputValue} />
      ) : (
        ""
      )}
    </>
  );
}
