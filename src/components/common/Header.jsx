import React, { Component } from 'react'

export class Header extends Component {
  render() {
    return (
        <div className="navigate-btn-container">
            <div className="w-100 d-flex justify-content-center align-items-center p-1" style={{background: '#f6f6f6'}}>

                <strong>{this.props.children}</strong>
            </div>
        </div>
    )
  }
}

export default Header