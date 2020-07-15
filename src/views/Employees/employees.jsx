import React, { Component } from 'react'
import Datatable from '../../components/DataTable/Datatable'
import BodyContent from '../../components/bodyForm/contentBody'
import { inject,observer} from "mobx-react";
import Wizzard from '../../components/stepsWizzard/StepsWizzard'
import moment from 'moment';
@inject('employees')
@observer
class Employees extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            body:{
                employee:{
                    Employee_code:"",
                },
                user:[],
            },
            errors:{
                employee:[],
                user:[],
            },
            Employee_id:null,
            create:false,
            update:false,
            seletectedItems:[],
            dateStart:moment().format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.saveEmployee = this.saveEmployee.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.updateEmployee = this.updateEmployee.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.filterDate = this.filterDate.bind(this);
    }

     componentDidMount(){
        const {employees} = this.props;
        employees.statusLoading(true);
         this.reloadTable();
         this.setState({
             errors:employees.fieldErrors
         })
        employees.statusLoading(false);

    }

    reloadTable(){
        const {employees} = this.props;
         employees.getAllEmployees();
    }

    changePage(page){
        const {employees} = this.props
        employees.getAllEmployees(page);
    }


    openModal(){
        this.setState({
            create: !this.state.create,
            body:{
                employee:[],
                user:[],
                update:false,
            },
        })
        
    }

   

   async setValue(name,value,modelName,mask = null){
        const {employees} = this.props
        let body = this.state.body;
        if(name ==='status' && this.state.Employee_id){
           await employees.activeClicent(value==='Employeee'?'activate':'deactivate', this.state.Employee_id)
        }
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
                    value&&(model[key] = false)
               }
               continue;
           }
           if(typeof value==='string'){
            value&&(errors[i] = false)
        }
           
        }
    }

    async saveEmployee(){
        const {employees} = this.props
        let body = this.state.body;
        const result = await employees.saveEmployee(body);
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha creado el Empleado','Puede verificar en la lista el nuevo empleado registrado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
        


    }


    async filterDate(date,name){
        const {employees} = this.props
        this.setState({
            [name]:date
        });
        let body = {
            filter_values:[
                this.state.dateStart,
                this.state.dateEnd,
            ]
        }
        await employees.filterEmployee('created_at',1,body);


    }


    async openDetail(id){
        const {employees} = this.props;
        console.log('id', id)
        this.props.alertLoading("Espere un momento....",true)
        await employees.getEmployeeById(id);
        console.log('Employeesss', employees.EmployeeByIdInfo)
        delete employees.EmployeeByIdInfo.employee.updated_at
        delete employees.EmployeeByIdInfo.employee.created_at
        delete employees.EmployeeByIdInfo.employee.user.updated_at
        delete employees.EmployeeByIdInfo.employee.user.created_at
        employees.EmployeeByIdInfo.employee.user.password = ""
        this.state.errors['user']['password'] = false
        

        let body ={
            employee:employees.EmployeeByIdInfo.employee,
            user: employees.EmployeeByIdInfo.employee.user?employees.EmployeeByIdInfo.employee.user:[],
            Employee_id:id
        }
        this.setState({
            body:body,
            create:true,
            update:true,
            Employee_id:id
        })
        this.verifyErrors();
        this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updateEmployee(){
        const {employees} = this.props
        let body = this.state.body;
        const result = await employees.updateEmployee(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el Empleado','Puede verificar en la lista el Empleado actualizado','success')
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

    async deleteEmployee(){
        const {employees} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await employees.deleteEmployeeById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])
           
        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos Empleados no se eliminaron',
                'los siguientes Empleados no se borraron: ' +allErrorsDelete.toString(),
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
        const {employees} = this.props
        
        console.log('this.state.type employee', employees.fields.user)
        const steps = [
            { 
                name:employees.fields.employee.title, 
                errors: this.state.errors.employee,
                component: <BodyContent 
                            fields={employees.fields.employee.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            errors={this.state.errors.employee}
                            alertMessage={this.props.alertMessage}
                            view={this.state.update?'update':'create'}
                            method={this.state.update&&this.updateEmployee}
                            buttonName={"Actualizar"} 
                            /> 
            },
            { 
                name: employees.fields.user.title, 
                errors:this.state.errors.user,
                component: <BodyContent 
                            fields={employees.fields.user.fields} 
                            fieldValues={this.state.body} 
                            setValue={this.setValue}
                            view={this.state.update?'update':'create'}
                            errors={this.state.errors.user}
                            alertMessage={this.props.alertMessage} 
                            method={this.state.update?this.updateEmployee:this.saveEmployee}
                            buttonName={this.state.update?"Actualizar":"Guardar"}
                            /> 
            },
            
          ];
        return (
            <div className={!this.state.create?"main-content":""}>
             {this.state.create&&(
                 <Wizzard 
                 steps={steps} 
                 closeWizard={this.closeWizard} 
                 subtitle={ ""}
                 title={this.state.update?'DETALLE DEL EMPLEADO': 'CREANDO UN NUEVO  EMPELADO'} 
                 />
                 )}
               
                {!this.state.create&&(
                    <Datatable
                    thArray={employees.headers} 
                    tdArray={employees.getDataEmployees}
                    loading={employees.loading}
                    selectedItem={this.selectedItem}
                    items={this.state.seletectedItems} 
                    deleteMethod={this.deleteEmployee}
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

export default Employees
