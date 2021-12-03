import React, { Component } from 'react'
import "./SelectCreated.scss";
import Arrow from '@assets/arrow.svg'
import {Input} from "fwt-internship-uikit";

class SelectCreated extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'Select'} >
                <span>Created</span>
                <div className={'Select__arrow'}><Arrow/></div>
                <div className={'select_popup_created'} id={'select_popup_created'} style={{display: 'none'}}>
                    <Input className={`select_created ${this.props.theme}`} placeholder={'from'}/>
                    <div className={'select_line'}></div>
                    <Input className={`select_created ${this.props.theme}`} placeholder={'before'}/>
                </div>
            </div>
        );
    }
}

export default SelectCreated;