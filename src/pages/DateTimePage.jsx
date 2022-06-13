import React, { Component, Fragment } from 'react'
import Header from '../components/common/Header';
import NavigateBtn from '../components/common/NavigateBtn';
import { Calendar, Card } from 'react-rainbow-components';
import { withRouter} from 'react-router-dom';
import AppURL from '../api/AppURL';
import axios from 'axios';

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const calendarContainerStyles = {
  padding: '20px'
};

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

class DateTimePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        staff: {},
        timeSlots: null,
        pickedDate: '',
        pickedTime: '',

        // time slot that was taken by other client before
        pickedTimeSlot: [],
    }
  }

  componentDidMount = () => {
    // protect route
    if (this.props.location.state == undefined) {
      this.props.history.push('/');
    } else {  
      this.setState({ 
        staff: this.props.location.state.confirm.staff,
        pickedDate: this.props.location.state.date ? this.props.location.state.date : new Date().toLocaleDateString('en-us', options)
      })
      // if exists previous date and time already
      if (this.props.location.state.date && this.props.location.state.time) {
        let day = days[new Date(this.props.location.state.date).getDay()];
        // // check time slot taken by other client before
        axios.get(AppURL.SlotTimeCheck(formatDate(this.props.location.state.date))).then(response => {
          if (response.status == 200) {
            this.setState({
              pickedTimeSlot: response.data
            });
          // check time slot for that day
          axios.get(AppURL.TimeSlotByStaff(day, this.props.location.state.confirm.staff['id'])).then(response => {
            if (response.status == 200) {
                let timeSlots = [];
                
                response.data.forEach((staffTime) => {
                    timeSlots = timeSlots.concat(staffTime['staff_times']);
                });     
                this.setState({
                  timeSlots: timeSlots,
                  pickedTime: this.props.location.state.time
                })
            }
          }).catch(error => { 
              console.log(error);
          });
        }}).catch(error => {
        console.log(error);
        })
      } else {
        // set default day is today
        let today = days[new Date().getDay()];

        axios.get(AppURL.TimeSlotByStaff(today, this.props.location.state.confirm.staff['id'])).then(response => {
            if (response.status == 200) {
                let timeSlots = [];
                
                response.data.forEach((staffTime) => {
                    timeSlots = timeSlots.concat(staffTime['staff_times']);
                });     
                this.setState({
                  timeSlots: timeSlots,
                })
            }
        }).catch(error => { 
            console.log(error);
        });
      }
    }
  }

  dateChanged = (value) => {
    const dayOfWeek = days[value.getDay()];
    // check time slot taken by other client before
    axios.get(AppURL.SlotTimeCheck(formatDate(value))).then(response => {
      if (response.status == 200) {
        this.setState({
          pickedTimeSlot: response.data
        });
        // then, get all time slots by staff
        axios.get(AppURL.TimeSlotByStaff(dayOfWeek, this.state.staff['id'])).then(response => {
          if (response.status == 200) {
              let timeSlots = [];
              response.data.forEach((staffTime) => {
                  timeSlots = timeSlots.concat(staffTime['staff_times']);
              });
              
              this.setState({
                  timeSlots: timeSlots, // new timeslots
                  pickedDate: value.toLocaleDateString('en-us', options),
                  pickedTime: ''
              })
            }
        }).catch(error => {
            console.log(error);
        });
      }
    }).catch(error => {
      console.log(error);
    })
  }

  comfirmClicked = () => {
    this.props.history.push({
      pathname: '/confirm',
      state: { 
        date: this.state.pickedDate,
        time: this.state.pickedTime,
        confirm: this.props.location.state.confirm
      }
    });
  }

  render() {
    let timeSlotsList = null;
    let timeSlots = this.state.timeSlots;
    if (timeSlots !== null) {
      if (timeSlots.length > 0 && timeSlots !== null) {
        // all TIMESLOTS
        timeSlotsList = 
        <div className='row gx-3 gy-4'>
          {timeSlots.filter(slot => {return new Date(Date.parse(this.state.pickedDate + " " + slot['time'])) < new Date(Date.parse(this.state.pickedDate + " 12:00 PM"))}).length > 0 ? <div >Morning</div> : null}
          {timeSlots.filter(slot => {return new Date(Date.parse(this.state.pickedDate + " " + slot['time'])) < new Date(Date.parse(this.state.pickedDate + " 12:00 PM"))}).map((slot, i) => {
            return (
              // MORNING
              <div key={slot['id']} className="col-6 col-sm-6 col-md-4 col-lg-3">
                  <button onClick={() => this.setState({pickedTime: slot['time']})} style={{width: '100%'}} className={"btn btn-outline-secondary" + (this.state.pickedTime == slot['time'] ? " btnFocus" : "") + (this.state.pickedDate == new Date().toLocaleDateString('en-us', options) || this.state.pickedTimeSlot.includes(slot['time']) ? ' disabled' : '')}>
                      <span>{slot['time']}</span>
                  </button>
              </div>
            )
          })}

          {timeSlots.filter(slot => {return new Date(Date.parse(this.state.pickedDate + " " + slot['time'])) < new Date(Date.parse(this.state.pickedDate + " 5:00 PM")) && new Date(Date.parse(this.state.pickedDate + " " + slot['time'])) >= new Date(Date.parse(this.state.pickedDate + " 12:00 PM"))}).length > 0 ? <div>Afternoon</div> : null}
          {timeSlots.filter(slot => {return new Date(Date.parse(this.state.pickedDate + " " + slot['time'])) < new Date(Date.parse(this.state.pickedDate + " 5:00 PM")) && new Date(Date.parse(this.state.pickedDate + " " + slot['time'])) >= new Date(Date.parse(this.state.pickedDate + " 12:00 PM"))}).map((slot, i) => {
            return (
              // AFTERNOON
              <div key={slot['id']} className="col-6 col-sm-6 col-md-4 col-lg-3">
                  <button onClick={() => this.setState({pickedTime: slot['time']})} style={{width: '100%'}} className={"btn btn-outline-secondary" + (this.state.pickedTime == slot['time'] ? " btnFocus" : "") + (this.state.pickedDate == new Date().toLocaleDateString('en-us', options) || this.state.pickedTimeSlot.includes(slot['time']) ? ' disabled' : '')}>
                      <span>{slot['time']}</span>
                  </button>
              </div>
            )
          })}

          {timeSlots.filter(slot => {return new Date(Date.parse(this.state.pickedDate + " " + slot['time'])) >= new Date(Date.parse(this.state.pickedDate + " 5:00 PM"))}).length > 0 ? <div>Evening</div> : null}
          {timeSlots.filter(slot => {return new Date(Date.parse(this.state.pickedDate + " " + slot['time'])) >= new Date(Date.parse(this.state.pickedDate + " 5:00 PM"))}).map((slot, i) => {
            return (
              // EVENING
              <div key={slot['id']} className="col-6 col-sm-6 col-md-4 col-lg-3">
                  <button onClick={() => this.setState({pickedTime: slot['time']})} style={{width: '100%'}} className={"btn btn-outline-secondary" + (this.state.pickedTime == slot['time'] ? " btnFocus" : "") + (this.state.pickedDate == new Date().toLocaleDateString('en-us', options) || this.state.pickedTimeSlot.includes(slot['time']) ? ' disabled' : '')}>
                      <span>{slot['time']}</span>
                  </button>
              </div>
            )
          })}
        </div>
      } else {
        timeSlotsList = <div>No data available</div>
      }
    } 
    

    return (
      <Fragment>
        <Header>Select Date/Time</Header>
        
        <div className="container time-date-container px-2">
            <div className="row g-4">
                <div className='col-md-6'>   
                    <Card style={calendarContainerStyles} className="rainbow-p-around_large">
                        <Calendar
                            id="calendar-3"
                            value={this.state.pickedDate}
                            minDate={new Date()}
                            maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
                            onChange={(value) => {this.dateChanged(value)}}
                        />
                    </Card>
                </div>

                <div className='col-md-6'>  
                  <div className="card">
                    <div className="card-header"><strong>Booking for {this.state.pickedDate}</strong></div>
                    <div className="card-body">
                      {timeSlotsList}
                    </div>
                  </div>
                </div>
            </div>
        </div>

        {this.state.pickedTime !== '' ? <NavigateBtn confirmClicked={this.comfirmClicked}/> : null}

      </Fragment>
    )
  }
}

export default withRouter(DateTimePage);