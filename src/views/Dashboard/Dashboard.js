import * as React from "react";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
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

const drawerWidth = 240;
function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
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

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <CustomAppBar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <CustomDrawer drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} window={window} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <SaleDataTable salesData={salesData} />
        <Divider />
        <SaleChart salesData={salesData} />
        <p className="download-files-text-style">Download Data files</p>
        <Grid display="flex" justifyContent="space-around" alignContent="center" alignItems="center">
          <Button variant="outlined" onClick={downloadPDFHandle}>
            Download PDF
          </Button>
          <Button variant="outlined" onClick={downloadPDFHandle} className="btn-box">
            Download Word
          </Button>
          <Button variant="outlined" onClick={downloadPDFHandle} className="btn-box">
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
