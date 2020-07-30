import { observable, computed } from "mobx";
import { Users } from "../../services/index";
    class User {

    @observable loading = false
    @observable model = []
    @observable user = []
    @observable allUsers = []
    @observable isAuthUser = false

    @computed
    get modelUser(){
        return  this.model;

    }


    @computed
    get infoUser(){
        return this.user;
    }


    @computed
    get allUsersInfo(){
        let array = [];
        let users = this.allUsers;
        for (const key in users) {
            array.push({value: users[key].id,label:users[key].name+" "+users[key].firstlastname})
        }
        return array
    }

    @computed
    get getIsAuth(){
        return this.isAuthUser;
    }

    
    async getUsersById(id){
        const result =  await Users.getUsersById(id);
        this.user = result.data
    }



    async logout(token){
        const result = await Users.logout(token)
        return result.data
    }



    

    isAuth(status){
        if(status === 401) this.isAuthUser = false;
        if(status !== 401) this.isAuthUser = true;
    }


   
    async loginServices(body){
        
        const result = await Users.login(body)
        
        if(result.status !== 200 && !result.data) this.user = [];
        if(result.status === 200 && result.data) this.user = result.data
        
        return this.user
        
    }


    async getAllUsers(){
        const result = await Users.getUsers();
        console.log('result.state', result)
        if(result.status === 200 && result.data){
            this.allUsers = result.data.users
            
        }else{
            this.allUsers = []
        }
        
    }

    async forgetPassword(id){
        const result = await Users.forgetPassword(id);
        if(result.status === 200 && result.data){
            
            console.log('resilt.data', result.data)
           return result.data.result
            
        }else{
           return []
        }
    }


    async saveUserService(body){
        if(!body) return
        const result = await Users.savUser(body)
        if(result.status === 200 && result.data){
            return result.data.user
        }
        return []
        
    }




  }

  export default User;