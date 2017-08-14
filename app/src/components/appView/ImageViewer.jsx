import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import {
    deleteImageFromApp,
    openDialog,
    editImageLogo
} from "../../actions/actionCreators";
import * as DialogTypes from "../../constants/dialogTypes";
import { GridList, GridTile } from "material-ui/GridList";
import Slider from "react-slick";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import { FadeAnimation, FadeAnimationList } from "../utils/Animate";
import Theme from "../../styles/theme";
const styles = {
    root: {
        display: "flex",
        flexWrap: "wrap",
        overflowX: "auto",
        justifyContent: "space-around"
    },
    gridList: {
        maxHeight: "400px"
    },
    titleStyle: {
        color: "rgb(0, 188, 212)"
    },
    imageStyle: {
        maxHeight: "100%"
    },
    expandedImageStyle: {},
    actionIconStyle: {
        color: "white"
    }
};

const ImageElement = props => {
    const imageElementStyle = {
        root: {
            height: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        titleBar: {
            position: "absolute",
            display: "flex",
            alignItems: "center",
            background: "rgba(0,0,0,0.4)",
            maxHeight: "120px",
            minHeight: "60px",
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "space-between",
            whiteSpace: "pre-line",
            wordWrap: "break-word"
        },
        titleWrap: {
            overflowY: "auto",
            color: "white",
            margin: 10,
            maxHeight: "inherit"
        },
        title: {
            fontSize: "16px",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        subTitle: {
            fontSize: "12px"
        },
        actions: {}
    };
    return (
        <div style={{ ...imageElementStyle.root, ...props.style }}>
            {props.renderTitleBar
                ? <FadeAnimation
                      exit={false}
                      in
                      appear
                      mountOnEnter
                      unmountOnExit
                  >
                      <div style={imageElementStyle.titleBar}>
                          <div style={imageElementStyle.titleWrap}>
                              <div style={imageElementStyle.title}>
                                  {props.title}
                              </div>
                              <div style={imageElementStyle.subTitle}>
                                  {props.subtitle}
                              </div>
                          </div>
                          <div style={imageElementStyle.actions}>
                              {props.actions}
                          </div>
                      </div>
                  </FadeAnimation>
                : null}
            {props.children}
        </div>
    );
};

ImageElement.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    actions: PropTypes.element,
    renderTitleBar: PropTypes.bool,
    style: PropTypes.object
};
ImageElement.defaultProps = {
    renderTitleBar: true
};

class ImageViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedImage: null,
            current: 0
        };
        this.renderExpandedImage = this.renderExpandedImage.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.handleDeleteImage = this.handleDeleteImage.bind(this);
        this.handleEditImage = this.handleEditImage.bind(this);
        this.handleSetLogoImage = this.handleSetLogoImage.bind(this);
    }

    handleExpandImage(image) {
        // const ret = image !== this.state.expandedImage ? image : -1
        this.slider.slickGoTo(image);
    }

    handleChangeIndex(index) {
        this.setState({
            ...this.state,
            current: index
        });
    }

    renderExpandedImage() {
        if (!this.state.expandedImage) return null;
        return (
            <img
                style={styles.expandedImageStyle}
                src={this.state.expandedImage.url}
            />
        );
    }

    handleDeleteImage(imageId) {
        this.props.deleteImage(this.props.appId, imageId);
    }

    handleSetLogoImage(imageId) {
        this.props.setLogo(this.props.appId, imageId);
    }

    handleEditImage(image) {
        this.props.openEditImageDialog(this.props.appId, image);
    }

    renderActions(image, index) {
        const setLogoIcon = image.logo ? "star" : "star_border";
        return (
            <div style={{ display: "flex" }}>
                <IconButton
                    tooltip="Set as logo"
                    tooltipPosition="top-center"
                    iconStyle={styles.actionIconStyle}
                    iconClassName="material-icons"
                    onClick={() => this.handleSetLogoImage(image.id)}
                >
                    {setLogoIcon}
                </IconButton>
                <IconButton
                    tooltip="Delete"
                    tooltipPosition="top-center"
                    iconStyle={styles.actionIconStyle}
                    iconClassName="material-icons"
                    onClick={() => this.handleDeleteImage(image.id)}
                >
                    delete
                </IconButton>
                <IconButton
                    tooltip="Edit"
                    tooltipPosition="top-center"
                    iconStyle={styles.actionIconStyle}
                    iconClassName="material-icons"
                    onClick={() => this.handleEditImage(image)}
                >
                    mode_edit
                </IconButton>
            </div>
        );
    }

    render() {
        const { images, editable, showEmptyMessage } = this.props;
        const { current } = this.state;
        const sliderProps = {
            className: "slide-center",
            accessibility: true,
            dots: true,
            centerMode: true,
            slidesToShow: 1,
            centerPadding: "60px",
            draggable: true,
            swipeToSlide: true,
            infinite: false
        };
        const emptyDiv = showEmptyMessage
            ? <div style={Theme.paddedCard}>
                  {editable
                      ? "No images for this app. Upload your first now!"
                      : "No images for this app."}
              </div>
            : null;

        const tiles = images.map((tile, i) => {
            return (
                <div key={i}>
                    <ImageElement
                        key={i}
                        style={styles.tileStyle}
                        renderTitleBar={
                            i == current &&
                            (editable || !!tile.caption || !!tile.description)
                        }
                        title={tile.caption}
                        subtitle={tile.description}
                        actions={editable ? this.renderActions(tile, i) : null}
                    >
                        <img
                            style={styles.imageStyle}
                            src={tile.imageUrl}
                            onClick={this.handleExpandImage.bind(this, i)}
                        />
                    </ImageElement>
                </div>
            );
        });

        return images.length > 0
            ? <Slider
                  afterChange={this.handleChangeIndex.bind(this)}
                  {...sliderProps}
                  ref={ref => (this.slider = ref)}
                  style={styles.gridList}
                  cols={2}
              >
                  {tiles}
              </Slider>
            : emptyDiv;
    }
}

ImageViewer.PropTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            imageUrl: PropTypes.string,
            description: PropTypes.string,
            caption: PropTypes.string
        })
    ),
    appId: PropTypes.string,
    editable: PropTypes.bool,
    showEmptyMessage: PropTypes.bool
};

ImageViewer.defaultProps = {
    showEmptyMessage: true
};
const mapDispatchToProps = dispatch => ({
    deleteImage(appId, imageId) {
        dispatch(deleteImageFromApp(appId, imageId));
    },
    openEditImageDialog(appId, image) {
        dispatch(openDialog(DialogTypes.EDIT_IMAGE, { appId, image }));
    },
    setLogo(appId, imageId) {
        dispatch(editImageLogo(appId, imageId, true));
    }
});

export default connect(null, mapDispatchToProps)(ImageViewer);
