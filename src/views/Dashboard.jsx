/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Col, Row } from "react-bootstrap";
// react component used to create charts
import ChartistGraph from "react-chartist";
// react components used to create a SVG / Vector map
import Skeleton from "react-loading-skeleton";
import Card from "components/Card/Card.jsx";
import StatsCard from "components/Card/StatsCard.jsx";
import Tasks from "components/Tasks/Tasks.jsx";
import { inject, observer } from "mobx-react";
import {
  dataPie,
  dataSales,
  optionsSales,
  responsiveSales,
  dataBar,
  optionsBar,
  responsiveBar,
  table_data,
} from "variables/Variables.jsx";

@inject("statistics")
@observer
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPieClient: {
        labels: ["0%", "0%"],
        series: [0, 0],
      },
    };
  }

  async componentDidMount() {
    const { statistics } = this.props;
    const result = await statistics.getStatistics();
    this.clientByType();
    console.log("resul Dash", statistics.getDataStatistics, this.state);
  }

  clientByType() {
    const { statistics } = this.props;
    let client = statistics.getDataStatistics.client
      ? statistics.getDataStatistics.clients.by_type
      : null;

    if (client) {
      let dataPieClient = {
        label: [client.company + "%", client.people + "%"],
        series: [client.company, client.people],
      };
      this.setState({
        dataPieClient: dataPieClient,
      });
    }
  }
  createTableData() {
    var tableRows = [];
    for (var i = 0; i < table_data.length; i++) {
      tableRows.push(
        <tr key={i}>
          <td>
            <div className="flag">
              <img src={table_data[i].flag} alt="us_flag" />
            </div>
          </td>
          <td>{table_data[i].country}</td>
          <td className="text-right">{table_data[i].count}</td>
          <td className="text-right">{table_data[i].percentage}</td>
        </tr>
      );
    }
    return tableRows;
  }
  render() {
    const { statistics } = this.props;
    return (
      <div className="main-content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-user text-warning" />}
                statsText="Clientes"
                statsValue={
                  statistics.getDataStatistics.statistics &&
                  statistics.getDataStatistics.statistics.clients.total
                }
                statsIcon={<i className="fa fa-info" />}
                statsIconText="total de clientes"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Polizas"
                statsValue={
                  statistics.getDataStatistics.statistics &&
                  statistics.getDataStatistics.statistics.policies.total
                }
                statsIcon={<i className="fa fa-info" />}
                statsIconText="total polizas registradas"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-portfolio text-danger" />}
                statsText="Sinistros"
                statsValue={
                  statistics.getDataStatistics.statistics &&
                  statistics.getDataStatistics.statistics.policies
                    .with_opened_sinister
                }
                statsIcon={<i className="fa fa-info" />}
                statsIconText="Sinistros Abiertos"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-users text-info" />}
                statsText="Comisionistas"
                statsValue={
                  statistics.getDataStatistics.statistics &&
                  statistics.getDataStatistics.statistics.commissioners
                }
                statsIcon={<i className="fa fa-info" />}
                statsIconText="Total de colaboradores"
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Card
                title="Clientes registrados"
                category="clientes tipo persona y tipo empresa"
                content={
                  (statistics.getDataStatistics.statistics &&
                    statistics.getDataStatistics.statistics.clients && (
                      <ChartistGraph
                        data={{
                          labels: [
                            statistics.getDataStatistics.statistics.clients
                              .by_type.company + "%",
                            statistics.getDataStatistics.statistics.clients
                              .by_type.people + "%",
                          ],
                          series: [
                            statistics.getDataStatistics.statistics.clients
                              .by_type.company,
                            statistics.getDataStatistics.statistics.clients
                              .by_type.people,
                          ],
                        }}
                        type="Pie"
                      />
                    )) || <Skeleton circle={true} height={300} width={300} />
                }
                legend={
                  <div>
                    <i className="fa fa-circle text-info" /> Tipo persona
                    <i className="fa fa-circle text-danger" /> Tipo empresa
                  </div>
                }
                stats={
                  <div>
                    <i className="fa fa-info" /> todas los clientes registrados
                    desde el inicio
                  </div>
                }
              />
            </Col>
            <Col md={8}>
              <Card
                title="Clientes registrados por mes"
                category="todos los clientes registrados desde el inicio"
                content={
                  (statistics.getDataStatistics.statistics &&
                    statistics.getDataStatistics.statistics.clients && (
                      <ChartistGraph
                        data={{
                          labels: Object.values(
                            statistics.getDataStatistics.statistics.clients
                              .new_by_month_in_this_year.labels
                          ),
                          series: Object.values(
                            statistics.getDataStatistics.statistics.clients
                              .new_by_month_in_this_year.series
                          ),
                        }}
                        type="Line"
                        options={optionsSales}
                        responsiveOptions={responsiveSales}
                      />
                    )) || <Skeleton height={300} width={750} />
                }
                legend={
                  <div>
                    <i className="fa fa-circle text-info" /> Usuarios
                  </div>
                }
                stats={
                  <div>
                    <i className="fa fa-history" /> Actualizado hoy
                  </div>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Card
                title="Cumpleaños"
                category="Lista de cumpleaños de clientes"
                content={
                  (
                    <table className="table">
                      <Tasks />
                    </table>
                  ) || <Skeleton height={300} width={330} />
                }
                stats={
                  <div>
                    <i className="fa fa-history" /> Actualizado hace una hora
                  </div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                title="Clientes registrados"
                category="clientes tipo persona y tipo empresa"
                content={
                  (statistics.getDataStatistics.statistics &&
                    statistics.getDataStatistics.statistics.clients && (
                      <ChartistGraph
                        data={{
                          labels: [
                            statistics.getDataStatistics.statistics.clients
                              .by_type.company + "%",
                            statistics.getDataStatistics.statistics.clients
                              .by_type.people + "%",
                          ],
                          series: [
                            statistics.getDataStatistics.statistics.clients
                              .by_type.company,
                            statistics.getDataStatistics.statistics.clients
                              .by_type.people,
                          ],
                        }}
                        type="Pie"
                      />
                    )) || <Skeleton circle={true} height={300} width={300} />
                }
                legend={
                  <div>
                    <i className="fa fa-circle text-info" /> Tipo persona
                    <i className="fa fa-circle text-danger" /> Tipo empresa
                  </div>
                }
                stats={
                  <div>
                    <i className="fa fa-info" /> todas los clientes registrados
                    desde el inicio
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
