import { observable, computed } from "mobx";
import React, { Component } from "react";
import { Clients,Employees } from "../../services/index";
import {ClientsForm} from '../../jsonForms/index'

    class ClientController  extends Component  {

    @observable load = true
    @observable fieldErrors = ClientsForm.fieldErrors;
    @observable headers = ClientsForm.headers;
    @observable fields = ClientsForm.fieldsPages;
    @observable clients = []
    @observable clientById = []
    @observable allUsers = []
    @observable isActive = false
    @observable init = false
    @observable typeClient = "people"


    @computed
    get modelClients(){
        return  this.model;

    }


    @computed
    get getDataClients(){
        return this.clients;
    }

    @computed
    get clientByIdInfo(){
        return this.clientById;
    }

    @computed
    get loading(){
        return this.load;
    }

    @computed
    get getTypeClient(){
        return this.typeClient;
    }


    statusLoading(status){
        this.load = status;
    }

    changeClient(type){
        this.typeClient = type;
    }

    async  getActivitiesEconomic() {
        const result = await Clients.getActivitiesEconomic();
        let positions = result.data.data
        console.log('positions', positions)
        let array = []
        for (const i in positions) {
            array.push({label: positions[i].name,value:positions[i].id})
        }
        return array;
    }

    async initValues(){
        if(this.init) return
        const fieldsAll = this.fields;
        const activity = await this.getActivitiesEconomic();
        const employees = await Employees.getEmployees(1,100);
        const clients = await Clients.getClientsAll();
        console.log('clients.data.data', clients.data)

        for (const x in fieldsAll) {
            let fields = fieldsAll[x].fields;
            console.log('fields', fields)
            for (const i in fields) {
                if(fields[i].name ==='economic_activity_id'){
                    fields[i].value = activity;
                }
                if(fields[i].name ==='owner_id'){
                    fields[i].value = employees.data.data.map((item,i)=>{
                        return {label:item.first_name+ ' '+item.last_name,value:item.id}
                    })
                }
                if(fields[i].name === 'related_client_id'){
                    fields[i].value = clients.data.clients.map((item,i)=>{
                        return {label:item.name+ ' '+item.last_name,value:item.id,type:item.type}
                    }).filter((item,i)=>{ return item.type ==='company'});
                }
            }
        }
        
        this.init = true

    }

    async getClientById(id){
        const result = await Clients.getClientsById(id);
        if(result.data.success && result.status ===200) this.clientById = result.data.client
        if(!result.data.success || result.status !==200) this.clientById = []
        console.log('result', result);
    }

    async deleteClientById(id){
        const result = await Clients.deleteClient(id);
        return result.data
    }


    async getAllClients(page){
        await this.initValues();
        const result = await Clients.getClients(page||1);
        if(result.status === 200 && result.data){
            let data = result.data.data;
            let json = [];
            
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].name, 
                    data[i].cell_phone_number,
                    data[i].document_number, 
                    data[i].type==="people"?'Persona':'Empresa', 
                    data[i].email,
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.clients =  result.data
           
            console.log('this.clients all clients%%%%%', result.data)

        }else{
            this.clients = []
        }
        this.load = false;
    }
    
    async activeClicent(isActive,id){
        const result = await Clients.activeClient(isActive,id);
        return result.data
    }
    async filterClient(field,page,body){
        const result = await Clients.filterDateClient(field,page,body);
        if(result.status === 200 && result.data){
            console.log('!!!!!!!!!result.data.data', result.data.data)
            let data = result.data.data;
            let json = [];
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].name, 
                    data[i].cell_phone_number,
                    data[i].document_number, 
                    data[i].type==="people"?'Persona':'Empresa', 
                    data[i].email,
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.clients =  result.data
            
            console.log('this.clients filter data %%%%%%%', result.data)

        }else{
            this.clients = []
        }
        this.load = false;
    
    }

    async saveClient(body){
        console.log('body', body)
        let owner_id = body.type === 'company'?  body.company.owner_id : body.people.owner_id;
        let related_client_id = body.type === 'people'? body.people.related_client_id:null;
        if(body.type === 'company') delete body.company.owner_id  
        if(body.type === 'people') { delete body.people.owner_id; delete body.people.related_client_id;}  
        let content = {
            referred_by_id:1,
            contact_employee_id:1,
            owner_id: owner_id,
            related_client_id:related_client_id,
            authorize_data_processing:body.authorize_data_processing,
            comment:body.comment,
            type:body.type,
            company:body.company,
            contact_info:  Object.assign({}, body.contact_info),
            people:  Object.assign({}, body.people),
            user:  Object.assign({}, body.user)
        }
       
        const result = await Clients.saveClient(content);
        return result.data;
    }

    async updateClient(body){
        console.log('body', body)
        let owner_id = body.type === 'company'?  body.company.owner_id : body.people.owner_id;
        let related_client_id = body.type === 'people'? body.people.related_client_id:null;
        if(body.type === 'company') delete body.company.owner_id  
        if(body.type === 'people') { delete body.people.owner_id; delete body.people.related_client_id;}    
        let content = {
            referred_by_id:1,
            contact_employee_id:1,
            authorize_data_processing:body.authorize_data_processing,
            comment:body.comment,
            owner_id: owner_id,
            related_client_id:related_client_id,
            type:body.type,
            company:body.company,
            contact_info:  Object.assign({}, body.contact_info),
            people:  Object.assign({}, body.people),
            user:  Object.assign({}, body.user)
        }
        const result = await Clients.updateClient(body.client_id,content);
        return result.data;
    }



  }

  export default ClientController;