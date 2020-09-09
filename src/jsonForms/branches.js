
const fieldErrors = {
    branches:{
        "name":true,
        "main_branch_id":true
    },
};


const headers = [
    "Nombre",
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
                label: 'Ramo principal', 
                name:'main_branch_id', 
                value:[],
                type:'select',
                mask:'',
                model:'branches',
                display:['create','update'],
                col:6
            },
            
            {
                label: 'Comisiones de aseguradoras', 
                name:'commissions', 
                value:'',
                headers:['Nombre','Comision'] ,
                data:[] ,
                type:'table',
                display:['update'],
                btnName:'Agregar comision',
                delete:()=>{},
                create:()=>{},
                openDetail: ()=>{},
                mask:'',
                model:'branches', 
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