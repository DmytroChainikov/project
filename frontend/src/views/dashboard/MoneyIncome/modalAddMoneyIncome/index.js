import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { NumericFormat } from 'react-number-format';
import { IconPlus } from '@tabler/icons';
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useState } from 'react';
import { addIncome } from 'services/income';
import Autocomplete from '@mui/material/Autocomplete';
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

export default function ModalAddMoneyIncome({ modalOpen, onClose, isUpdate, setUpdate }) {
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
                        quantity: 0,
                        type: '',
                        description: '',
                        period: 0
                    }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                values.currency = currency;
                                setStatus({ success: true });
                                setSubmitting(false);
                                await addIncome({
                                    income_type: values.type,
                                    income_description: values.description,
                                    income_quantity: values.quantity,
                                    income_currency: values.currency,
                                    income_period: values.period
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
                                    Add Income
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
                                name="type"
                                onChange={handleChange}
                                id="standard-multiline-static"
                                sx={{ width: '100%' }}
                                label="Type"
                                variant="standard"
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
