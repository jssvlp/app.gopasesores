import React, { Component } from 'react'
import Datatable from '../../components/DataTable/Datatable'
import Modal from '../../components/Modal/Modal'
import ClientBody from './clientBody'
import { inject,observer} from "mobx-react";
import Wizzard from '../../components/stepsWizzard/StepsWizzard'
import Wind from '../Forms/Wizard/Wizard';
import Step1 from '../Forms/Wizard/Step1'
import Skeleton from "react-loading-skeleton";

@inject('clients')
@observer
class clients extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            body:{
                people:{
                    client_code:"",
                },
                user:[],
                company:[],
                contact_info:{
                    province_of_birth:"",
                    city:""
                },
                comment:"",
                authorize_data_processing:false
            },
            errors:{
                people:[],
                user:[],
                contact_info:[],
                company:[]
            },
            create:false,
            update:false,
            seletectedItems:[],
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.saveClient = this.saveClient.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.updateClient = this.updateClient.bind(this);
        this.deleteClient = this.deleteClient.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
    }

     componentDidMount(){
        const {clients} = this.props;
        clients.statusLoading(true);
         this.reloadTable();
         this.setState({
             errors:clients.fieldErrors
         })
        clients.statusLoading(false);

    }

    reloadTable(){
        const {clients} = this.props;
         clients.getAllClients();
    }

    changePage(page){
        const {clients} = this.props
        clients.getAllClients(page);
    }


    openDialog(){
        this.props.htmlAlert(
            'Seleccionar el tipo de cliente',
            this.openModal,
            )
    }

    openModal(type){
        const {clients} = this.props

        this.setValue("type",type,null)
        clients.changeClient(type)

        this.setState({
            create: !this.state.create,
            body:{
                people:clients.getTypeClient === "people"?{ client_code:""}:null,
                company:clients.getTypeClient === "company"?{ client_code:""}:null,
                user:[],
                contact_info:[],
                comment:"",
                authorize_data_processing:false,
                update:false,
                type:type
            },
        })
        
    }

   

    setValue(name,value,modelName,mask = null){
        let body = this.state.body;

        if(modelName ===null&&body){
            body[name] =value
            this.setState({body:body,errors:this.setErrors(name,value,modelName,mask)})
            return
        }
        
        let model = body[modelName]
        console.log('model', modelName)
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
                   console.log('i', key,value)
                    value&&(model[key] = false)
               }
               continue;
           }
           if(typeof value==='string'){
            if(i==="type" && value==="people") errors['company'] = []
            if(i==="type" && value==="company") errors['people'] = []
            value&&(errors[i] = false)
        }
           
        }
    }

    async saveClient(){
        const {clients} = this.props
        let body = this.state.body;
        const result = await clients.saveClient(body);
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha creado el cliente','Puede verificar en la lista el nuevo cliente registrado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
        


    }


    async openDetail(id){
        const {clients} = this.props;
        console.log('id', id)
        this.props.alertLoading("Espere un momento....",true)
        await clients.getClientById(id);

        let type = clients.clientByIdInfo.people? 'people':'company'
        delete clients.clientByIdInfo[type].updated_at
        delete clients.clientByIdInfo[type].created_at
        delete clients.clientByIdInfo.user.updated_at
        delete clients.clientByIdInfo.user.created_at
        clients.clientByIdInfo.contact&& delete clients.clientByIdInfo.contact.updated_at
        clients.clientByIdInfo.contact&& delete clients.clientByIdInfo.contact.created_at
        clients.clientByIdInfo.user.password = ""
        this.state.errors['user']['password'] = false
        console.log('object', clients.clientByIdInfo.contact)
        let body ={
            type:type,
            people:clients.clientByIdInfo.people,
            company: clients.clientByIdInfo.company? clients.clientByIdInfo.company:[],
            contact_info:clients.clientByIdInfo.contact?clients.clientByIdInfo.contact:[],
            user: clients.clientByIdInfo.user?clients.clientByIdInfo.user:[],
            comment: clients.clientByIdInfo.comment?clients.clientByIdInfo.comment:"",
            authorize_data_processing:clients.clientByIdInfo.authorize_data_processing ===1?true:false,
            client_id:id
        }
        this.setState({
            body:body,
            create:true,
            update:true
        })
        clients.changeClient(type)
        this.verifyErrors();
        this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updateClient(){
        const {clients} = this.props
        let body = this.state.body;
        const result = await clients.updateClient(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el cliente','Puede verificar en la lista el cliente actualizado','success')
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

    async deleteClient(){
        const {clients} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await clients.deleteClientById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])
           
        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos clientes no se eliminaron',
                'los siguientes clientes no se borraron: ' +allErrorsDelete.toString(),
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

 
  
    render() {
        const {clients} = this.props
        
        console.log('this.state.type', this.state)
        const steps = [
            { 
                name: clients.getTypeClient ==="people"? clients.fields.people.title:clients.fields.company.title, 
                errors:clients.getTypeClient ==="people"? this.state.errors.people:this.state.errors.company ,
                component: <ClientBody 
                            fields={clients.getTypeClient ==="people"?clients.fields.people.fields:clients.fields.company.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            errors={clients.getTypeClient ==="people"? this.state.errors.people:this.state.errors.company}
                            alertMessage={this.props.alertMessage}
                            
                            method={this.state.update&&this.updateClient}
                            buttonName={"Actualizar"} 
                            /> 
            },
            
            { 
                name:  clients.fields.contact_info.title, 
                errors:this.state.errors.contact_info,
                component: <ClientBody 
                            fields={clients.fields.contact_info.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            errors={this.state.errors.contact_info}
                            alertMessage={this.props.alertMessage} 
                            method={this.state.update&&this.updateClient}
                            buttonName={"Actualizar"} 
                            /> 
            },
            { 
                name: clients.fields.user.title, 
                errors:this.state.errors.user,
                component: <ClientBody 
                            fields={clients.fields.user.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            errors={this.state.errors.user}
                            alertMessage={this.props.alertMessage} 
                            method={this.state.update?this.updateClient:this.saveClient}
                            buttonName={this.state.update?"Actualizar":"Guardar"}
                            /> 
            }
          ];
        return (
            <div className={!this.state.create?"main-content":""}>
             {this.state.create&&(
                 <Wizzard 
                 steps={steps} 
                 closeWizard={this.closeWizard} 
                 subtitle={ clients.getTypeClient ==="people"?"El cliente que esta creando es tipo persona":" El cliente que esta creando es tipo empresa"}
                 title={this.state.update?'DETALLE DEL CLIENTE': 'CREANDO UN NUEVO  CLIENTE'} 
                 />
                 )}
               
                {!this.state.create&&(
                    <Datatable
                    thArray={clients.headers} 
                    tdArray={clients.getDataClients}
                    loading={clients.loading}
                    selectedItem={this.selectedItem}
                    items={this.state.seletectedItems} 
                    deleteMethod={this.deleteClient}
                    title={"Clientes"}
                    changePage={this.changePage}
                    create={this.openDialog}
                    openDetail={this.openDetail}
                    searchFilter={()=>{}}
                    changeFilterValue={()=>{}}
                    filterDataSelect={()=>{}}
                    titleBtn={"Nuevo"}
                    />
                )}








{/* <Modal 
                body={
                    <ClientBody 
                    fields={clients.fields} 
                    fieldValues={this.state.body} 
                    setValue={this.setValue}
                    errors={this.state.errors}
                    />
                }
                title="Crear un nuevo Cliente de Empresa"
                alertMessage={this.props.alertMessage}  
                modalShow={this.state.modal} 
                modalCreate={this.openModal}
                errors={this.state.errors} 
                saveMethod={this.saveClient} 
                /> */}
                
            </div>
        )
    }
}

export default clients