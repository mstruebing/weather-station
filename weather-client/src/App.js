import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import AmountSwitcher from './components/amountSwitcher';
import Brightness from './components/brightness';
import Humidity from './components/humidity';
import Loader from './components/loader';
import Rain from './components/rain';
import Temperature from './components/temperature';

class App extends Component {
  constructor() {
    super();

    this.requestURL = 'http://mail.hokanhub.com:8080/';
    // this.requestURL = 'http://localhost:8080/';

    this.state = {
      isLoading: true,
      amount: 10,
      brightness: [],
      humidity: [],
      rain: [],
      temperature: []
    };
  };

  componentWillMount() {
    // get initial data
    // setTimeout(this.fetchInitialData.bind(this), 1000);
    this.fetchInitialData();
  }

  componentDidMount() {
    setInterval(this.fetchUpdatedData.bind(this), 5000);
  }

  fetchInitialData() {
    // sample data
    // this.setState({
    //   isLoading: false,
    //   brightness: {1494234168: this.getRandomArbitrary(0, 1), 1494234268: this.getRandomArbitrary(0, 1), 1494234368: this.getRandomArbitrary(0, 1)},
    //   humidity: {1494234168: this.getRandomArbitrary(0, 100), 1494234268: this.getRandomArbitrary(0, 100), 1494234368: this.getRandomArbitrary(0, 100)},
    //   rain: {1494234168: this.getRandomArbitrary(0, 1), 1494244268: this.getRandomArbitrary(0, 1), 1494234368: this.getRandomArbitrary(0, 1)},
    //   temperature: {1494234168: this.getRandomArbitrary(-20, 40), 1494234268: this.getRandomArbitrary(-20, 40), 1494234368: this.getRandomArbitrary(-20, 40)},
    // });

    // real data
    this.fetchBrightness();
    this.fetchHumidity();
    this.fetchRain();
    this.fetchTemperature();
  }

  fetchUpdatedData() {
    const brightness = this.state.brightness;
    const lastBrightnessTimestamp = Object.keys(brightness).reduce(this.getLastTimestamp, 0);
    const brightnessQuery = lastBrightnessTimestamp ? `?timestamp=${lastBrightnessTimestamp}` : '';
    this.fetchBrightness(brightnessQuery)

    const humidity = this.state.humidity;
    const lastHumidityTimestamp = Object.keys(humidity).reduce(this.getLastTimestamp, 0);
    const humidityQuery = lastHumidityTimestamp ? `?timestamp=${lastHumidityTimestamp}` : '';
    this.fetchHumidity(humidityQuery)

    const rain = this.state.rain;
    const lastRainTimestamp = Object.keys(rain).reduce(this.getLastTimestamp, 0);
    const rainQuery = lastRainTimestamp ? `?timestamp=${lastRainTimestamp}` : '';
    this.fetchRain(rainQuery)

    const temperature = this.state.temperature;
    const lastTemperatureTimestamp = Object.keys(temperature).reduce(this.getLastTimestamp, 0);
    const temperatureQuery = lastTemperatureTimestamp ? `?timestamp=${lastTemperatureTimestamp}` : '';
    this.fetchTemperature(temperatureQuery)
    // temperature[lastTemperatureTimestamp * 1 + 100] = this.getRandomArbitrary(-20, 40);
  }

  fetchBrightness(query = '') {
    axios.get(`${this.requestURL}brightness${query}`)
      .then(res => {
        this.setState({
          isLoading: false,
          brightness: query === '' ? res.data : Object.assign(this.state.brightness, res.data)
        });
      });
  }

  fetchHumidity(query = '') {
    axios.get(`${this.requestURL}humidity${query}`)
      .then(res => {
        this.setState({
          isLoading: false,
          humidity: query === '' ? res.data : Object.assign(this.state.humidity, res.data)
        });
      });
  }

  fetchRain(query = '') {
    axios.get(`${this.requestURL}rain${query}`)
      .then(res => {
        this.setState({
          isLoading: false,
          rain: query === '' ? res.data : Object.assign(this.state.rain, res.data)
        });
      });
  }

  fetchTemperature(query = '') {
    axios.get(`${this.requestURL}temperature${query}`)
      .then(res => {
        this.setState({
          isLoading: false,
          temperature: query === '' ? res.data : Object.assign(this.state.temperature, res.data)
        });
      });
  }

  // Just for sample data
  getLastTimestamp(a, b) {
    return (a > b ? a : b);
  }

  // Just for sample data
  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  handleChange(event) {
    this.setState({amount: event.target.value});
  }

  render() {
    return (
      <div className="app">
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <div className="content">
            <div className="controls">
              <AmountSwitcher amount={this.state.amount} onChange={this.handleChange.bind(this)} />
            </div>
            <div className="charts">
              <Brightness amount={this.state.amount} brightness={this.state.brightness} />
              <Humidity amount={this.state.amount} humidity={this.state.humidity} />
              <Rain amount={this.state.amount} rain={this.state.rain} />
              <Temperature amount={this.state.amount} temperature={this.state.temperature} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
