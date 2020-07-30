import { observable, computed } from "mobx";
import { Branches } from "../../services/index";
import {BranchesForm} from '../../jsonForms/index'

    class BranchController   {

    @observable load = true
    @observable fieldErrors = BranchesForm.fieldErrors;
    @observable headers = BranchesForm.headers;
    @observable fields = BranchesForm.fieldsPages;
    @observable Branches = []
    @observable BranchById = []
    @observable allUsers = []
    @observable init = false;
    @observable isActive = false
    @observable typeBranch = "people"


    @computed
    get modelBranches(){
        return  this.model;

    }


    @computed
    get getDataBranches(){
        return this.Branches;
    }

    @computed
    get BranchByIdInfo(){
        return this.BranchById;
    }

    @computed
    get loading(){
        return this.load;
    }

    @computed
    get getTypeBranch(){
        return this.typeBranch;
    }
    

     statusLoading(status){
        this.load = status;
    }


    changeBranch(type){
        this.typeBranch = type;
    }


   


 

    async initValues(){
        if(this.init) return
        const fields = this.fields.branches.fields;
        const mains = await Branches.getMainBranches();
        const insurances = await Branches.getInsurancesBranches();
        for (const i in fields) {
            if(fields[i].name ==='main_branch_id'){
                fields[i].value = mains.data.branches.map((item,i)=>{
                    return {label: item.name, value:item.id}
                });
            }
            if(fields[i].name === 'insurance_id'){
                fields[i].value = insurances.data.map((item,i)=>{
                    return {label: item.name, value:item.id}
                });
            }
        }

        this.init = true

    }

    async getBranchById(id){
        const result = await Branches.getBranchesById(id);
        if(result.data.success && result.status ===200) this.BranchById = result.data
        if(!result.data.success || result.status !==200) this.BranchById = []
        console.log('result', result);
    }

    async deleteBranchById(id){
        const result = await Branches.deleteBranch(id);
        return result.data
    }


    async getAllBranches(page){
        this.initValues();
        const result = await Branches.getBranches(page||1);

        if(result.status === 200 && result.data){
            let data = result.data.data;
            let json = [];
            
            console.log('result.data.data', result.data.data)
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].name,
                    data[i].commission_percentage,
                    data[i].insurance.name, 
                    data[i].main_branch.name,
                    data[i].created_at.split('T')[0],
                ])
            }
            
            result.data.data = json
            this.Branches =  result.data
            console.log('this.Branches', result.data)

        }else{
            this.Branches = []
        }
        this.load = false;
    }
    
    
    async filterBranch(field,page,body){
        const result = await Branches.filterDateBranch(field,page,body);
        if(result.status === 200 && result.data){
            let data = result.data.data;
            let json = [];
            for (const i in data) {
                json.push([
                    data[i].id, 
                    data[i].commission_percentage,
                    data[i].insurance_id, 
                    data[i].main_branch_id,
                    data[i].created_at,
                ])
            }
            
            result.data.data = json
            this.Branches =  result.data
           
            console.log('this.Branches', result.data)

        }else{
            this.Branches = []
        }
        this.load = false;
    
    }

    async saveBranch(body){
        let content = Object.assign({}, body.branches)
        console.log('content', content)
        const result = await Branches.saveBranch(content);
        return result.data;
    }

    async updateBranch(body){
        console.log('body', body)
        let content = Object.assign({}, body.branches);

        console.log('content', content)
        const result = await Branches.updateBranch(body.branches_id,content);
        return result.data;
    }



  }

  export default BranchController;