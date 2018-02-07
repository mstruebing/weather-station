import React, { props, Component } from 'react';
import Chart from '../chart';
import './Humidity.css';

class Humidity extends Component {
  constructor() {
    super(props);
  }

  render() {
    const humidity = this.props.humidity;

    // convert keys(timestamps)/values(data) to arrays
    // and get only the wanted amount of them
    // (timestamp is 2 hours greater than the real time, this is some fuck up in the api)
    const labels = Object.keys(humidity).map(
      timestamp => new Date(timestamp * 1000).toLocaleTimeString())
      .slice(this.props.amount * -1);
    const data = Object.keys(humidity).map(
      timestamp => humidity[timestamp])
      .slice(this.props.amount * -1);

    return (
      <div className="humidity">
        <h1>Humidity</h1>
        <span className="legend">
          <p>y - percent</p>
          <p>x - time</p>
        </span>
        <Chart labels={labels} data={data} />
      </div>
    );
  }
}

export default Humidity;
