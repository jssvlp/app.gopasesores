import api from '../api/create';




function getRoles(page) {

    return api.get('/roles?page='+page)

}



function getRolesById(id) {

    return api.get('/roles/'+id)

}


function saveRole(body) {

    return api.post('/roles/',body)

}
function addPermissions(id,id_permission,body) {

    return api.post('/roles/'+id+'/permission/'+id_permission,body)

}
function deletePermissions(id,id_permission) {

    return api.delete('/roles/'+id+'/permission/'+id_permission)

}

function deleteRole(id) {

    return api.delete('/roles/'+id)

}

function updateRole(id,body) {

    return api.put('/roles/'+id,body)

}

function filterDateRole(field,page,body) {
    console.log('field,body', field,body)
    return api.get('/roles/filterby/'+field+'?per_page='+page,body)
    

}



export {
    getRoles,
    saveRole,
    getRolesById,
    deleteRole,
    updateRole,
    filterDateRole,
    addPermissions,
    deletePermissions
}