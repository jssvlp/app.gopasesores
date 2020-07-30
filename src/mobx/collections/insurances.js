import { observable, computed } from "mobx";
import { Insurances } from "../../services/index";
import {InsurancesForm} from '../../jsonForms/index'

    class InsuranceController   {

    @observable load = true
    @observable fieldErrors = InsurancesForm.fieldErrors;
    @observable headers = InsurancesForm.headers;
    @observable fields = InsurancesForm.fieldsPages;
    @observable Insurances = []
    @observable InsuranceById = []
    @observable allUsers = []
    @observable isActive = false
    @observable typeInsurance = "people"


    @computed
    get modelInsurances(){
        return  this.model;

    }


    @computed
    get getDataInsurances(){
        return this.Insurances;
    }

    @computed
    get InsuranceByIdInfo(){
        return this.InsuranceById;
    }

    @computed
    get loading(){
        return this.load;
    }

    @computed
    get getTypeInsurance(){
        return this.typeInsurance;
    }
    

     statusLoading(status){
        this.load = status;
    }


    changeInsurance(type){
        this.typeInsurance = type;
    }


   


 

    async initValues(){
   

    }

    async getInsuranceById(id){
        const result = await Insurances.getInsurancesById(id);
        if(result.data.success && result.status ===200) this.InsuranceById = result.data
        if(!result.data.success || result.status !==200) this.InsuranceById = []
        console.log('result', result);
    }

    async deleteInsuranceById(id){
        const result = await Insurances.deleteInsurance(id);
        return result.data
    }


    async getAllInsurances(page){
        const result = await Insurances.getInsurances(page||1);

        if(result.status === 200 && result.data){
            let data = result.data.data;
            let json = [];
            
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].name,
                    data[i].rnc, 
                    data[i].phone,
                    data[i].email, 
                    data[i].account, 
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.Insurances =  result.data
            console.log('this.Insurances', result.data)

        }else{
            this.Insurances = []
        }
        this.load = false;
    }
    
    
    async filterInsurance(field,page,body){
        const result = await Insurances.filterDateInsurance(field,page,body);
        if(result.status === 200 && result.data){
            console.log('result.data.data', result.data.data)
            let data = result.data.data;
            let json = [];
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].name,
                    data[i].rnc, 
                    data[i].phone,
                    data[i].email, 
                    data[i].account, 
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.Insurances =  result.data
           
            console.log('this.Insurances', result.data)

        }else{
            this.Insurances = []
        }
        this.load = false;
    
    }

    async saveInsurance(body){
        let content = Object.assign({}, body.insurances)
        console.log('content', content)
        const result = await Insurances.saveInsurance(content);
        return result.data;
    }

    async updateInsurance(body){
        console.log('body', body)
        let content = Object.assign({}, body.insurances);

        console.log('content', content)
        const result = await Insurances.updateInsurance(body.insurance_id,content);
        return result.data;
    }



  }

  export default InsuranceController;