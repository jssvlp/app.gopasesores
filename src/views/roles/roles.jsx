import React, { Component } from 'react'
import Datatable from '../../components/DataTable/Datatable'
import BodyContent from '../../components/bodyForm/contentBody'
import { inject,observer} from "mobx-react";
import Wizzard from '../../components/stepsWizzard/StepsWizzard'
import Modal from '../../components/Modal/Modal';
import ModalPermissions from './ModalPermissions'
import moment from 'moment';
@inject('roles','users')
@observer
class Roles extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            body:{
                roles:{
                    role_code:"",
                },
            },
            errors:{
                roles:[],
            },
            role_id:null,
            create:false,
            update:false,
            id_permissions:null,
            seletectedItems:[],
            modalPermission:false,
            dateStart:moment().format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.saveRole = this.saveRole.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.updaterole = this.updaterole.bind(this);
        this.deleterole = this.deleterole.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.openModalPermissions = this.openModalPermissions.bind(this);
        this.addPermissions = this.addPermissions.bind(this);
        this.deletePermissons = this.deletePermissons.bind(this);
        this.setIdPermissons = this.setIdPermissons.bind(this);
    }

     componentDidMount(){
        const {roles} = this.props;
        roles.statusLoading(true);
         this.reloadTable();
         this.setState({
             errors:roles.fieldErrors
         })
         console.log('roles.fieldErrors', roles.fieldErrors)
        roles.statusLoading(false);

    }

    reloadTable(){
        const {roles} = this.props;
         roles.getAllRoles();
    }

    changePage(page){
        const {roles} = this.props
        roles.getAllRoles(page);
    }


    openModal(){
        this.setState({
            create: !this.state.create,
            update:false,
            body:{
                roles:[],
                update:false,
            },
        })
        
    }

   

   async setValue(name,value,modelName,mask = null){
        const {roles} = this.props
        let body = this.state.body;
        if(name ==='status' && this.state.role_id){
           await roles.activeClicent(value==='rolee'?'activate':'deactivate', this.state.role_id)
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

    async saveRole(){
        const {roles} = this.props
        let body = this.state.body;
        const result = await roles.saveRole(body);
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha creado el Rol','Puede verificar en la lista el nuevo Rol registrado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
        


    }


    async filterDate(date,name){
        const {roles} = this.props
        this.setState({
            [name]:date
        });
        let body = {
            filter_values:[
                this.state.dateStart,
                this.state.dateEnd,
            ]
        }
        await roles.filterrole('created_at',1,body);


    }


    configurationsTable(data){
        const {roles} = this.props
        let fields = roles.fields.roles.fields
       
        for (const i in fields) {
           if(fields[i].name === 'permissions'){
                fields[i].delete = this.deletePermissons;
               fields[i].create = this.openModalPermissions;
           }
        }
        return data.map((item,i)=>{
            return [item.id,item.name,item.path]
        })
    }

    openModalPermissions(){
        this.setState({
            modalPermission: !this.state.modalPermission,
            body:{
                permissions:[],
            },
        })
        
    }

    setIdPermissons(id){
        this.setState({
            id_permissions:id
        })
    }

   

    async addPermissions(){
        const {roles} = this.props
        const result = await roles.addPermissions(this.state.role_id,this.state.id_permissions)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se agrego el permiso','Puede verificar en la lista el nuevo permiso registrado','success')
            this.setState({
                modalPermission: !this.state.modalPermission,
            })
            await this.reloadPermissionsTable(roles,this.state.role_id)
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')

    }

    async deletePermissons(id_permissions){
        const {roles} = this.props
        const result = await roles.deletePermissions(this.state.role_id,id_permissions)
        await this.reloadPermissionsTable(roles,this.state.role_id)
        return result
    }


    async reloadPermissionsTable(roles,id){
        await roles.getRoleById(id);
        console.log('Rolesss', roles.roleByIdInfo)
        delete roles.roleByIdInfo.rol.updated_at
        delete roles.roleByIdInfo.rol.created_at
        roles.roleByIdInfo.rol.permissions = this.configurationsTable(roles.roleByIdInfo.rol.permissions)
        console.log('roles.field.foie',  roles.fields.roles.fields)
        let body ={
            roles:roles.roleByIdInfo.rol,
            role_id:id
        }
        this.setState({
            body:body,
            update:true,
            role_id:id
        })
        this.verifyErrors();
        window.location.reload();
      //  this.props.alertLoading("Espere un momento....",false)

    }


    async openDetail(id){
        const {roles} = this.props;
        console.log('id', id)
        this.props.alertLoading("Espere un momento....",true)
        await roles.getRoleById(id);
        console.log('Rolesss', roles.roleByIdInfo)
        delete roles.roleByIdInfo.rol.updated_at
        delete roles.roleByIdInfo.rol.created_at
        roles.roleByIdInfo.rol.permissions = this.configurationsTable(roles.roleByIdInfo.rol.permissions)
        console.log('roles.field.foie',  roles.fields.roles.fields)
        let body ={
            roles:roles.roleByIdInfo.rol,
            role_id:id
        }
        this.setState({
            body:body,
            create:true,
            update:true,
            role_id:id
        })
        this.verifyErrors();
        this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updaterole(){
        const {roles} = this.props
        let body = this.state.body;
        const result = await roles.updateRole(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el Rol','Puede verificar en la lista el Rol actualizado','success')
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

    async deleterole(){
        const {roles} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await roles.deleteRoleById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])
           
        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos Rols no se eliminaron',
                'los siguientes Rols no se borraron: ' +allErrorsDelete.toString(),
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
        const {roles,users} = this.props
        
        console.log('this.state.type role', this.state)
        const steps = [
            { 
                name:roles.fields.roles.title, 
                errors: this.state.errors.roles,
                component: <BodyContent 
                            fields={roles.fields.roles.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            errors={this.state.errors.roles}
                            alertMessage={this.props.alertMessage}
                            alertLoading={this.props.alertLoading}
                            showSteps={false}
                            permissions={users.infoUser}
                            location={this.props.location}
                            view={this.state.update?'update':'create'}
                            method={this.state.update?this.updaterole:this.saveRole}
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
                 title={this.state.update?'DETALLE DEL ROL': 'CREANDO UN NUEVO  ROL'} 
                 />
                 )}
               
                {!this.state.create&&(
                    <Datatable
                    permissions={users.infoUser}
                    location={this.props.location}
                    thArray={roles.headers} 
                    tdArray={roles.getDataRoles}
                    loading={roles.loading}
                    selectedItem={this.selectedItem}
                    items={this.state.seletectedItems} 
                    deleteMethod={this.deleterole}
                    changePage={this.changePage}
                    create={this.openModal}
                    openDetail={this.openDetail}
                    titleBtn={"Nuevo"}
                    />
                )}
                <Modal 
                body={
                    <ModalPermissions
                    onChange={this.setIdPermissons} 
                    />
                }
                title="Asignar un nuevo permiso"
                alertMessage={this.props.alertMessage}  
                modalShow={this.state.modalPermission} 
                modalCreate={this.openModalPermissions}
                saveMethod={this.state.id_permissions&&this.addPermissions} 
                /> 

                
            </div>
        )
    }
}

export default Roles
