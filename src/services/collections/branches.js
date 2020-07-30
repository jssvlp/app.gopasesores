import api from '../api/create';




function getBranches(page) {

    return api.get('/branches?page='+page)

}

function getMainBranches() {

    return api.get('/branches/main/get')

}

function getInsurancesBranches(page) {

    return api.get('/insurances/list/all')

}



function getBranchesById(id) {

    return api.get('/branches/'+id)

}


function saveBranch(body) {

    return api.post('/branches/',body)

}


function deleteBranch(id) {

    return api.delete('/branches/'+id)

}

function updateBranch(id,body) {

    return api.put('/branches/'+id,body)

}

function filterDateBranch(field,page,body) {
    console.log('field,body', field,body)
    return api.get('/branches/filterby/'+field+'?per_page='+page,body)
    

}



export {
    getBranches,
    saveBranch,
    getBranchesById,
    deleteBranch,
    updateBranch,
    filterDateBranch,
    getMainBranches,
    getInsurancesBranches
}