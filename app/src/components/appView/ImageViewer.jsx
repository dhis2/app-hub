import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { GridList, GridTile } from 'material-ui/GridList';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        overflowX: 'auto',
        justifyContent: 'space-around',
    },
    gridList: {
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
    },
    titleStyle: {
        color: 'rgb(0, 188, 212)',
    },
    imageStyle: {
        width: '100%',
        WebkitTransition: 'width 500ms ease-in'
    },
    expandedImageStyle: {
        width: '100%',
        transition: 'all 200ms ease-in'
    }
};

class ImageViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedImage : null
        }
        this.renderExpandedImage = this.renderExpandedImage.bind(this)
    }


    handleExpandImage(image) {
        const ret = image !== this.state.expandedImage ? image : -1
        this.setState({
            expandedImage: ret
        })
    }

    renderExpandedImage() {
        if(!this.state.expandedImage)
            return null
        return (<img style={styles.expandedImageStyle} src={this.state.expandedImage.url} />)
    }

    render() {
        console.log(this.props.images)

        const {images }  = this.props;

        const isExpanded = (image) => image == this.state.expandedImage

        const tiles = images.map((tile, i) => (

            <GridTile key={i} style={isExpanded(i) ? styles.expandedImageStyle : styles.imageStyle} title={isExpanded(i) ? tile.description : ''} rows={isExpanded(i) ? 2  : 1} cols={isExpanded(i)? 2  : 1}>
                <ReactCSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300} >
                <img src={tile.imageUrl} onClick={this.handleExpandImage.bind(this, i)} />
                </ReactCSSTransitionGroup>
            </GridTile>

        ))

        return (
            <GridList key="list" style={styles.gridList} cols={2}>
                {tiles}
            </GridList>
           )
    }
}


ImageViewer.PropTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        imageUrl: PropTypes.string,
        description: PropTypes.string,
        caption: PropTypes.string,
    }))

}

export default ImageViewer;