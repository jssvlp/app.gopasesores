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
import { Tooltip, OverlayTrigger } from "react-bootstrap";

import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

export class Tasks extends Component {
  handleCheckbox = (event) => {
    const target = event.target;
    console.log(event.target);
    this.setState({
      [target.name]: target.checked,
    });
  };
  render() {
    console.log("this.props", this.props);
    var tasks = [];

    return (
      <tbody>
        {this.props.data &&
          this.props.data.map((item, i) => (
            <tr
              key={i}
              style={{
                border: item.is_today ? "" : "",
                backgroundColor: item.is_today ? "#fb404b" : "white",
                color: item.is_today ? "white" : "black",
                borderRadius: 40,
              }}
            >
              <td>
                {item.is_today && (
                  <i
                    className="pe-7s-gift"
                    style={{ fontSize: 20, color: "white" }}
                  />
                )}{" "}
                {item.first_name + " " + item.last_name}
              </td>
              <td>
                {item.is_today
                  ? "Hoy!"
                  : item.is_tomorrow
                  ? "Mañana"
                  : item.birth_date}
              </td>
              {item.is_today && (
                <td className="td-actions text-right">
                  <i
                    className="pe-7s-gift"
                    style={{ fontSize: 20, color: "white" }}
                  />
                </td>
              )}

              {item.is_tomorrow && (
                <td className="td-actions text-right">
                  <i
                    className="pe-7s-clock text-info"
                    style={{ fontSize: 20 }}
                  />
                </td>
              )}
              {!item.is_tomorrow && !item.is_today && (
                <td className="td-actions text-right">
                  <i
                    className="pe-7s-bell text-warning"
                    style={{ fontSize: 20 }}
                  />
                </td>
              )}
            </tr>
          ))}
      </tbody>
    );

    return <tbody>{tasks}</tbody>;
  }
}

export default Tasks;
