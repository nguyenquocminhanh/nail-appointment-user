import React, { Component, Fragment } from 'react';
import axios from 'axios';
import AppURL from '../../api/AppURL';
import { withRouter} from 'react-router-dom';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Spinner from '../common/Spinner';

class SelectService extends Component {
  constructor(props) {
    super(props);
    this.state = {
        services: [],
        filteredServices: [],        
        serviceKeyword: '',
        pickedService: null,
        pickedServiceId: '',

        staffs: [],
        staffKeyword:'',
        filteredStaffs: [],
        pickedStaff: null,
        pickedStaffId: '',

        isService: true,
        isStaffModal: false,
        isServiceModal: false,
        mainDiv: "d-none",

        isLoading: true
    }
  }

  componentDidMount = () => {
    axios.get(AppURL.ServiceAll).then(response => {
        if (response.status == 200) {
            this.setState({
                services: response.data,
                filteredServices: response.data,
                mainDiv: "",
                isLoading: false
            })
        }
    }).catch(error => {
        this.setState({mainDiv: ""});
        console.log(error);
    });

    axios.get(AppURL.StaffAll).then(response => {
      if (response.status == 200) {
          this.setState({
              staffs: response.data,
              filteredStaffs: response.data,
              mainDiv: "",
              isLoading: false
          })
      }
    }).catch(error => {
        this.setState({mainDiv: ""});
        console.log(error);
    })
  }

