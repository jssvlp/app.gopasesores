import React, { Component } from 'react'
import { inject,observer} from "mobx-react";
import Select from "react-select";
import {
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
  } from "react-bootstrap";
@inject('permissions')
@observer

class ModalPermissions extends Component {


    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){
        const {permissions} = this.props;
        permissions.getAllPermissions();

    }

    render() {
        const {permissions} = this.props;
        console.log('permissions.getDataPermissions.data', permissions.getDataPermissions.data)
        return (
            <Row>
                <Col md={12}>
                    <FormGroup >
                        <ControlLabel>Seleccione la accion</ControlLabel>
                        <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name={'rol_has_permissions'}
                        onChange={(e)=> this.props.onChange(e.value)}
                        options={   permissions.getDataPermissions.data&&permissions.getDataPermissions.data.map((item,i)=>{
                            return {label:item[1],value:item[0]} 
                        })}
                        placeholder={'seleccione'}
                        />
                    </FormGroup>
                </Col>
      
            </Row>
        )
    }
}

export default ModalPermissions;
