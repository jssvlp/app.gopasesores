
const fieldErrors = {
    roles:{
        "name":true,
    },
};


const headers = [
    "Nombre",  
    "Fecha",
];

const fieldsPages = {
    roles:{
        "title": "Informacion del rol",
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
                model:'roles', 
                col:6
            },
            {
                label: 'Permisos del rol', 
                name:'permissions_title', 
                value:'',
                type:'title',
                mask:'',
                model:'roles',
                display:['update'],
                col:12
            },
          
            {
                label: 'Permisos del rol', 
                name:'permissions', 
                value:'',
                headers:['Nombre','Ruta'] ,
                data:[] ,
                type:'table',
                display:['update'],
                btnName:'Agregar permisos',
                delete:()=>{},
                create:()=>{},
                openDetail: ()=>{},
                mask:'',
                model:'roles', 
                col:12
            },
          
        ]
    },
   
   
}
    




export {
    fieldErrors,
    headers,
    fieldsPages,
}