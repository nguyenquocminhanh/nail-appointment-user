import React, { Component } from 'react'

class ConfirmService extends Component {
  render() {
    const allServices = this.props.services;
    const staff = this.props.staff;
    let servicesList = null;
    if (this.props.services && this.props.services.length > 0) {
      servicesList = allServices.map((service, i) => {
        return (
          <div key={i} className="list-item list-group-item py-3 position-relative">
            <span onClick={() => this.props.serviceRemoved(service)} className="position-absolute top-50" style={{transform: "translateY(-50%)", right: "1.25rem", color: "#5e73ff"}}><i className="fas fa-times fa-lg"></i></span>
            <span className="fw-semibold">{service['name']}</span>
            <span className="d-block mt-1" style={{color: "#5e73ff", fontWeight: '700'}}>{staff['name']}</span>
          </div>
        )
      })
    } 

    return (
      <div className="select-service-container">
        <div className="type-container d-grid gap-3 border-0">
          {servicesList}

          {this.props.children}
        </div>        
      </div>
    )
  }
}

export default ConfirmService;