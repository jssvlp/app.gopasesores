import { observable, computed } from "mobx";
import React, { Component } from "react";
import { Permissions } from "../../services/index";
import {PermissionsForm} from '../../jsonForms/index'

    class PermissionController  extends Component  {

    @observable load = true
    @observable fieldErrors = PermissionsForm.fieldErrors;
    @observable headers = PermissionsForm.headers;
    @observable fields = PermissionsForm.fieldsPages;
    @observable Permissions = []
    @observable PermissionById = []
    @observable allUsers = []
    @observable isActive = false
    @observable typePermission = "people"


    @computed
    get modelPermissions(){
        return  this.model;

    }


    @computed
    get getDataPermissions(){
        return this.Permissions;
    }

    @computed
    get PermissionByIdInfo(){
        return this.PermissionById;
    }

    @computed
    get loading(){
        return this.load;
    }

    @computed
    get getTypePermission(){
        return this.typePermission;
    }
    

     statusLoading(status){
        this.load = status;
    }


    changePermission(type){
        this.typePermission = type;
    }


   


 

    async initValues(){
   

    }

    async getPermissionById(id){
        const result = await Permissions.getPermissionsById(id);
        if(result.data.success && result.status ===200) this.PermissionById = result.data
        if(!result.data.success || result.status !==200) this.PermissionById = []
        console.log('result', result);
    }

    async deletePermissionById(id){
        const result = await Permissions.deletePermission(id);
        return result.data
    }


    async getAllPermissions(page){
        this.initValues()
        const result = await Permissions.getPermissions(page||1);

        if(result.status === 200 && result.data){
            let data = result.data.data;
            let json = [];
            
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].name,
                    data[i].path, 
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.Permissions =  result.data
            console.log('this.Permissions', result.data)

        }else{
            this.Permissions = []
        }
    }
    
    
    async filterPermission(field,page,body){
        const result = await Permissions.filterDatePermission(field,page,body);
        if(result.status === 200 && result.data){
            console.log('result.data.data', result.data.data)
            let data = result.data.data;
            let json = [];
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].name,
                    data[i].path, 
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.Permissions =  result.data
            console.log('this.Permissions', result.data)

        }else{
            this.Permissions = []
        }
    
    }

    async savePermission(body){
        let content = Object.assign({}, body.permissions)
        console.log('content', content)
        const result = await Permissions.savePermission(content);
        return result.data;
    }

    async updatePermission(body){
        console.log('body', body)
        let content = Object.assign({}, body.permissions);

        console.log('content', content)
        const result = await Permissions.updatePermission(body.permission_id,content);
        return result.data;
    }



  }

  export default PermissionController;