import React, { Component } from 'react'
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Form,
    InputGroup
  } from "react-bootstrap";
  import Datetime from "react-datetime";
  import InputMask from 'react-input-mask';
  import { observer} from "mobx-react";
import Checkbox from '../CustomCheckbox/CustomCheckbox'
  import moment from 'moment';

  import Select from "react-select";
@observer
class body extends Component {

    constructor(props){
        super(props)
        this.state = {
            values:[]
        }
    }

    componentWillReceiveProps(props){
        let values = props.fieldValues
        this.setState({
            values:values
        })
     }

     value(values,model,name,value){
         if(values[model]){
             return values[model][name]
         }
         if(!model){
            return values[name]
         }
         if(values.length===0){
            return value
         }

     }

     findValueSelect(values,selected) {
         return values.find(e=>e.value === selected)

     }


    
    render() {

        const {fields,onChange,errors} = this.props;
        const {values} = this.state;
        return (
            <div>
                <Row>
                {fields.length>0&&
                    fields.map((field,i)=>
                        field.type==='text'?(
                            <Col  md={field.col} >
                                <FormGroup validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <InputMask 
                                    className="form-control" 
                                    mask={field.mask} 
                                    placeholder={field.label} 
                                    name={field.name} 
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=> onChange(field.name,e.target.value,field.model,field.mask)} 
                                    type={field.type} 
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='header'?(
                            <Col  md={field.col} >
                                <h4>{field.label}</h4>
                                <hr/>
                            </Col>
                        ):
                        field.type==='date'?(
                            <Col md={field.col}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <Datetime 
                                    timeFormat={false} 
                                    name={field.name} 
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    inputProps={{ placeholder: field.label }} 
                                    onChange={(e)=> onChange(field.name,moment(e).format('YYYY-MM-DD'),field.model)} 
                                    defaultValue={new Date()}  
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='email'?(
                            <Col md={field.col}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <FormControl 
                                    placeholder={field.label} 
                                    name={field.name} 
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=> onChange(field.name,e.target.value,field.model)} 
                                    type={field.type} 
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='password'?(
                            <Col md={field.col}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <FormControl 
                                    placeholder={field.label} 
                                    name={field.name} 
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=> onChange(field.name,e.target.value,field.model)} 
                                    type={field.type} 
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='number'?(
                            <Col md={field.col}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <FormControl 
                                    placeholder={field.label} 
                                    name={field.name} 
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=> onChange(field.name,e.target.value,field.model)} 
                                    type={field.type} 
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        
                        field.type==='textarea'?(
                            <Col md={field.col}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <textarea 
                                    className="form-control" 
                                    placeholder={field.label} 
                                    name={field.name} 
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=> onChange(field.name,e.target.value,field.model)}
                                    type={field.type} 
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='checkbox'?(
                            <Col md={field.col}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <Checkbox 
                                    number={field.name} 
                                    label={field.label + ' '+ (errors[field.name]?'*':'')} 
                                    checked={this.value(values,field.model,field.name,field.value)}
                                    onClick={(e)=> onChange(field.name,e.target.checked,field.model)}
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='select'&&(
                            <Col md={field.col}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <Select
                                    className="react-select primary"
                                    classNamePrefix="react-select"
                                    name={field.name}
                                    value={  field.value.find(e=>e.value === this.value(values,field.model,field.name,field.value)) } 
                                    onChange={(e)=> onChange(field.name,e.value,field.model)}
                                    options={field.value}
                                    placeholder={field.label}
                                    />
                                </FormGroup>
                            </Col>
                        )
                    )
                }

                </Row>
            </div>
        )
    }
}

export default body;
