import React, { Component } from 'react'
import {Table, Grid, Row, Col, Tooltip, OverlayTrigger, Pagination, NavDropdown, MenuItem,Nav} from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import Card from "components/Card/Card.jsx";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Skeleton from "react-loading-skeleton";
import Datetime from "react-datetime";
import moment from 'moment';
import { inject,observer} from "mobx-react";
@inject('users')
@observer
 class Datatable extends Component {


  constructor(props){
    super(props)
    this.state = {
      pages:[],
      pageSelect: 1,
      fistPage: 1,
      lastPage: 1,
      itemsPage:[],
      filter: false,
      permissions:[]
    }
  }


 async  UNSAFE_componentWillReceiveProps(nextprops){
    let pages = nextprops.tdArray&&nextprops.tdArray.last_page
    let result =  nextprops.permissions&&this.setPermissions(nextprops.permissions)
    let arraypages=[];
    for (let i = 1; i <= pages; i++) {
      arraypages.push(i)

    }
    this.setState({
      pages: arraypages,
      fistPage: 1,
      lastPage: nextprops.tdArray&&nextprops.tdArray.last_page,
      permissions: result
    })

  }

  componentDidMount(){
    let result =  this.props.permissions&&this.setPermissions(this.props.permissions)
    this.setState({
      permissions: result
    })
  }



  setPermissions(permisions){
    let p = permisions.permissions
    let result = [];

    for (const i in p) {
      if('/admin'+p[i].path === this.props.location.pathname){
          result = p[i].actions
      }
    }
    return result
  }






  selectpage(p){
    this.setState({
      pageSelect:p
    })
    this.props.changePage(p)
  }

  drop(result) {
      let data = result.split('%')
      let name = data[1];
      let id = data[3];
      let parameters = data[4];
      let options = data[2].split(',')
      return(
          <Nav pullRight>
              <NavDropdown
                  eventKey={3}
                  title={
                      <div>
                          <Button bsStyle="primary" sx >{name}</Button>

                      </div>
                  }
                  noCaret
                  id="basic-nav-dropdown-2"
              >
                  {options.map((data,i)=>
                      <MenuItem eventKey={i} onClick={()=>this.props.dropMethod(id,parameters,data)}>{data}</MenuItem>
                  )}
              </NavDropdown>
          </Nav>
      )
  }


     actions = (id) =>{
        const view = <Tooltip id="view">Ver Detalle</Tooltip>;
        const edit = <Tooltip id="edit">Editar Registro</Tooltip>;
        const remove = <Tooltip id="remove">Eliminar Registro</Tooltip>;
        return (
            <td className="td-actions text-right">
              {this.props.view&&(
                <OverlayTrigger placement="top" overlay={view}>
                <Button simple bsStyle="info" onClick={()=> this.props.view(id)} bsSize="md">
                  <i className="fa fa-user" />
                </Button>
              </OverlayTrigger>
              )}
              {this.props.edit&&(
                <OverlayTrigger placement="top" overlay={edit}>
                <Button simple bsStyle="success" onClick={()=> this.props.edit(id)} bsSize="md">
                  <i className="fa fa-edit" />
                </Button>
              </OverlayTrigger>
              )}
              {this.props.remove&&(
                <OverlayTrigger placement="top" overlay={remove}>
                <Button simple bsStyle="danger" onClick={()=>this.props.remove(id)} bsSize="md">
                  <i className="fa fa-times" />
                </Button>
              </OverlayTrigger>
              )}
            </td>
          );
    }
    render() {
        return (
            <Grid fluid>
            <Row>

                <Col md={12}>

                {this.state.permissions.includes('create')&&this.props.create&&(
                    <div>
                    {this.props.loading&&(<Skeleton  height={30} width={70}/>)}
                    {!this.props.loading&&(<Button bsStyle="primary" fill wd onClick={()=>this.props.create()}>{this.props.titleBtn}</Button>)}
                    <br/><br/>
                    </div>
                )}
                <Card
                    title={this.props.title}
                    category={this.props.subtitle}
                    tableFullWidth
                    content={
                    <div style={{padding: 2}}>



                    <div >
                      <div style={{ justifyContent: 'space-between ', display: 'flex',  flexSelf:'felx-end'}}>
                        <div>
                        {this.state.permissions.includes('delete')&&this.props.deleteMethod&& this.props.items.length>0&&(
                          <OverlayTrigger placement="top" overlay={ <Tooltip id="remove">Eliminar Registro</Tooltip>}>
                            <Button simple bsStyle="danger" onClick={()=>this.props.deleteMethod()} bsSize="xl">
                              <i className="fa fa-trash" style={{fontSize: 20}} />
                            </Button>
                          </OverlayTrigger>
                        )}
                        </div>

                        {this.props.filter&&(
                          <div  style={{ justifyContent: 'space-around', display: 'flex', paddingRight:20}}>
                          <Button bsStyle="dark"  style={{height:35}} onClick={()=>this.setState({filter:!this.state.filter})}><i className="fa fa-filter"  />{"Filtros"}</Button>
                            &ensp;
                            {this.props.loading&&(<Skeleton  height={30} width={180}/>)}
                            {!this.props.loading&&( <input  className="form-control" align="left" style={{width:300, height:35}} onChange={(e)=> this.props.searchFilter(e)}   placeholder="Buscar..." name="serchCompanies"  type="serch" />)}

                        </div>
                        )}

                      </div>
                    </div>
                    <div style={{ justifyContent: 'flex-start', display: 'flex', paddingLeft:20}}>
                    {this.state.filter&&
                      this.props.filterDate&&(
                        <div style={{ justifyContent: 'space-around', display: 'flex',}}>
                          <div>
                            <label>Desde</label>
                            <Datetime
                            timeFormat={false}
                            name={"dateStart"}
                            inputProps={{ placeholder: 'Desde' }}
                            onChange={(e)=> this.props.filterDate(moment(e).format('YYYY-MM-DD'),'dateStart')}
                            defaultValue={new Date()}
                            />
                          </div>
                          &ensp;
                          &ensp;
                          <div>
                            <label>Hasta</label>
                            <Datetime
                            timeFormat={false}
                            name={"dateEnd"}
                            inputProps={{ placeholder: 'Hasta'}}
                            onChange={(e)=>  this.props.filterDate(moment(e).format('YYYY-MM-DD'),'dateEnd')}
                            defaultValue={new Date()}
                            />
                          </div>

                        </div>
                      )}
                    </div>
                    {this.props.loading&&( <Table striped hover responsive><Skeleton  height={300} width={'100%'}/></Table>)}
                   {!this.props.loading&&(
                      <Table striped hover responsive>
                          <thead>
                          <tr>
                          <th><Checkbox number="all"/></th>
                          <th>#</th>
                              {this.props.thArray.map((prop, key) => {
                              return <th key={key}>{prop}</th>;
                              })}
                          </tr>
                          </thead>
                          <tbody>
                          {this.props.tdArray.data&&this.props.tdArray.data.map((prop, key) => {
                              return (
                              <tr key={key} style={{cursor:'pointer'}}>
                              <td key={key}><Checkbox checked={ this.props.items.filter(e=>e ===prop[0]).length>0}  onClick={(e)=>this.props.selectedItem&&this.props.selectedItem(prop[0],e)} number={key+prop[0]+prop[1]+(this.props.view?this.props.view:'none')}/></td>
                              {/* <td onClick={()=>this.state.permissions.includes('detail') || this.state.permissions.includes('update')?this.props.openDetail&&this.props.openDetail(prop[0]):{}} >{key+1}</td> */}
                                  {prop.map((item, i) => {


                                      if( item && item.toString().substring(0, 2)==="c%"){
                                          return <td style={{color: item && item.toString().substring(0, 2)==="c%"? item.split("%")[1]:"black"}}  onClick={()=>this.state.permissions.includes('detail') || this.state.permissions.includes('update')?this.props.openDetail&&this.props.openDetail(prop[0]):{}} key={i}>{item.toString().substring(0, 2)==="c%"? item.split("%")[2]:item}</td>

                                      }
                                    if( item && item.toString().substring(0, 4)==="http"){
                                      return <td  onClick={()=> this.state.permissions.includes('detail') || this.state.permissions.includes('update')?this.props.openDetail&&this.props.openDetail(prop[0]):{}} key={i}><img src={item} alt="logo" className="img-fluid" width="40"/></td>
                                    }
                                    if( item && item.toString().substring(0, 2)==="b%"){
                                      return <td  onClick={()=> this.state.permissions.includes('detail') || this.state.permissions.includes('update')?this.props.buttonAction&&this.props.buttonAction(item.toString().split("%")[2]):{}} key={i}>
                                      <Button bsStyle="primary" sx onClick={()=>this.props.buttonAction(item.toString().split("%")[2])}>{item.toString().split("%")[1]}</Button></td>
                                    }
                                      if( item && item.toString().substring(0, 5)==="drop%"){
                                          return <td  onClick={()=> this.state.permissions.includes('detail') || this.state.permissions.includes('update')?this.props.buttonAction&&this.props.buttonAction(item.toString().split("%")[2]):{}} key={i}>
                                              {this.drop(item)}
                                          </td>
                                      }
                                    if(prop.length-1===i) return  <td key={i}>{item}</td>;

                                    return <td   onClick={()=>this.state.permissions.includes('detail') || this.state.permissions.includes('update')?this.props.openDetail&&this.props.openDetail(prop[0]):{}} key={i}>{item}</td>

                                  })}
                              </tr>
                              );
                          })}
                          {!this.props.tdArray.data &&(
                              <tr><td colSpan={10} style={{fontSize: 20}}><center>No hay registros...</center></td></tr>
                          )}
                          </tbody>

                      </Table>
                   )}
                   {this.props.loading&&(<Table striped hover responsive><Skeleton  height={30} width={'20%'}/></Table>)}
                    {this.state.pages.length>0&&(
                          <Pagination className="pagination-blue" style={{paddingLeft: 10}}>
                              <Pagination.First  onClick={()=> this.selectpage(this.state.fistPage)} />
                              {this.state.pages.length>0&&
                              this.state.pages.map((p,i)=>(
                                <Pagination.Item active={this.state.pageSelect === p} onClick={()=> this.selectpage(p)}>{p}</Pagination.Item>
                              ))}
                              <Pagination.Last  onClick={()=> this.selectpage(this.state.lastPage)}/>
                          </Pagination>
                        )}
                    </div>
                    }
                />
                </Col>
            </Row>

        </Grid>
        )
    }
}

export default Datatable;