  filterService = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = this.state.services.filter((service) => {
        return service['name'].toLowerCase().includes(keyword.toLowerCase());
      })
      this.setState({filteredServices: results});
    } else {
      const services = this.state.services;
      this.setState({filteredServices: services});
    }
    this.setState({serviceKeyword: keyword});
  }

  filterStaff = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = this.state.staffs.filter((staff) => {
        return staff['name'].toLowerCase().includes(keyword.toLowerCase());
      })
      this.setState({filteredStaffs: results});
    } else {
      const staffs = this.state.staffs;
      this.setState({filteredStaffs: staffs});
    }
    this.setState({staffKeyword: keyword});
  }

  servicePicked = (service) => {
    let id = service['id'];

    this.setState({
      pickedServiceId: id,
      pickedService: service
    })

    // enough service + staff => confirm page
    if (this.state.pickedStaffId !== '') {
      this.props.history.push({
        pathname: '/confirm',
        state: { confirm: {service: service, staff: this.state.pickedStaff}, allServices: this.state.services.filter((s) => { return s['id'] !== service['id']}) }
      });
    } else {
      axios.get(AppURL.StaffsByService(id)).then(response => {
        if (response.status == 200) {
          this.setState({
            filteredStaffs: response.data,
            isStaffModal: true
          })
        }
      }).catch(error => {
        console.log(error);
      })
    }
  } 

  staffPicked = (staff) => {
    let id = staff['id'];

    this.setState({
      pickedStaffId: id,
      pickedStaff: staff
    })

    // enough service + staff => confirm page
    if (this.state.pickedServiceId !== '') {
      this.props.history.push({
        pathname: '/confirm',
        state: { confirm: {service: this.state.pickedService, staff: staff} }
      });
    } else {
      axios.get(AppURL.ServicesByStaff(id)).then(response => {
        if (response.status == 200) {
          this.setState({
            filteredServices: response.data,
            isServiceModal: true
          })
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }

  render() {
    const spinner = this.state.isLoading ? <div className="spinner-container"><Spinner/></div> : null;

    const allServices = this.state.filteredServices;
    let serviceList = null;
    if (this.state.filteredServices && this.state.filteredServices.length > 0) {
      serviceList = allServices.map((service, i) => {
        const renderTooltip = (props, content) => (
          <Tooltip title="Hello" style={{width: '300px'}} id="button-tooltip" {...props}>
            <div>Description: {service['name']}. Price: ${service['price']}. Duration: {service['duration']}</div>
          </Tooltip>
        );

        return (
          <div key={service['id']} onClick={() => this.servicePicked(service)} className={"list-item list-group-item py-3 pe-5" + (this.state.pickedServiceId == service['id'] ? ' picked' : '') }>
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
      })
    } 

    const allStaffs = this.state.filteredStaffs;
    let staffList = null;
    if (this.state.filteredStaffs && this.state.filteredStaffs.length > 0) {
      staffList = allStaffs.map((staff, i) => {
      return (
        <div key={staff['id']} onClick={() => this.staffPicked(staff)} className={"staff-item-component" + (this.state.pickedStaffId == staff['id'] ? ' picked' : '')}>
          <div className="row">
            <div className="col d-flex align-items-center">
              <div className="profile-image-container">
                <img src={staff['profile_image'] ? staff['profile_image'] : 'https://minh-nail.s3.us-east-2.amazonaws.com/images/staff/user.png'} style={{maxHeight: "100%", width: '100%'}}/>
              </div>
              &nbsp;&nbsp;
              <span>{staff['name']}</span>
            </div>
            <div className="col">
              <button className="button float-end" ><span>Book</span></button>
            </div>
          </div>
        </div>
      )})
    } 

    let myView = !this.state.isLoading ? 
    <div className="type-container d-grid gap-3 border-0">
      <div className="d-flex justify-content-center align-items-center">
        <div className="form w-100">
          <i className="fa fa-search"></i>
          <input onChange={this.filterService} value={this.state.serviceKeyword} type="text" className="form-control form-input" placeholder="Search service"/>
          <span className="left-pan"><i className="fa fa-microphone"></i></span>
        </div>
      </div>
      {serviceList}
    </div> : spinner

    if (!this.state.isService) {
      myView = !this.state.isLoading ? 
      <div>
        <div className="type-container row height d-flex justify-content-center align-items-center">
          <div className="col-md-12">
            <div className="form">
              <i className="fa fa-search"></i>
              <input onChange={this.filterStaff} value={this.state.staffKeyword} type="text" className="form-control form-input" placeholder="Search staff"/>
              <span className="left-pan"><i className="fa fa-microphone"></i></span>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap w-100 staff-container">
          {staffList}
        </div>
      </div> : spinner
    }

    return (
      <Fragment>
          <div className="mainDiv select-service-container">
            {/* type buttons */}
            <div className="type-container d-flex align-items-center justify-content-between">
                <div 
                  onClick={() => this.setState({isService: true, staffKeyword: '', filteredStaffs: this.state.staffs, filteredServices: this.state.services})}
                  className={"type-item d-flex align-items-center justify-content-center" + (this.state.isService == true ? " active" : "")}>Service</div>
                <div 
                  onClick={() => this.setState({isService: false, serviceKeyword: '', filteredStaffs: this.state.staffs, filteredServices: this.state.services})}
                  className={"type-item d-flex align-items-center justify-content-center" + (this.state.isService == false ? " active" : "")}>Staff</div>
            </div>

            {myView}
          </div>

          {/* Staff Modal */}
          <Modal centered scrollable	size="lg" show={this.state.isStaffModal} onHide={() => this.setState({isStaffModal: false, pickedServiceId: ''})}>
            <Modal.Header closeButton>
              <div className="w-100 d-flex justify-content-center align-items-center">
                <h5 className="m-0">Select Staff</h5>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-wrap w-100">
                {staffList}
              </div>
            </Modal.Body>
          </Modal>

          {/* Service Modal */}
          <Modal centered scrollable	size="md" show={this.state.isServiceModal} onHide={() => this.setState({isServiceModal: false, pickedStaffId: ''})}>
            <Modal.Header closeButton>
              <div className="w-100 d-flex justify-content-center align-items-center">
                <h5 className="m-0">Select Service</h5>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="d-grid gap-3 border-0">
                {serviceList}
              </div>
            </Modal.Body>
          </Modal>
      </Fragment>
    )
  }
}

export default withRouter(SelectService);