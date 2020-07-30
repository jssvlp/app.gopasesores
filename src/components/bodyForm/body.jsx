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
import Datatable from '../DataTable/Datatable'
  import moment from 'moment';

  import Select from "react-select";
@observer
class body extends Component {

    constructor(props){
        super(props)
        this.state = {
            values:[],
            seletectedItems:[],
            fields:[]
        }
        this.selectedItem = this.selectedItem.bind(this);
    }

    componentWillReceiveProps(props){
        let values = props.fieldValues
        this.setState({
            values:values,
            fields: props.fields
        })
     }

     componentDidMount(){
        let values = this.props.fieldValues
        this.setState({
            values:values,
            fields: this.props.fields
        })
     
     }

     initRules(name,value,model){
        let field = this.state.fields
        let error = this.props.errors
        let rules = this.props.rules
        let values = this.state.values
        console.log('rules', rules,name,value)

        for (const x in rules) {

            if(rules[x].fieldFrom === name && rules[x].valueFrom === value){
                for (const i in field) {
                    if(field[i].name === rules[x].fieldTo){
                        if(rules[x].rule === 'show'){
                            field[i].hidden = false
                            field[i].value = ''
                        }
                        if(rules[x].rule === 'hidden'){
                            field[i].hidden = true
                            field[i].value = ''
                        }
                        if(rules[x].rule === 'disabled'){
                            field[i].disabled = true
                        }
                        if(rules[x].rule === 'active'){
                            field[i].disabled = false
                        }
                        if(rules[x].rule === 'require'){
                            error[field[i].name] = true
                        }
                        if(rules[x].rule === 'notrequire'){
                            error[field[i].name] = false
                        }
                        if(rules[x].rule === 'nomask'){
                            field[i].mask = ''
                            values[field[i].model][field[i].name] = ''
                            console.log('values[model]', values[field[i].model])
                            //values[model][field[i].name] = ''
                            console.log('LALOAL');
                        }
                        if(rules[x].rule === 'mask'){
                            field[i].mask = rules[x].mask
                            values[field[i].model][field[i].name] = ''
                        }
                    }
                    
                }
            }
            
        }
        
     }
     

     async deleteTable(method){
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await method(items[i]);
            !result.success&& allErrorsDelete.push(items[i])
           
        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos Rols no se eliminaron',
                'los siguientes Rols no se borraron: ' +allErrorsDelete.toString(),
                'error'
                )
        }

        if(allErrorsDelete.length===0){
            this.props.alertMessage(
                'Se elimino correctamente',
                'Puede verificar en la lista de registros ',
                'success'
                )
        }
        this.setState({
            seletectedItems:[]
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

     selectedItem(id,checkbox){
        let items = this.state.seletectedItems;
        console.log('checkbox.target.checked', checkbox.target.checked)
        checkbox.target.checked?items.push(id) : items = items.filter(e=>e !==id);
        this.setState({
            seletectedItems:items
        })
    }

    
    render() {

        const {onChange,errors,view} = this.props;
        const {values} = this.state;
        console.log('view', view,)
        return (
            <div>
                <Row>
                {this.state.fields.length>0&&
                    this.state.fields.map((field,i)=>
                    
                        field.type==='text'?(
                            <Col  md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}} >
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
                                    disabled={field.disabled}
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='header'?(
                            <Col  md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}} >
                                <h4>{field.label}</h4>
                                <hr/>
                            </Col>
                        ):
                        field.type==='date'?(
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <Datetime 
                                    timeFormat={false} 
                                    name={field.name} 
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    inputProps={{ placeholder: field.label }} 
                                    onChange={(e)=> onChange(field.name,moment(e).format('YYYY-MM-DD'),field.model)} 
                                    defaultValue={new Date()}  
                                    disabled={field.disabled}
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='email'?(
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <FormControl 
                                    placeholder={field.label} 
                                    name={field.name} 
                                    id={field.name}
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=> onChange(field.name,e.target.value,field.model)} 
                                    type={field.type} 
                                    disabled={field.disabled}
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='password'?(
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <FormControl 
                                    placeholder={field.label} 
                                    name={field.name}
                                    autoComplete="off"
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=>  onChange(field.name,e.target.value,field.model)} 
                                    type={field.type} 
                                    disabled={field.disabled}
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='number'?(
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <FormControl 
                                    placeholder={field.label} 
                                    name={field.name} 
                                    id={field.name}
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=> onChange(field.name,e.target.value,field.model)} 
                                    type={field.type} 
                                    disabled={field.disabled}
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        
                        field.type==='textarea'?(
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <textarea 
                                    className="form-control" 
                                    placeholder={field.label} 
                                    name={field.name} 
                                    value={this.value(values,field.model,field.name,field.value)} 
                                    onChange={(e)=> onChange(field.name,e.target.value,field.model)}
                                    type={field.type} 
                                    disabled={field.disabled}
                                    />
                                </FormGroup>
                            </Col> 
                        ):
                        field.type==='checkbox'?(
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <Checkbox 
                                    number={field.name} 
                                    label={field.label + ' '+ (errors[field.name]?'*':'')} 
                                    checked={this.value(values,field.model,field.name,field.value)}
                                    onClick={(e)=> onChange(field.name,e.target.checked,field.model)}
                                    disabled={field.disabled}
                                    />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='title'?(
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}}>
                            <FormGroup  style={{paddingLeft:'2%'}}>
                                <label>{field.label}:</label>
                            </FormGroup>
                            </Col>
                        ):
                        field.type==='br'?(
                            <Col md={field.col} >
                            <FormGroup  style={{paddingLeft:'2%'}}>
                                <br/>
                            </FormGroup>
                            </Col>
                        ):
                        field.type==='table'?(
                            
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}} >
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                <Datatable
                                thArray={field.headers}
                                permissions={this.props.permissions} 
                                location={this.props.location}
                                tdArray={{data:this.value(values,field.model,field.name,field.value)}}
                                loading={false}
                                selectedItem={this.selectedItem}
                                items={this.state.seletectedItems} 
                                deleteMethod={()=>{field.delete&&this.deleteTable(field.delete)}}
                                changePage={this.changePage}
                                create={field.create}
                                openDetail={field.openDetail}
                                titleBtn={field.btnName}
                                />
                                </FormGroup>
                            </Col>
                        ):
                        field.type==='select'&&(
                            <Col md={field.col} style={{display: field.hidden? 'none':  field.display.indexOf(view)!==-1?'block':'none'}}>
                                <FormGroup  validationState={errors[field.name]?'error':''}>
                                    <ControlLabel>{field.label} {errors[field.name]&&(<span className="star">*</span>)}</ControlLabel>
                                    <Select
                                    className="react-select primary"
                                    classNamePrefix="react-select"
                                    name={field.name}
                                    value={  field.value.find(e=>e.value === this.value(values,field.model,field.name,field.value)) } 
                                    onChange={(e)=> [onChange(field.name,e.value,field.model),this.initRules(field.name,e.value)]}
                                    options={field.value}
                                    placeholder={field.label}
                                    isDisabled={field.disabled}
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
