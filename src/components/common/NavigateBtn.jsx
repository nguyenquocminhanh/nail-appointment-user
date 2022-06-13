import React, { Component } from 'react'
import { withRouter} from 'react-router-dom';

class NavigateBtn extends Component {
  render() {
    return (
        
      <div className="position-fixed fixed-bottom navigate-btn-container" style={{background: "hsla(0,0%,100%,.8)"}}>
        <div className="type-container d-flex align-items-center justify-content-between">
            <div onClick={() => this.props.history.goBack()} className="type-item d-flex align-items-center justify-content-center">Back</div>
            <div onClick={this.props.confirmClicked} className="type-item d-flex align-items-center justify-content-center active">Confirm</div>
        </div>
      </div>
    )
  }
}

export default withRouter(NavigateBtn);