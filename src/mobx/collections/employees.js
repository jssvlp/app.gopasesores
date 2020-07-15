import { observable, computed } from "mobx";
import React, { Component } from "react";
import { Employees } from "../../services/index";
import {EmployeesForm} from '../../jsonForms/index'
import Switch from "react-bootstrap-switch";

    class EmployeeController  extends Component  {

    @observable load = true
    @observable fieldErrors = EmployeesForm.fieldErrors;
    @observable headers = EmployeesForm.headers;
    @observable fields = EmployeesForm.fieldsPages;
    @observable Employees = []
    @observable EmployeeById = []
    @observable allUsers = []
    @observable isActive = false
    @observable typeEmployee = "people"


    @computed
    get modelEmployees(){
        return  this.model;

    }


    @computed
    get getDataEmployees(){
        return this.Employees;
    }

    @computed
    get EmployeeByIdInfo(){
        return this.EmployeeById;
    }

    @computed
    get loading(){
        return this.load;
    }

    @computed
    get getTypeEmployee(){
        return this.typeEmployee;
    }
    

     statusLoading(status){
        this.load = status;
    }


    changeEmployee(type){
        this.typeEmployee = type;
    }


   


    async  getPositions() {
        const result = await Employees.getPosition();
        let positions = result.data.positions
        let array = []
        for (const i in positions) {
            array.push({label: positions[i].description,value:positions[i].id})
        }
        return array;
    }

    async initValues(){
        const fields = this.fields.employee.fields;
        const positions = await this.getPositions();

        for (const i in fields) {
            if(fields[i].name ==='position_id'){
                fields[i].value = positions;
            }
        }

    }

    async getEmployeeById(id){
        const result = await Employees.getEmployeesById(id);
        if(result.data.success && result.status ===200) this.EmployeeById = result.data
        if(!result.data.success || result.status !==200) this.EmployeeById = []
        console.log('result', result);
    }

    async deleteEmployeeById(id){
        const result = await Employees.deleteEmployee(id);
        return result.data
    }


    async getAllEmployees(page){
        this.initValues()
        const result = await Employees.getEmployees(page||1);

        if(result.status === 200 && result.data){
            let data = result.data.data;
            let json = [];
            
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].first_name, 
                    data[i].last_name,
                    data[i].position_id, 
                    data[i].type, 
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.Employees =  result.data
            console.log('this.Employees', result.data)

        }else{
            this.Employees = []
        }
    }
    
    async activeClicent(isActive,id){
        const result = await Employees.activeEmployee(isActive,id);
        console.log('result.data', result.data)
        return result.data
    }
    async filterEmployee(field,page,body){
        const result = await Employees.filterDateEmployee(field,page,body);
        if(result.status === 200 && result.data){
            console.log('result.data.data', result.data.data)
            let data = result.data.data;
            let json = [];
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].first_name, 
                    data[i].last_name,
                    data[i].position_id, 
                    data[i].type, 
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.Employees =  result.data
            console.log('this.Employees', result.data)

        }else{
            this.Employees = []
        }
    
    }

    async saveEmployee(body){
        let content = Object.assign({}, body.employee)
        content.user =  Object.assign({}, body.user);
        console.log('content', content)
        const result = await Employees.saveEmployee(content);
        return result.data;
    }

    async updateEmployee(body){
        console.log('body', body)
        let content = Object.assign({}, body.employee)
        content.user =  Object.assign({}, body.user);
        delete content.position
        delete content.referred_clients

console.log('content', content)
        const result = await Employees.updateEmployee(body.Employee_id,content);
        return result.data;
    }



  }

  export default EmployeeController;