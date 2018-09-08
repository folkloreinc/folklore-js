import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WebFont from 'webfontloader';

import {
    setSize as setSizeActions,
    setFontsLoaded as setFontsLoadedActions,
} from '../../actions/LayoutActions';

import styles from '<%= getRelativeStylesPath('components/layouts/Main.jsx', 'layouts/main.scss') %>';

const propTypes = {
    fontsLoaded: PropTypes.bool.isRequired,
    setFontsLoaded: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    setSize: PropTypes.func.isRequired,
    isPrerender: PropTypes.bool,
    fonts: PropTypes.shape({
        google: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
        custom: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    }),
};

const defaultProps = {
    isPrerender: false,
    fonts: {
        google: {
            families: ['Open Sans:400,700'],
        },
        custom: {},
    },
};

class MainLayout extends Component {
    constructor(props) {
        super(props);

        this.onResize = this.onResize.bind(this);
        this.onFontsActive = this.onFontsActive.bind(this);
    }

    componentDidMount() {
        const { fonts } = this.props;
        WebFont.load({
            ...fonts,
            active: this.onFontsActive,
        });

        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onFontsActive() {
        const { setFontsLoaded } = this.props;
        setFontsLoaded(true);
    }

    onResize() {
        const { setSize } = this.props;
        const { innerWidth, innerHeight } = window;
        setSize({
            width: innerWidth,
            height: innerHeight,
        });
    }

    render() {
        const {
            children, fontsLoaded, isPrerender,
        } = this.props;

        const innerStyle = {
            opacity: fontsLoaded || isPrerender ? 1 : 0,
        };

        return (
            <div className={styles.container}>
                <div className={styles.inner} style={innerStyle}>
                    <div className={styles.content}>{children}</div>
                </div>
            </div>
        );
    }
}

MainLayout.propTypes = propTypes;
MainLayout.defaultProps = defaultProps;

const mapStateToProps = ({ layout, site }) => ({
    size: layout.size,
    fontsLoaded: layout.fontsLoaded,
    isPrerender: site.isPrerender || false,
});
const mapDispatchToProps = dispatch => ({
    setSize: size => dispatch(setSizeActions(size)),
    setFontsLoaded: loaded => dispatch(setFontsLoadedActions(loaded)),
});
const WithStateContainer = connect(mapStateToProps, mapDispatchToProps)(MainLayout);

export default WithStateContainer;
