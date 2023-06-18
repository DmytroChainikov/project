import instance from './configurations/configurations';

const MONEY_URLS = {
    ADD_MONEY: '/money/add_money/',
    GET_BALANCE: '/money/get_balance',
    GET_RANDOM_BALANCE: '/money/get_random_balance',
    GET_TOTAL_BALANCE: '/money/get_total_balance',
    EDIT_MONEY_TYPE: '/money/edit_money_type',
    MONEY_DELETE: '/money/money_type_delete'
};

export default class moneyService {
    static getBalanse() {
        return instance.get(MONEY_URLS.GET_BALANCE);
    }
    static getRandomBalanse() {
        return instance.get(MONEY_URLS.GET_RANDOM_BALANCE);
    }

    static addMoney(model) {
        return instance.post(MONEY_URLS.ADD_MONEY, model);
    }

    static editMoneyType(idMoney, model) {
        return instance.put(MONEY_URLS.EDIT_MONEY_TYPE + `?id=${idMoney}`, model);
    }

    static deleteMoney(idMoney) {
        return instance.delete(MONEY_URLS.MONEY_DELETE + `?id=${idMoney}`);
    }

    static getTotalBalanse() {
        return instance.get(MONEY_URLS.GET_TOTAL_BALANCE);
    }
}
