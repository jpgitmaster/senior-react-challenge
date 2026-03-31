const initUserObj = {
    id: null,
    age: null,
    email: '',
    phone: '',
    gender: null,
    username: '',
    lastName: '',
    firstName: '',
}

const initStatus = {
    message: '',
    loader: false,
}

const initFilter = {
    search: '',
    filter: { gender: '' },
    currentPage: 1,
    recordsLimit: 10
}

const initUser = {
    userArr: [],
    totalUsers: 0,
    userObj: initUserObj,
}

export {
    initUser,
    initStatus,
    initFilter,
};