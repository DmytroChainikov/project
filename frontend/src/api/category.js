import instance from './configurations/configurations';

const CATEGORY_URLS = {
    ADD_CATEGORY: '/category/add_category/',
    GET_CATEGORY: '/category/get_category',
    EDIT_CATEGORY: '/category/edit_category',
    CATEGORY_DELETE: '/category/category_delete',
    COST_DELETE: '/category/category_delete_money',
    ADD_CATEGORY_MONEY: '/category/add_category_money/',
    GET_COSTS: '/category/get_costs_by_id?category_type_id=',
    GET_USER_COSTS: '/category/get_costs'
};

export default class categoryService {
    static getCategory() {
        return instance.get(CATEGORY_URLS.GET_CATEGORY);
    }

    static addCategory(model) {
        return instance.post(CATEGORY_URLS.ADD_CATEGORY, model);
    }

    static editMoneyCategory(idIncome, model) {
        return instance.put(CATEGORY_URLS.EDIT_CATEGORY + `?id=${idIncome}`, model);
    }

    static deleteCategory(idIncome) {
        return instance.delete(CATEGORY_URLS.CATEGORY_DELETE + `?id=${idIncome}`);
    }

    static addCategoryMoney(model, body) {
        return instance.post(
            CATEGORY_URLS.ADD_CATEGORY_MONEY + '?category_type_id=' + model.category_type_id + '&payment_id=' + model.payment_id,
            body
        );
    }

    static getCosts(category_type_id) {
        return instance.get(CATEGORY_URLS.GET_COSTS + `${category_type_id}`);
    }
    static getUserCosts() {
        return instance.get(CATEGORY_URLS.GET_USER_COSTS);
    }

    static deleteCosts(idIncome) {
        return instance.delete(CATEGORY_URLS.COST_DELETE + `?id=${idIncome}`);
    }
}
