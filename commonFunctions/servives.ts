import axios from "axios";
import { api_url, auth_token } from "../helper/config";
class UserService {
  //get customers
  getUser = async () => {
    let data;
    await axios({
      method: "POST",
      url: `${api_url}/getUser`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res: any) => {
        if (res) {
          data = res?.data?.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  };

  getParentUser = async () => {
    let data;
    await axios({
      method: "POST",
      url: `${api_url}/getParentUser`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res: any) => {
        if (res) {
          console.log("getParentUser", res);
          data = res?.data?.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  };

  //get user det
  GetUserDet = async (id: any) => {
    let response = await axios.get(`${api_url}/getuserdetails/${id}`, {
      headers: {
        Authorization: auth_token,
      },
    });
    return response.data.data[0];
  };
  //get role det
  GetRoles = async () => {
    let response = await axios.get(`${api_url}/getRole`, {
      headers: {
        Authorization: auth_token,
      },
    });
    return response.data.data;
  };
  //get customer type
  getType = async () => {
    let response = await axios.get(`${api_url}/getType`, {
      headers: {
        Authorization: auth_token,
      },
    });
    return response.data.data;
  };
  //get all items
  getItem = async () => {
    let response = await axios.get(`${api_url}/getItems`, {
      headers: {
        Authorization: auth_token,
      },
    });
    return response.data.data;
  };
  //get invoices
  getInvoices = async () => {
    let data;
    await axios({
      method: "POST",
      url: `${api_url}/getInvoice`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res: any) => {
        if (res) {
          data = res?.data?.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  };
  //get items by items id
  getItems = async (itenId: any) => {
    let data;
    await axios({
      method: "POST",
      url: `${api_url}/getItembyid/${itenId}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res: any) => {
        if (res) {
          data = res?.data?.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  };
  //get childs
  getChilds = async (id: any) => {
    const response = await fetch(`${api_url}/getChildsByparentId/${id}`, {
      method: "get",
      headers: {
        Authorization: auth_token,
      },
    });
    const data = await response.json();
    return data.data;
  };
  //convert parent child json format
  convert = (array: any) => {
    var map: any = {};
    for (var i = 0; i < array.length; i++) {
      var obj = array[i];
      obj.children = [];
      map[obj.id] = obj;
      var parent = obj.parentId || "-";
      if (!map[parent]) {
        map[parent] = {
          children: [],
        };
      }
      map[parent].children.push(obj);
    }
    return map["-"].children;
  };
  //get user nvoices
  getUserInvoiceList = async (id: any) => {
    const response = await fetch(`${api_url}/getPendingInvoices/${id}`, {
      method: "POST",
      headers: {
        Authorization: auth_token,
      },
    });
    const res = await response.json();
    return res.data;
  };
  //get purchase activity
  getActvtPchdlist = async (id: any) => {
    const response = await fetch(`${api_url}/getactivitybyuserid/${id}`, {
      method: "get",
      headers: {
        Authorization: auth_token,
      },
    });
    const res = await response.json();
    return res;
  };
  //get credit notes
  getCreditNotes = async (id: any) => {
    const response = await fetch(`${api_url}/creditballanceByUser/${id}`, {
      method: "GET",
      headers: {
        Authorization: auth_token,
      },
    });
    const res = await response.json();
    return res;
  };
  //get credit ballance
  fetchCreditBallance = async (id: any) => {
    const response = await fetch(`${api_url}/creditballance/${id}`, {
      method: "GET",
      headers: {
        Authorization: auth_token,
      },
    });
    const res = await response.json();
    return res;
  };
  //get parent details by user id
  getParentDetails = async (id: any) => {
    const response = await fetch(`${api_url}/getuserbypid/${id}`, {
      method: "GET",
      headers: {
        Authorization: auth_token,
      },
    });
    const res = await response.json();
    return res.data;
  };
  //download invoices
  DownloadInvoices = async (reqData: any) => {
    let pdfdownloaddata;
    await axios({
      method: "post",
      url: `${api_url}/downloadinvoice`,
      data: reqData,
      responseType: "arraybuffer",
      headers: {
        Authorization: auth_token,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/pdf",
      },
    })
      .then((response: any) => {
        if (response) {
          pdfdownloaddata = response;
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
    return pdfdownloaddata;
  };

  //download partial paid or multiple paid receipt
  DownloadReceipt = async (reqData: any) => {
    let receiptdownloaddata;
    await axios({
      method: "post",
      url: `${api_url}/downloadreceipt`,
      data: reqData,
      responseType: "arraybuffer",
      headers: {
        Authorization: auth_token,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/pdf",
      },
    })
      .then((response: any) => {
        if (response) {
          receiptdownloaddata = response;
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
    return receiptdownloaddata;
  };

  // download single paid receipt
  DownloadReceiptSinglePaid = async (reqData: any) => {
    let receiptdownloaddata;
    await axios({
      method: "post",
      url: `${api_url}/downloadreceiptbytrxid`,
      data: reqData,
      responseType: "arraybuffer",
      headers: {
        Authorization: auth_token,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/pdf",
      },
    })
      .then((response: any) => {
        if (response) {
          receiptdownloaddata = response;
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
    return receiptdownloaddata;
  };

  //get invoiceids
  getinvoiceds = async () => {
    const response = await fetch(`${api_url}/getinvoiceids`, {
      method: "get",
      headers: {
        Authorization: auth_token,
      },
    });
    const data = await response.json();
    return data.data;
  };
  //get invoiceids
  getreceiptnumbers = async () => {
    const response = await fetch(`${api_url}/getreceiptnumbers`, {
      method: "get",
      headers: {
        Authorization: auth_token,
      },
    });
    const data = await response.json();
    return data.data;
  };
}
export default new UserService();
