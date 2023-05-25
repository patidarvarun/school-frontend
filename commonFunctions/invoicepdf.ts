import axios from "axios";
import { api_url, qatar_currency } from "../helper/config";
import { jsPDF } from "jspdf";
import moment from "moment";
import commmonfunctions from "../commonFunctions/commmonfunctions";
class PDFService {
  // generate pdf
  generateSimplePDF = async (item: any, title: string, isSide: string) => {
    console.log(item);

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
        // setItem(res?.data.data);
        let items = res?.data.data;
        if (res) {
          setTimeout(() => {
            var price = 0;
            for (let d of items) {
              price = price + d.price;
            }
            const doc = new jsPDF("p", "mm", "a4");

            var image = new Image();
            image.src = "/Qatar_International_School_logo.jpg";
            doc.addImage(image, "jpg", 20, 15, 32, 32);

            doc.setFontSize(18);
            doc.text("Qatar International School", 55, 25);
            doc.setFontSize(11);
            doc.text("Qatar International School W.L.L", 56, 31);
            doc.text("United Nations st, West Bay, P.O. Box: 5697", 56, 37);
            doc.text("Doha, Qatar", 56, 43);

            doc.setFontSize(10);
            doc.text("Tel: 44833456", 25, 56);
            doc.text("www.qis.org", 70, 55.5);
            doc.text("billing@qis.org", 120, 55);

            doc.setFont("courier");
            doc.setFontSize(25);
            doc.text(`INVOICE`, 85, 80);

            doc.setFontSize(11);
            doc.text(
              `Created Date : ${moment(item?.createdDate, "DD/MM/YYYY").format(
                "MMM DD, YYYY"
              )}`,
              25,
              96
            );
            doc.text(
              `Due Date : ${moment(item?.invoiceDate, "DD/MM/YYYY").format(
                "MMM DD, YYYY"
              )}`,
              100,
              95.2
            );
            doc.text(
              `Invoice Id : ${item?.tuition_invoice_id || item?.invoiceId}`,
              25,
              102
            );

            doc.text(`Bill to : ${item?.name.toUpperCase()}`, 25.5, 115);
            doc.text(
              `Id : ${item?.sageCustomerId || item?.sageParentId}`,
              25.5,
              120
            );

            if (parent_det !== null) {
              doc.text(
                `Family ID : ${
                  item?.sageParentId
                    ? item?.sageParentId
                    : parent_det?.parent_id
                }`,
                25.5,
                130
              );
              doc.text(
                `Name : ${
                  parent_det == null
                    ? item?.name.toUpperCase()
                    : parent_det.parent_name.toUpperCase()
                }`,
                25.5,
                135
              );
            }

            doc.rect(25, 150, 60, 7);
            doc.setFontSize(10).text(`DESCRIPTION`, 26, 155, {
              align: "left",
            });
            doc.rect(85, 150, 30, 7);
            doc.setFontSize(10).text(`QTY`, 100, 155, {
              align: "center",
            });
            doc.rect(115, 150, 35, 7);
            doc.setFontSize(10).text(`UNIT PRICE(QAR)`, 133, 155, {
              align: "center",
            });
            doc.rect(150, 150, 40, 7);
            doc.setFontSize(10).text(`LINE TOTAL(QAR)`, 170, 155, {
              align: "center",
            });

            let productNo = 1;
            items.forEach((element: any) => {
              let y = 150 + productNo * 7;
              let ydown = 150 + productNo * 12;
              doc.rect(25, y, 60, 7).stroke();
              doc.text(`${element?.item_description}`, 26, ydown, {
                align: "left",
              });
              doc.rect(85, y, 30, 7).stroke();
              doc.text(`${element?.quantity}`, 100, ydown, {
                align: "center",
              });
              doc.rect(115, y, 35, 7).stroke();
              doc.text(
                `${commmonfunctions.formatePrice(element?.item_price)}`,
                133,
                ydown,
                {
                  align: "center",
                }
              );
              doc.rect(150, y, 40, 7).stroke();
              doc.text(
                `${commmonfunctions.formatePrice(element.item_total_price)}`,
                170,
                ydown,
                {
                  align: "center",
                }
              );
              productNo++;
            });

            doc.rect(25, 150 + productNo * 7, 90, 50).stroke();
            image.src = "/qisstamp.png";
            {
              isSide !== "admin_side"
                ? doc.addImage(image, "png", 30, 190, 70, 30)
                : "";
            }

            doc.rect(115, 150 + productNo * 7, 35, 50).stroke();
            doc.rect(150, 150 + productNo * 7, 40, 50).stroke();
            doc.text(`Total Amt.`, 133, 175 + productNo * 7, {
              align: "center",
            });
            doc.text(
              `${commmonfunctions.formatePrice(item?.amount)}`,
              170,
              175 + productNo * 7,
              {
                align: "center",
              }
            );

            doc.save("Document.pdf");
          }, 1500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
export default new PDFService();
