import React, { Component } from 'react'
import {Select, Input, Pagination, Range} from 'fwt-internship-uikit'
import PictureCard from "./PictureCard";
import im1 from '../assets/2.jpg'
import im2 from '../assets/im.png'

class PicturePage extends React.Component {
    render() {
        return (
            <div>
                <PictureCard src_img={im1} picture={'The Night Watch'} author={'Rembrandt'} year={'1642'} location={'The Rijksmuseum'}/>
                <PictureCard src_img={im2} picture={'The Persistence of Memory'} author={'Dali'} year={'1642'} location={'HGSjakdhu'}/>
            </div>
        );
    }
}

export default PicturePage;