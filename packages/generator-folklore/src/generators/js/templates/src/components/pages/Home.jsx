import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Helmet from 'react-helmet';

const propTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
    }).isRequired,
};

const HomePage = ({ intl }) => (
    <div className="page">
        <Helmet>
            <title>
                {intl.formatMessage({
                    id: 'meta.title',
                    defaultMessage: 'Accueil',
                })}
            </title>
            <style type="text/css">
                {`
                    .folklore {
                        background: url("/img/folklore.png") no-repeat top left;
                        background-size: 100% 100%;
                        width: 200px;
                        height: 200px;
                        position:fixed;
                        top: 50%;
                        left: 50%;
                        margin-top:-100px;
                        margin-left:-100px;
                        transition: all 0.2s ease-out;
                    }

                    .folklore:hover {
                        -webkit-filter: blur(100px);
                        -webkit-transform: scale(0.5) rotate(260deg);
                        -moz-filter: blur(100px);
                        -moz-transform: scale(0.5) rotate(260deg);
                        -ms-filter: blur(100px);
                        -ms-transform: scale(0.5) rotate(260deg);
                        filter: blur(100px);
                        transform: scale(0.5) rotate(260deg);
                    }
                `}
            </style>
        </Helmet>
        <div className="folklore" />
    </div>
);

HomePage.propTypes = propTypes;

const HomePageContainer = connect(state => ({
    test: state.test,
}))(HomePage);

const WithIntlContainer = injectIntl(HomePageContainer);

export default WithIntlContainer;
