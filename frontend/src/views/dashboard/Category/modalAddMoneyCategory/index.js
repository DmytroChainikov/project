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
import { addCategory } from 'services/category';

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

export default function ModalAddMoneyCategory({ modalOpen, onClose, isUpdate, setUpdate }) {
    const scriptedRef = useScriptRef();

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
                        name: '',
                        description: ''
                    }}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                                await addCategory({
                                    category_name: values.name,
                                    category_description: values.description
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
                                    Add Category
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
                                name="name"
                                onChange={handleChange}
                                id="standard-multiline-static"
                                sx={{ width: '100%' }}
                                label="Name"
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
