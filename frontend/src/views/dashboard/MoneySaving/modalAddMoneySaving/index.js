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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useState } from 'react';
import moment from 'moment/moment';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { addSaving } from 'services/saving';
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

export default function ModalAddMoneySaving({ modalOpen, onClose, isUpdate, setUpdate }) {
    const scriptedRef = useScriptRef();
    const [periodStart, setPeriodStart] = useState(moment().format('yyyy-MM-DD'));
    const [periodEnd, setPeriodEnd] = useState(moment().format('yyyy-MM-DD'));
    const [currency, setСurrency] = useState('');
    const handelPreidStart = (res) => {
        setPeriodStart(res.$d);
    };

    const handelPreidEnd = (res) => {
        setPeriodEnd(res.$d);
    };

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
                        currency: '',
                        name: '',
                        description: '',
                        persentage: 0,
                        period_start: moment(periodStart).format('yyyy-MM-DD'),
                        period_end: moment(periodEnd).format('yyyy-MM-DD')
                    }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                                values.currency = currency;
                                values.period_start = moment(periodStart).format('yyyy-MM-DD');
                                values.period_end = moment(periodEnd).format('yyyy-MM-DD');
                                await addSaving({
                                    saving_name: values.name,
                                    saving_quantity: values.quantity,
                                    saving_currency: values.currency,
                                    saving_persentage: values.persentage,
                                    saving_description: values.description,
                                    saving_period_start: values.period_start,
                                    saving_period_end: values.period_end
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
                                    Add Saving
                                </Typography>
                                <IconButton
                                    onClick={() => {
                                        onClose(false);
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                                    label="Persentage"
                                    onChange={handleChange}
                                    name="persentage"
                                    id="formatted-numberformat-input"
                                    InputProps={{
                                        inputComponent: NumericFormatCustom
                                    }}
                                    variant="standard"
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    type="text"
                                    label="Name"
                                    name="name"
                                    onChange={handleChange}
                                    id="formatted-numberformat-input"
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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem>
                                        <DatePicker
                                            onChange={handelPreidStart}
                                            label="Period start"
                                            name="period_start"
                                            id="formatted-numberformat-input"
                                            slotProps={{
                                                textField: {
                                                    variant: 'standard',
                                                    defaultValue: moment().format('DD/MM/yyyy')
                                                }
                                            }}
                                            sx={{ width: '100%' }}
                                        />
                                    </DemoItem>
                                    <DemoItem>
                                        <DatePicker
                                            onChange={handelPreidEnd}
                                            label="Period end"
                                            name="period_end"
                                            id="formatted-numberformat-input"
                                            sx={{ width: '100%' }}
                                            slotProps={{
                                                textField: {
                                                    variant: 'standard',
                                                    defaultValue: moment().format('DD/MM/yyyy')
                                                }
                                            }}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
                                <Button
                                    disabled={isSubmitting}
                                    type="submit"
                                    startIcon={<IconPlus />}
                                    color="primary"
                                    variant="contained"
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                        </form>
                    )}
                </Formik>
            </Grid>
        </Modal>
    );
}
