
const fieldErrors = {
    people:{
        "first_name":true,
        "last_name":true,
        "document_type":true,
        "document_number":true,
        "gender":true,
        "birth_date":true,
        "marital_status":true,
        "owner_id":true
    },
    company:{
        "business_name":true,
        "rnc":true,
        "economic_activity_id":true,
        "owner_id":true
    },
    contact_info:{
        "nationality":true,
        "province_of_birth":true,
        "address_line1":true,
        "cell_phone_number":true,
        "city":true
    },
    user:{
        "email":true,
        "password":true,
    },
    type:true
};


const headers = [
    "Nombre / Razón Social",  
    "Teléfono", 
    "Cedula / RNC",
    "Tipo",
    "Correo",
    'Fecha de Registro',
];

const fieldsPages = {
    people:{
        "title": "Informacion Personal",
        "rules": [
            {
                fieldFrom: 'document_type',
                valueFrom: 'Pasaporte',
                fieldTo: 'document_number',
                rule:'nomask'
            },
            {
                fieldFrom: 'document_type',
                valueFrom: 'Cedula',
                fieldTo: 'document_number',
                rule:'mask',
                mask:'999-9999999-9'
            },
            {
                fieldFrom: 'document_type',
                valueFrom: 'RNC',
                fieldTo: 'document_number',
                rule:'mask',
                mask:'9999999'
            },
            {
                fieldFrom: 'document_type',
                valueFrom: 'Cedula de Extranjería',
                fieldTo: 'document_number',
                rule:'nomask',
                mask:''
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
                display:['create','update'],
                model:'people', 
                col:6
            },
            {
                label: 'Apellidos', 
                name:'last_name',
                value:'', 
                type:'text',
                mask:'',
                model:'people',
                display:['create','update'],
                col:6},
            {
                label: 'Tipo de Documento', 
                name:'document_type', 
                value:[
                    {label:'Cedula',value:'Cedula'},
                    {label: 'Pasaporte',value: 'Pasaporte'},
                    {label: 'RNC',value:'RNC'},
                    {label:'Cedula de Extranjería',value:'Cedula de Extranjería'}
                ], 
                type:'select',
                mask:'',
                model:'people',
                display:['create','update'],
                col:6
            },
            {
                label: 'No. Documento',
                name:'document_number', 
                value:'', 
                type:'text',
                mask:'999-9999999-9',
                model:'people',
                display:['create','update'],
                col:6
            },
            {
                label: 'Fecha de expiración del documento', 
                name:'document_expire_date', 
                value:'', 
                type:'date',
                model:'people',
                display:['create','update'],
                col:6
            },
            {
                label: 'Fecha de Expedicion', 
                name:'document_expedition_date', 
                value:'', 
                type:'date',
                display:['create','update'],
                mask:'',
                model:'people',
                col:6
            },
            {
                label: 'Codigo de Cliente', 
                name:'client_code', 
                value:'', 
                type:'text',
                model:'people',
                display:['create','update'],
                col:4
            },
            {
                label: 'Genero', 
                name:'gender', 
                value:[
                    {label: 'Masculino',value: 'Masculino'},
                    {label: 'Femenino',value:'Femenino'}
                ], 
                type:'select',
                model:'people',
                display:['create','update'],
                mask:'',
                col:4
            },
            {
                label: 'Fecha de Nacimiento', 
                name:'birth_date', 
                value:'01/01/1999', 
                display:['create','update'],
                type:'date',
                model:'people',
                mask:'',
                col:4
            },
            {
                label: 'Estado', 
                name:'marital_status', 
                value:[
                    {label:'Soltero',value:'Soltero'},
                    {label:'Casado',value:'Casado'},
                    {label:'Divorciado',value:'Divorciado'},
                    {label:'Unión Libre',value:'Union Libre'},
                    {label:'Viudo',value:'Viudo'}
                ], 
                type:'select',
                model:'people',
                display:['create','update'],
                mask:'',
                col:4
            },
            {
                label: 'Ingresos Mensuales', 
                name:'monthly_income', 
                value:'', 
                type:'number',
                mask:'',
                display:['create','update'],
                model:'people',
                col:4
            },
            {
                label: 'Moneda', 
                name:'currency', 
                value:[
                    {label:'RD',value:'RD'},
                    {label:'USD',value:'USD'},
                ], 
                type:'select',
                model:'people',
                display:['create','update'],
                mask:'',
                col:4
            },
            {
                label: 'Dueño del cliente', 
                name:'owner_id', 
                value:[], 
                type:'select',
                model:'people',
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Relacionado', 
                name:'related_client_id', 
                value:[], 
                type:'select',
                model:'people',
                display:['create','update'],
                mask:'',
                col:6
            }

        ]
    },
    company:{
        title:"Informacion de Empresa",
        rules:[],
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
                label: 'Nombre de la Empresa', 
                name:'business_name', 
                value:'',
                model:'company', 
                type:'text',
                mask:'',
                display:['create','update'],
                col:6
            },
            {
                label: 'RNC', 
                name:'rnc', 
                value:'',
                model:'company', 
                type:'number',
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Fecha de expedición del RNC', 
                name:'rnc_expedition_date', 
                value:'',
                model:'company', 
                type:'date',
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Fecha de expiración del RNC', 
                name:'rnc_expire_date', 
                value:'',
                model:'company', 
                type:'date',
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Fecha de constitución', 
                name:'constitution_date', 
                value:'',
                model:'company', 
                type:'date',
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Codigo del Cliente', 
                name:'client_code', 
                value:'',
                model:'company', 
                type:'text',
                mask:'',
                display:['create','update'],
                col:6
            },
            {
                label: 'Actividad Economica', 
                name:'economic_activity_id', 
                value:[
                    {label:"Tecnologia",value:1}
                ],
                model:'company', 
                type:'select',
                mask:'',
                display:['create','update'],
                col:6
            },
            {
                label: 'Dueño del cliente', 
                name:'owner_id', 
                value:[], 
                type:'select',
                model:'company',
                display:['create','update'],
                mask:'',
                col:6
            },
        ]
    },
    contact_info:{
        title:"Informacion de Contacto",
        rules:[],
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
                label: 'Celular', 
                name:'cell_phone_number', 
                value:'',
                model:'contact_info', 
                type:'text',
                mask:'(999)-999-9999',
                display:['create','update'],
                col:6
            },
            {
                label: 'Ciudad', 
                name:'city', 
                value:'', 
                type:'text',
                model:'contact_info', 
                mask:'',
                display:['create','update'],
                col:6
            },
            {
                label: 'Nacionalidad', 
                name:'nationality', 
                value:'', 
                type:'text',
                model:'contact_info', 
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Provincia', 
                name:'province_of_birth', 
                value:'', 
                type:'text',
                model:'contact_info', 
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: 'Codigo Postal',
                name:'postal_code', 
                value:'', 
                type:'text',
                model:'contact_info', 
                display:['create','update'],
                mask:'',
                col:6
            },
            {
                label: '1era Direccion', 
                name:'address_line1', 
                value:'', 
                type:'textarea',
                model:'contact_info', 
                display:['create','update'],
                mask:'',
                col:12
            },
            {
                label: '2da Direccion', 
                name:'address_line2', 
                value:'', 
                type:'textarea',
                model:'contact_info', 
                mask:'',
                display:['create','update'],
                col:12
            }
        ]
    },
    user:{
        title:'Informacion de Usuario',
        rules:[],
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
                label: 'Comentario', 
                name:'comment', 
                value:'', 
                type:'textarea',
                model:null,
                display:['create','update'],
                mask:'',
                col:12
            },
            {
                label: 'Prospecto', 
                name:'status', 
                value:[
                    {label:'Si',value:'Prospecto'},
                    {label:'No',value:'Cliente'},
                ], 
                type:'select',
                model:null,
                display:['create','update'],
                mask:'',
                col:6

            },
            {
                label: 'Autorizar Procesar la Informacion', 
                name:'authorize_data_processing', 
                value:'', 
                type:'checkbox',
                display:['create','update'],
                model:null,
                mask:'',
                col:12
            },
        ]
    }
}
    




export {
    fieldErrors,
    headers,
    fieldsPages
}