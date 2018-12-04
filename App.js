import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  ActivityIndicator,
  StatusBar
} from 'react-native';

import { fetchLocationId, fetchWeather } from './utils/api'
import getImageForWeather from './utils/getImageForWeather'

import SearchInput from './components/SearchInput'

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    location: 'San Francisco',
    loading: false,
    error: false,
    temperature: 0,
    weather: ''
  };

  componentDidMount() {
    this.handleUpdateLocation(this.state.location);
  }

  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({ loading: true }, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(locationId);

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature
        });
      } catch (e) {
        this.setState({
          error: true,
          loading: false
        });
      }
    });
  }

  render() {
    const { location, error, weather, temperature, loading } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}>

          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try another city!
                  </Text>
                )}

                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
                    <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                    <Text style={[styles.largeText, styles.textStyle]}>{`${Math.round(temperature)}C`}</Text>
                  </View>
                )}

                <SearchInput
                  placeholder="Search a city"
                  onSubmit={this.handleUpdateLocation}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS == 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white'
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 20
  }
});
