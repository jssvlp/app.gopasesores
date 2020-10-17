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
                statsIconText="Total de clientes"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Pólizas"
                statsValue={
                  statistics.getDataStatistics.statistics &&
                  statistics.getDataStatistics.statistics.policies.total
                }
                statsIcon={<i className="fa fa-info" />}
                statsIconText="Total pólizas registradas"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-car text-danger" />}
                statsText="Siniestros"
                statsValue={
                  statistics.getDataStatistics.statistics &&
                  statistics.getDataStatistics.statistics.policies
                    .with_opened_sinister
                }
                statsIcon={<i className="fa fa-info" />}
                statsIconText="Siniestros Abiertos"
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
                category="según el tipo"
                content={
                  (statistics.getDataStatistics.statistics &&
                    statistics.getDataStatistics.statistics.clients && (
                      <ChartistGraph
                        data={{
                          labels: Object.values(
                            statistics.getDataStatistics.statistics.clients
                              .by_type.percentages
                          ),
                          series: Object.values(
                            statistics.getDataStatistics.statistics.clients
                              .by_type.series
                          ),
                        }}
                        type="Pie"
                      />
                    )) || <Skeleton circle={true} height={300} width={300} />
                }
                legend={
                  <div>
                    {statistics.getDataStatistics.statistics &&
                      statistics.getDataStatistics.statistics.clients &&
                      statistics.getDataStatistics.statistics.clients.by_type.labels.map(
                        (item, i) => (
                          <div>
                            <i
                              className={
                                "fa fa-circle " +
                                (i === 0
                                  ? "text-info"
                                  : i === 1
                                  ? "text-danger"
                                  : "text-warning")
                              }
                            ></i>
                            {item}
                          </div>
                        )
                      )}
                  </div>
                }
                stats={
                  <div>
                    <i className="fa fa-info" /> Todos los clientes registrados.
                  </div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                title="Pólizas"
                category="por aseguradoras"
                content={
                  (statistics.getDataStatistics.statistics &&
                    statistics.getDataStatistics.statistics.policies && (
                      <ChartistGraph
                        data={{
                          labels: Object.values(
                            statistics.getDataStatistics.statistics.policies
                              .by_insurances.percentages
                          ),
                          series: Object.values(
                            statistics.getDataStatistics.statistics.policies
                              .by_insurances.series
                          ),
                        }}
                        type="Pie"
                      />
                    )) || <Skeleton circle={true} height={300} width={300} />
                }
                legend={
                  <div>
                    {statistics.getDataStatistics.statistics &&
                      statistics.getDataStatistics.statistics.policies &&
                      statistics.getDataStatistics.statistics.policies.by_insurances.labels.map(
                        (item, i) => (
                          <div>
                            <i
                              className={
                                "fa fa-circle " +
                                (i === 0
                                  ? "text-info"
                                  : i === 1
                                  ? "text-danger"
                                  : "text-warning")
                              }
                            ></i>
                            {item}
                          </div>
                        )
                      )}
                  </div>
                }
                stats={
                  <div>
                    <i className="fa fa-info" /> Las 5 aseguradoras con más
                    pólizas.
                  </div>
                }
              />
            </Col>
            <Col md={4}>
              <Card
                title="Pólizas"
                category="por ramos"
                content={
                  (statistics.getDataStatistics.statistics &&
                    statistics.getDataStatistics.statistics.policies && (
                      <ChartistGraph
                        data={{
                          labels: Object.values(
                            statistics.getDataStatistics.statistics.policies
                              .by_branches.percentages
                          ),
                          series: Object.values(
                            statistics.getDataStatistics.statistics.policies
                              .by_branches.series
                          ),
                        }}
                        type="Pie"
                      />
                    )) || <Skeleton circle={true} height={300} width={300} />
                }
                legend={
                  <div>
                    {statistics.getDataStatistics.statistics &&
                      statistics.getDataStatistics.statistics.policies &&
                      statistics.getDataStatistics.statistics.policies.by_branches.labels.map(
                        (item, i) => (
                          <div>
                            <i
                              className={
                                "fa fa-circle " +
                                (i === 0
                                  ? "text-info"
                                  : i === 1
                                  ? "text-danger"
                                  : "text-warning")
                              }
                            ></i>
                            {item}
                          </div>
                        )
                      )}
                  </div>
                }
                stats={
                  <div>
                    <i className="fa fa-info" /> Los 5 ramos con más pólizas
                  </div>
                }
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card
                title="Cumpleaños"
                category="de los clientes en el presente  mes"
                content={
                  <table className="table">
                    <Tasks
                      data={
                        statistics.getDataStatistics.statistics &&
                        statistics.getDataStatistics.statistics.birthdays &&
                        statistics.getDataStatistics.statistics.birthdays
                      }
                    />
                  </table>
                }
                stats={
                  <div>
                    <i className="fa fa-history" /> Actualizado hoy
                  </div>
                }
              />
            </Col>
            <Col md={6}>
              <Card
                title="Cantidad de clientes registrados por mes"
                category="en el presente año"
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
                        options={{
                          low: 0,
                          high:
                            statistics.getDataStatistics.statistics &&
                            statistics.getDataStatistics.statistics.clients &&
                            Math.max(
                              Object.values(
                                statistics.getDataStatistics.statistics.clients
                                  .new_by_month_in_this_year.series
                              )
                            ),
                          showArea: false,
                          height: "245px",
                          axisX: {
                            showGrid: false,
                          },
                          axisY: {
                            showGrid: true,
                          },
                          lineSmooth: true,
                          showLine: true,
                          showPoint: true,
                          fullWidth: true,
                          chartPadding: {
                            right: 50,
                          },
                        }}
                        responsiveOptions={responsiveSales}
                      />
                    )) || <Skeleton height={300} width={750} />
                }
                legend={
                  <div>
                    <i className="fa fa-circle text-info" /> Cantidad de
                    clientes
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
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
