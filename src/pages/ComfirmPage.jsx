import React, { Component, Fragment } from 'react';
import { withRouter} from 'react-router-dom';
import { Redirect } from 'react-router';
import NavigateBtn from '../components/common/NavigateBtn';
import ConfirmService from '../components/confirm/ConfirmService';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Header from '../components/common/Header';
import axios from 'axios';
import AppURL from '../api/AppURL';
import ConfirmDateTime from '../components/confirm/ConfirmDateTime';

class ComfirmPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      allServices: [],
      staff: {},
      isServiceModal: false,
    }
  }

  addServiceClicked = () => {
    this.setState({
      isServiceModal: true
    })
  }

  serviceAdded = (service) => {
    const updatedNewAllServices = this.state.allServices.filter((serv) => {
      return serv['id'] !== service['id'];
    })

    this.setState({
      services: [...this.state.services, service],
      allServices: updatedNewAllServices,
      isServiceModal: false
    })
  }

  serviceRemoved = (service) => {
    const updatedNewServices = this.state.services.filter((serv) => {
      return serv['id'] !== service['id'];
    })

    this.setState({
      services: updatedNewServices,
      allServices: [...this.state.allServices, service]
    })
  }

  componentDidMount = () => {
      // protect route
      if (this.props.location.state == undefined) {
        this.props.history.push('/');
      } else {
        this.setState({ 
          services: Array.isArray(this.props.location.state.confirm.service) ? this.state.services.concat(this.props.location.state.confirm.service) : [...this.state.services, this.props.location.state.confirm.service],
          staff: this.props.location.state.confirm.staff
        })
        // get service by staff
        axios.get(AppURL.ServicesByStaff(this.props.location.state.confirm.staff['id'])).then(response => {
          if (response.status == 200) {
            let allServices = [];
            if (Array.isArray(this.props.location.state.confirm.service)) {

              allServices = response.data.filter(item => !this.props.location.state.confirm.service.find(({ id }) => item['id'] === id));
            } else {
              allServices = response.data.filter(item => item['id'] != this.props.location.state.confirm.service['id']);
            }
            this.setState({ 
              allServices: allServices,
            })
          }
        }).catch(error => {
          console.log(error);
        })
      }
  }

  componentDidUpdate = (prevProps, prevStates) => {
    if(this.state.services !== prevStates.services && this.state.services.length == 0) {
      this.props.history.push('/');
    }
  }

  confirmClicked = (staff) => {
    if (this.props.location.state.date) {
      this.props.history.push({
        pathname: '/book',
        state: {
          staff: this.props.location.state.confirm.staff, // object
          date: this.props.location.state.date, // string
          time: this.props.location.state.time, // string
          services: this.state.services // array
        }
      });
    } else {
      this.props.history.push({
        pathname: '/date-time',
        state: { 
          confirm: {service: this.state.services, staff: staff},
        }
      });
    }
  }

  dateTimeClicked = () => {
    this.props.history.push({
      pathname: '/date-time',
      state: { 
        confirm: {service: this.state.services, staff: this.props.location.state.confirm.staff},
        date: this.props.location.state.date,
        time: this.props.location.state.time
      }
    });
  }

  render() {    
    if (this.props.location.state == undefined) {
      return <Redirect to="/"/>
    }

    let serviceList = null;
    if (this.state.allServices && this.state.allServices.length > 0) {
      serviceList = this.state.allServices.map((service, i) => {
        const renderTooltip = (props, content) => (
          <Tooltip title="Hello" style={{width: '300px'}} id="button-tooltip" {...props}>
            <div>{service['name']}</div>
          </Tooltip>
        );

        return (
          <div onClick={() => this.serviceAdded(service)} key={service['id']} className="list-item list-group-item py-3 pe-5">
            {service['name']} &nbsp;

            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <i className="fas fa-question-circle" style={{color: '#5e73ff'}}></i>
            </OverlayTrigger>
          </div>
        )
      });
    }
  
    return (
      <Fragment>
        <Header>Your Appointment</Header>
        
        <ConfirmService services={this.state.services} staff={this.state.staff} serviceRemoved={this.serviceRemoved}>

          {this.props.location.state.date ? 
          <ConfirmDateTime clicked={this.dateTimeClicked} date={this.props.location.state.date} time={this.props.location.state.time}/> 
          : null}

          {this.state.allServices.length != 0 ? 
          <div onClick={this.addServiceClicked} className="type-item w-100 d-flex align-items-center justify-content-center">Add more service</div>
          : null}
        </ConfirmService>

        <NavigateBtn confirmClicked={() => this.confirmClicked(this.state.staff)}/>

        {/* Service Modal */}
        <Modal centered scrollable	size="md" show={this.state.isServiceModal} onHide={() => this.setState({isServiceModal: false, pickedStaffId: ''})}>
          <Modal.Header closeButton>
            <div className="w-100 d-flex justify-content-center align-items-center">
              <h5 className="m-0">Select Service</h5>
            </div>
          </Modal.Header>
          <Modal.Body>
            <p style={{textAlign: 'center'}}>For second service and up, to avoid time conflict, you can only choose your <strong>original staff</strong>. By doing so we will arrange the most relevant staff for you.</p>
            <div className="d-grid gap-3 border-0">
              {serviceList}
            </div>
          </Modal.Body>
        </Modal>
      </Fragment>
    )
  }
}

export default withRouter(ComfirmPage);