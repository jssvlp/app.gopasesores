import api from '../api/create';




function getClients(page) {

    return api.get('/clients?page='+page)

}


function getClientsById(id) {

    return api.get('/clients/'+id)

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



export {
    getClients,
    saveClient,
    getClientsById,
    deleteClient,
    updateClient
}