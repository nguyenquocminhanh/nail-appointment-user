import React, { Component } from 'react'

class ConfirmDateTime extends Component {
  render() {
    return (
        <div onClick={this.props.clicked} className="list-item list-group-item py-3 position-relative">
            <span className="position-absolute top-50" style={{transform: "translateY(-50%)", right: "1.25rem", color: "#5e73ff"}}><i className="fas fa-calendar-alt fa-lg"></i></span>
            <span className="fw-semibold">{this.props.date}</span>
            <span className="d-block mt-1">{this.props.time}</span>
        </div>
    )
  }
}

export default ConfirmDateTime;