import api from '../api/create';




function login(body) {

    return api.post('/auth/login',body)

}


function savUser(body) {

    return api.post('/auth/register',body)

}


function updateUser(id,body) {

    return  api.put('/users/'+id,body)

}


function getUsersById(id) {

    return api.get('/auth/users/'+id)

}



function forgetPassword(id) {

    return api.get('/users/forgetpassword/'+id)

}


function getUsers() {

    return api.get('/auth/users')

}

function logout(token){
    return api.post('/auth/logout',token)
}


export {
    login,
    savUser,
    updateUser,
    getUsersById,
    getUsers,
    forgetPassword,
    logout
}