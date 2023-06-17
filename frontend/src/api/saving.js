import instance from './configurations/configurations';

const SAVING_URLS = {
    ADD_MONEY_SAVING: '/money/add_money_saving/',
    GET_SAVING: '/money/get_saving',
    GET_TOTAL_SAVING: '/money/get_total_saving',
    EDIT_SAVING_TYPE: '/money/edit_saving_type',
    MONEY_SAVING_DELETE: '/money/money_saving_delete'
};

export default class savingService {
    static getSaving() {
        return instance.get(SAVING_URLS.GET_SAVING);
    }

    static getTotalSaving() {
        return instance.get(SAVING_URLS.GET_TOTAL_SAVING);
    }

    static addSaving(model) {
        return instance.post(SAVING_URLS.ADD_MONEY_SAVING, model);
    }

    static editMoneySaving(idSaving, model) {
        return instance.put(SAVING_URLS.EDIT_SAVING_TYPE + `?id=${idSaving}`, model);
    }

    static deleteSaving(idSaving) {
        return instance.delete(SAVING_URLS.MONEY_SAVING_DELETE + `?id=${idSaving}`);
    }
}
