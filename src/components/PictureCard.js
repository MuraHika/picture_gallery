import React, { Component } from 'react'
import {Select, Input, Pagination, Range} from 'fwt-internship-uikit'
import "./PicturePage.css";

class PictureCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'container_card'} style={{backgroundImage: 'url('+ this.props.src_img + ')'}}>
                <div className={'card_footer'}>
                    <h1>{this.props.picture}</h1>
                    <div className={'card_footer-row'}>
                        <h2>Author: </h2>
                        <p>{this.props.author}</p>
                    </div>
                    <div className={'card_footer-row'}>
                        <h2>Created: </h2>
                        <p>{this.props.year}</p>
                    </div>
                    <div className={'card_footer-row'}>
                        <h2>Location: </h2>
                        <p>{this.props.location}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default PictureCard;