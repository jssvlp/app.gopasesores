import React, { Component } from 'react'
import Datatable from '../../components/DataTable/Datatable'
import BodyContent from '../../components/bodyForm/contentBody'
import { inject,observer} from "mobx-react";
import Wizzard from '../../components/stepsWizzard/StepsWizzard'
import moment from 'moment';
import Modal from '../../components/Modal/Modal';
import ModalBranches from './modalBranches'
@inject('branches','users')
@observer
class branches extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            body:{
                branches:{
                    branches_code:"",
                },
            },
            errors:{
                branches:[],
            },
            branches_id:null,
            modalBranches:false,
            branch_id:null,
            create:false,
            update:false,
            seletectedItems:[],
            dateStart:moment().format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.saveBranches = this.saveBranches.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.updateBranch = this.updateBranch.bind(this);
        this.deleteBranches = this.deleteBranches.bind(this);
        this.setidBranch = this.setidBranch.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.openModalBranches = this.openModalBranches.bind(this);
        this.addComissions = this.addComissions.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.deleteInsurance = this.deleteInsurance.bind(this);
        this.openDetailComissions = this.openDetailComissions.bind(this);
    }

     componentDidMount(){
        const {branches} = this.props;
        branches.statusLoading(true);
         this.reloadTable();
         this.setState({
             errors:branches.fieldErrors
         })
         console.log('branches.fieldErrors', branches.fieldErrors)
        branches.statusLoading(false);

    }

    reloadTable(){
        const {branches} = this.props;
         branches.getAllBranches();
    }

    changePage(page){
        const {branches} = this.props
        branches.getAllBranches(page);
    }


    openModal(){
        this.setState({
            create: !this.state.create,
            update:false,
            body:{
                branches:[],
                update:false,
            },
        })
        
    }

   

   async setValue(name,value,modelName,mask = null){
        const {branches} = this.props
        let body = this.state.body;
        if(name ==='status' && this.state.branches_id){
           await branches.activeClicent(value==='branchese'?'activate':'deactivate', this.state.branches_id)
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

    async saveBranches(){
        const {branches} = this.props
        let body = this.state.body;
        const result = await branches.saveBranch(body);
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha creado el Ramo','Puede verificar en la lista el registrado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
        


    }


    async filterDate(date,name){
        const {branches} = this.props
        this.setState({
            [name]:date
        });
        let body = {
            filter_values:[
                this.state.dateStart,
                this.state.dateEnd,
            ]
        }
        await branches.filterbranches('created_at',1,body);


    }


    configurationsTable(data){
        const {branches} = this.props
        let fields = branches.fields.branches.fields
       
        for (const i in fields) {
            if(fields[i].name === 'commissions'){
                fields[i].delete = this.deleteInsurance;
               fields[i].create = this.openModalBranches;
               fields[i].openDetail = this.openDetailComissions;
           }
        }
        return data.map((item,i)=>{
            return [item.id,item.insurance,item.commission_percentage]
        })
    }


    async openDetailComissions(id){
        const {branches} = this.props
        const result = await branches.getComissionsToBranch(id);
        if(result.success){
            this.setState({
                modalBranches: !this.state.modalBranches,
                "isc_percent": result.commission.isc_percent,
                "commission_percentage": result.commission.commission_percentage,
                "insurance_id":result.commission.insurance_id,
                "multiple_beneficiaries" : result.commission.multiple_beneficiaries,
                "branch_id" : this.state.branches_id,
                commisions_id: result.commission.id,
                updateComissions:true
            })
        }
        console.log('result branch', result,id)
    }



    deleteInsurance(id){
        const {branches} = this.props;
        const result = branches.deleteInsuranceToBranch(id);
        this.openDetail(this.state.branches_id,true);
        return result;
    }

    async updateComissionsToBranch(body){
        const {branches} =this.props;
        const result = await branches.updateComissionsToBranch(this.state.commisions_id,body)
        if(result.success){
            this.props.alertMessage('Se ha actualizo el registro','Puede verificar en la lista el registrado','success')
            this.setState({
                modalBranches: false,
                updateComissions:false
            })
            this.openDetail(this.state.branches_id,true);
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
        console.log('body update', body)
    }


    async addComissions(){
        const {branches} = this.props
        let body = {
            "isc_percent": this.state.isc_percent,
            "commission_percentage": this.state.commission_percentage,
            "multiple_beneficiaries" : this.state.multiple_beneficiaries,
            "branch_id" : this.state.branches_id
        }
        let bodyUpdate = {
            "isc_percent": this.state.isc_percent,
            "commission_percentage": this.state.commission_percentage,
            "multiple_beneficiaries" : this.state.multiple_beneficiaries,
        }
        if(this.state.updateComissions) return this.updateComissionsToBranch(bodyUpdate)

        console.log('body', body)
        const result = await branches.saveToInsurance(this.state.insurance_id,body)
        if(result.data.success){
            this.props.alertMessage('Se ha creado el registro','Puede verificar en la lista el registrado','success')
            this.setState({
                modalBranches: false
            })
            this.openDetail(this.state.branches_id,true);
        }
        if(!result.data.success) this.props.alertMessage(result.data.message,'Favor verificar los datos','error')
        console.log('body', result)

    }
 

    

    async openDetail(id,reload = false){
        const {branches} = this.props;
        console.log('id', id)
       !reload&& this.props.alertLoading("Espere un momento....",true)
        await branches.getBranchById(id);
        
        delete branches.BranchByIdInfo.branch.updated_at
        delete branches.BranchByIdInfo.branch.created_at
        branches.BranchByIdInfo.branch.commissions = this.configurationsTable(branches.BranchByIdInfo.branch.commissions)
        console.log('branchesss', branches.BranchByIdInfo)
        console.log('branches.field.foie',  branches.fields.branches.fields)
        let body ={
            branches:branches.BranchByIdInfo.branch,
            branches_id:id
        }
        this.setState({
            body:body,
            create:true,
            update:true,
            branches_id:id
        })
        this.verifyErrors();
        !reload&&this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updateBranch(){
        const {branches} = this.props
        let body = this.state.body;
        const result = await branches.updateBranch(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el Ramo','Puede verificar en la lista el Ramo actualizado','success')
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

    async deleteBranches(){
        const {branches} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await branches.deleteBranchById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])
           
        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunas Ramos no se eliminaron',
                'los siguientes registros no se borraron: ' +allErrorsDelete.toString(),
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

    setidBranch(name,value){
        this.setState({
            [name]:value
        })
    }

    openModalBranches(){
        console.log('this.state', this.state)
        this.setState({
            modalBranches: !this.state.modalBranches
        })
    }

 
  
    render() {
        const {branches,users} = this.props
        
        console.log('this.state.type branches', this.state)
        const steps = [
            { 
                name:branches.fields.branches.title, 
                errors: this.state.errors.branches,
                component: <BodyContent 
                            fields={branches.fields.branches.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            errors={this.state.errors.branches}
                            alertMessage={this.props.alertMessage}
                            alertLoading={this.props.alertLoading}
                            showSteps={false}
                            view={this.state.update?'update':'create'}
                            method={this.state.update?this.updateBranch:this.saveBranches}
                            permissions={users.infoUser}
                            location={this.props.location}
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
                 title={this.state.update?'DETALLE DE EL RAMO': 'CREANDO UNA NUEVO RAMO'} 
                 />
                 )}
               
                {!this.state.create&&(
                    <Datatable
                    permissions={users.infoUser}
                    location={this.props.location}
                    thArray={branches.headers} 
                    tdArray={branches.getDataBranches}
                    loading={branches.loading}
                    selectedItem={this.selectedItem}
                    items={this.state.seletectedItems} 
                    deleteMethod={this.deleteBranches}
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
                    fields={this.state}
                    />
                }
                title="Asignar una nueva comision por aseguradora"
                alertMessage={this.props.alertMessage}  
                modalShow={this.state.modalBranches} 
                modalCreate={this.openModalBranches}
                saveMethod={this.state.insurance_id&&this.addComissions} 
                /> 

                
            </div>
        )
    }
}

export default branches
