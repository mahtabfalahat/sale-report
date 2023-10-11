import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { utils as XLSXUtils, writeFile } from "xlsx";
import { saveAs } from "file-saver";
import * as docx from "docx";
import domtoimage from "dom-to-image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import { Grid } from "@mui/material";
import CustomAppBar from "./../../components/CustomAppBar/CustomAppBar";
import CustomDrawer from "./../../components/CustomDrawer/CustomDrawer";
import SaleDataTable from "./../../components/SaleDataTable/SaleDataTable";
import SaleChart from "./../../components/SaleChart/SaleChart";
const { Document, Table, TableCell, TableRow, Packer, Paragraph, Media } = docx;

const drawerWidth = 240;
function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const chartRef = useRef(null);
  const salesData = [
    { month: "January", sales: 500 },
    { month: "September", sales: 510 },
    { month: "February", sales: 400 },
    { month: "June", sales: 450 },
    { month: "March", sales: 480 },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const downloadPDFHandle = () => {
    const unit = "pt";
    const size = "A4";
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const title = "Table sale report";
    const headers = [["Month", "Sales"]];
    const data = salesData.map((data) => [data.month, data.sales]);
    let content = {
      startY: 50,
      head: headers,
      body: data,
    };
    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    const chartBarContainer = document.getElementById("chart-bar-box");
    if (!chartBarContainer) {
      console.error("Chart not found!");
      return;
    }
    domtoimage
      .toPng(chartBarContainer)
      .then((dataUrl) => {
        doc.addImage(dataUrl, "PNG", 200, 200, 200, 200);
        doc.save("SaleReport.pdf");
      })
      .catch((error) => {
        console.error("Error exporting data to PDF:", error);
      });
  };

  const downloadExcelHandle = () => {
    if (!salesData || salesData.length === 0) {
      console.error("Sales data is empty");
      return;
    }
    const worksheet = XLSXUtils.json_to_sheet(salesData);
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, "Sales Data");
    writeFile(workbook, "SaleReport.xlsx");
  };

  const downloadWordHandle = async () => {
    const tableNode = document.getElementById("chart-bar-box");
    if (!tableNode) {
      console.error("Table not found.");
      return;
    }

    domtoimage
      .toPng(tableNode)
      .then((dataUrl) => {
        const base64Image = dataUrl.split(",")[1];
        const blob = base64ToBlob(base64Image, "image/png");
        const image = new docx.ImageRun(blob);
        const imageParagraph = new docx.Paragraph({ children: [image] });
        const imageSection = new docx.Section({ children: [imageParagraph] });
        doc.addSection(imageSection);
      })
      .catch((error) => {
        console.error("Error changing table to image:", error);
      });
    const tableRows = salesData.map((data) => {
      return new TableRow({
        children: [new TableCell({ children: [new Paragraph(data.month)] }), new TableCell({ children: [new Paragraph(data.sales.toString())] })],
      });
    });
    console.log(tableRows);
    const table = new Table({
      rows: [
        new TableRow({
          children: [new TableCell({ children: [new Paragraph("Month")] }), new TableCell({ children: [new Paragraph("Sales")] })],
        }),
        ...tableRows,
      ],
    });

    const doc = new Document();
    doc.addSection({ children: [table] });
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "SaleReport.docx");
    });
  };

  const base64ToBlob = (base64Data, contentType) => {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <CustomAppBar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <CustomDrawer drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} window={window} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <SaleDataTable salesData={salesData} />
        <Divider />
        <SaleChart salesData={salesData} chartRef={chartRef} />
        <p className="download-files-text-style">Download Data files</p>
        <Grid display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
          <Button variant="outlined" onClick={downloadPDFHandle}>
            Download PDF
          </Button>
          <Button variant="outlined" onClick={downloadWordHandle} className="btn-box">
            Download Word
          </Button>
          <Button variant="outlined" onClick={downloadExcelHandle} className="btn-box">
            Download Excel
          </Button>
        </Grid>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
