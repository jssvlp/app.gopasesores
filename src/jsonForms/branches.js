
const fieldErrors = {
    branches:{
        "name":true,
        "commission_percentage":true,
        "itbis":true,
        "insurance_id":true,
        "main_branch_id":true
    },
};


const headers = [
    "Nombre",  
    "Comision",
    "Aseguradora",
    "Ramo principal",
    "Fecha"
];

const fieldsPages = {
    branches:{
        "title": "Informacion del RAMO",
        fields:[
            {
                label: '', 
                name:'espace', 
                value:'',
                type:'br',
                mask:'',
                model:'branchess',
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
                model:'branches', 
                col:6
            },
            {
                label: 'Porcentaje de comision', 
                name:'commission_percentage', 
                value:'',
                type:'number',
                mask:'',
                model:'branches',
                display:['create','update'],
                col:6
            },
          
            {
                label: 'Itbis', 
                name:'itbis', 
                value:'',
                type:'number',
                mask:'',
                model:'branches',
                display:['create','update'],
                col:6
            },

            {
                label: 'Aseguradora', 
                name:'insurance_id', 
                value:[],
                type:'select',
                mask:'',
                model:'branches',
                display:['create','update'],
                col:6
            },

            {
                label: 'Ramo principal', 
                name:'main_branch_id', 
                value:[],
                type:'select',
                mask:'',
                model:'branches',
                display:['create','update'],
                col:12
            },
            {
                label: '', 
                name:'espace', 
                value:'',
                type:'br',
                mask:'',
                model:'branchess',
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