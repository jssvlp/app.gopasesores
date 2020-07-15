import Routers from '../routes'
const fieldErrors = {
    permissions:{
        "name":true,
        "path":true
    },
};


const headers = [
    "Nombre",
    "Ruta",  
    "Fecha",
];

const fieldsPages = {
    permissions:{
        "title": "Informacion del rol",
        fields:[
            {
                label: 'Nombre', 
                name:'name', 
                value:'', 
                type:'text',
                mask:'',
                model:'permissions', 
                display:['create','update'],
                col:6
            },
            {
                label: 'Ruta', 
                name:'path', 
                value:Routers.map((item,i)=>{
                    return {label:item.name,value:item.path}
                }), 
                type:'select',
                mask:'',
                model:'permissions', 
                display:['create','update'],
                col:6
            },
            {
                label: 'Accion', 
                name:'action', 
                display:['create','update'],
                value:[
                    {label:'Crear',value:'create'},
                    {label:'Eliminar',value:'delete'},
                    {label:'Actualizar',value:'update'},
                    {label:'Ver Lista',value:'all'},
                ], 
                type:'select',
                mask:'',
                model:'permissions', 
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