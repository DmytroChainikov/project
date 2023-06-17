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
import { deleteBalance, getBalance } from 'services/money';
import ModalAddMoney from './modalAddMoney';
import ModalEditMoney from './modalEditMoney';

const MyTable = () => {
    const [money, setMoney] = useState([
        {
            type_name: '',
            type_quantity: 0,
            user_id: 0,
            id: 0,
            type_currency: ''
        }
    ]);
    const [openModelForAdd, setOpenModelForAdd] = useState(false);
    const [openModelForEdit, setOpenModelForEdit] = useState(false);
    const [velueEdit, setValueEdit] = useState({
        type_name: '',
        type_currency: '',
        type_quantity: 0
    });
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setMoney(await getBalance());
        };
        fetchData();
    }, [update]);

    return (
        <Grid container sx={{ p: 2, pb: 0, color: '#fff', gap: 1 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h2">Money</Typography>
                <Button onClick={() => setOpenModelForAdd(true)} startIcon={<IconPlus />} variant="contained" color="primary">
                    Add money
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="caption table">
                        <caption>All your money is placed here</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Currency</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {money ? (
                                money.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.type_name}
                                        </TableCell>
                                        <TableCell align="right">{row.type_quantity}</TableCell>
                                        <TableCell align="right">{row.type_currency}</TableCell>
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
                                                    await deleteBalance(data.id);
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
            <ModalEditMoney
                modalOpen={openModelForEdit}
                onClose={setOpenModelForEdit}
                value={velueEdit}
                setUpdate={setUpdate}
                isUpdate={update}
            />
            <ModalAddMoney modalOpen={openModelForAdd} onClose={setOpenModelForAdd} setUpdate={setUpdate} isUpdate={update} />
        </Grid>
    );
};

export default MyTable;
