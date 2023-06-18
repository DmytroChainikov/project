import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, IconButton } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { NumericFormat } from 'react-number-format';
import { IconPlus } from '@tabler/icons';
import CloseIcon from '@mui/icons-material/Close';
import currencies from '../modalAddMoney/moneyType';
import { editMoneyType } from 'services/money';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useState } from 'react';
import { useEffect } from 'react';

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

export default function ModalEditMoney({ modalOpen, onClose, value, isUpdate, setUpdate }) {
    const scriptedRef = useScriptRef();
    const [currency, setCurrency] = useState('');

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
                        name: value.type_name,
                        quantity: value.type_quantity,
                        currency: value.type_currency
                    }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                                values.currency = currency;
                                await editMoneyType(value.id, {
                                    type_name: values.name === '' ? value.type_name : values.name,
                                    type_currency: values.currency,
                                    type_quantity: values.quantity
                                });
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
                        <form noValidate style={{ width: '100%' }} onSubmit={handleSubmit}>
                            <Box display={'flex'} justifyContent="space-between" sx={{ width: '100%' }}>
                                <Typography id="modal-modal-title" variant="h2">
                                    Edit Money
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        onClose(false);
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <TextField
                                defaultValue={value.type_name}
                                type="text"
                                name="name"
                                onChange={handleChange}
                                id="standard-multiline-static"
                                sx={{ width: '100%' }}
                                label="Name"
                                multiline
                                rows={1}
                                variant="standard"
                            />
                            <TextField
                                type="text"
                                label="Quantity"
                                defaultValue={value.type_quantity}
                                onChange={handleChange}
                                name="quantity"
                                id="formatted-numberformat-input"
                                InputProps={{
                                    inputComponent: NumericFormatCustom
                                }}
                                variant="standard"
                                sx={{ width: '100%' }}
                            />
                            <Autocomplete
                                disablePortal
                                onChange={(res) => {
                                    if (res.target.textContent === '') {
                                        setCurrency('');
                                    } else {
                                        setCurrency(res.target.textContent);
                                    }
                                }}
                                name="currency"
                                defaultValue={value.type_currency}
                                id="combo-box-demo"
                                options={currencies.map((item) => `${item.code}`)}
                                sx={{ width: '100%', paddingBottom: '45px' }}
                                renderInput={(params) => (
                                    <TextField type="text" name="currency" {...params} variant="standard" label="Currency" />
                                )}
                            />
                            <Button disabled={isSubmitting} type="submit" color="warning" variant="contained" sx={{ width: '100%' }}>
                                Edit
                            </Button>
                        </form>
                    )}
                </Formik>
            </Grid>
        </Modal>
    );
}
