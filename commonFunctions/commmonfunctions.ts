import axios from "axios";
import jwt_decode from "jwt-decode";
import { api_url, auth_token } from "../helper/config";
import getwayService from "../services/gatewayService";

class CommonFunctions {
  //################## auth related functions ##################################

  //check token experiy date and remove token
  CheckTekenRExpire = async () => {
    const storedToken = localStorage.getItem("QIS_loginToken");
    if (storedToken) {
      let decodedData: any = jwt_decode(storedToken, { header: true });
      let expirationDate = decodedData.exp;
      var current_time = Date.now() / 1000;
      if (expirationDate < current_time) {
        localStorage.removeItem("QIS_loginToken");
        window.location.replace("/");
      }
    }
    if (
      storedToken === undefined ||
      storedToken === null ||
      storedToken === ""
    ) {
      window.location.replace("/");
    }
  };

  //verify token  and get details
  VerifyLoginUser = async () => {
    let login_token: any;
    login_token = localStorage.getItem("QIS_loginToken");
    const decoded: any = jwt_decode(login_token);
    return decoded;
  };

  //Crenditials get user details by token
  GivenPermition = async () => {
    let login_token: any;
    login_token = localStorage.getItem("QIS_loginToken");
    const decoded: any = jwt_decode(login_token);
    let response = await axios.get(`${api_url}/getuserdetails/${decoded.id}`, {
      headers: {
        Authorization: auth_token,
      },
    });
    return response.data.data[0];
  };

  //------------------------         manage previlegs    -------------------------------//

  //get user previlogs
  myfun = async () => {
    let login_token: any;
    login_token = localStorage.getItem("QIS_loginToken");
    const decoded: any = jwt_decode(login_token);
    let response = await axios.get(`${api_url}/getuserdetails/${decoded.id}`, {
      headers: {
        Authorization: auth_token,
      },
    });
    return response;
  };
  //manage dashboard
  ManageDashboard = async () => {
    const response = await this.myfun();
    const dt = response?.data?.data[0]?.userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].Dashboard) {
        return dttt.user_permition[i].Dashboard;
      }
    }
  };
  //manage customers
  ManageCustomers = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].Customers) {
        return dttt.user_permition[i].Customers;
      }
    }
  };
  //manage invoices
  ManageInvoices = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].Invoices) {
        return dttt.user_permition[i].Invoices;
      }
    }
  };
  //manage Activites
  ManageActivity = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].Activites) {
        return dttt.user_permition[i].Activites;
      }
    }
  };
  //manage Sales invoices
  ManageSalesInvoices = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].SalesInvoices) {
        return dttt.user_permition[i].SalesInvoices;
      }
    }
  };
  //manage composers
  ManageComposers = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].Cumposers) {
        return dttt.user_permition[i].Cumposers;
      }
    }
  };

  //Manage Credit Notes
  ManageCreditNotes = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].CreditNote) {
        return dttt.user_permition[i].CreditNote;
      }
    }
  };

  //Manage Accept Payment
  ManageAcceptPayment = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].AcceptPayment) {
        return dttt.user_permition[i].AcceptPayment;
      }
    }
  };

  //Manage Reports
  ManageReports = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].Reports) {
        return dttt.user_permition[i].Reports;
      }
    }
  };

  //Manage Accept Payment
  ManageCreditRequest = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].CreditRequest) {
        return dttt.user_permition[i].CreditRequest;
      }
    }
  };

  //manage composers
  ManageUsers = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].Customers) {
        return dttt.user_permition[i].Customers;
      }
    }
  };

  //manage composers
  ManageUserManagement = async () => {
    const response = await this.myfun();
    const dt = response.data.data[0].userPrevilegs;
    const dttt = JSON.parse(dt);
    const lgh = dttt.user_permition.length;
    for (var i = 0; i <= lgh - 1; i++) {
      if (dttt.user_permition[i].UserManagement) {
        return dttt.user_permition[i].UserManagement;
      }
    }
  };

  //Crenditials
  GetuserDet = async (token: any) => {
    const decoded: any = jwt_decode(token);
    let response = await axios.get(`${api_url}/getuserdetails/${decoded.id}`, {
      headers: {
        Authorization: auth_token,
      },
    });
    return response.data.data[0];
  };
  //get lastInsert id
  GetLastInsertId = async () => {
    let response = await axios.get(`${api_url}/getLastInsertId`, {
      headers: {
        Authorization: auth_token,
      },
    });
    return response.data.data[0];
  };
  //calculate dashboard data
  CallculateDashBoardData = async () => {
    try {
      let response = await axios.get(`${api_url}/dashboardData`, {
        headers: {
          Authorization: auth_token,
        },
      });
      return response.data;
    } catch (error: any) {
      console.log("error => ", error.message);
    }
  };
  //send emails with attachment after payment
  SendEmailsAfterPayment = async (data: any) => {
    await axios({
      method: "POST",
      url: `${api_url}/sendEmailAfterPay`,
      data: data,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res: any) => {
        if (res) {
          return res;
        }
      })
      .catch((error) => {
        return error;
      });
  };

  //unique key generate
  keyGen = (keyLength: any) => {
    var i,
      key = "",
      characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (i = 0; i < keyLength; i++) {
      key += characters.substr(
        Math.floor(Math.random() * charactersLength + 1),
        1
      );
    }
    return key;
  };

  // formate price in decimal
  formatePrice = (price: number) => {
    const formattedNumber = price?.toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formattedNumber;
  };

  //save data into tranaction after payment
  transactionSaveInDB = async (data: any) => {
    getwayService.transactionDataSaveInDB(data, async function (result: any) {
      // data = {
      //   invoiceTitle: "INVOICE",
      //   customerId: customerID,
      //   transactionId:
      //     result &&
      //     result.insetTransatction &&
      //     result.insetTransatction?.insertId,
      //   activityId: 0,
      //   itemId: itemsId,
      // };
      // const res = await commmonfunctions.SendEmailsAfterPayment(data);
      // setShowSuccess(true);
      // AddLogs(
      //   userUniqueId,
      //   `Invoice purchase transaction id - #${data?.transactionId}`
      // );
      // setTimeout(callBack_func, 5000);
      // function callBack_func() {
      //   setShowSuccess(false);
      //   document.location.href = `${process.env.NEXT_PUBLIC_AMEX_INVOICE_REDIRECT_URL}`;
      // }
    });
  };
}
export default new CommonFunctions();
