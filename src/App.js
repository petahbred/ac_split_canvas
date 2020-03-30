import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

import Header from 'components/header';
import Form from 'components/form';
import ImageDisplay from 'components/image_display';

import { splitImage } from './utils/image';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(2)
  },
  content: {
    marginTop: theme.spacing(10)
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);

    this.state = {
      file: null,
      tileNumber: 2,
      outputType: 'canvas',
      imagePieces: []
    };
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    this.setState({
      file
    });
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(file) {
    if (!file) {
      return;
    }

    console.log({ file });
    const reader = new FileReader();
    reader.addEventListener('load', async () => {
      try {
        const imagePieces = await splitImage(reader.result);
        console.log({ imagePieces });
        this.setState({
          imagePieces
        });
      } catch (error) {
        console.error(error);
      }
    });
    reader.readAsDataURL(file);
  }

  render() {
    const { classes } = this.props;
    const { outputType, tileNumber, imagePieces } = this.state;
    return (
      <>
        <Container maxWidth='lg'>
          <Header></Header>
          <Paper elevation={3} className={classes.content}>
            <CardContent>
              <Form onSubmit={this.handleSubmit}></Form>
            </CardContent>
          </Paper>
          <Paper elevation={3} className={classes.paper}>
            <CardContent>
              <Typography variant='h5'>Result:</Typography>
              <ImageDisplay imagePieces={imagePieces}></ImageDisplay>
            </CardContent>
          </Paper>
        </Container>
      </>
    );
  }
}

export default withStyles(styles)(App);
