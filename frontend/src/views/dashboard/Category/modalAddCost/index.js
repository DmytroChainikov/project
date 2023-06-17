import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { NumericFormat } from 'react-number-format';
import { IconPlus } from '@tabler/icons';
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useEffect } from 'react';
import { useState } from 'react';
import { getBalance } from 'services/money';
import { addCategoryMoney } from 'services/category';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    border: 0,
    gap: 1
};

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            thousandSeparator
            valueIsNumericString
            prefix=""
        />
    );
});

export default function ModalAddCost({ modalOpen, onClose, categoryId, isUpdate, setUpdate }) {
    const scriptedRef = useScriptRef();
    const [typeName, setTypeName] = useState('');
    const [money, setMoney] = useState([
        {
            type_name: '',
            type_quantity: 0,
            user_id: 0,
            id: 0,
            type_currency: ''
        }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            setMoney(await getBalance());
        };
        fetchData();
    }, [isUpdate]);

    return (
        <Modal
            open={modalOpen}
            onClose={() => {
                onClose(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Grid container sx={style}>
                <Formik
                    initialValues={{
                        money: '',
                        description: '',
                        quantity: 0
                    }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);

                                console.log(values);

                                await addCategoryMoney(
                                    { category_type_id: categoryId, payment_id: typeName },
                                    { category_quantity: values.quantity, quantity_description: values.description }
                                );

                                setUpdate(!isUpdate);
                                onClose(false);
                            }
                        } catch (err) {
                            console.error(err);
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }
                    }}
                >
                    {({ handleSubmit, isSubmitting, handleChange }) => (
                        <form
                            noValidate
                            style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
                            onSubmit={handleSubmit}
                        >
                            <Box display={'flex'} justifyContent="space-between" sx={{ width: '100%' }}>
                                <Typography id="modal-modal-title" variant="h2">
                                    Add Cost
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        onClose(false);
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Autocomplete
                                disablePortal
                                onChange={(res) => {
                                    if (res.target.textContent === '') {
                                        setTypeName('');
                                    } else {
                                        setTypeName(res.target.textContent.split(' ')[0]);
                                    }
                                }}
                                name="money"
                                id="combo-box-demo"
                                options={money.map((item) => `${item.id} ${item.type_name} - ${item.type_quantity} ${item.type_currency}`)}
                                sx={{ width: '100%' }}
                                renderInput={(params) => (
                                    <TextField type="text" name="money" {...params} variant="standard" label="Money" />
                                )}
                            />
                            <TextField
                                type="text"
                                label="Quantity"
                                onChange={handleChange}
                                name="quantity"
                                id="formatted-numberformat-input"
                                InputProps={{
                                    inputComponent: NumericFormatCustom
                                }}
                                variant="standard"
                                sx={{ width: '100%' }}
                            />
                            <TextField
                                type="text"
                                name="description"
                                onChange={handleChange}
                                id="standard-multiline-static"
                                sx={{ width: '100%' }}
                                label="Description"
                                multiline
                                rows={3}
                                variant="standard"
                            />

                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                startIcon={<IconPlus />}
                                color="primary"
                                variant="contained"
                                sx={{ width: '100%' }}
                            />
                        </form>
                    )}
                </Formik>
            </Grid>
        </Modal>
    );
}
