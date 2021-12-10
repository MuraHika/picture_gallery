import React from 'react';
import "./SelectCreated.scss";
import Arrow from '@assets/arrow.svg';
import { Input } from "fwt-internship-uikit";

class SelectCreated extends React.Component {
    render() {
        return (
          <div id="select_range" className="Select">
            <span id="select_range_span">Created</span>
            <div className="Select__arrow"><Arrow /></div>
            <div className="select__popup" id="select_popup_range" style={{ display: 'none' }}>
              <Input id="select_range_input_from" className={`select__popup__range ${this.props.theme}`} placeholder="from" />
              <div className="select__popup__line" />
              <Input id="select_range_input_before" className={`select__popup__range ${this.props.theme}`} placeholder="before" />
            </div>
          </div>
        );
    }
}

export default SelectCreated;
