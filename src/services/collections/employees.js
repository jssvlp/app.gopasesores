import api from '../api/create';




function getEmployees(page,limit = 10) {

    return api.get('/employees?page='+page+'per_page='+limit)

}

function getPosition() {

    return api.get('/positions')

}


function getEmployeesById(id) {

    return api.get('/employees/'+id)

}

function getEmployeesByUser(id) {

    return api.get('/employees/user/'+id)

}


function saveEmployee(body) {

    return api.post('/employees/',body)

}

function deleteEmployee(id) {

    return api.delete('/employees/'+id)

}

function updateEmployee(id,body) {

    return api.put('/employees/'+id,body)

}

function filterDateEmployee(field,page,body) {
    console.log('field,body', field,body)
    return api.get('/employees/filterby/'+field+'?per_page='+page,body)
    

}



export {
    getEmployees,
    saveEmployee,
    getEmployeesById,
    deleteEmployee,
    updateEmployee,
    filterDateEmployee,
    getPosition,
    getEmployeesByUser
}