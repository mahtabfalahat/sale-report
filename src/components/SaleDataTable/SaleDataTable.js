import { useCallback, useEffect, useState, memo } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const SaleDataTable = ({ salesData }) => {
    const [sales, setSales] = useState([]);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#ccc",
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
            with: "50%",
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const sortData = useCallback(
        (data) => {
            let res = data.sort(function (a, b) {
                return a.sales - b.sales;
            });
            return res;
        }, []);

    useEffect(() => {
       

        let newArr = [];
        for (let key in salesData) {
            newArr.push({
                ...salesData[key],
                id: key
            });
        }
        setSales(sortData(newArr));
    }, []);


    return (
        <TableContainer component={Paper}>
            {(sales.length > 0 && typeof sales !== "undefined") ? <Table sx={{ minWidth: 500 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">Sale</StyledTableCell>
                        <StyledTableCell align="center">Month</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sales.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell align="center">{row.month}</StyledTableCell>
                            <StyledTableCell align="center">{row.sales}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table> : <p> nothing to show</p>}


        </TableContainer>
    )
}

export default memo(SaleDataTable); 