import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import Header from 'components/header';
import Form from 'components/form';

import { splitImage } from './utils/image';

const styles = theme => ({
  content: {
    marginTop: theme.spacing(10),
    padding: '10px 15px'
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
      outputType: 'canvas'
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
    reader.addEventListener('load', () => {
      splitImage(reader.result);
    });
    reader.readAsDataURL(file);
  }

  render() {
    const { classes } = this.props;
    const { outputType, tileNumber, file } = this.state;
    return (
      <>
        <Container maxWidth='lg'>
          <Header></Header>
          <Paper elevation={3} className={classes.content}>
            <Form onSubmit={this.handleSubmit}></Form>
          </Paper>
        </Container>
      </>
    );
  }
}

export default withStyles(styles)(App);
