
const fieldErrors = {
    sinisters:{
        "sinister_company_number":true,
        "type":true,
        "sinister_date":true,
        "notice_date":true,
        "assigned_provider":true,
        "facts_description":true,
        "estimated_amount":true
    },
    documents:[]
};


const headers = [
    "Asignado",
    "No. Sinistro Aseguradora",
    "No. Poliza",
    "Monto Asegurado",
    "Prima",
    "Tipo",
    "Estado",
    "Fecha del Sinistro",
    "Accion"
];

const fieldsPages = {
    sinisters:{
        "title": "Informacion del Sinistro",
        fields:[
            {
                label: '',
                name:'espace',
                value:'',
                type:'br',
                mask:'',
                model:'sinisterss',
                display:['create','update'],
                col:12
            },
            {
                label: 'No. Sinistro Aseguradora',
                name:'sinister_company_number',
                value:'',
                type:'text',
                mask:'',
                display:['create','update'],
                model:'sinisters',
                col:4
            },

            {
                label: 'Tipo de Siniestro',
                name:'type',
                value:[
                    { label: "Accidente de transito", value: "Accidente de transito" }
                ],
                type:'select',
                mask:'',
                model:'sinisters',
                display:['create','update'],
                col:4
            },
            {
                label: 'Fecha de Sinistro',
                name:'sinister_date',
                value:'',
                type:'date',
                mask:'',
                display:['create','update'],
                model:'sinisters',
                col:4
            },


            {
                label: 'Fecha de Aviso a Asesores',
                name:'notice_date',
                value:'',
                type:'date',
                mask:'',
                display:['create','update'],
                model:'sinisters',
                col:6
            },


            {
                label: 'Fecha de Aviso a la Aseguradora',
                name:'insurance_notice_date',
                value:'',
                type:'date',
                mask:'',
                display:['create','update'],
                model:'sinisters',
                col:6
            },


            {
                label: 'Proveedor Asignado',
                name:'assigned_provider',
                value:[
                    { label: "Proveedor", value: "Proveedor" }
                ],
                type:'select',
                mask:'',
                display:['create','update'],
                model:'sinisters',
                col:6
            },
            {
                label: 'Monto estimado',
                name:'estimated_amount',
                value:'',
                type:'number',
                mask:'',
                display:['create','update'],
                model:'sinisters',
                col:6
            },

            {
                label: 'Descripcion',
                name:'facts_description',
                value:'',
                type:'textarea',
                mask:'',
                display:['create','update'],
                model:'sinisters',
                col:12
            },

            {
                label: '',
                name:'espace',
                value:'',
                type:'br',
                mask:'',
                model:'sinisterss',
                display:['create','update'],
                col:6
            },

        ]
    },
    documents: {
        title: "Documentos adjuntos",
        rules: [],
        fields: [
          {
            label: "Subir todos los Adjuntos del sinistro",
            name: "documents",
            value: "",
            type: "file",
            child: {
              model: "sinisters",
              field: "sinister_company_number",
              path: "sinisters",
            },
            display: ["create", "update"],
            model: "documents",
            mask: "",
            col: 12,
          },
          {
            label: "",
            name: "espace",
            value: "",
            type: "br",
            mask: "",
            model: "insurances",
            display: ["create", "update"],
            col: 6,
          },
        ],
      },


}





export {
    fieldErrors,
    headers,
    fieldsPages,
}
