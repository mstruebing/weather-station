import React, { props, Component } from 'react';
import Chart from '../chart';
import './Rain.css';

class Rain extends Component {
  constructor() {
    super(props);
  }

  render() {
    const rain = this.props.rain;

    // convert keys(timestamps)/values(data) to arrays
    // and get only the wanted amount of them
    // (timestamp is 2 hours greater than the real time, this is some fuck up in the api)
    const labels = Object.keys(rain).map(
      timestamp => new Date(timestamp * 1000).toLocaleTimeString())
      .slice(this.props.amount * -1);
    const data = Object.keys(rain).map(
      timestamp => rain[timestamp])
      .slice(this.props.amount * -1);

    return (
      <div className="rain">
        <h1>Rain</h1>
        <span className="legend">
          <p>y - yes/no</p>
          <p>x - time</p>
        </span>
        <Chart labels={labels} data={data} />
      </div>
    );
  }
}

export default Rain;
