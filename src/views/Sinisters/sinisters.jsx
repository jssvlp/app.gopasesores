import React, { Component } from 'react'
import Datatable from '../../components/DataTable/Datatable'
import BodyContent from '../../components/bodyForm/contentBody'
import { inject,observer} from "mobx-react";
import Wizzard from '../../components/stepsWizzard/StepsWizzard'
import moment from 'moment';
@inject('sinisters','users')
@observer
class Sinisters extends Component {
    constructor(props){
        super(props)
        this.state = {
            modal:false,
            body:{
                Sinisters:{
                    Sinister_code:"",
                },
                documents: [],
            },
            errors:{
                sinisters:[],
                documents: [],
            },
            sinister_id:null,
            create:false,
            update:false,
            seletectedItems:[],
            dateStart:moment().format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
        }
        this.changePage = this.changePage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.setValue = this.setValue.bind(this);
        this.saveSinister = this.saveSinister.bind(this);
        this.openDetail = this.openDetail.bind(this);
        this.closeWizard = this.closeWizard.bind(this);
        this.updateSinister = this.updateSinister.bind(this);
        this.deleteSinister = this.deleteSinister.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.filterDate = this.filterDate.bind(this);
        this.showPolices = this.showPolices.bind(this);
        this.optionDrop = this.optionDrop.bind(this)

    }

     componentDidMount(){
        const {sinisters} = this.props;
        sinisters.statusLoading(true);
        let idPolicy = this.props.location.state? this.props.location.state.idPolicy? this.props.location.state.idPolicy:null:null
        if(idPolicy){
            this.openModal(idPolicy)
        }
         this.reloadTable();
         this.setState({
             errors:sinisters.fieldErrors
         })
         console.log('sinisters.fieldErrors', sinisters.fieldErrors)
        sinisters.statusLoading(false);

    }

    reloadTable(){
        const {sinisters} = this.props;
         sinisters.getAllSinisters();
    }

    changePage(page){
        const {sinisters} = this.props
        sinisters.getAllSinisters(page);
    }


    openModal(id){
        this.setState({
            create: !this.state.create,
            body:{
                sinisters:{
                    policy_id:id
                },
                documents: [],
                update:false,
            },
        })

    }



