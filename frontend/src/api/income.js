import instance from './configurations/configurations';

const INCOME_URLS = {
    ADD_MONEY_INCOME: '/money/add_money_income/',
    GET_MONEY_INCOME: '/money/get_money_income',
    GET_TOTAL_MONEY_INCOME: '/money/get_total_income',
    EDIT_MONEY_INCOME: '/money/edit_money_income',
    MONEY_INCOME_DELETE: '/money/money_income_delete'
};

export default class incomeService {
    static getIncome() {
        return instance.get(INCOME_URLS.GET_MONEY_INCOME);
    }

    static getTotalIncome() {
        return instance.get(INCOME_URLS.GET_TOTAL_MONEY_INCOME);
    }

    static addIncome(model) {
        return instance.post(INCOME_URLS.ADD_MONEY_INCOME, model);
    }

    static editMoneyIncome(idIncome, model) {
        return instance.put(INCOME_URLS.EDIT_MONEY_INCOME + `?id=${idIncome}`, model);
    }

    static deleteIncome(idIncome) {
        return instance.delete(INCOME_URLS.MONEY_INCOME_DELETE + `?id=${idIncome}`);
    }
}
