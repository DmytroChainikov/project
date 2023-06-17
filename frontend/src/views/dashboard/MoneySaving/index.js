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
import ModalAddMoneySaving from './modalAddMoneySaving';
import ModalEditMoneySaving from './modalEditMoneySaving';
import { deleteSaving, getSaving } from 'services/saving';

const MoneySaving = () => {
    const [saving, setSaving] = useState([
        {
            id: 0,
            saving_persentage: 0,
            saving_period_end: '2023-05-14',
            user_id: 0,
            saving_quantity: 0,
            saving_name: 'string',
            saving_period_start: '2023-05-14',
            saving_description: 'string'
        }
    ]);
    const [openModelForAdd, setOpenModelForAdd] = useState(false);
    const [openModelForEdit, setOpenModelForEdit] = useState(false);
    const [velueEdit, setValueEdit] = useState({
        saving_name: '',
        saving_quantity: 0,
        saving_persentage: 0,
        saving_currency: '',
        saving_description: '',
        saving_period_start: '',
        saving_period_end: ''
    });
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setSaving(await getSaving());
        };
        fetchData();
    }, [update]);

    return (
        <Grid container sx={{ p: 2, pb: 0, color: '#fff', gap: 1 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h2">Money Saving</Typography>
                <Button onClick={() => setOpenModelForAdd(true)} startIcon={<IconPlus />} variant="contained" color="primary">
                    Add saving
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="caption table">
                        <caption>All your money saving is placed here</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">quantity</TableCell>
                                <TableCell align="right">currency</TableCell>
                                <TableCell align="right">persentage</TableCell>
                                <TableCell align="right">period_start</TableCell>
                                <TableCell align="right">period_end</TableCell>
                                <TableCell align="right">description</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {saving ? (
                                saving.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.saving_name}
                                        </TableCell>
                                        <TableCell align="right">{row.saving_quantity}</TableCell>
                                        <TableCell align="right">{row.saving_currency}</TableCell>
                                        <TableCell align="right">{row.saving_persentage}</TableCell>
                                        <TableCell align="right">{row.saving_period_start}</TableCell>
                                        <TableCell align="right">{row.saving_period_end}</TableCell>
                                        <TableCell align="right">{row.saving_description}</TableCell>
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
                                                    await deleteSaving(data.id);
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
            <ModalEditMoneySaving
                modalOpen={openModelForEdit}
                onClose={setOpenModelForEdit}
                value={velueEdit}
                setUpdate={setUpdate}
                isUpdate={update}
            />
            <ModalAddMoneySaving modalOpen={openModelForAdd} onClose={setOpenModelForAdd} setUpdate={setUpdate} isUpdate={update} />
        </Grid>
    );
};

export default MoneySaving;
