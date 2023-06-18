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
import { editMoneyType } from 'services/money';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useState } from 'react';
import { useEffect } from 'react';
import { editMoneyIncome } from 'services/income';
import currencies from 'views/dashboard/Money/modalAddMoney/moneyType';

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

export default function ModalEditMoneyIncome({ modalOpen, onClose, value, isUpdate, setUpdate }) {
    const scriptedRef = useScriptRef();
    const [currency, setСurrency] = useState('');

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
                        quantity: value.income_quantity,
                        type: value.income_type,
                        description: value.income_description,
                        period: value.income_period
                    }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                                await editMoneyIncome(value.id, {
                                    income_type: values.type,
                                    income_description: values.description,
                                    income_quantity: values.quantity,
                                    income_period: values.period,
                                    income_currency: currency
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
                        <form
                            noValidate
                            style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
                            onSubmit={handleSubmit}
                        >
                            <Box display={'flex'} justifyContent="space-between" sx={{ width: '100%' }}>
                                <Typography id="modal-modal-title" variant="h2">
                                    Edit Income
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
                                type="text"
                                name="type"
                                onChange={handleChange}
                                defaultValue={value.income_type}
                                id="standard-multiline-static"
                                sx={{ width: '100%' }}
                                label="Type"
                                variant="standard"
                            />
                            <TextField
                                type="text"
                                label="Quantity"
                                onChange={handleChange}
                                name="quantity"
                                defaultValue={value.income_quantity}
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
                                        setСurrency('');
                                    } else {
                                        setСurrency(res.target.textContent);
                                    }
                                }}
                                name="currency"
                                defaultValue={value.income_currency}
                                id="combo-box-demo"
                                options={currencies.map((item) => `${item.code}`)}
                                sx={{ width: '100%', paddingBottom: '45px' }}
                                renderInput={(params) => (
                                    <TextField required type="text" name="currency" {...params} variant="standard" label="Currency" />
                                )}
                            />
                            <TextField
                                type="text"
                                label="Period"
                                onChange={handleChange}
                                defaultValue={value.income_period}
                                name="period"
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
                                defaultValue={value.income_description}
                                id="standard-multiline-static"
                                sx={{ width: '100%' }}
                                label="Description"
                                multiline
                                rows={3}
                                variant="standard"
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
