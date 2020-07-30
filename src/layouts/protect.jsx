import React, { Component, Children } from 'react'
import { inject,observer} from "mobx-react";
import { Redirect } from 'react-router'
@inject('users')
@observer
class Protect extends Component {


    constructor(props){
        super(props)
        this.state = {
            path:[],
            permissionsForUser:[],
        }
    }

     async componentDidMount(){
        const {users} = this.props
        if(!users.infoUser.permissions) return;
        
        console.log('result protect!!!!!!!!!!!!!!!!!!!',users.infoUser ,this.props)
        let path =users.infoUser.permissions.map((item,i)=>{
            return item.path
        })

        this.setState({
            path:path,
        })
        if(!path.includes(this.props.path)) window.location.href = '#/admin/dashboard'

    }
    async componentWillReceiveProps(nextProps){
        const {users} = this.props
        if(!users.infoUser.permissions){
            await users.getUsersById(localStorage.getItem('user-id-gop'));
            console.log('LLEGO EL CLIENT')
        }
        
    }
    render() { 
      //if(!this.state.path.includes(this.props.path)) return <center style={{padding:'20%'}}><i className="fa fa-spin fa-circle-o-notch" style={{fontSize:20,color:'#2C6CF6'}}/></center>
      return  this.props.children
        
    }
}

export default Protect;
