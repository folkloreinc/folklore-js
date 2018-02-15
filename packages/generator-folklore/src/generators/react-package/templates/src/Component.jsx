import React, { Component } from 'react';

const propTypes = {

};

const defaultProps = {

};

class <%= componentName %> extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div />
        );
    }

}

<%= componentName %>.propTypes = propTypes;
<%= componentName %>.defaultProps = defaultProps;

export default <%= componentName %>;
