import React, { Component } from 'react'
import Datatable from '../../components/DataTable/Datatable'
import BodyContent from '../../components/bodyForm/contentBody'
import { inject,observer} from "mobx-react";
import Wizzard from '../../components/stepsWizzard/StepsWizzard'
import moment from 'moment';
@inject('permissions','users')
@observer
class permissions extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            body:{
                permissions:{
                    permission_code:"",
                },
            },
            errors:{
                permissions:[],
            },
            permission_id:null,
            create:false,
            update:false,
            seletectedItems:[],
            dateStart:moment().format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.savePermission = this.savePermission.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.updatePermission = this.updatePermission.bind(this);
        this.deletePermission = this.deletePermission.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.filterDate = this.filterDate.bind(this);
    }

     componentDidMount(){
        const {permissions} = this.props;
        permissions.statusLoading(true);
         this.reloadTable();
         this.setState({
             errors:permissions.fieldErrors
         })
         console.log('permissions.fieldErrors', permissions.fieldErrors)
        permissions.statusLoading(false);

    }

    reloadTable(){
        const {permissions} = this.props;
         permissions.getAllPermissions();
    }

    changePage(page){
        const {permissions} = this.props
        permissions.getAllPermissions(page);
    }


    openModal(){
        this.setState({
            create: !this.state.create,
            body:{
                permissions:[],
                update:false,
            },
        })
        
    }

   

   async setValue(name,value,modelName,mask = null){
        const {permissions} = this.props
        let body = this.state.body;
        if(name ==='status' && this.state.permission_id){
           await permissions.activeClicent(value==='permissione'?'activate':'deactivate', this.state.permission_id)
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

    async savePermission(){
        const {permissions} = this.props
        let body = this.state.body;
        const result = await permissions.savePermission(body);
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha creado el Permiso','Puede verificar en la lista el nuevo Permiso registrado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
        


    }


    async filterDate(date,name){
        const {permissions} = this.props
        this.setState({
            [name]:date
        });
        let body = {
            filter_values:[
                this.state.dateStart,
                this.state.dateEnd,
            ]
        }
        await permissions.filterpermission('created_at',1,body);


    }


    async openDetail(id){
        const {permissions} = this.props;
        console.log('id', id)
        this.props.alertLoading("Espere un momento....",true)
        await permissions.getPermissionById(id);
        console.log('permissionsss', permissions.PermissionByIdInfo)
        delete permissions.PermissionByIdInfo.permission.updated_at
        delete permissions.PermissionByIdInfo.permission.created_at
        
        let body ={
            permissions:permissions.PermissionByIdInfo.permission,
            permission_id:id
        }
        this.setState({
            body:body,
            create:true,
            update:true,
            permission_id:id
        })
        this.verifyErrors();
        this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updatePermission(){
        const {permissions} = this.props
        let body = this.state.body;
        const result = await permissions.updatePermission(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el Permiso','Puede verificar en la lista el Permiso actualizado','success')
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

    async deletePermission(){
        const {permissions} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await permissions.deletePermissionById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])
           
        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos Permisos no se eliminaron',
                'los siguientes Permisos no se borraron: ' +allErrorsDelete.toString(),
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
        const {permissions,users} = this.props
        
        console.log('this.state.type permission', this.state)
        const steps = [
            { 
                name:permissions.fields.permissions.title, 
                errors: this.state.errors.permissions,
                component: <BodyContent 
                            fields={permissions.fields.permissions.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            errors={this.state.errors.permissions}
                            alertMessage={this.props.alertMessage}
                            showSteps={false}
                            view={this.state.update?'update':'create'}
                            method={this.state.update?this.updatePermission:this.savePermission}
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
                 title={this.state.update?'DETALLE DEL PERMISO': 'CREANDO UN NUEVO  PERMISO'} 
                 />
                 )}
               
                {!this.state.create&&(
                    <Datatable
                    permissions={users.infoUser}
                    location={this.props.location}
                    thArray={permissions.headers} 
                    tdArray={permissions.getDataPermissions}
                    loading={permissions.loading}
                    selectedItem={this.selectedItem}
                    items={this.state.seletectedItems} 
                    deleteMethod={this.deletePermission}
                    changePage={this.changePage}
                    create={this.openModal}
                    openDetail={this.openDetail}
                    titleBtn={"Nuevo"}
                    />
                )}


                
            </div>
        )
    }
}

export default permissions
