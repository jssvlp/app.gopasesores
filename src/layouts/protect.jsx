import React, { Component } from 'react'
import { inject,observer} from "mobx-react";
@inject('users')
@observer
class Protect extends Component {


    constructor(props){
        super(props)
        this.state = {

        }
    }


    componentWillUpdate(){
        console.log('aqui va el getUserById');

    }
    async componentWillUnmount(){
        const {users} = this.props
        const result = await users.getAllUsers();
        console.log('result protect', result)

    }
    render() {
        const {users} = this.props
        console.log('this.props', users.infoUser)
        return  this.props.children
            
        
    }
}

export default Protect;
