




import { Employees } from "../services/index";



const fieldErrors = {
    employee:{
        "first_name":true,
        "last_name":true,
        "position_id":true,
        "type":true,
    },
    user:{
        "email":true,
        "password":true,
    },
};


const headers = [
    "Nombre",  
    "Apellido", 
    "Posicion",
    "Tipo",
    'Fecha de Registro',
];

const fieldsPages = {
    employee:{
        "title": "Informacion Personal",
        fields:[
            {
                label: 'Nombres', 
                name:'first_name', 
                value:'', 
                type:'text',
                mask:'',
                model:'employee', 
                display:['create','update'],
                col:6
            },
            {
                label: 'Apellidos', 
                name:'last_name',
                value:'', 
                type:'text',
                mask:'',
                model:'employee',
                display:['create','update'],
                col:6
            },
            {
                label: 'Posicion', 
                name:'position_id', 
                value:[], 
                type:'select',
                mask:'',
                model:'employee',
                display:['create','update'],
                col:6
            },
            {
                label: 'Tipo', 
                name:'type', 
                value: [
                    {label: 'Socio',value:'partner'},
                    {label: 'Administrativo',value:'administrative'},
                    {label: 'Referidor',value:'referrer'},
                ], 
                type:'select',
                mask:'',
                display:['create','update'],
                model:'employee',
                col:6
            },
            {
                label: 'Comision', 
                name:'commissioner', 
                value:'', 
                type:'number',
                display:['create','update'],
                model:'employee',
                col:6
            },
            {
                label: 'Porcentaje de comision', 
                name:'default_commission_percentage', 
                value:'', 
                type:'number',
                mask:'',
                display:['create','update'],
                model:'employee',
                col:6
            },
          
        ]
    },
   
    user:{
        title:'Informacion de Usuario',
        fields:[
            {
                label: 'Correo', 
                name:'email', 
                value:'', 
                type:'email',
                model:'user', 
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Contraseña', 
                name:'password', 
                value:'', 
                type:'password',
                model:'user', 
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Rol de usuario', 
                name:'rol', 
                value:'', 
                type:'select',
                model:'user', 
                display:['update'],
                mask:'',
                col:6
            },
           
          
        ]
    }
}
    




export {
    fieldErrors,
    headers,
    fieldsPages,
}