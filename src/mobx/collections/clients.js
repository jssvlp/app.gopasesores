import { observable, computed } from "mobx";
import React, { Component } from "react";
import { Clients } from "../../services/index";
import {ClientsForm} from '../../jsonForms/index'
import Switch from "react-bootstrap-switch";

    class ClientController  extends Component  {

    @observable load = true
    @observable fieldErrors = ClientsForm.fieldErrors;
    @observable headers = ClientsForm.headers;
    @observable fields = ClientsForm.fieldsPages;
    @observable clients = []
    @observable clientById = []
    @observable allUsers = []
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
        const result = await Clients.getClients(page);
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
                    <Switch
                    onText="Activo"
                    offText="Inactivo"
                    defaultValue={data[i].status === "Prospecto"}/>
                ])
            }
            
            result.data.data = json
            this.clients =  result.data
            console.log('this.clients', result.data)

        }else{
            this.clients = []
        }
    }

    async saveClient(body){
        console.log('body', body)
        let content = {
            referred_by_id:1,
            contact_employee_id:1,
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
        let content = {
            referred_by_id:1,
            contact_employee_id:1,
            authorize_data_processing:body.authorize_data_processing,
            comment:body.comment,
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