import React, { Component } from 'react'
import Enumerable from 'linq'
import {Select, Input, Pagination, Range} from 'fwt-internship-uikit'
import PictureCard from "./PictureCard"
import './PicturesPage.scss';
import im1 from '../assets/2.jpg'
import im2 from '../assets/im.png'
import Logo_icon from '../assets/Frame.svg'
import Light_dark_switch from '../assets/light_dark_switch.svg'
import Arrow from '../assets/arrow.svg'
// import './PicturePageDark.css'

class PicturePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            paintings: [],
            authors: [],
            locations: [],
            currentPage: 1,
            countPaintingsOnPage: window.innerWidth >= 1024? 9 : window.innerWidth >= 768? 8 : 6,
            select_author: 'Author',
            select_location: 'Location',
            theme: 'light',
            window_width: window.innerWidth
        }
    }

    request = () => {
        const header = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            mode: "cors",
            referrer: "origin-when-cross-origin"
        }

        console.log(this.state.currentPage);
        fetch(`https://test-front.framework.team/paintings?_page=${this.state.currentPage}&_limit=${this.state.countPaintingsOnPage}`, header)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log('paintings', data);
                    this.setState( {paintings: data})
                }
            );
    }

    updateCountPainting = () => {
        let count = 0;
        if(this.state.window_width >= 1024){
            count = 9;
            this.setState({countPaintingsOnPage: count});
            this.request();
        } else if (this.state.window_width >= 768 && this.state.window_width < 1024) {
            count = 8;
            this.setState({countPaintingsOnPage: count});
            this.request();
        } else if (this.state.window_width < 768) {
            count = 6;
            this.setState({countPaintingsOnPage: count});
            this.request();
        }
        return count;
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        console.log(this.state.window_width);
        const count = this.updateCountPainting();
        console.log(this.state.countPaintingsOnPage);
        const header = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            mode: "cors",
            referrer: "origin-when-cross-origin"
        }

        fetch(`https://test-front.framework.team/paintings?_page=1&_limit=${count}`, header)
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

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {

        this.setState({ window_width: window.innerWidth });
        this.updateCountPainting();
        console.log(this.state.window_width);
    }


    selectPage = (e) => {
        console.log(e);
        this.setState({currentPage: e});
        this.request();
    }

    changeTheme = () => {
        this.setState({theme: this.state.theme === 'light'? 'dark' : 'light'});
        document.getElementById('root').className = this.state.theme === 'light'? 'dark' : 'light';
    }

    selectCreated = () => {
        let popup = document.getElementById('select_popup_created');
        let select = document.getElementById('select_created');
        console.log(popup.style.display);
        if (popup.style.display === 'none') {
            console.log('flex');
            popup.style.display = 'flex';
            // select.style.height = 'fit-content';
        } else {
            console.log('none');
            popup.style.display = 'none';
            select.style.height = '45px';
        }
    }

    render() {
        return (
            <div className={''}>
                <div className={'block'}>
                    <div className={'svg_block'}>
                        <Logo_icon id={'logo'}/>
                        <Light_dark_switch className={'light_dark_switch'} onClick={this.changeTheme} id={'switch'}/>
                    </div>
                    <div className={`filters_block ${this.state.theme}`}>
                        <Input className={`input_picture ${this.state.theme}`} placeholder={'Name'}/>
                        <div className={`select_picture ${this.state.theme}`}>
                            <Select
                                options={this.state.authors.map(el => ( {id:el.id, name:el.name}))}
                                value={this.state.select_author}
                                disabled={false}
                                onChange={(e) => {this.setState({select_author: e})}}
                            />
                        </div>

                        <div className={`select_picture ${this.state.theme}`}>
                            <Select
                                options={ this.state.locations.map(el => ( {id:el.id, name:el.location}))}
                                value={this.state.select_location}
                                disabled={false}
                                onChange={(e) => {this.setState({select_location: e})}}
                            />
                        </div>

                        <div className={`select_picture ${this.state.theme}`} onClick={this.selectCreated} id={'select_created'}>
                            <div className={'Select'} >
                                <span>Created</span>
                                <div className={'Select__arrow'}><Arrow/></div>
                                <div className={'select_popup_created'} id={'select_popup_created'} style={{display: 'none'}}>
                                     <Input className={`select_created ${this.state.theme}`} placeholder={'from'}/>
                                     <div className={'select_line'}></div>
                                     <Input className={`select_created ${this.state.theme}`} placeholder={'before'}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`main_block ${this.state.theme}`}>
                        <div className={`pictures_gallery ${this.state.theme}`}>
                            {this.state.paintings.map(el => {
                                if(this.state.locations.length > 0 ){
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
                        <div className={`pagination ${this.state.theme}`}>
                            <Pagination pagesAmount={Math.ceil(33/this.state.countPaintingsOnPage)} currentPage={this.state.currentPage} onChange={(e) => {this.selectPage(e)}}></Pagination>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default PicturePage;