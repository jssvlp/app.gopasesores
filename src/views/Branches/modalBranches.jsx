import React, { Component } from 'react'
import { inject,observer} from "mobx-react";
import Select from "react-select";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";

import {
    Row,
    Col,
    FormGroup,
    ControlLabel,
  } from "react-bootstrap";
@inject('insurances')
@observer

class ModalPermissions extends Component {


    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){
        const {insurances} = this.props;
        insurances.getInsurancesAllList();

    }

    findValue(values,field){
        for (const i in values) {
            console.log('values[i]', values[i].id,field)
            if(values[i].id === field){
                console.log('field', field)
                return {label:values[i].name,value:values[i].id}
            }
        }
        return {}
    }

    render() {
        const {insurances,fields} = this.props;
        console.log('permissions.getDataPermissions.data', insurances.getListInsurances)
        return (
            <Row>
                <Col md={4}>
                    <FormGroup >
                        <ControlLabel>Porcentaje</ControlLabel>
                        <input name="isc_percent" value={fields.isc_percent} type="number" onChange={(e)=>this.props.onChange('isc_percent',e.target.value)} className="form-control"/>
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup >
                        <ControlLabel>Comision</ControlLabel>
                        <input name="commission_percentage" type="number" value={fields.commission_percentage} onChange={(e)=>this.props.onChange('commission_percentage',e.target.value)} className="form-control"/>
                    </FormGroup>
                </Col>
                
                <Col md={4}>
                    <FormGroup >
                        <ControlLabel>Aseguradora</ControlLabel>
                        <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name={'insurance_id'}
                        value={ this.findValue(insurances.getListInsurances,fields.insurance_id) } 

                        onChange={(e)=> this.props.onChange('insurance_id',e.value)}
                        options={    insurances.getListInsurances&& insurances.getListInsurances.map((item,i)=>{
                            return {label:item.name,value:item.id} 
                        })}
                        placeholder={'seleccione'}
                        />
                    </FormGroup>
                </Col>
                <Col md={12}>
                    <FormGroup >
                        <ControlLabel>Multiple beneficiarios?</ControlLabel>
                        <Checkbox number="multiple_beneficiaries" checked={fields.multiple_beneficiaries ===1?true:false} onClick={(e)=>this.props.onChange('multiple_beneficiaries',e.target.checked?1:0)} name="multiple_beneficiaries" />
                    </FormGroup>
                </Col>
      
            </Row>
        )
    }
}

export default ModalPermissions;
