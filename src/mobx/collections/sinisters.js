import { observable, computed } from "mobx";
import { Component } from "react";
import { Sinisters,Policies } from "../../services/index";
import {SinistersForm} from '../../jsonForms/index'

    class SinisterController  extends Component  {

    @observable load = true
    @observable fieldErrors = SinistersForm.fieldErrors;
    @observable headers = SinistersForm.headers;
    @observable fields = SinistersForm.fieldsPages;
    @observable Sinisters = []
    @observable SinisterById = []
    @observable allUsers = []
    @observable isActive = false
    @observable typeSinister = "people"


    @computed
    get modelSinisters(){
        return  this.model;

    }


    @computed
    get getDataSinisters(){
        return this.Sinisters;
    }

    @computed
    get SinisterByIdInfo(){
        return this.SinisterById;
    }

    @computed
    get loading(){
        return this.load;
    }

    @computed
    get getTypeSinister(){
        return this.typeSinister;
    }
    

     statusLoading(status){
        this.load = status;
    }


    changeSinister(type){
        this.typeSinister = type;
    }


   


 

    async initValues(){
        const fieldsAll = this.fields;
        const result = await Policies.getPolicies(1);
        console.log('result', result)
        for (const x in fieldsAll) {
            let fields = fieldsAll[x].fields;
            for (const i in fields) {
                if (fields[i].name === "policy_id") {
                    fields[i].value =  result.data.data.map((item, i) => {
                      return {
                        label: item.branch,
                        value: item.id,
                      };
                    });
                  }
            }
            
        }
   

    }

    async getSinisterById(id){
        const result = await Sinisters.getSinistersById(id);
        if(result.data.success && result.status ===200) this.SinisterById = result.data
        if(!result.data.success || result.status !==200) this.SinisterById = []
        console.log('result', result);
    }

    async deleteSinisterById(id){
        const result = await Sinisters.deleteSinister(id);
        return result.data
    }


    async getAllSinisters(page){
       // this.initValues()
        const result = await Sinisters.getSinisters(page||1);
        console.log('result.data.data', result.data.data)
        if(result.status === 200 && result.data){
            let data = result.data.data;
            let json = [];
            
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].assigned_provider,
                    data[i].sinister_company_number, 
                    data[i].policy.policy_number,
                    data[i].policy.currency + "$ "+ data[i].policy.insured_amount,
                    data[i].policy.prime,
                    data[i].type,
                    data[i].status,
                    data[i].sinister_date,
                ])
            }
            
            result.data.data = json
            this.Sinisters =  result.data
            console.log('this.Sinisters', result.data)

        }else{
            this.Sinisters = []
        }
        this.load = false;
    }
    
    
    async filterSinister(field,page,body){
        const result = await Sinisters.filterDateSinister(field,page,body);
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
            this.Sinisters =  result.data
           
            console.log('this.Sinisters', result.data)

        }else{
            this.Sinisters = []
        }
        this.load = false;
    
    }

    async saveSinister(body){
        let content = Object.assign({}, body.sinisters)
        content.documents = body.documents
        console.log('content', content)
        const result = await Sinisters.saveSinister(content);
        return result.data;
    }

    async updateSinister(body){
        console.log('body', body)
        let content = Object.assign({}, body.sinisters);
        content.documents = body.documents
        console.log('content', content)
        const result = await Sinisters.updateSinister(body.sinister_id,content);
        return result.data;
    }



  }

  export default SinisterController;