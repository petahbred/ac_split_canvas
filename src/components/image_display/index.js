import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  imageContainer: {}
});

const ImageDisplay = props => {
  const classes = useStyles();

  const renderImages = imagePieces => {
    return imagePieces.map((imagePiece, index) => {
      const { gutter, qrImage } = imagePiece;

      return (
        <div key={`piece_${index}`}>
          {/* <img src={src} alt={index} /> */}
          <img
            alt={`piece_${index}`}
            src={qrImage}
            style={{
              marginBottom: `${gutter}px`,
              marginRight: `${gutter}px`
            }}
          />
        </div>
      );
    });
  };

  return (
    <div className={classes.imageContainer}>
      {renderImages(props.imagePieces)}
    </div>
  );
};

ImageDisplay.propTypes = {
  imagePieces: PropTypes.array
};

export default ImageDisplay;
