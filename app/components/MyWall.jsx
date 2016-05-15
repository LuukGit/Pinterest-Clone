import React from 'react';
import { Modal, Button } from "react-bootstrap";
import ajax from "../common/ajax-functions.js";
import Masonry from 'react-masonry-component';
var masonryOptions = { transitionDuration: 0 };

class MyWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined, title: "", URL: "", showModal: false };
        this.addImage = this.addImage.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleURL = this.handleURL.bind(this);
        this.imageError = this.imageError.bind(this);
    }

    componentDidMount() {
        if(!this.state.user){
            ajax('GET', "/api/user", "", function(data) {
                data = JSON.parse(data);
                if (data !== "no user"){
                    this.setState({ user: data })
                }
            }.bind(this));
        }
    }

    addImage() {
        if (this.state.title !== "" && this.state.URL !== "" && this.state.title.length < 50) {
            var image = { title: this.state.title, URL: this.state.URL, owner: this.state.user.twitter.id };
            this.closeModal();
            ajax("POST", "/api/add/image", JSON.stringify({ image: image, user: this.state.user }), function(data) {
                data = JSON.parse(data);
                if (data !== "bad image") {
                    this.setState({ user: data });
                }
                else {
                    alert("Invalid image link. Please try again.");
                }
            }.bind(this));
        }
        else if (this.state.title.length >= 50) {
            alert("Title has to be shorter than 50 characters!");
        }
        else if (this.state.title === "" && this.state.URL === "") {
            alert("The image needs a title and an image link.");
        }
        else if (this.state.title === "") {
            alert("The image needs a title.");
        }
        else {
            alert("The image needs an image link")
        }
    }

    deleteImage(image) {
        ajax("POST", "/api/delete/image", JSON.stringify({ image: image, user: this.state.user }), function(data) {
            data = JSON.parse(data);
            if (data !== "bad image") {
                this.setState({ user: data });
            }
            else {
                alert("Delete failed. Please try again.");
            }
        }.bind(this));
    }

    openModal() {
        this.setState({ showModal: true });
    }

    closeModal() {
        this.setState({ title: "", URL: "", showModal: false });
    }

    handleTitle(e) {
        this.setState({ title: e.target.value });
    }

    handleURL(e) {
        this.setState({ URL: e.target.value });
    }

    imageError(image) {
        var user = this.state.user;
        var images = user.images;
        for (var i = 0; i < images.length; i++) {
            if (images[i].title === image.title
                    && images[i].URL === image.URL
                        && images[i].owner === image.owner) {
                images[i].URL = "http://www.dreamfuel.me/assets/default-no-image.png";
            }
        }
        user.images = images;
        this.setState({ user: user });
    }

    render() {
        if (this.state.user) {
            var childElements = this.state.user.images.map(function(image, index) {
                return (
                     <li key={index} className="image-element-class">
                         <div className="image-remove">
                             <button className="btn btn-default" onClick={() => {this.deleteImage(image)}}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
                         </div>
                         <img src={image.URL} onError={() => {this.imageError(image)}} />
                         <hr></hr>
                         <h3>{image.title}</h3>
                     </li>
                 );
            }.bind(this));
            return (
                <div>
                    <button className="btn btn-success" onClick={this.openModal}> Add Image </button>
                    <hr id="gallery-line"></hr>
                    <Masonry
                        className={'my-gallery-class'} // default ''
                        elementType={'ul'} // default 'div'
                        options={masonryOptions} // default {}
                        disableImagesLoaded={false} // default false
                    >
                        {childElements}
                    </Masonry>

                    <Modal show={this.state.showModal} onHide={this.closeModal}>
                      <Modal.Header closeButton>
                        <Modal.Title>Add Image</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <div className="form-group">
                              <label className="control-label" for="title">Title</label>
                              <input className="form-control" type="text" name="title" value={this.state.title} onChange={this.handleTitle}></input>
                          </div>
                          <div className="form-group">
                              <label for="URL" className="control-label">Image Link</label>
                              <input className="form-control" type="text" name="URL" value={this.state.URL} onChange={this.handleURL}></input>
                          </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button className="btn btn-default" onClick={this.closeModal}>Close</Button>
                        <Button className="btn btn-primary" onClick={this.addImage}>Submit</Button>
                      </Modal.Footer>
                    </Modal>
                </div>
            );
        }
        else {
            return(
                <div></div>
            );
        }
    }
}

module.exports = MyWall;
