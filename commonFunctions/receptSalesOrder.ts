import axios from "axios";
import { api_url, auth_token } from "../helper/config";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

class ReceiptSalesPDFService {
  // generate pdf
  ReceiptPDF = async (item: any, receipt_title: string) => {
    await axios({
      method: "get",
      url: `${api_url}/getActivityDetails/${item.itemId}`,
      headers: {
        Authorization: auth_token,
      },
    })
      .then((res) => {
        let items = res?.data.data[0];
        if (res) {
          const doc = new jsPDF("l", "mm", "a4");
          doc.setFontSize(20);
          doc.text("Qatar International School", 30, 21);
          doc.setFontSize(12);
          doc.text("United Nations St, West Bay, P.O. Box: 5697", 31, 28);
          doc.text("Doha, Qatar", 31, 34.5);
          doc.setFontSize(12);
          doc.text("Telephone: 44833456", 230, 20);
          doc.text("Website: www.qis.org", 230, 26);
          doc.text("Email:  qisfinance@qis.org", 230, 32);
          doc.setFont("courier");
          doc.setFontSize(25);
          doc.text(`${receipt_title} RECEIPT`, 110, 60);

          doc.setFontSize(13);
          doc.text("Receipt Number   : ", 40, 90);
          doc.text(
            `${
              item.refrenceId === undefined ? item?.receiptNo : item.refrenceId
            }`,
            95,
            90
          );
          doc.text("Transaction Type : ", 40, 100);
          doc.text(
            `${
              item.paymentMethod === undefined
                ? item?.transaction_paymentMethod
                : item.paymentMethod
            }`,
            95,
            100
          );
          doc.text("Sales Order Id : ", 40, 110);
          doc.text(
            `${
              item.sales_order_id ? item?.sales_order_id : item?.sales_order_id
            }`,
            95,
            110
          );
          doc.text("Invoice Number  : ", 170, 90);
          doc.text(
            `${item.invoiceId ? item?.invoiceId : item.invoiceId}`,
            230,
            90
          );
          doc.text("Transaction Date : ", 170, 100);
          doc.text(
            `${moment(
              item.transactionDate
                ? item.transactionDate
                : item.transactionDate,
              "YYYY MM DD"
            ).format("MMM DD, YYYY")}`,
            230,
            100
          );
          doc.text("Transaction Amount : ", 170, 110);
          doc.text(
            `${
              item.transactionAmount
                ? item.transactionAmount
                : item.transactionAmount
            }(QAR)`,
            230,
            110
          );

          doc.text("Credit Note : ", 170, 120);
          doc.text(
            `${
              item?.transaction_amount > 0
                ? item.amount - item.transaction_amount
                : item?.transaction_amount === 0
                ? item.amount
                : "0"
            }(QAR)`,
            230,
            120
          );

          const head = [["SL.No", "ACTIVITY NAME", "AMOUNT(QAR)"]];

          doc.setFontSize(20);
          autoTable(doc, {
            theme: "plain",
            margin: { top: 140, left: 45 },
            tableWidth: 230,
            styles: { fontSize: 13 },
            columnStyles: { 0: { halign: "left" } },
            head: head,
            body: [["1", `${items.name}`, `${items.price}`]],
            didDrawCell: (data: any) => {},
          });
          if (items.length > 2) {
            doc.setFontSize(13);
            doc.text("Grand Total : ", 165, 170);
            doc.setFontSize(13);
            doc.text(`${items.price}(QAR)`, 201, 170);
          } else {
            doc.setFontSize(13);
            doc.text("Grand Total : ", 165, 170);
            doc.setFontSize(13);
            doc.text(`${items.price}(QAR)`, 201, 170);
          }
          doc.save("Document.pdf");
        }
      })
      .catch((err) => {});
  };
}
export default new ReceiptSalesPDFService();
