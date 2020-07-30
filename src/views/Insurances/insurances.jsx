import React, { Component } from 'react'
import Datatable from '../../components/DataTable/Datatable'
import BodyContent from '../../components/bodyForm/contentBody'
import { inject,observer} from "mobx-react";
import Wizzard from '../../components/stepsWizzard/StepsWizzard'
import Modal from '../../components/Modal/Modal';
import ModalBranches from './modalBranches'
import moment from 'moment';
@inject('insurances','users')
@observer
class Insurances extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            body:{
                insurances:{
                    insurancee_code:"",
                },
            },
            errors:{
                insurances:[],
            },
            insurance_id:null,
            branch_id:null,
            create:false,
            update:false,
            modalBranches: false,
            seletectedItems:[],
            dateStart:moment().format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.saveInsurance = this.saveInsurance.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.updateInsurance = this.updateInsurance.bind(this);
        this.deleteInsurance = this.deleteInsurance.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.deleteBranch = this.deleteBranch.bind(this);
        this.setidBranch = this.setidBranch.bind(this);
        this.openModalBranches = this.openModalBranches.bind(this);
    }

     componentDidMount(){
        const {insurances} = this.props;
        insurances.statusLoading(true);
         this.reloadTable();
         this.setState({
             errors:insurances.fieldErrors
         })
         console.log('insurances.fieldErrors', insurances.fieldErrors)
        insurances.statusLoading(false);

    }

    reloadTable(){
        const {insurances} = this.props;
         insurances.getAllInsurances();
    }

    changePage(page){
        const {insurances} = this.props
        insurances.getAllInsurances(page);
    }


    openModal(){
        this.setState({
            create: !this.state.create,
            update:false,
            body:{
                insurances:[],
                update:false,
            },
        })
        
    }


    openModalBranches(){
        console.log('this.state', this.state)
        this.setState({
            modalBranches: !this.state.modalBranches
        })
    }

   

   async setValue(name,value,modelName,mask = null){
        const {insurances} = this.props
        let body = this.state.body;
        if(name ==='status' && this.state.insurance_id){
           await insurances.activeClicent(value==='insuranceee'?'activate':'deactivate', this.state.insurance_id)
        }
        if(modelName ===null&&body){
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

    async saveInsurance(){
        const {insurances} = this.props
        let body = this.state.body;
        const result = await insurances.saveInsurance(body);
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha creado la nueva aseguradora','Puede verificar en la lista la asgurada registrada','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
        


    }


    async filterDate(date,name){
        const {insurances} = this.props
        this.setState({
            [name]:date
        });
        let body = {
            filter_values:[
                this.state.dateStart,
                this.state.dateEnd,
            ]
        }
        await insurances.filterinsurancee('created_at',1,body);


    }


    configurationsTable(data){
        const {insurances} = this.props
        let fields = insurances.fields.insurances.fields
       
        for (const i in fields) {
            if(fields[i].name === 'branches'){
                fields[i].delete = null;
               fields[i].create = null;
           }
        }
        return data.map((item,i)=>{
            return [item.id,item.name,item.path]
        })
    }
    setidBranch(id){
        this.setState({
            branch_id:id
        })
    }


    deleteBranch(){

    }

 

    

    async openDetail(id){
        const {insurances} = this.props;
        console.log('id', id)
        this.props.alertLoading("Espere un momento....",true)
        await insurances.getInsuranceById(id);
        console.log('insurancesss', insurances.InsuranceByIdInfo)
        delete insurances.InsuranceByIdInfo.insurance.updated_at
        delete insurances.InsuranceByIdInfo.insurance.created_at
        insurances.InsuranceByIdInfo.insurance.branches = this.configurationsTable(insurances.InsuranceByIdInfo.insurance.branches)
        console.log('insurances.field.foie',  insurances.InsuranceByIdInfo.insurance)
        let body ={
            insurances:insurances.InsuranceByIdInfo.insurance,
            insurance_id:id
        }
        this.setState({
            body:body,
            create:true,
            update:true,
            insurance_id:id
        })
        this.verifyErrors();
        this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updateInsurance(){
        const {insurances} = this.props
        let body = this.state.body;
        const result = await insurances.updateInsurance(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el insurance','Puede verificar en la lista el insurance actualizado','success')
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

    async deleteInsurance(){
        const {insurances} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await insurances.deleteInsuranceById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])
           
        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos insurances no se eliminaron',
                'los siguientes insurances no se borraron: ' +allErrorsDelete.toString(),
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
        const {insurances,users} = this.props
        
        console.log('this.state.type insurancee', this.state)
        const steps = [
            { 
                name:insurances.fields.insurances.title, 
                errors: this.state.errors.insurances,
                component: <BodyContent 
                            fields={insurances.fields.insurances.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            errors={this.state.errors.insurances}
                            alertMessage={this.props.alertMessage}
                            alertLoading={this.props.alertLoading}
                            showSteps={false}
                            view={this.state.update?'update':'create'}
                            permissions={users.infoUser}
                            location={this.props.location}
                            method={this.state.update?this.updateInsurance:this.saveInsurance}
                            buttonName={this.state.update?"Actualizar":"Guardar"}
                            /> 
            },
            
          ];
        return (
            <div className={!this.state.create?"main-content":""}>
             {this.state.create&&(
                 <Wizzard 
                 steps={steps} 
                 showNavigation={false}
                 showSteps={false}
                 stepsNavigation={false}
                 closeWizard={this.closeWizard} 
                 subtitle={ ""}
                 title={this.state.update?'DETALLE DE LA ASEGURADORA': 'CREANDO UNA NUEVA ASEGURADORA'} 
                 />
                 )}
               
                {!this.state.create&&(
                    <Datatable
                    permissions={users.infoUser}
                    location={this.props.location}
                    thArray={insurances.headers} 
                    tdArray={insurances.getDataInsurances}
                    loading={insurances.loading}
                    selectedItem={this.selectedItem}
                    items={this.state.seletectedItems} 
                    deleteMethod={this.deleteInsurance}
                    changePage={this.changePage}
                    create={this.openModal}
                    openDetail={this.openDetail}
                    titleBtn={"Nuevo"}
                    />
                )}

                <Modal 
                body={
                    <ModalBranches
                    onChange={this.setidBranch} 
                    />
                }
                title="Asignar un nuevo permiso"
                alertMessage={this.props.alertMessage}  
                modalShow={this.state.modalBranches} 
                modalCreate={this.openModalBranches}
                saveMethod={this.state.branch_id&&this.addPermissions} 
                /> 

                
            </div>
        )
    }
}

export default Insurances
