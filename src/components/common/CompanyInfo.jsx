import React, { Component, Fragment } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import AppURL from '../../api/AppURL';
import Spinner from './Spinner';

class CompanyInfo extends Component {
  constructor() {
    super();
    this.state = {
        data: {},
        isLoading: false,
        // d-none là ko hiện
        mainDiv: "d-none"
    }
  }

  componentDidMount = () => {
    axios.get(AppURL.BusinessInfo).then(response => {
        if (response.status == 200) {
            this.setState({
                data: response.data,
                // placeholder
                isLoading: false,
                // d-none là ko hiện
                mainDiv: ""
          });
        }
    }).catch(error => {
        this.setState({
          isLoading: false,
          mainDiv: ""
        })
        console.log(error);
    })
  }

  render() {
    const spinner = this.state.isLoading ? <div className="spinner-container"><Spinner/></div> : null;

    return (
      <Fragment>
        <div className={this.state.mainDiv + ' info-container'}>
            <Container className='text-center' fluid={"true"}>
      
              <img className="rounded-circle avatar-xl" src={this.state.data['logo_image']} alt="..."/>
              <p></p>

              <div className='section-title text-center mb-55'>
                  <h3>{this.state.data['name']}</h3>
                  <h5>{this.state.data['address']}</h5>
                  <p>{this.state.data['phone_number']}</p>
              </div>
            </Container>
        </div>

          {spinner}
  
      </Fragment>
    )
  }
}

export default CompanyInfo