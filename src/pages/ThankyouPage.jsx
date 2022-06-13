import React, { Component, Fragment } from 'react';
import { withRouter} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import AppURL from '../api/AppURL';
import cogoToast from 'cogo-toast';
import { Redirect } from 'react-router';

function capitalizeFirstLetter(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

class ThankyouPage extends Component {
  cancelAppointment = (appointmentId) => {
    axios.get(AppURL.CancelAppointment(appointmentId)).then(response => {
        if (response.status == 200) {
            cogoToast.success(response.data.message, {position: 'top-right', hideAfter: 1}).then(() => {
                this.props.history.replace('/');
            });
        }
    }).catch(error => {
        cogoToast.error("Something went wrong, please try again!", {position: 'top-right'});
        console.log(error);
    })
  }

  render() {
    if (this.props.location.state == undefined) {
        return <Redirect to="/"/>
    }

    return (
      <Fragment>
          <div className="navigate-btn-container">
           <div className="type-container d-flex justify-content-center align-items-center">
            <div className='text-center'>
                <h5>Thank you! Your appointment has been sent. Please check your email for confirmation.</h5>
                <p>{capitalizeFirstLetter(this.props.location.state.name)}</p>
                <p>{this.props.location.state.phone_number}</p>
                <hr></hr>
                {this.props.location.state.confirm.services.map((service, i) => {
                    return <p key={i.toString()}>{capitalizeFirstLetter(service['name'])} by {capitalizeFirstLetter(this.props.location.state.confirm.staff['name'])}</p>
                })}
                <hr></hr>
                <p>{this.props.location.state.date}</p>
                <p>{this.props.location.state.time}</p>
                <br></br>
                <div className='row gy-3'>
                    <Button variant="outline-primary">Add to calendar</Button>
                    <Button onClick={() => this.props.history.replace('/')} variant="primary">Book another appointment</Button>
                    <Button onClick={() => this.cancelAppointment(this.props.location.state.appointment_id)} variant="danger">Cancel Appointment</Button>
                </div>
            </div>
           </div>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(ThankyouPage);