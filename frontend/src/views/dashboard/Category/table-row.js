import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { deleteCategory, getCategory } from 'services/category';
import ModalAddMoneyCategory from './modalAddMoneyCategory';
import ModalEditMoneyCategory from './modalEditMoneyCategory';
import { IconButton } from '@mui/material';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons';
import { useEffect, useState } from 'react';

import ModalAddCost from './modalAddCost';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getCosts, deleteCosts } from 'services/category';

const MyTableBody = ({ setUpdate, isUpdate, row, ...rest }) => {
    const [openModelForAdd, setOpenModelForAdd] = useState(false);
    const [openModelForEdit, setOpenModelForEdit] = useState(false);
    const [openModelForCost, setOpenModelForCost] = useState(false);

    const [categoryId, setCategoryId] = useState(0);
    const [velueEdit, setValueEdit] = useState({
        type_name: '',
        type_description: '',
        type_quantity: 0
    });
    const [open, setOpen] = useState(false);
    const [categoryCosts, setCategoryCosts] = useState([
        {
            id: 1,
            user_id: 1,
            category_quantity: 0,
            quantity_description: 'string',
            payment_id: 1,
            payment_currency: 'string',
            category_name: 'string'
        }
    ]);

    const handelCollapse = () => {
        const fetchData = async () => {
            setCategoryCosts(await getCosts(row.id));
        };
        fetchData();
        setOpen(!open);
    };

    console.log(categoryCosts.length);

    return (
        <>
            <TableRow {...rest}>
                <TableCell component="th" scope="row">
                    <IconButton aria-label="expand row" size="small" onClick={handelCollapse}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.category_name}
                </TableCell>
                <TableCell align="right">{row.category_description}</TableCell>
                <TableCell align="right">
                    <IconButton
                        onClick={() => {
                            const id = row.id;
                            setCategoryId(id);
                            setOpenModelForCost(true);
                        }}
                        align="right"
                    >
                        <IconPlus />
                    </IconButton>
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
                            await deleteCategory(data.id);
                            setUpdate(!isUpdate);
                        }}
                        align="right"
                    >
                        <IconTrash />
                    </IconButton>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Costs
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Currency</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categoryCosts.length !== 0 ? (
                                        categoryCosts.map((cost) => (
                                            <TableRow key={cost.id}>
                                                <TableCell component="th" scope="row">
                                                    {cost.category_quantity}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {cost.payment_currency}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {cost.quantity_description}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        onClick={async () => {
                                                            await deleteCosts(cost.id);
                                                            setUpdate(!isUpdate);
                                                            setCategoryCosts(await getCosts(row.id));
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
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <ModalEditMoneyCategory
                modalOpen={openModelForEdit}
                onClose={setOpenModelForEdit}
                value={velueEdit}
                setUpdate={setUpdate}
                isUpdate={isUpdate}
            />
            <ModalAddCost
                modalOpen={openModelForCost}
                onClose={setOpenModelForCost}
                categoryId={categoryId}
                setUpdate={setUpdate}
                isUpdate={isUpdate}
            />
        </>
    );
};

export default MyTableBody;
