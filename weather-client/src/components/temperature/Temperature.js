import React, { props, Component } from 'react';
import Chart from '../chart';
import './Temperature.css';

class Temperature extends Component {
  constructor() {
    super(props);
  }

  render() {
    const temperature = this.props.temperature;

    // convert keys(timestamps)/values(data) to arrays
    // and get only the wanted amount of them
    const labels = Object.keys(temperature).map(
      timestamp => new Date(timestamp * 1000).toLocaleTimeString())
      .slice(this.props.amount * -1);
    const data = Object.keys(temperature).map(
      timestamp => temperature[timestamp])
      .slice(this.props.amount * -1);

    return (
      <div className="temperature">
        <h1>Temperature</h1>
        <span className="legend">
          <p>y - °C</p>
          <p>x - time</p>
        </span>
        <Chart labels={labels} data={data} />
      </div>
    );
  }
}

export default Temperature;
