import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import CustomAppBar from './../../components/CustomAppBar/CustomAppBar';
import CustomDrawer from './../../components/CustomDrawer/CustomDrawer';
import SaleDataTable from './../../components/SaleDataTable/SaleDataTable';
import SaleChart from './../../components/SaleChart/SaleChart';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const salesData = [
        { month: 'January', sales: 500 },
        { month: 'September', sales: 510 },
        { month: 'February', sales: 400 },
        { month: 'June', sales: 450 },
        { month: 'March', sales: 480 },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <CustomAppBar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
            <CustomDrawer drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} mobileOpen = {mobileOpen} window = {window}  />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }} >
                <Toolbar />
                <SaleDataTable salesData={salesData} />
                <Divider />
                <SaleChart salesData={salesData} />
            </Box>
        </Box>
    );
}

ResponsiveDrawer.propTypes = {
    window: PropTypes.func,
};

export default ResponsiveDrawer;
