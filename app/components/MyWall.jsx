import React from 'react';

class MyWall extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: undefined };
    }

    render() {
        return (
            <div id="myWall">
                Hello World!
            </div>
        );
    }
}

module.exports = MyWall;
