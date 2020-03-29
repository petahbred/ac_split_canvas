import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Publish from '@material-ui/icons/Publish';

const useStyles = makeStyles({
  button: {},
  fileName: {
    fontWeight: 'bold',
    marginLeft: '10px',
    verticalAlign: 'middle'
  }
});

const Form = props => {
  const [file, setFile] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const classes = useStyles();

  const handleFileChange = event => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleFileInputClick = event => {
    event.preventDefault();
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    console.log({ file });

    props.onSubmit(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          ref={e => {
            setFileInput(e);
          }}
          accept='image/*'
          style={{ display: 'none' }}
          id='raised-button-file'
          type='file'
          onChange={handleFileChange}
        />
        <label htmlFor='raised-button-file'>
          <IconButton
            color='primary'
            className={classes.button}
            onClick={handleFileInputClick}>
            <Publish></Publish>
          </IconButton>
          <Typography className={classes.fileName} component='span'>
            {file ? file.name : 'No file selected'}
          </Typography>
        </label>
      </div>
      <div>
        <Button type='submit' color='primary' variant='contained'>
          Convert
        </Button>
      </div>
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default Form;
