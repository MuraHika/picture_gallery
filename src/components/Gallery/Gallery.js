import React from 'react';
import Enumerable from 'linq';
import $ from 'jquery';
import { Select, Input, Pagination } from 'fwt-internship-uikit';
import './Gallery.scss';
import Logo_icon from '@assets/Frame.svg';
import Light_dark_switch from '@assets/light_dark_switch.svg';
import { API, requestOptions } from '@utils/index';
import SelectCreated from "@components/SelectCreated/SelectCreated";
import Card from "../Card/Card";

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
            input_value: '',
            author_id: 0,
            location_id: 0,
            range_from: 1,
            range_before: 2021,
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', (e) => {
            this.searchRange(e);
        });

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        const count = this.updateCountPainting();

        fetch(`${API.GET_PAINTINGS}?_page=1&_limit=${count}`, requestOptions('GET'))
            .then((response) => response.json())
            .then(
                (data) => {
                    this.setState({ paintings: data });
                },
            );

        fetch(API.GET_AUTHORS, requestOptions('GET'))
            .then((response) => response.json())
            .then(
                (data) => {
                    this.setState({ authors: data });
                },
            );

        fetch(API.GET_LOCATIONS, requestOptions('GET'))
            .then((response) => response.json())
            .then(
                (data) => {
                    this.setState({ locations: data });
                },
            );
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        document.removeEventListener('mousedown', (e) => {
            this.searchRange(e);
        });
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
        fetch(`${API.GET_PAINTINGS}?_page=${e}&_limit=${this.state.countPaintingsOnPage}`, requestOptions('GET'))
            .then((response) => response.json())
            .then(
                (data) => {
                    this.setState({ paintings: data });
                },
            );
    };

    updateWindowDimensions = () => {
        this.setState({ window_width: window.innerWidth });
        this.updateCountPainting();
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

    appearPopupRange = () => {
        const popup = document.getElementById('select_popup_range');
        if (popup.style.display === 'none') {
            popup.style.display = 'flex';
        }
    };

    searchPaintingOnInput = () => {
        const i = document.getElementById('inputSearch');
        this.setState({ input_value: i.value });
        this.searchPaint(i.value, this.state.author_id, this.state.location_id);
    };

    searchRange = (e) => {
        const container = $("#select_popup_range");
        if (container.has(e.target).length === 0) {
            const span = document.getElementById('select_range_span');
            const from = document.getElementById('select_range_input_from').value;
            const before = document.getElementById('select_range_input_before').value;
            if (from !== '' || before !== '') {
                span.innerText = `${from === '' ? this.state.range_from : from} - ${before === '' ? this.state.range_before : before}`;
            } else {
                span.innerText = 'Created';
            }
            this.searchPaint(this.state.input_value, this.state.author_id, this.state.location_id);
            container.hide();
        }
    };

    searchAuthor = (e_author) => {
        let author_id = '';
        this.state.authors.forEach((el) => {
            if (el.name === e_author) {
                author_id = el.id;
            }
        });
        this.setState({ select_author: e_author, author_id });
        this.searchPaint(this.state.input_value, author_id, this.state.location_id);
    };

    searchLocation = (e_location) => {
        let location_id = '';
        this.state.locations.forEach((el) => {
            if (el.location === e_location) {
                location_id = el.id;
            }
        });
        this.setState({ select_location: e_location, location_id });
        this.searchPaint(this.state.input_value, this.state.author_id, location_id);
    };

    searchPaint = (e_input, e_author, e_location) => {
        const range = document.getElementById('select_range_span').innerText;

        let url = `${API.GET_PAINTINGS}?&_limit=${this.state.countPaintingsOnPage}`;
        if (e_input !== '') {
            url += `&q=${e_input}`;
        }
        if (e_author !== 0) {
            url += `&authorId=${e_author}`;
        }
        if (e_location !== 0) {
            url += `&locationId=${e_location}`;
        }
        if (range !== 'Created') {
            const from = range.replace(" - ", ' ').split(' ')[0];
            const before = range.replace(" - ", ' ').split(' ')[1];

            if (from !== '') {
                url += `&created_gte=${from}`;
            }
            if (before !== '') {
                url += `&created_lte=${before}`;
            }
        }

        fetch(url, requestOptions('GET'))
            .then((response) => response.json())
            .then(
                (data) => {
                    this.setState({ paintings: data });
                },
            );
    };

    render() {
        return (
          <div className="gallery">
            <div className="header">
              <Logo_icon id="logo" />
              <Light_dark_switch className="header__switch" onClick={this.changeTheme} id="switch" />
            </div>

            <div className={`filters ${this.state.theme}`}>
              <Input id="inputSearch" className={`filters__input ${this.state.theme}`} value={this.state.input_value} placeholder="Name" onInput={this.searchPaintingOnInput} />
              <div className={`filters__select ${this.state.theme}`}>
                <Select
                  options={this.state.authors.map((el) => ({ id: el.id, name: el.name }))}
                  value={this.state.select_author}
                  disabled={false}
                  onChange={(e) => { this.searchAuthor(e); }}
                />
              </div>

              <div className={`filters__select ${this.state.theme}`}>
                <Select
                  options={this.state.locations.map((el) => ({ id: el.id, name: el.location }))}
                  value={this.state.select_location}
                  disabled={false}
                  onChange={(e) => { this.searchLocation(e); }}
                />
              </div>

              <div
                className={`filters__select ${this.state.theme}`}
                onClick={this.appearPopupRange}
                id="select_created"
              >
                <SelectCreated theme={this.state.theme} />
              </div>
            </div>

            <div className={`paintings ${this.state.theme}`}>
              <div className={`paintings__gallery ${this.state.theme}`}>
                {this.state.paintings.map((el) => {
                    if (this.state.locations.length > 0 && this.state.authors.length > 0) {
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
              <div className={`paintings__pagination ${this.state.theme}`}>
                <Pagination
                  pagesAmount={Math.ceil(33 / this.state.countPaintingsOnPage)}
                  currentPage={this.state.currentPage}
                  onChange={(e) => { this.selectPage(e); }}
                />
              </div>
            </div>
          </div>
        );
    }
}

export default Gallery;
