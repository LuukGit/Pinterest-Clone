import React from 'react';
import ajax from "../common/ajax-functions.js";
import Masonry from 'react-masonry-component';
var masonryOptions = { transitionDuration: 0 };

class Recent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { images: undefined };
        this.imageError = this.imageError.bind(this);
    }

    componentDidMount() {
        ajax("GET", "/api/images", "", function(data) {
            data = JSON.parse(data);
            this.setState({ images: data });
        }.bind(this));
    }

    imageError(image) {
        var images = this.state.images;
        for (var i = 0; i < images.length; i++) {
            if (images[i].title === image.title
                    && images[i].URL === image.URL
                        && images[i].owner === image.owner) {
                images[i].URL = "http://www.dreamfuel.me/assets/default-no-image.png";
            }
        }
        this.setState({ images: images });
    }

    render() {
        if (this.state.images) {
            if (this.state.images.length > 0) {
                var childElements = this.state.images.map(function(image, index) {
                    return (
                         <li key={index} className="image-element-class">
                             <img src={image.URL} onError={() => {this.imageError(image)}}/>
                             <hr></hr>
                             <h3>{image.title}</h3>
                         </li>
                     );
                }.bind(this));
                return (
                    <Masonry
                        className={'my-gallery-class'} // default ''
                        elementType={'ul'} // default 'div'
                        options={masonryOptions} // default {}
                        disableImagesLoaded={false} // default false
                    >
                        {childElements}
                    </Masonry>
                );
            }
            else {
                return (
                    <div id="recent-empty">
                        Nothing to show...
                    </div>
                );
            }
        }
        else {
            return (
                <div>
                </div>
            );
        }
    }
}

module.exports = Recent;
