

const fieldErrors = {
    employee:{
        "first_name":true,
        "last_name":true,
        "position_id":true,
        "type":true,
        "commissioner": true,
        "phone":true,
        "document_id":true,
        "document_type": true,
        "address":true
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
        "rules": [
            {
                fieldFrom: 'commissioner',
                valueFrom: 1,
                fieldTo: 'default_commission_percentage',
                rule:'show',
            },
            {
                fieldFrom: 'commissioner',
                valueFrom: 1,
                fieldTo: 'default_commission_percentage',
                rule:'require'
            },
            {
                fieldFrom: 'commissioner',
                valueFrom: 0,
                fieldTo: 'default_commission_percentage',
                rule:'hidden'
            },
            {
                fieldFrom: 'commissioner',
                valueFrom: 0,
                fieldTo: 'default_commission_percentage',
                rule:'notrequire'
            },
            {
                fieldFrom: "document_type",
                valueFrom: "Pasaporte",
                fieldTo: "document_id",
                rule: "nomask",
              },
              {
                fieldFrom: "document_type",
                valueFrom: "Cedula",
                fieldTo: "document_id",
                rule: "mask",
                mask: "999-9999999-9",
              },
              {
                fieldFrom: "document_type",
                valueFrom: "RNC",
                fieldTo: "document_id",
                rule: "mask",
                mask: "9999999",
              },
              {
                fieldFrom: "document_type",
                valueFrom: "Cedula de Extranjería",
                fieldTo: "document_id",
                rule: "nomask",
                mask: "",
              },
        ],
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
                label: 'Nombres', 
                name:'first_name', 
                value:'', 
                type:'text',
                mask:'',
                model:'employee', 
                display:['create','update'],
                col:4
            },
            {
                label: 'Apellidos', 
                name:'last_name',
                value:'', 
                type:'text',
                mask:'',
                model:'employee',
                display:['create','update'],
                col:4
            },

            {
                label: 'Telefono', 
                name:'phone',
                value:'', 
                type:'text',
                mask:'999-999-9999',
                model:'employee',
                display:['create','update'],
                col:4
            },
            {
                label: "Tipo de Documento",
                name: "document_type",
                value: [
                  { label: "Cedula", value: "Cedula" },
                  { label: "Pasaporte", value: "Pasaporte" },
                  { label: "RNC", value: "RNC" },
                  { label: "Cedula de Extranjería", value: "Cedula de Extranjería" },
                ],
                type: "select",
                mask: "",
                model: "employee",
                display: ["create", "update"],
                col: 6,
              },
            {
                label: 'Cedula', 
                name:'document_id',
                value:'', 
                type:'text',
                mask:'999-9999999-9',
                model:'employee',
                display:['create','update'],
                col:6
            },
            {
                label: 'Direccion', 
                name:'address',
                value:'', 
                type:'textarea',
                mask:'',
                model:'employee',
                display:['create','update'],
                col:12
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
                    {label: 'Socio',value:'Socio'},
                    {label: 'Administrativo',value:'Administrativo'},
                    {label: 'Referidor',value:'Referidor'},
                ], 
                type:'select',
                mask:'',
                display:['create','update'],
                model:'employee',
                col:6
            },
            {
                label: '¿Puede comisionar?', 
                name:'commissioner', 
                value:[
                    {label:'Si',value:1},
                    {label:'No',value:0},
                ], 
                type:'select',
                display:['create','update'],
                model:'employee',
                disabled:false,
                col:6
            },
            {
                label: 'Porcentaje de comision', 
                name:'default_commission_percentage', 
                value:'', 
                type:'number',
                hidden: true,
                disabled:false,
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
                label: 'Foto de Perfil', 
                name:'picture', 
                value:'', 
                type:'image',
                model:'user', 
                display:['create','update'],
                mask:'',
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
    }
}
    




export {
    fieldErrors,
    headers,
    fieldsPages,
}