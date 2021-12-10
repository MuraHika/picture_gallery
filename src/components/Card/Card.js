import React from 'react';
import "./Card.scss";

class Card extends React.Component {
    render() {
        return (
          <div className="container-card" style={{ backgroundImage: `url(${this.props.src_img})` }}>
            <div className="container-card__footer">
              <h1>{this.props.picture}</h1>
              <div className="container-card__footer__row">
                <h2>Author: </h2>
                <p>{this.props.author}</p>
              </div>
              <div className="container-card__footer__row">
                <h2>Created: </h2>
                <p>{this.props.year}</p>
              </div>
              <div className="container-card__footer__row">
                <h2>Location: </h2>
                <p>{this.props.location}</p>
              </div>
            </div>
          </div>
        );
    }
}

export default Card;
