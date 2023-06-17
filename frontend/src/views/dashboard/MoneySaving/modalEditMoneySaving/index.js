import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { NumericFormat } from 'react-number-format';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import { useState } from 'react';
import moment from 'moment/moment';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { editMoneySaving } from 'services/saving';
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

export default function ModalEditMoneySaving({ modalOpen, onClose, value, isUpdate, setUpdate }) {
    const scriptedRef = useScriptRef();
    const [periodStart, setPeriodStart] = useState(moment(value.saving_period_start).format('yyyy-MM-DD'));
    const [periodEnd, setPeriodEnd] = useState(moment(value.saving_period_end).format('yyyy-MM-DD'));
    const [description, setDescription] = useState(value.saving_description);
    const [persentage, setPersentage] = useState(value.saving_persentage);

    const handelPreidStart = (res) => {
        if (res.$d === null) {
            setPeriodStart(moment().format('yyyy-MM-DD'));
        } else {
            setPeriodStart(moment(res.$d).format('yyyy-MM-DD'));
        }
    };

    const handelPreidEnd = (res) => {
        if (res.$d === null) {
            setPeriodEnd(moment().format('yyyy-MM-DD'));
        } else {
            setPeriodEnd(moment(res.$d).format('yyyy-MM-DD'));
        }
    };

    const handelDescription = (res) => {
        if (res.target.value === '') {
            setDescription('');
        } else {
            setDescription(res.target.value);
        }
    };

    const handelPersentage = (res) => {
        if (res.target.value === '') {
            setPersentage('');
        } else {
            setPersentage(res.target.value);
        }
    };

    const clearData = () => {
        setPeriodStart(moment(value.saving_period_start).format('yyyy-MM-DD'));
        setPeriodEnd(moment(value.saving_period_end).format('yyyy-MM-DD'));
        setDescription(value.saving_description);
        setPersentage(value.saving_persentage);
    };

    useEffect(() => {
        clearData();
    }, [value]);

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
                        quantity: value.saving_quantity,
                        name: value.saving_name,
                        description: value.saving_description,
                        persentage: value.saving_persentage,
                        period_start: moment(value.saving_period_start).format('yyyy-MM-DD'),
                        period_end: moment(value.saving_period_end).format('yyyy-MM-DD')
                    }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                                values.period_start = periodStart;
                                values.period_end = periodEnd;
                                console.log(value);
                                console.log({
                                    saving_name: values.name,
                                    saving_quantity: values.quantity,
                                    saving_persentage: persentage,
                                    saving_description: description,
                                    saving_period_start: values.period_start === '' ? value.saving_period_start : values.period_start,
                                    saving_period_end: values.period_end === '' ? value.saving_period_end : values.period_end
                                });

                                await editMoneySaving(value.id, {
                                    saving_name: values.name,
                                    saving_quantity: values.quantity,
                                    saving_persentage: persentage,
                                    saving_description: description,
                                    saving_period_start: values.period_start === '' ? value.saving_period_start : values.period_start,
                                    saving_period_end: values.period_end === '' ? value.saving_period_end : values.period_end
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
                                    Edit Saving
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
                                    defaultValue={value.saving_quantity}
                                    id="formatted-numberformat-input"
                                    InputProps={{
                                        inputComponent: NumericFormatCustom
                                    }}
                                    variant="standard"
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    type="text"
                                    label="Persentage"
                                    onChange={handelPersentage}
                                    name="persentage"
                                    defaultValue={value.saving_persentage}
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
                                    defaultValue={value.saving_name}
                                    name="name"
                                    onChange={handleChange}
                                    id="formatted-numberformat-input"
                                    variant="standard"
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    type="text"
                                    name="description"
                                    onChange={handelDescription}
                                    defaultValue={value.saving_description}
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
                                                    variant: 'standard'
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
                                                    variant: 'standard'
                                                }
                                            }}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
                                <Button disabled={isSubmitting} type="submit" color="warning" variant="contained" sx={{ width: '100%' }}>
                                    Edit
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Grid>
        </Modal>
    );
}
