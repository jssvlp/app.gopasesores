import React, { Component } from 'react'
import { Table, Grid, Row, Col,Tooltip,OverlayTrigger,Button as Button2, Pagination,FormControl,FormGroup } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import Card from "components/Card/Card.jsx";
import Select from "react-select";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Skeleton from "react-loading-skeleton";

export default class Datatable extends Component {


  constructor(props){
    super(props)
    this.state = {
      pages:[],
      pageSelect: 1,
      fistPage: 1,
      lastPage: 1,
      itemsPage:[]
    }
  }


  UNSAFE_componentWillReceiveProps(nextprops){
    let pages = nextprops.tdArray&&nextprops.tdArray.last_page
    let arraypages=[];
    for (let i = 1; i <= pages; i++) {
      arraypages.push(i) 
      
    }
    this.setState({
      pages: arraypages,
      fistPage: 1,
      lastPage: nextprops.tdArray&&nextprops.tdArray.last_page,
    })
    console.log('this.state', nextprops.tdArray)
  }

  


  selectpage(p){
    this.setState({
      pageSelect:p
    })
    this.props.changePage(p)
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
                
                {this.props.create&&(
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

                    {this.props.deleteMethod&& this.props.items.length>0&&(
                      <OverlayTrigger placement="top" overlay={ <Tooltip id="remove">Eliminar Registro</Tooltip>}>
                        <Button simple bsStyle="danger" onClick={()=>this.props.deleteMethod()} bsSize="lg">
                          <i className="fa fa-trash" />
                        </Button>
                      </OverlayTrigger>
                    )}

                    <div style={{ justifyContent: 'flex-end', display: 'flex', paddingRight:20}}>

                     <Button simple bsStyle="default"  bsSize="md">
                      <i className="fa fa-filter" />
                    </Button>

                    {this.props.loading&&(<Skeleton  height={30} width={80}/>)}
                    {!this.props.loading&&(
                      <select onChange={(e)=>this.props.changeFilterValue(e)} className="form-control" align="left" style={{width:100, height:35}}>
                      <option value={"Filtrar"}>Filtrar</option>
                      {this.props.filterDataSelect.length>0&&
                        this.props.filterDataSelect.map((data,i)=>(
                          <option value={data.value}>{data.name}</option>
                        )
                      )}
                      </select>
                    )}
                    &nbsp;
                    {this.props.loading&&(<Skeleton  height={30} width={180}/>)}
                    {!this.props.loading&&( <input  className="form-control" align="left" style={{width:300, height:35}} onChange={(e)=> this.props.searchFilter(e)}   placeholder="Buscar..." name="serchCompanies"  type="serch" />)}
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
                              <td key={key}><Checkbox checked={ this.props.items.filter(e=>e ===prop[0]).length>0}  onClick={(e)=>this.props.selectedItem&&this.props.selectedItem(prop[0],e)} number={key}/></td>
                              <td onClick={()=>this.props.openDetail&&this.props.openDetail(prop[0])} >{key+1}</td>
                                  {prop.map((item, i) => {
                                    
                                    if( item && item.toString().substring(0, 4)==="http"){
                                      return <td  onClick={()=>this.props.openDetail&&this.props.openDetail(prop[0])} key={i}><img src={item} alt="logo" className="img-fluid" width="40"/></td>
                                    }
                                    if(i===0) return;
                                    return <td  onClick={()=>this.props.openDetail&&this.props.openDetail(prop[0])} key={i}>{item}</td>
                                  
                                  })}
                              </tr>
                              );
                          })}
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
