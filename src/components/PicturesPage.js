import React, { Component } from 'react'
import Enumerable from 'linq';
import {Select, Input, Pagination, Range} from 'fwt-internship-uikit'
import PictureCard from "./PictureCard"
import im1 from '../assets/2.jpg'
import im2 from '../assets/im.png'
import Logo_icon from '../assets/Frame.svg'
import './PicturePageDark.css'

class PicturePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            paintings: [],
            authors: [],
            locations: [],
            currentPage: 1,
            countPaintingsOnPage: 9,
            select_author: 'Author',
            select_location: 'Location'
        }
    }

    componentDidMount() {
        const header = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            mode: "no-cors",
            referrer: "origin-when-cross-origin"
        }

        fetch('https://test-front.framework.team/paintings?_page=1&_limit=9', header)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log('paintings', data);
                    this.setState( {paintings: data})
                }
            );

        fetch('https://test-front.framework.team/authors', header)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log('authors', data);
                    this.setState( {authors: data})
                }
            );

        fetch('https://test-front.framework.team/locations', header)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log('locations', data);
                    this.setState( {locations: data})
                }
            );
    }

    selectPage = (e) => {
        console.log(e);
        this.setState({currentPage: e});
        fetch(`https://test-front.framework.team/paintings?_page=${e}&_limit=9`, header)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log('paintings', data);
                    this.setState( {paintings: data})
                }
            );
    }

    render() {
        return (
            <div className={''}>
                {/*<Logo_icon />*/}
                <div className={'filters_block'}>
                    <Input className={'input_picture'} placeholder={'Name'}></Input>
                    <div className={'select_picture'}>
                        {/*<Select*/}
                        {/*    id={1}*/}
                        {/*    options={this.state.authors.map(el => ( {id:el.id, name:el.name}))}*/}
                        {/*    value={'Author'}*/}
                        {/*    disabled={false}*/}
                        {/*></Select>*/}
                        <Select
                            id={1}
                            options={[{id:1, name:'el.name1'},{id:2, name:'el.name2'}, {id:3, name:'el.name3'}]}
                            value={this.state.select_author}
                            disabled={false}
                            onChange={(e) => {this.setState({select_author: e})}}
                        ></Select>
                    </div>

                    <div className={'select_picture'}>
                        <Select
                            id={2}
                            options={ this.state.locations.map(el => ( {id:el.id, name:el.location}))}
                            value={this.state.select_location}
                            disabled={false}
                            onChange={(e) => {this.setState({select_location: e})}}
                        ></Select>
                    </div>

                    <div className={'select_picture'}>
                        <Select id={3} options={
                            [{id:1, name:'One'},
                                {id: 2, name: 'Two'}]
                        } value={'Created'} disabled={false}>
                        </Select>
                    </div>
                </div>

                <div className={'main_block'}>
                    <div className={'pictures_gallery'}>
                        {this.state.paintings.map(el => {
                            if(this.state.locations.length > 0  ){
                            // console.log(Enumerable.from(this.state.authors).where(el_auth => el_auth.id  === el.authorId).select(author => author.name ).first());
                                return <PictureCard
                                    // src_img={el.imageUrl}
                                    src_img={im1}
                                    picture={el.name}
                                    author={Enumerable.from(this.state.authors).where(el_auth => el_auth.id === el.authorId).select(author => author.name).first()}
                                    year={el.created}
                                    location={Enumerable.from(this.state.locations).where(el_loc => el_loc.id === el.locationId).select(location => location.location).first()}
                                    key={el.id}
                                />
                            }})}
                    </div>
                    <div className={'pagination'}>
                        <Pagination pagesAmount={Math.ceil(33/this.state.countPaintingsOnPage)} currentPage={this.state.currentPage} onChange={(e) => {this.selectPage(e)}}></Pagination>
                    </div>
                </div>
            </div>
        );
    }
}

export default PicturePage;