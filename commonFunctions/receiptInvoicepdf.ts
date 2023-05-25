import axios from "axios";
import { api_url, qatar_currency } from "../helper/config";
import { jsPDF } from "jspdf";
import moment from "moment";
import commmonfunctions from "../commonFunctions/commmonfunctions";

class ReceiptPDFService {
  // generate pdf
  ReceiptPDF = async (item: any, receipt_title: String, isSide: String) => {
    //calculate wallet ballemce
    console.log(item);
    let walletBall = 0;
    if (item.transactionAmount < item.amount) {
      walletBall = item.amount - item.transactionAmount;
    }

    //get customer parent details
    let parent_det: {
      parent_name: any;
      parent_id: any;
    } | null = null;
    if (item.user_id && item.cusromerparentid > 0) {
      const response = await fetch(
        `${api_url}/getParentsDetByCustomerId/${item.cusromerparentid}`,
        {
          method: "get",
        }
      );
      const data = await response.json();
      parent_det = data.data[0];
    }

    await axios({
      method: "POST",
      url: `${api_url}/getItembyid/${item?.id || item?.invid}`,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        let items = res?.data.data;
        if (res) {
          setTimeout(() => {
            var price = 0;
            for (let d of items) {
              price = price + d.item_total_price;
            }
            const doc = new jsPDF("p", "mm", "a4");
            var image = new Image();
            image.src = "/Qatar_International_School_logo.jpg";
            doc.addImage(image, "jpg", 20, 15, 32, 32);
            doc.setFontSize(20);
            doc.text("Qatar International School", 55, 25);
            doc.setFontSize(11);
            doc.text("Qatar International School W.L.L", 56, 31);
            doc.text("United Nations st, West Bay, P.O. Box: 5697", 56, 37);
            doc.text("Doha, Qatar", 56, 43);
            // doc.text("Telephone: 44833456", 230, 20);
            // doc.text("Website: www.qis.org", 230, 26);
            // doc.text("Email:  qisfinance@qis.org", 230, 32);
            doc.setFontSize(12);
            doc.text("Telephone: 44833456", 25, 55);
            doc.text("Website: www.qis.org", 75, 55);
            doc.text("Email: qisfinance@qis.org", 125, 55);
            doc.setFont("courier");
            doc.setFontSize(25);
            doc.text(`RECEIPT CONFIRMATION`, 55, 80);
            doc.setFontSize(12);
            doc.text("Amount Received", 26, 100);
            doc.text(
              `${commmonfunctions.formatePrice(item?.transactionAmount)} ${
                "(" + qatar_currency + ")"
              }`,
              160,
              100
            );
            doc.setFontSize(10);
            doc.text(`Paid by: ${item?.paymentMethod}`, 26, 113);
            doc.text(`CHECK/RECEIPT NO.: ${item?.refrenceId}`, 62, 113);
            doc.text(
              `Date Received : ${moment(
                item?.transactionDate,
                "YYYY-MM-DD"
              ).format("MMM DD, YYYY")}`,
              135,
              113
            );
            image.src = "/qispaid.png";
            doc.addImage(image, "png", 117, 95, 40, 15);

            doc.rect(26, 125, 84, 35);
            doc.setFontSize(11);
            doc.text(
              `Family ID : ${
                item?.sageParentId ? item?.sageParentId : parent_det?.parent_id
              }`,
              28,
              132
            );

            doc.text(
              `Name : ${
                parent_det == null
                  ? item?.name.toUpperCase()
                  : parent_det.parent_name.toUpperCase()
              }`,
              28,
              139
            );

            doc.rect(110, 125, 85, 18);
            doc.setFontSize(11);
            doc.text(
              `DOCUMENT NO. : ${item?.tuition_invoice_id || item?.invoiceId}`,
              112,
              132
            );
            doc.text(
              `Date : ${moment(item?.invoiceDate, "YYYY-MM-DD").format(
                "MMM DD, YYYY"
              )}`,
              112,
              139
            );

            doc.rect(110, 143, 85, 17); //blanck box

            doc.rect(26, 170, 120, 9);
            doc.text("DOCUMENTS PAID", 70, 176);
            doc.rect(146, 170, 49, 9);
            doc.text("Amount (QAR)", 160, 176);

            let productNo = 1;
            items.forEach((element: any) => {
              let y = 159 + productNo * 20;
              let ydown = 165 + productNo * 20;
              doc.rect(26, y, 120, 9);
              doc.text(`${element?.item_name}`, 28, ydown);
              doc.rect(146, y, 49, 9);
              doc.text(
                `${commmonfunctions.formatePrice(element?.item_total_price)}`,
                187,
                ydown,
                {
                  align: "right",
                }
              );
              productNo++;
            });

            doc.rect(26, 188, 120, 11);
            doc.text(
              `${item?.name.toUpperCase() + " - "}${
                item?.sageCustomerId == null
                  ? item?.sageParentId
                  : item?.sageCustomerId
              }`,
              28,
              195
            );
            doc.rect(146, 188, 49, 11);
            doc.text(
              `${commmonfunctions.formatePrice(item?.transactionAmount)}`,
              187,
              195,
              {
                align: "right",
              }
            );

            doc.rect(26, 199, 120, 7);
            doc.text("Deduct From Wallet:", 100, 204);
            doc.rect(146, 199, 49, 7);
            doc.text(`${commmonfunctions.formatePrice(walletBall)}`, 187, 204, {
              align: "right",
            });

            doc.rect(26, 206, 120, 7);
            doc.text("UNAPPLIED AMOUNT:", 105, 211);
            doc.rect(146, 206, 49, 7);
            doc.text(`${commmonfunctions.formatePrice(0)}`, 187, 211, {
              align: "right",
            });

            doc.rect(26, 206, 120, 63);
            doc.text("TOTAL AMOUNT RECEIVED:", 93.5, 218);
            image.src = "/qisstamp.png";
            {
              isSide !== "admin_side"
                ? doc.addImage(image, "png", 45, 220, 80, 30)
                : "";
            }
            doc
              .setFontSize(10)
              .text(
                "Note: These fees are for tuition only and do not ",
                27,
                262
              )
              .text("include transport, meals, books,or uniform.", 27, 267);

            doc.rect(146, 199, 49, 70);
            doc.text(
              `${commmonfunctions.formatePrice(item?.transactionAmount)}`,
              187,
              218,
              {
                align: "right",
              }
            );
            doc.save("Document.pdf");
          }, 1500);
        }
      })
      .catch((err) => {});
  };
}
export default new ReceiptPDFService();
