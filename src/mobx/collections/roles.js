import { observable, computed } from "mobx";
import React, { Component } from "react";
import { Roles } from "../../services/index";
import {RolesForm} from '../../jsonForms/index'
import Switch from "react-bootstrap-switch";

    class RoleController  extends Component  {

    @observable load = true
    @observable fieldErrors = RolesForm.fieldErrors;
    @observable headers = RolesForm.headers;
    @observable fields = RolesForm.fieldsPages;
    @observable Roles = []
    @observable roleByIdInfo = []
    @observable allUsers = []
    @observable isActive = false
    @observable typeRole = "people"


    @computed
    get modelRoles(){
        return  this.model;

    }


    @computed
    get getDataRoles(){
        return this.Roles;
    }

    @computed
    get RoleByIdInfo(){
        return this.RoleById;
    }

    @computed
    get loading(){
        return this.load;
    }

    @computed
    get getTypeRole(){
        return this.typeRole;
    }
    

     statusLoading(status){
        this.load = status;
    }


    changeRole(type){
        this.typeRole = type;
    }


   


 

    async initValues(){
   

    }

    async getRoleById(id){
        const result = await Roles.getRolesById(id);
        if(result.data.success && result.status ===200) this.roleByIdInfo = result.data
        if(!result.data.success || result.status !==200) this.roleByIdInfo = []
        console.log('result', result);
    }

    async deleteRoleById(id){
        const result = await Roles.deleteRole(id);
        return result.data
    }


    async getAllRoles(page){
        this.initValues()
        const result = await Roles.getRoles(page||1);

        if(result.status === 200 && result.data){
            let data = result.data.data;
            let json = [];
            
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].name, 
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.Roles =  result.data
            console.log('this.Roles', result.data)

        }else{
            this.Roles = []
        }
    }
    
    
    async filterRole(field,page,body){
        const result = await Roles.filterDateRole(field,page,body);
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
            this.Roles =  result.data
            console.log('this.Roles', result.data)

        }else{
            this.Roles = []
        }
    
    }

    async saveRole(body){
        let content = Object.assign({}, body.roles)
        console.log('content', content)
        const result = await Roles.saveRole(content);
        return result.data;
    }

    async addPermissions(id,idpermissions){
        console.log('content', id,idpermissions)
        const result = await Roles.addPermissions( id,idpermissions,{});
        return result.data;
    }
    async deletePermissions(id,idpermissions){
        console.log('content', id,idpermissions)
        const result = await Roles.deletePermissions( id,idpermissions);
        return result.data;
    }

    async updateRole(body){
        console.log('body', body)
        delete  body.roles.permissions
        let content = Object.assign({}, body.roles);

        console.log('content', content)
        const result = await Roles.updateRole(body.role_id,content);
        return result.data;
    }



  }

  export default RoleController;