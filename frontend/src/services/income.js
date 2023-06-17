import incomeService from '../api/income';

export function getIncome() {
    return incomeService
        .getIncome()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function getTotalIncome() {
    return incomeService
        .getTotalIncome()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function addIncome(model) {
    return incomeService
        .addIncome(model)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('ADD_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('ADD_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function editMoneyIncome(idMoney, model) {
    return incomeService
        .editMoneyIncome(idMoney, model)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('EDIT_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('EDIT_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function deleteIncome(idMoney) {
    return incomeService
        .deleteIncome(idMoney)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('DELETE_USER_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('DELETE_USER_INCOME_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}
