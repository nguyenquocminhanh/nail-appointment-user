import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router';
import { withRouter} from 'react-router-dom';

import HomePage from '../pages/HomePage';
import ConfirmPage from '../pages/ComfirmPage';
import DateTimePage from '../pages/DateTimePage';
import BookPage from '../pages/BookPage';
import ThankyouPage from '../pages/ThankyouPage';
import CompanyInfo from '../components/common/CompanyInfo';

class AppRoute extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    window.scroll(0, 0);
    // this.props.history.push('/');
  }

  render() {
    return (
      <Fragment>
        <div className='Desktop'>
          <img style={{width: '100%', height: '15vh'}} src='https://booking.gocheckin.net/images/banner-bg.png'/>
        </div>
        <CompanyInfo/>

        <Switch>
          <Route exact path="/" render={(props) => <HomePage {...props} key={Date.now()}/>}/>
          <Route exact path="/confirm" render={(props) => <ConfirmPage {...props} key={Date.now()}/>}/>
          <Route exact path="/date-time" render={(props) => <DateTimePage {...props} key={Date.now()}/>}/>
          <Route exact path="/book" render={(props) => <BookPage {...props} key={Date.now()}/>}/>
          <Route exact path="/thankyou" render={(props) => <ThankyouPage {...props} key={Date.now()}/>}/>
        </Switch>
      </Fragment>
    )
  }
}

export default withRouter(AppRoute);