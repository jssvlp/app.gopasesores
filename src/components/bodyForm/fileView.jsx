import React, { Component } from "react";
import {
  Row,
  Col,
  Grid,
  FormGroup,
  ControlLabel,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import FileViewer from "react-file-viewer";

export default class fileBody extends Component {

    constructor(props){
        super(props)
    }


    onError = (e) => {
        console.log(e, "error in file-viewer"); 
      };

      shouldComponentUpdate(nextState,nextProps){
          return nextState !== this.props
      }

      

  render() {
    const { data } = this.props;
    console.log(`data`, data)
    return (
      <div>
        <a href={data.data}>lalo</a>
      </div>
    );
  }
}
