import api from '../api/create';




function getClients(page,limit = 10) {

    return api.get('/clients?page='+page+'per_page='+limit)

}


function getClientsAll(){
    return api.get('/clients/list/all')
}


function getClientsById(id) {

    return api.get('/clients/'+id)

}

function getActivitiesEconomic(id) {

    return api.get('/economicActivities')

}





function saveClient(body) {

    return api.post('/clients/',body)

}

function deleteClient(id) {

    return api.delete('/clients/'+id)

}

function updateClient(id,body) {

    return api.put('/clients/'+id,body)

}

function activeClient(isActive,id) {

    return api.put('/clients/'+id+'/'+isActive)

}

function filterDateClient(field,page,body) {
    console.log('field,body', field,body)
    return api.post('/clients/filterby/'+field+'?per_page='+page,body)
    

}



export {
    getClients,
    saveClient,
    getClientsById,
    deleteClient,
    updateClient,
    filterDateClient,
    activeClient,
    getClientsAll,
    getActivitiesEconomic
}