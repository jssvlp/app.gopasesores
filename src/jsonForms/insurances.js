
const fieldErrors = {
    insurances:{
        "name":true,
        "rnc":true,
        "phone":true,
        "email":true,
        "account":true
    },
};


const headers = [
    "Nombre",  
    "RNC",
    "Telefono",
    "Email",
    "cuenta",
    "Fecha"
];

const fieldsPages = {
    insurances:{
        "title": "Informacion de la aseguradora",
        fields:[
              {
                label: '', 
                name:'espace', 
                value:'',
                type:'br',
                mask:'',
                model:'insurances',
                display:['create','update'],
                col:12
            },
            {
                label: 'Nombre', 
                name:'name', 
                value:'', 
                type:'text',
                mask:'',
                display:['create','update'],
                model:'insurances', 
                col:6
            },
            {
                label: 'RNC', 
                name:'rnc', 
                value:'',
                type:'text',
                mask:'999999999',
                model:'insurances',
                display:['create','update'],
                col:6
            },
          
            {
                label: 'Telefono', 
                name:'phone', 
                value:'',
                type:'text',
                mask:'999-999-9999',
                model:'insurances',
                display:['create','update'],
                col:6
            },

            {
                label: 'Correo', 
                name:'email', 
                value:'',
                type:'email',
                mask:'',
                model:'insurances',
                display:['create','update'],
                col:6
            },

            {
                label: 'Cuenta', 
                name:'account', 
                value:'',
                type:'number',
                mask:'',
                model:'insurances',
                display:['create','update'],
                col:6
            },
            {
                label: 'Direccion', 
                name:'address', 
                value:'',
                type:'textarea',
                mask:'',
                model:'insurances',
                display:['create','update'],
                col:12
            },
            {
                label: '', 
                name:'espace', 
                value:'',
                type:'br',
                mask:'',
                model:'insurances',
                display:['create','update'],
                col:6
            },
          
        ]
    },
   
   
}
    




export {
    fieldErrors,
    headers,
    fieldsPages,
}