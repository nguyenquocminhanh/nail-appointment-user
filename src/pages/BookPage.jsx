import React, { Component, Fragment } from 'react'
import Header from '../components/common/Header';
import { withRouter} from 'react-router-dom';

import cogoToast from 'cogo-toast';
import AppURL from '../api/AppURL';
import axios from 'axios';

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function convert(time12h) {
    const [time, modifier] = time12h.split(' ');
  
    let [hours, minutes] = time.split(':');
  
    if (modifier === 'AM' && hours < 10) {
        hours = '0' + hours;
    }
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}`;
  }

class BookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: '',
        phone_number: '',
        email: '',
        notes: '',

        btn: 'Book Appointment',
        staffId: '',
        date: '',
        time: '',
        services: [],
    }
  }

  componentDidMount = () => {
    // protect route
    if (this.props.location.state == undefined) {
        this.props.history.push('/');
    } else {
        this.setState({
            staffId: this.props.location.state.staff['id'],
            date: this.props.location.state.date,
            time: this.props.location.state.time,
            services: this.state.services.concat(this.props.location.state.services)
        })
    }
  }

  formSubmit = (e) => {
    // page not loaded when submit
    e.preventDefault();
    this.setState({
        btn: 'Sending Request...'
    });

    let submitForm = document.getElementById('submitForm');

    let name = this.state.name;
    let phone_number = this.state.phone_number;
    let email = this.state.email;
    let notes = this.state.notes;
    
    let staffId = parseInt(this.state.staffId);
    let date = this.state.date;
    let time = this.state.time;
    let services = this.state.services.map((e) => {return e['name']}).join(', ');


    if (this.state.staffId == '' || this.state.date == '' || this.state.time == '' || this.state.services.length == 0) {
        cogoToast.error('Something Went Wrong! Please Try Again!');
    } else {
        let myFormData = new FormData();

        myFormData.append('name', name);
        myFormData.append('phone_number', phone_number);
        myFormData.append('email', email);
        myFormData.append('notes', notes);

        myFormData.append('user_id', staffId);
        myFormData.append('date', formatDate(date));
        myFormData.append('time', convert(time));
        myFormData.append('services', services);

        axios.post(AppURL.StoreAppointment, myFormData).then(response => {
            if(response.status === 200) {
                this.setState({
                    btn: 'Book Appointment',
                });
                cogoToast.success(response.data.message, {position: 'top-right', hideAfter: 1},).then(() => {
                    submitForm.reset();
                    this.props.history.push({
                        pathname: '/thankyou',
                        state: { 
                            confirm: {services: this.state.services, staff: this.props.location.state.staff},
                            date: this.state.date,
                            time: this.state.time,
                            name: this.state.name,
                            phone_number: this.state.phone_number,
                            appointment_id: response.data.appointment['id'],
                        }
                    });
                });
            } else {
                cogoToast.error(response.data.message, {position: 'top-right'});
            }
        }).catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                cogoToast.error(error.response.data, {position: 'top-right'});
                cogoToast.error(error.response.status, {position: 'top-right'});
                cogoToast.error(error.response.headers, {position: 'top-right'});
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                cogoToast.error(error.request, {position: 'top-right'});
              } else {
                // Something happened in setting up the request that triggered an Error
                cogoToast.error('Error', error.message, {position: 'top-right'});
              }
              cogoToast.error(error.config, {position: 'top-right'});
        })
    }

  }
  
  render() {
    return (
      <Fragment>
        <Header>Your Information</Header>

        <div className="navigate-btn-container">
           <div className="form-container d-flex justify-content-center align-items-center">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title text-center">How do we say hello?</h4>
                        <p className="card-title-desc text-center">Your name and phone number will be used to send you appointment confirmations and reminders. We’ll also be able to call or text you if anything changes.</p>

                        <form className="custom-validation" onSubmit={this.formSubmit} id="submitForm">
                            <div className="input-group input-group-md mb-3">
                                <input onChange={(e) => {this.setState({name: e.target.value})}} type="text" className="form-control" required placeholder="Full Name (*)"/>
                            </div>

                            <div className="input-group input-group-md mb-3">
                                <input onChange={(e) => {this.setState({phone_number: e.target.value})}} type="text" className="form-control" required placeholder="Phone Number (*)"/>
                            </div>

                            <div className="input-group input-group-md mb-3">
                                <input onChange={(e) => {this.setState({email: e.target.value})}}  type="email" className="form-control" required placeholder="Email (*)"/>
                            </div>

                            <div style={{color: '#5e73ff'}} className="input-group input-group-md mb-3">
                                (*) is required. Please check your input information before submit.
                            </div>

                            <div className="input-group mb-3">
                                <textarea onChange={(e) => {this.setState({notes: e.target.value})}} placeholder='Appointment Notes' className="form-control" rows="5"></textarea>
                            </div>

                            <div className="mb-0">
                                <center>
                                    <button type="submit" className="btn btn-primary waves-effect waves-light me-1">
                                        {this.state.btn}
                                    </button>
                                </center>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(BookPage);