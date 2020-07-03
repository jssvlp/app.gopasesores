//=================================== CHANGE ENVIRONMENT ==================================
const option = 'development'
//=========================================================================================

function env(env) {
    switch (env) {
        case 'local':
            return 'http://localhost:4200/api'
        case 'development':
            return 'https://api-gop.ddns.net/api'
        default:
            return ''
    }
}
try{
    module.exports ={
        api:    env(option),
        SECRET_TOKEN: 'palolo'
    }
}catch(e){
}