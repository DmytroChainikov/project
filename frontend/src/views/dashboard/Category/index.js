import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Button, Grid, IconButton } from '@mui/material';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons';
import { useEffect, useState } from 'react';
import ModalAddMoneyCategory from './modalAddMoneyCategory';
import ModalEditMoneyCategory from './modalEditMoneyCategory';
import { deleteCategory, getCategory } from 'services/category';
import ModalAddCost from './modalAddCost';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MyTableBody from './table-row';

const Category = () => {
    const [category, setCategory] = useState([
        {
            id: 1,
            category_description: 'string',
            user_id: 1,
            category_name: 'string'
        }
    ]);
    const [openModelForAdd, setOpenModelForAdd] = useState(false);
    const [openModelForEdit, setOpenModelForEdit] = useState(false);
    const [openModelForCost, setOpenModelForCost] = useState(false);
    const [categoryId, setCategoryId] = useState(0);
    const [velueEdit, setValueEdit] = useState({
        type_name: '',
        type_description: '',
        type_quantity: 0
    });
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setCategory(await getCategory());
        };
        fetchData();
    }, [update]);
    return (
        <Grid container sx={{ p: 2, pb: 0, color: '#fff', gap: 1 }}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h2">Category</Typography>
                <Button onClick={() => setOpenModelForAdd(true)} startIcon={<IconPlus />} variant="contained" color="primary">
                    Add category
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="caption table">
                        <caption>All your category is placed here</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">description</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {category ? (
                                category.map((row) => <MyTableBody row={row} key={row.id} setUpdate={setUpdate} isUpdate={update} />)
                            ) : (
                                <TableRow>
                                    <TableCell>Not Data</TableCell>
                                    <TableCell>♫</TableCell>
                                    <TableCell>☼</TableCell>
                                    <TableCell>☺</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <ModalAddMoneyCategory
                            modalOpen={openModelForAdd}
                            onClose={setOpenModelForAdd}
                            setUpdate={setUpdate}
                            isUpdate={update}
                        />
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

export default Category;
