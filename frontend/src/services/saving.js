import savingService from '../api/saving';

export function getSaving() {
    return savingService
        .getSaving()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function getTotalSaving() {
    return savingService
        .getTotalSaving()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function addSaving(model) {
    return savingService
        .addSaving(model)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('ADD_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('ADD_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function editMoneySaving(idMoney, model) {
    return savingService
        .editMoneySaving(idMoney, model)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('EDIT_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('EDIT_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function deleteSaving(idMoney) {
    return savingService
        .deleteSaving(idMoney)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('DELETE_USER_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('DELETE_USER_SAVING_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}
