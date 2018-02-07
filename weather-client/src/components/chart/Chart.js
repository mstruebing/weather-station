import React, {props, Component} from 'react';
import {Line} from 'react-chartjs';

class Chart extends Component {
  constructor() {
    super(props);
  }

  render() {
    const data = {
        labels: this.props.labels,
        datasets: [
            {
                fill: false,
                fillColor: "rgba(120,120,220,0.4)",
                lineTension: 0.1,
                backgroundColor: "rgba(0,0,255,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.props.data,
                spanGaps: false,
            }
        ]
    };

    const options = {
      responsive: false,
    };

    return (
      <div>
        <Line data={data} options={options} width="600" height="250" />
      </div>
    )
  }
}

export default Chart;
