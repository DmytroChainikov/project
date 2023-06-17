import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Box, Button, Grid, IconButton } from '@mui/material';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { getBalance } from 'services/money';
import ModalAddMoneyIncome from './modalAddMoneyIncome';
import ModalEditMoneyIncome from './modalEditMoneyIncome';
import { deleteIncome, getIncome } from 'services/income';

const MoneyIncome = () => {
    const [income, setIncome] = useState([
        {
            id: 1,
            income_quantity: 0,
            income_currency: 'string',
            user_id: 1,
            income_type: 'string',
            income_description: 'string',
            income_period: 0
        }
    ]);
    const [openModelForAdd, setOpenModelForAdd] = useState(false);
    const [openModelForEdit, setOpenModelForEdit] = useState(false);
    const [velueEdit, setValueEdit] = useState({
        type_name: '',
        type_description: '',
        type_currency: '',
        type_quantity: 0
    });
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIncome(await getIncome());
        };
        fetchData();
    }, [update]);

    return (
        <Grid container sx={{ p: 2, pb: 0, color: '#fff', gap: 1 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h2">Money Income</Typography>
                <Button onClick={() => setOpenModelForAdd(true)} startIcon={<IconPlus />} variant="contained" color="primary">
                    Add income
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="caption table">
                        <caption>All your money income is placed here</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">quantity</TableCell>
                                <TableCell align="right">currency</TableCell>
                                <TableCell align="right">period</TableCell>
                                <TableCell align="right">description</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {income ? (
                                income.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.income_type}</TableCell>
                                        <TableCell align="right">{row.income_quantity}</TableCell>
                                        <TableCell align="right">{row.income_currency}</TableCell>
                                        <TableCell align="right">{row.income_period}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.income_description}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => {
                                                    const data = row;
                                                    setValueEdit(data);
                                                    setOpenModelForEdit(true);
                                                }}
                                                align="right"
                                            >
                                                <IconEdit />
                                            </IconButton>
                                            <IconButton
                                                onClick={async () => {
                                                    const data = row;
                                                    await deleteIncome(data.id);
                                                    setUpdate(!update);
                                                }}
                                                align="right"
                                            >
                                                <IconTrash />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell>Not Data</TableCell>
                                    <TableCell>♫</TableCell>
                                    <TableCell>☼</TableCell>
                                    <TableCell>☺</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <ModalEditMoneyIncome
                modalOpen={openModelForEdit}
                onClose={setOpenModelForEdit}
                value={velueEdit}
                setUpdate={setUpdate}
                isUpdate={update}
            />
            <ModalAddMoneyIncome modalOpen={openModelForAdd} onClose={setOpenModelForAdd} setUpdate={setUpdate} isUpdate={update} />
        </Grid>
    );
};

export default MoneyIncome;
