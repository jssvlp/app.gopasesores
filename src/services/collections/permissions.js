import api from '../api/create';




function getPermissions(page) {

    return api.get('/permissions?page='+page+'&per_page=1000')

}



function getPermissionsById(id) {

    return api.get('/permissions/'+id)

}


function savePermission(body) {

    return api.post('/permissions/',body)

}

function deletePermission(id) {

    return api.delete('/permissions/'+id)

}

function updatePermission(id,body) {

    return api.put('/permissions/'+id,body)

}

function filterDatePermission(field,page,body) {
    console.log('field,body', field,body)
    return api.get('/permissions/filterby/'+field+'?per_page='+page,body)
    

}



export {
    getPermissions,
    savePermission,
    getPermissionsById,
    deletePermission,
    updatePermission,
    filterDatePermission,
}