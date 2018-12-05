import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  Alert,
  PermissionsAndroid } from 'react-native';
import MapView from 'react-native-maps';

const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = 0.02;

export default class App extends Component {
  state = {
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    },
    destMarker: {
      latitude: 0,
      longitude: 0
    },
    destianationSelected: false
  }

  constructor(props) {
    super(props);
    this.addDestinationMarker = this.addDestinationMarker.bind(this);
    this.handleLongPress = this.handleLongPress.bind(this);
  }

  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(data => {
        // handle if user did not allow this
        console.log(data);
        this.watchID = navigator.geolocation.watchPosition((position) => {
          console.log(position.coords);
          const { latitude, longitude } = position.coords;
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
          const newCoordinate = {
            latitude,
            longitude
          }
          this.map.animateToRegion(newRegion, 500);
          this.liveMarker.animateMarkerToCoordinate(newCoordinate, 500);
          // this.setState({ region: newRegion });
        });
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  addDestinationMarker(coords) {
    console.log(coords);
    this.setState({destMarker: coords, destianationSelected: true});
  }

  handleLongPress(latlng) {
    console.log(latlng.nativeEvent.coordinate);
    const coords = latlng.nativeEvent.coordinate;
    const addDestinationMarker = this.addDestinationMarker;
    Alert.alert(
      'Confirm',
      'Are you sure this is your destination?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => addDestinationMarker(coords)},
      ],
      { cancelable: false }
    )
  }

  render() {
    const currentLocation = {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    }
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}
          ref={map => (this.map = map)}
          onLongPress={this.handleLongPress}
        >
          <MapView.Marker
            coordinate={currentLocation}
            ref={liveMarker => (this.liveMarker = liveMarker)}
          >
            <View style={styles.liveMarker}/>
          </MapView.Marker>
          {this.state.destianationSelected ?
            <MapView.Marker coordinate={this.state.destMarker}>
              <View style={styles.destMarker}/>
            </MapView.Marker> : null
          }
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  liveMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: "blue"
  },
  destMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: "red"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
