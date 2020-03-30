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
      const { data: src, gutter, qrImage } = imagePiece;
      return (
        <img
          key={`piece_${index}`}
          alt={`piece_${index}`}
          src={qrImage}
          style={{
            marginBottom: `${gutter}px`,
            marginRight: `${gutter}px`
          }}
        />
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
