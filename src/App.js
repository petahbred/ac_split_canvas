import React from 'react';

import { splitImage } from './utils/image';

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

  handleSubmit(event) {
    event.preventDefault();
    const { file } = this.state;
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      splitImage(reader.result);
    });
    reader.readAsDataURL(file);
  }

  render() {
    const { outputType, tileNumber } = this.state;
    return (
      <div className='app container'>
        <header>
          <h1>AC Image Splitter</h1>
        </header>
        <div className='row'>
          <form onSubmit={this.handleSubmit} className='form'>
            <div className='form-row'>
              <div className='custom-file col'>
                <input
                  type='file'
                  className='custom-file-input'
                  id='customFile'
                  onChange={this.handleFileChange}
                />
                <label className='custom-file-label' htmlFor='customFile'>
                  Choose file
                </label>
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group'>
                <select
                  name='outputType'
                  className='form-control'
                  defaultValue={outputType}
                  onChange={this.handleInputChange}>
                  <option value='canvas'>Canvas</option>
                </select>
              </div>
              <div className='form-group'>
                {/* <label htmlFor='tileNumber'>Number of tiles</label> */}
                <input
                  id='tileNumber'
                  name='tileNumber'
                  type='number'
                  className='form-control'
                  placeholder='Number of tiles'
                  onChange={this.handleInputChange}
                  defaultValue={tileNumber}
                  disabled
                />
              </div>
            </div>
            <div className='form-row'>
              <div className='form-group col'>
                <button type='submit' className='btn btn-primary'>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className='row'>
          <div id='imageContainer'></div>
        </div>
      </div>
    );
  }
}

export default App;
