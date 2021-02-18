//=================================== CHANGE ENVIRONMENT ==================================
const option = 'development'
//=========================================================================================

function env(env) {
    switch (env) {
        case 'local':
            return 'http://localhost:4200/api'
        case 'development':
            return 'https://apigop.ddns.net/api'
        default:
            return ''
    }
}
try{
    module.exports ={
        api:    env(option),
        SECRET_TOKEN: 'palolo',
        apiKey: "AIzaSyBuBTNO7JUprC3hdr_wUX-0qck1CWP4Cm0",
        authDomain: "gopasesores-c0c69.firebaseapp.com",
        databaseURL: "https://gopasesores-c0c69.firebaseio.com",
        projectId: "gopasesores-c0c69",
        storageBucket: "gopasesores-c0c69.appspot.com",
        messagingSenderId: "281611175503",
        appId: "1:281611175503:web:f555e3f967016ef9aa0c3a",
        measurementId: "G-59H2VT99QJ"

    }
}catch(e){
}