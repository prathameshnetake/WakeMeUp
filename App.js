import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Mapview, { AnimatedRegion, Marker } from 'react-native-maps';


export default class App extends React.Component {
  state = {
    region: {
      latitudeDelta: -1,
      longitudeDelta: -1      
    }
  }
  constructor(props) {
    super(props);
    this.gotCurrentPosition = this.gotCurrentPosition.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
  }

  gotCurrentPosition(data) {
    console.log(data)
    this.setState({region: Object.assign({}, this.state.region, data.coords)});
  }

  handleLocationError(err) {
    console.log(err);
  }

  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(this.gotCurrentPosition, this.handleLocationError);
  }

  componentWillMount() {
    this.getCurrentLocation();
  }
  render() {
    return (
      <View style={styles.container}>
        <Mapview
          style={styles.map}
          showsUserLocation
          followsUserLocation
          initialRegion={{
            latitude: 19.0856214,
            longitude: 72.8889969,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02 
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
