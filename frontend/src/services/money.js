import moneyService from '../api/money';

export function getBalance() {
    return moneyService
        .getBalanse()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_BALANSE_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_BALANSE_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}
export function getRandomBalance() {
    return moneyService
        .getRandomBalanse()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_BALANSE_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_BALANSE_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function getTotalBalance() {
    return moneyService
        .getTotalBalanse()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_TOTAL_BALANSE_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_TOTAL_BALANSE_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function addMoney(model) {
    return moneyService
        .addMoney(model)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('ADD_MONEY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('ADD_MONEY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function editMoneyType(idMoney, model) {
    return moneyService
        .editMoneyType(idMoney, model)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('EDIT_MONEY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('EDIT_MONEY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function deleteBalance(idMoney) {
    return moneyService
        .deleteMoney(idMoney)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('DELETE_USER_BALANSE_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('DELETE_USER_BALANSE_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}
