import React from 'react';
import Enumerable from 'linq';
import { Select, Input, Pagination } from 'fwt-internship-uikit';
import './Gallery.scss';
import Logo_icon from '@assets/Frame.svg';
import Light_dark_switch from '@assets/light_dark_switch.svg';
import Card from "../Card/Card";
import SelectCreated from "../SelectCreated/SelectCreated";

class Gallery extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            paintings: [],
            authors: [],
            locations: [],
            currentPage: 1,
            countPaintingsOnPage: window.innerWidth >= 1024 ? 9 : window.innerWidth >= 768 ? 8 : 6,
            select_author: 'Author',
            select_location: 'Location',
            theme: 'light',
            window_width: window.innerWidth,
        };
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        const count = this.updateCountPainting();
        const header = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: "cors",
            referrer: "origin-when-cross-origin",
        };

        fetch(`https://test-front.framework.team/paintings?_page=1&_limit=${count}`, header)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log('paintings', data);
                    this.setState({ paintings: data });
                },
            );

        fetch('https://test-front.framework.team/authors', header)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log('authors', data);
                    this.setState({ authors: data });
                },
            );

        fetch('https://test-front.framework.team/locations', header)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log('locations', data);
                    this.setState({ locations: data });
                },
            );
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateCountPainting = () => {
        let count = 0;
        if (this.state.window_width >= 1024) {
            count = 9;
            this.setState({ countPaintingsOnPage: count });
            this.request();
        } else if (this.state.window_width >= 768 && this.state.window_width < 1024) {
            count = 8;
            this.setState({ countPaintingsOnPage: count });
            this.request();
        } else if (this.state.window_width < 768) {
            count = 6;
            this.setState({ countPaintingsOnPage: count });
            this.request();
        }
        return count;
    };

    request = (e) => {
        const header = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: "cors",
            referrer: "origin-when-cross-origin",
        };

        console.log(this.state.currentPage);
        fetch(`https://test-front.framework.team/paintings?_page=${e}&_limit=${this.state.countPaintingsOnPage}`, header)
            .then((response) => response.json())
            .then(
                (data) => {
                    console.log('paintings', data);
                    this.setState({ paintings: data });
                },
            );
    };

    updateWindowDimensions = () => {
        this.setState({ window_width: window.innerWidth });
        this.updateCountPainting();
        console.log(this.state.window_width);
    };

    selectPage = (e) => {
        this.setState({ currentPage: e });
        this.request(e);
    };

    changeTheme = () => {
        this.setState((prevState) => ({
            theme: prevState.theme === 'light' ? 'dark' : 'light',
        }));
        document.getElementById('root').className = this.state.theme === 'light' ? 'dark' : 'light';
    };

    selectCreated = () => {
        const popup = document.getElementById('select_popup_created');
        if (popup.style.display === 'none') {
            popup.style.display = 'flex';
        } else {
            popup.style.display = 'none';
        }
    };

    render() {
        return (
          <div className="">
            <div className="block">
              <div className="svg_block">
                <Logo_icon id="logo" />
                <Light_dark_switch className="light_dark_switch" onClick={this.changeTheme} id="switch" />
              </div>
              <div className={`filters_block ${this.state.theme}`}>
                <Input className={`input_picture ${this.state.theme}`} placeholder="Name" />
                <div className={`select_picture ${this.state.theme}`}>
                  <Select
                    options={this.state.authors.map((el) => ({ id: el.id, name: el.name }))}
                    value={this.state.select_author}
                    disabled={false}
                    onChange={(e) => { this.setState({ select_author: e }); }}
                  />
                </div>

                <div className={`select_picture ${this.state.theme}`}>
                  <Select
                    options={this.state.locations.map((el) => ({ id: el.id, name: el.location }))}
                    value={this.state.select_location}
                    disabled={false}
                    onChange={(e) => { this.setState({ select_location: e }); }}
                  />
                </div>

                <div className={`select_picture ${this.state.theme}`} onClick={this.selectCreated} id="select_created">
                  <SelectCreated theme={this.state.theme} />
                </div>
              </div>

              <div className={`main_block ${this.state.theme}`}>
                <div className={`pictures_gallery ${this.state.theme}`}>
                  {this.state.paintings.map((el) => {
                    if (this.state.locations.length > 0) {
                        return (
                          <Card
                            src_img={`https://test-front.framework.team${el.imageUrl}`}
                            picture={el.name}
                            author={Enumerable.from(this.state.authors)
                                .where((el_auth) => el_auth.id === el.authorId)
                                .select((author) => author.name)
                                .first()}
                            year={el.created}
                            location={Enumerable.from(this.state.locations)
                                .where((el_loc) => el_loc.id === el.locationId)
                                .select((location) => location.location)
                                .first()}
                            key={el.id}
                          />
                        );
                    }
                    return (<></>);
                  })}
                </div>
                <div className={`pagination ${this.state.theme}`}>
                  <Pagination
                    pagesAmount={Math.ceil(33 / this.state.countPaintingsOnPage)}
                    currentPage={this.state.currentPage}
                    onChange={(e) => { this.selectPage(e); }}
                  />
                </div>
              </div>
            </div>

          </div>
        );
    }
}

export default Gallery;
