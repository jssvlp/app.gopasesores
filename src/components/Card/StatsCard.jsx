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

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
export class StatsCard extends Component {
  render() {
    return (
      <div className="card card-stats">
        <div className="content">
          <div className="row">
            <div className="col-xs-5">
              <div className="icon-big text-center icon-warning">
                {this.props.bigIcon || <Skeleton circle={true} height={50} width={50} />}
              </div>
            </div>
            <div className="col-xs-7">
              <div className="numbers">
                <p>{this.props.statsText ||  <Skeleton />}</p>
                {this.props.statsValue ||  <Skeleton />}
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <hr />
          <div className="stats">
            {this.props.statsIcon } {this.props.statsIconText ||  <Skeleton />}
          </div>
        </div>
      </div>
    );
  }
}

export default StatsCard;
