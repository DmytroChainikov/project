import categoryService from '../api/category';

export function getCategory() {
    return categoryService
        .getCategory()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function addCategory(model) {
    return categoryService
        .addCategory(model)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('ADD_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('ADD_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function editMoneyCategory(idCategory, model) {
    return categoryService
        .editMoneyCategory(idCategory, model)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('EDIT_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('EDIT_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function deleteCategory(idCategory) {
    return categoryService
        .deleteCategory(idCategory)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('DELETE_USER_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('DELETE_USER_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function deleteCosts(idCategory) {
    return categoryService
        .deleteCosts(idCategory)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('DELETE_USER_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('DELETE_USER_CATEGORY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function addCategoryMoney(model, body) {
    return categoryService
        .addCategoryMoney(model, body)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('ADD_CATEGORY_MONEY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('ADD_CATEGORY_MONEY_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}

export function getCosts(idCategory) {
    return categoryService
        .getCosts(idCategory)
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_CATEGORY_COSTS_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_CATEGORY_COSTS_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}
export function getUserCosts() {
    return categoryService
        .getUserCosts()
        .then(
            (res) => {
                return res.data;
            },
            (error) => {
                console.error('GET_USER_CATEGORY_COSTS_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
            }
        )
        .catch((error) => {
            console.error('GET_USER_CATEGORY_COSTS_FAILED', `SOMETHING_WENT_WRONG\n${error}`);
        });
}
