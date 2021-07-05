
const fieldErrors = {
    payments:{
        "dues":true,
        //"months":true,
        "coment":true,
        //"payment_date":true,
        "commision_value":true,
    },
    documents:[]
};


const headers = [
    "Fecha",
    "Comision",
    "Valor",
    "ESTADO"
];

const fieldsPages = {
    payments:{
        "title": "Informacion del Pago",
        rules: [
            {
                fieldFrom: "dues",
                valueFrom: "value_field",
                fieldTo: "prime",
                fieldResult: "result_payment",
                rule: "div",
            },
        ],
        fields:[
            {
                label: '', 
                name:'espace', 
                value:'',
                type:'br',
                mask:'',
                model:'paymentss',
                display:['create','update'],
                col:12
            },
            {
                label: 'Cuotas', 
                name:'dues', 
                value:'', 
                type:'number',
                mask:'',
                display:['create','update'],
                model:'payments', 
                col:12
            },

            // {
            //     label: 'Meses', 
            //     name:'months', 
            //     value:[
            //         { label: "3 meses", value: 3 },
            //         { label: "6 meses", value: 6 },
            //         { label: "9 meses", value: 9 },
            //     ],
            //     type:'select',
            //     mask:'',
            //     model:'payments',
            //     display:['create','update'],
            //     col:6
            // },
            {
                label: 'Comentario', 
                name:'coment', 
                value:'', 
                type:'textarea',
                mask:'',
                display:['create','update'],
                model:'payments', 
                col:12
            },
            

            // {
            //     label: 'Fecha de Pago', 
            //     name:'payment_date', 
            //     value:'', 
            //     type:'date',
            //     mask:'',
            //     display:['create','update'],
            //     model:'payments', 
            //     col:4
            // },


            {
                label: 'Prima', 
                name:'prime', 
                value:'',
                type:'number',
                disabled: true,
                mask:'',
                display:['create','update'],
                model:'payments', 
                col:4
            },


            {
                label: '% de comision', 
                name:'commision_value', 
                value:'', 
                type:'number',
                mask:'',
                display:['create','update'],
                model:'payments', 
                col:4
            },

            // {
            //     label: 'Pago de cuota',
            //     name:'result_payment',
            //     value:'',
            //     disabled: true,
            //     type:'number',
            //     mask:'',
            //     display:['create','update'],
            //     model:'payments',
            //     col:4
            // },


           

            {
                label: '', 
                name:'espace', 
                value:'',
                type:'br',
                mask:'',
                model:'paymentss',
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