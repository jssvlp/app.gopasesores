import React, { Component } from 'react'
import Datatable from '../../components/DataTable/Datatable'
import BodyContent from '../../components/bodyForm/contentBody'
import { inject,observer} from "mobx-react";
import Wizzard from '../../components/stepsWizzard/StepsWizzard'
import moment from 'moment';
@inject('payments','users')
@observer
class payments extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            body:{
                payments:{
                    payment_code:"",
                },     
                documents: [],
            },
            idPayment:0,
            errors:{
                payments:[],
                documents: [],
            },
            payment_id:null,
            create:false,
            update:false,
            seletectedItems:[],
            dateStart:moment().format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.savepayment = this.savePayment.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.updatepayment = this.updatePayment.bind(this);
        this.deletepayment = this.deletePayment.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.showPolices = this.showPolices.bind(this);
    }

     componentDidMount(){
        const {payments} = this.props;
        payments.statusLoading(true);
        let idPolicy = localStorage.getItem("idPolicy");
        let prime = localStorage.getItem("prime");
        console.log('policiiii',idPolicy);
        if(idPolicy){
           this.reloadTable(idPolicy);
            this.setState({
                errors:payments.fieldErrors,
                idPolicy:idPolicy,
                prime:prime

                })
        }
        payments.statusLoading(false);

    }
    componentWillReceiveProps(props,states){
        console.log('policiiii',props);
    }
    componentDidUpdate(){
        console.log('this.state $%^$%#$%:>> ', this.state);
    }
    

    reloadTable(idPayment){
        const {payments} = this.props;
         payments.getPaymentsBypolicy(idPayment);
    }

    changePage(page){
        const {payments} = this.props
        payments.getAllPayments(page);
    }


    openModal(id){
        let prime = localStorage.getItem("prime")
        this.setState({
            create: !this.state.create,
            body:{
                payments:{
                    prime: prime
                },  
                documents: [],
                update:false,
            },
        })
        this.setValue("prime",prime,"payments")
        
    }

   

   async setValue(name,value,modelName,mask = null){
        const {payments} = this.props
        let body = this.state.body;
        if(name ==='status' && this.state.payment_id){
           await payments.activeClicent(value==='paymente'?'activate':'deactivate', this.state.payment_id)
        }
        if(modelName ===null && body){
            body[name] =value
            this.setState({body:body,errors:this.setErrors(name,value,modelName,mask)})
            return
        }
        
        let model = body[modelName]
        console.log('model', modelName,name)
        model[name] = value
        body[modelName] = model
        this.setState({body:body,errors:this.setErrors(name,value,modelName,mask)})
    }

    setErrors(name,value,model,mask){
        let errorsArray = this.state.errors
        let errors = [];
        
        if(model) errors = errorsArray[model];
        if(!model) errors = errorsArray;
        
        

        if(mask) !value.endsWith('_')? errors[name] = false : errors[name] = true
        if(!mask) value? errors[name] = false: errors[name] = true;

        model?errorsArray[model] = errors : errorsArray = errors 
        //console.log('errors', errorsArray)
        return errorsArray;
    }

    verifyErrors(){
        let body = this.state.body;
        let errors = this.state.errors
        for (const i in body) {
           let value = body[i];
           
           if(typeof value==='object'){
            
               for (const key in value) {
                   let model = errors[i]
                    value&&(model[key] = false)
               }
               continue;
           }
           if(typeof value==='string'){
            value&&(errors[i] = false)
        }
           
        }
    }

    async savePayment(){
        const {payments} = this.props
        let body = this.state.body;
        body.payments.policy_id = this.state.idPolicy;
        console.log('body :>> ', body);
        const result = await payments.savePayment(body);
        console.log('result!!!!', result)
        if(result.success){
            this.props.alertMessage('Se ha creado el Pago','Puede verificar en la lista el nuevo Pago registrado','success')
            this.setState({
                create: false
            })
            this.reloadTable(this.state.idPolicy);
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
        


    }


    async filterDate(date,name){
        const {payments} = this.props
        this.setState({
            [name]:date
        });
        let body = {
            filter_values:[
                this.state.dateStart,
                this.state.dateEnd,
            ]
        }
        await payments.filterPayment('created_at',1,body);


    }


    async openDetail(id){
        const {payments} = this.props;
        console.log('id', id)
        this.props.alertLoading("Espere un momento....",true)
        await payments.getPaymentById(id);
        console.log('paymentsss', payments.paymentByIdInfo)
        delete payments.paymentByIdInfo.payment.updated_at
        delete payments.paymentByIdInfo.payment.created_at
        
        let body ={
            payments:payments.paymentByIdInfo.payment,
            payment_id:id,
            documents:payments.paymentByIdInfo.payment.documents
        }
        this.setState({
            body:body,
            create:true,
            update:true,
            documents: [],
            payment_id:id
        })
        this.verifyErrors();
        this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updatePayment(){
        const {payments} = this.props
        let body = this.state.body;
        const result = await payments.updatePayment(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el Pago','Puede verificar en la lista el Pago actualizado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
    }


    selectedItem(id,checkbox){
        let items = this.state.seletectedItems;
        console.log('checkbox.target.checked', checkbox.target.checked)
        checkbox.target.checked?items.push(id) : items = items.filter(e=>e !==id);
        this.setState({
            seletectedItems:items
        })
    }

    async deletePayment(){
        const {payments} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await payments.deletePaymentById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])
           
        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos Pagos no se eliminaron',
                'los siguientes Pagos no se borraron: ' +allErrorsDelete.toString(),
                'error'
                )
        }

        if(allErrorsDelete.length===0){
            this.props.alertMessage(
                'Se elimino correctamente',
                'Puede verificar en la lista de registros ',
                'success'
                )
        }
        this.reloadTable();
        this.setState({
            seletectedItems:[]
        })

    }

    showPolices(id){
        alert("lalo: "+id)
    }

 
  
    render() {
        const {payments,users} = this.props
        
        console.log('this.state PAYMENT',  payments.isExistPayments)
        const steps = [
            { 
                name:payments.fields.payments.title, 
                errors: this.state.errors.payments,
                component: <BodyContent 
                            fields={payments.fields.payments.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            rules={payments.fields.payments.rules}
                            errors={this.state.errors.payments}
                            alertMessage={this.props.alertMessage}
                            showSteps={false}
                            view={this.state.update?'update':'create'}
                            method={this.state.update?this.updatepayment:this.savepayment}
                            buttonName={this.state.update?"Actualizar":"Guardar"}
                            />
            },
            
          ];
          console.log(`payments.AllListPayment!!!!`, payments.AllListPayment)
        return (
            <div className={!this.state.create?"main-content":""}>
             {this.state.create&&(
                 <Wizzard 
                 steps={steps}
                 closeWizard={this.closeWizard} 
                 subtitle={ ""}
                 title={this.state.update?'DETALLE DEL PAGO': 'CREANDO UN NUEVO  PAGO'} 
                 />
                 )}
               
                {!this.state.create&&(
                    <Datatable
                    permissions={users.infoUser}
                    location={this.props.location}
                    buttonAction={this.showPolices}
                    thArray={payments.headers} 
                    tdArray={{data:payments.AllListPayment}}
                    loading={payments.loading}
                    selectedItem={this.selectedItem}
                    items={this.state.seletectedItems} 
                    deleteMethod={this.deletepayment}
                    changePage={this.changePage}
                    create={payments.isExistPayments?null:this.openModal}
                    openDetail={this.openDetail}
                    titleBtn={"Nuevo"}
                    />
                )}


                
            </div>
        )
    }
}

export default payments