   async setValue(name,value,modelName,mask = null){
        const {sinisters} = this.props
        let body = this.state.body;
        if(name ==='status' && this.state.sinister_id){
           await sinisters.activeClicent(value==='Sinistere'?'activate':'deactivate', this.state.sinister_id)
        }
        if(modelName ===null&&body){
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

    async saveSinister(){
        const {sinisters} = this.props
        let body = this.state.body;
        const result = await sinisters.saveSinister(body);
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha creado el Sinistro','Puede verificar en la lista el nuevo Sinistro registrado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')



    }


    async filterDate(date,name){
        const {sinisters} = this.props
        this.setState({
            [name]:date
        });
        let body = {
            filter_values:[
                this.state.dateStart,
                this.state.dateEnd,
            ]
        }
        await sinisters.filterSinister('created_at',1,body);


    }


    async openDetail(id){
        const {sinisters} = this.props;
        console.log('id', id)
        this.props.alertLoading("Espere un momento....",true)
        await sinisters.getSinisterById(id);
        console.log('Sinistersss', sinisters.SinisterByIdInfo)
        delete sinisters.SinisterByIdInfo.sinister.updated_at
        delete sinisters.SinisterByIdInfo.sinister.created_at

        let body ={
            sinisters:sinisters.SinisterByIdInfo.sinister,
            sinister_id:id,
            documents:sinisters.SinisterByIdInfo.sinister.documents
        }
        this.setState({
            body:body,
            create:true,
            update:true,
            documents: [],
            sinister_id:id
        })
        this.verifyErrors();
        this.props.alertLoading("Espere un momento....",false)
    }

    closeWizard(){
        this.setState({
            create: !this.state.create
        })
    }


    async updateSinister(){
        const {sinisters} = this.props
        let body = this.state.body;
        const result = await sinisters.updateSinister(body)
        console.log('result', result)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el Sinistro','Puede verificar en la lista el Sinistro actualizado','success')
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

    async deleteSinister(){
        const {sinisters} = this.props;
        let items =this.state.seletectedItems;
        let allErrorsDelete=[]
        this.props.alertLoading("Eliminando Espere un momento....",true)
        for (const i in items) {
            console.log('items[i]', items[i])
            let result = await sinisters.deleteSinisterById(items[i]);
            !result.success&& allErrorsDelete.push(items[i])

        }
        this.props.alertLoading("Eliminando Espere un momento....",false)
        if(allErrorsDelete.length>0){
            this.props.alertMessage(
                'Ups!, algunos Sinistros no se eliminaron',
                'los siguientes Sinistros no se borraron: ' +allErrorsDelete.toString(),
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

    async optionDrop(id,paid = false,data){
        const {sinisters} = this.props
        let body =  {status : data,sinister_id:id};
        const result = await sinisters.updateSinister(body)
        if(result.success){
            this.props.alertMessage('Se ha actualizado el estado del Sinistro','Puede verificar en la lista el Sinistro actualizado','success')
            this.setState({
                create: false
            })
            this.reloadTable();
        }
        if(!result.success) this.props.alertMessage(result.message,'Favor verificar los datos','error')

    }



    render() {
        const {sinisters,users} = this.props

        console.log('this.state.type Sinister', this.state,sinisters.fields)
        const steps = [
            {
                name:sinisters.fields.sinisters.title,
                errors: this.state.errors.sinisters,
                component: <BodyContent
                            fields={sinisters.fields.sinisters.fields}
                            fieldValues={this.state.body}
                            setValue={this.setValue}
                            errors={this.state.errors.sinisters}
                            alertMessage={this.props.alertMessage}
                            showSteps={false}
                            view={this.state.update?'update':'create'}
                            method={this.state.update&&this.updateSinister}
                            buttonName={this.state.update?"Actualizar":"Guardar"}

                            />
            },
            {
                name: sinisters.fields.documents.title,
                errors: this.state.errors.documents,
                component: (
                  <BodyContent
                    fields={sinisters.fields.documents.fields}
                    fieldValues={this.state.body}
                    setValue={this.setValue}
                    errors={this.state.errors.documents}
                    alertMessage={this.props.alertMessage}
                    alertLoading={this.props.alertLoading}
                    showSteps={false}
                    permissions={users.infoUser}
                    location={this.props.location}
                    view={this.state.update ? "update" : "create"}
                    method={this.state.update?this.updateSinister:this.saveSinister}
                    buttonName={this.state.update ? "Actualizar" : "Guardar"}
                  />
                ),
              },

          ];
        return (
            <div className={!this.state.create?"main-content":""}>
             {this.state.create&&(
                 <Wizzard
                 steps={steps}
                 closeWizard={this.closeWizard}
                 subtitle={ ""}
                 title={this.state.update?'DETALLE DEL SINISTRO': 'CREANDO UN NUEVO  SINISTRO'}
                 />
                 )}

                {!this.state.create&&(
                    <Datatable
                    permissions={users.infoUser}
                    location={this.props.location}
                    buttonAction={this.showPolices}
                    thArray={sinisters.headers}
                    tdArray={sinisters.getDataSinisters}
                    loading={sinisters.loading}
                    selectedItem={this.selectedItem}
                    items={this.state.seletectedItems}
                    deleteMethod={this.deleteSinister}
                    changePage={this.changePage}
                    create={null}
                    openDetail={this.openDetail}
                    dropMethod={this.optionDrop }
                    titleBtn={"Nuevo"}
                    />
                )}



            </div>
        )
    }
}

export default Sinisters
