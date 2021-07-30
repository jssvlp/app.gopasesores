import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import Datetime from "react-datetime";
import {
    Row,
    Col,
    Grid,
    Nav,
    NavItem,
    Tab,
    Modal,
    FormControl,
    ControlLabel,
    InputGroup, Button
} from "react-bootstrap";
import moment from "moment";
import BodyContent from "../../components/bodyForm/contentBody";
import Wizzard from "../../components/stepsWizzard/StepsWizzard";
import Datatable from "../../components/DataTable/Datatable";
import payments from "./payment";

@inject('payments','users')
@observer
class paymentsClient extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            modalDrop: false,
            idDrop:0,
            bodyRecaudar:{

            },
            body:{
                payments:{
                    payment_code:"",
                },
                documents: [],
            },
            idPayment:0,
            valueToPaid:0,
            errors:{
                payments:[],
                documents: [],
            },
            payment_id:null,
            create:false,
            update:false,
            seletectedItems:[],
            dateStart:moment().format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.savepayment = this.savePayment.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.updatepayment = this.updatePayment.bind(this);
        this.deletepayment = this.deletePayment.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.showPolices = this.showPolices.bind(this);
        this.optionDrop = this.optionDrop.bind(this);
    }

    componentDidMount(){
        const {payments} = this.props;
        payments.statusLoading(true);
        // let idPolicy = localStorage.getItem("idPolicy");
        // let prime = localStorage.getItem("prime");
        // if(idPolicy){
        //     this.reloadTable(idPolicy);
        //     this.setState({
        //         errors:payments.fieldErrors,
        //         idPolicy:idPolicy,
        //         prime:prime
        //
        //     })
        // }
        this.reloadTable();
        payments.statusLoading(false);

    }
    componentDidUpdate(){
        console.log('this.state $%^$%#$%:>> ', this.state);
    }

    reloadTable(){
        const {payments} = this.props;
        payments.getPaymentsPedingClient('pendingClient');
    }

    changePage(page){
        const {payments} = this.props
        payments.getPaymentsPedingClient('pendingClient',page);
    }


    openModal(id){
        let prime = localStorage.getItem("prime")
        this.setState({
            create: !this.state.create,
            body:{
                payments:{
                    prime: prime
                },
                documents: [],
                update:false,
            },
        })
        this.setValue("prime",prime,"payments")

    }



    async setValue(name,value,modelName,mask = null){
        const {payments} = this.props
        let body = this.state.body;
        if(name ==='status' && this.state.payment_id){
            await payments.activeClicent(value==='paymente'?'activate':'deactivate', this.state.payment_id)
        }
        if(modelName ===null && body){
            body[name] =value
            this.setState({body:body,errors:this.setErrors(name,value,modelName,mask)})
            return
        }

        let model = body[modelName]
        console.log('model', modelName,name)
        model[name] = value
        body[modelName] = model
        this.setState({body:body,errors:this.setErrors(name,value,modelName,mask)})
    }

    setErrors(name,value,model,mask){
        let errorsArray = this.state.errors
        let errors = [];

        if(model) errors = errorsArray[model];
        if(!model) errors = errorsArray;



        if(mask) !value.endsWith('_')? errors[name] = false : errors[name] = true
        if(!mask) value? errors[name] = false: errors[name] = true;

        model?errorsArray[model] = errors : errorsArray = errors
        //console.log('errors', errorsArray)
        return errorsArray;
    }

    verifyErrors(){
        let body = this.state.body;
        let errors = this.state.errors
        for (const i in body) {
            let value = body[i];

            if(typeof value==='object'){

                for (const key in value) {
                    let model = errors[i]
                    value&&(model[key] = false)
                }
                continue;
            }
            if(typeof value==='string'){
                value&&(errors[i] = false)
            }

        }
    }

    async savePayment(){
        const {payments} = this.props
        let body = this.state.body;
        body.payments.policy_id = this.state.idPolicy;
        console.log('body :>> ', body);
        const result = await payments.savePayment(body);
        console.log('result!!!!', result)
        if(result.success){
            this.props.alertMessage('Se ha creado el Pago','Puede verificar en la lista el nuevo Pago registrado','success')
            this.setState({
                create: false
            })
            this.reloadTable(this.state.idPolicy);
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')



    }


    async filterDate(date,name){
        const {payments} = this.props
        this.setState({
            [name]:date
        });
        let body = {
            filter_values:[
                this.state.dateStart,
                this.state.dateEnd,
            ]
        }
        await payments.filterPayment('created_at',1,body);


    }


    async openDetail(id){
        const {payments} = this.props;
        console.log('id', id)
        this.props.alertLoading("Espere un momento....",true)
        await payments.getPaymentById(id);
        console.log('paymentsss', payments.paymentByIdInfo)
        delete payments.paymentByIdInfo.payment.updated_at
        delete payments.paymentByIdInfo.payment.created_at

        let body ={
            payments:payments.paymentByIdInfo.payment,
            payment_id:id,
            documents:payments.paymentByIdInfo.payment.documents
        }
        this.setState({
            body:body,
            create:true,
            update:true,
            documents: [],
            payment_id:id
        })
        this.verifyErrors();
        this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updatePayment(){
        const {payments} = this.props
        let body = this.state.body;
        const result = await payments.updatePayment(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el Pago','Puede verificar en la lista el Pago actualizado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
    }


    selectedItem(id,checkbox){
        let items = this.state.seletectedItems;
        console.log('checkbox.target.checked', checkbox.target.checked)
        checkbox.target.checked?items.push(id) : items = items.filter(e=>e !==id);
        this.setState({
            seletectedItems:items
        })
    }

    async deletePayment(){
        const {payments} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await payments.deletePaymentById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])

        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos Pagos no se eliminaron',
                'los siguientes Pagos no se borraron: ' +allErrorsDelete.toString(),
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
        this.reloadTable();
        this.setState({
            seletectedItems:[]
        })

    }

    showPolices(id){
        alert("lalo: "+id)
    }


    optionDrop(id,paid){
        this.setState({modalDrop:true, idDrop:id,valueToPaid:paid})

    }

    setValueRecaudar(e){
        let body = this.state.bodyRecaudar;
        body[e.target.name] = e.target.value;
        console.log('recaudar',body)
        this.setState(body)

    }
    setFullPaid(field){
        let body = this.state.bodyRecaudar
        let paid = this.state.valueToPaid;
        body[field] = paid;

        this.setState(body)


    }

    async savePayToOffice(){
        const {payments} = this.props;
        let body = this.state.bodyRecaudar;
        body.payment_id = this.state.idDrop
        const result = await payments.payToOffice(body);
        console.log(result);

        if(result.success){
            this.props.alertMessage('Se ha creado el Pago','Puede verificar','success')
            this.setState({
                modalDrop: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')
    }



    render() {
        const {payments,users} = this.props

        console.log('this.state PAYMENT',  payments.isExistPayments)
        const steps = [
            {
                name:payments.fields.payments.title,
                errors: this.state.errors.payments,
                component: <BodyContent
                    fields={payments.fields.payments.fields}
                    fieldValues={this.state.body}
                    setValue={this.setValue}
                    rules={payments.fields.payments.rules}
                    errors={this.state.errors.payments}
                    alertMessage={this.props.alertMessage}
                    showSteps={false}
                    view={this.state.update?'update':'create'}
                    method={this.state.update?this.updatepayment:this.savepayment}
                    buttonName={this.state.update?"Actualizar":"Guardar"}
                />
            },

        ];
        return (
            <div className={!this.state.create?"main-content":""}>
                {this.state.create&&(
                    <Wizzard
                        steps={steps}
                        closeWizard={this.closeWizard}
                        subtitle={ ""}
                        title={this.state.update?'DETALLE DEL PAGO': 'CREANDO UN NUEVO  PAGO'}
                    />
                )}

                {!this.state.create&&(
                    <Datatable
                        permissions={users.infoUser}
                        location={this.props.location}
                        buttonAction={this.showPolices}
                        thArray={payments.headersClient}
                        tdArray={payments.AllListPayment}
                        loading={payments.loading}
                        selectedItem={this.selectedItem}
                        items={this.state.seletectedItems}
                        deleteMethod={this.deletepayment}
                        changePage={this.changePage}
                        create={payments.isExistPayments?null:this.openModal}
                        openDetail={this.openDetail}
                        dropMethod={this.optionDrop }
                        titleBtn={"Nuevo"}
                    />
                )}
                <Modal
                    bsSize="lg"
                    show={this.state.modalDrop}
                    onHide={()=> this.setState({
                        modalDrop: false
                    })}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>RECAUDAR A ASEGURADORA</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <ControlLabel>Valor A Pagar</ControlLabel>
                                <input
                                    type={'text'}
                                    placeholder="Modelo"
                                    className="form-control"
                                    disabled={true}
                                    value={this.state.valueToPaid}
                                    name={'valueToPaid'}
                                    onChange={(e)=>this.setValueRecaudar(e)}
                                />
                                <br/>
                            </Col>
                            <Col md={12}>
                                <ControlLabel>Valor Recaudado en Oficina</ControlLabel>
                                <InputGroup>

                                    <FormControl type="text" value={this.state.bodyRecaudar['value_to_paid']&&this.state.bodyRecaudar['value_to_paid']} name={'value_to_paid'} placeholder="0" onChange={(e)=>this.setValueRecaudar(e)} />
                                    <InputGroup.Addon style={{backgroundColor:'#053e7a',color:'white'}}>
                                        <a onClick={()=> this.setFullPaid('value_to_paid')} style={{textDecoration:'none', color:'white', cursor:'pointer'}}>Recaudar Todo</a>
                                    </InputGroup.Addon>
                                </InputGroup>
                                <br/>
                            </Col>
                            <Col md={12}>
                                <ControlLabel>Fecha de Recaudacion en Oficina</ControlLabel>
                                <Datetime
                                    timeFormat={false}
                                    name={'collected_date'}
                                    defaultValue={new Date()}
                                    onChange={(e)=>
                                        this.setValueRecaudar({
                                            target:{
                                                name:'collected_date',value:moment(e).format("YYYY-MM-DD")}})}
                                />
                                <br/>
                            </Col>
                            <Col md={12}>
                                <ControlLabel>Forma de Pago</ControlLabel>
                                <select name={'payment_method'} onChange={(e)=>
                                    this.setValueRecaudar(e)} className={'form-control'}>
                                    <option>Seleccione</option>
                                    <option>Efectivo</option>
                                    <option>Tarjeta crédito</option>
                                    <option>Transferencia</option>
                                    <option>Nota de crédito</option>
                                </select>
                                <br/>
                            </Col>
                            <Col md={12}>
                                <ControlLabel  >Codigo Contable</ControlLabel>
                                <input
                                    onChange={(e)=>this.setValueRecaudar(e)}
                                    type={"Text"}
                                    name={'accounting_code'}
                                    placeholder="Modelo"
                                    className="form-control"
                                />
                                <br/>
                            </Col>
                            <Col md={12}>
                                <ControlLabel>Comentario:</ControlLabel>
                                <textarea
                                    onChange={(e)=>this.setValueRecaudar(e)}
                                    type={"Text"}
                                    name={'comment'}
                                    className="form-control"
                                ></textarea>
                                <br/>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={()=>this.savePayToOffice()}>Guardar</Button>
                    </Modal.Footer>
                </Modal>


            </div>
        )
    }
}

export default paymentsClient
