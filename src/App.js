import React, { Component, Fragment } from 'react'
import {Button} from 'react-bootstrap';
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './route/AppRoute';

// ROOT COMPONENT 

class App extends Component {
  render() {
    return (
      <Fragment>
        <BrowserRouter>
          <AppRoute/>
        </BrowserRouter>
      </Fragment>
    )
  }
}

export default App;