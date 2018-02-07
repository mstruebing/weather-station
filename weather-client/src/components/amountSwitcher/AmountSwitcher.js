import React, { props, Component } from 'react';
import './AmountSwitcher.css';

class AmountSwitcher extends Component {
  constructor() {
    super(props);
  }

  render() {
    return (
      <div className="amountSwitcher">
        <p>simultaneously printed values: {this.props.amount}</p>
        <input type="range" min="3" max="25" step="1" onChange={this.props.onChange} value={this.props.amount} />
      </div>
    );
  }
}

export default AmountSwitcher;
