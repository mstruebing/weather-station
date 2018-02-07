import React, { props, Component } from 'react';
import Chart from '../chart';
import './Brightness.css';

class Brightness extends Component {
  constructor() {
    super(props);
  }

  render() {
    const brightness = this.props.brightness;

    // convert keys(timestamps)/values(data) to arrays
    // and get only the wanted amount of them
    // (timestamp is 2 hours greater than the real time, this is some fuck up in the api)
    const labels = Object.keys(brightness).map(
      timestamp => new Date(timestamp * 1000)
      .toLocaleTimeString())
      .slice(this.props.amount * -1);
    const data = Object.keys(brightness).map(
      timestamp => brightness[timestamp])
      .slice(this.props.amount * -1);

    return (
      <div className="brightness">
        <h1>Brightness</h1>
        <span className="legend">
          <p>y - yes/no</p>
          <p>x - time</p>
        </span>
        <Chart labels={labels} data={data} />
      </div>
    );
  }
}

export default Brightness;
