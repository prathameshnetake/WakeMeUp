import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  PermissionsAndroid
} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const ALTITUDE = -48.599998474121094;

export default class App extends Component {
  state = {
    region: {
      latitude: 0,
      longitude: 0
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
    console.log("Component did mount");
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  addDestinationMarker(coords) {
    this.setState({ destMarker: coords, destianationSelected: true });
  }

  handleLongPress(latlng) {
    console.log(latlng.nativeEvent.coordinate);
    const coords = latlng.nativeEvent.coordinate;
    const addDestinationMarker = this.addDestinationMarker;
    Alert.alert(
      'Confirm',
      'Are you sure this is your destination?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => addDestinationMarker(coords) },
      ],
      { cancelable: false }
    )
  }

  gotNewPosition(position) {
    console.log(position.coords);
    const { latitude, longitude, altitude} = position.coords;
    const currentCam = this.map.getCamera();
    currentCam.then(data => {
      const camView = {
        center: {
          latitude,
          longitude
        },
        heading: data.heading,
        altitude
      }
      this.map.animateCamera(camView, {duration: 500});
    });
    const newCoordinate = {
      latitude,
      longitude
    }
    this.liveMarker.animateMarkerToCoordinate(newCoordinate, 500);
  }

  positionError(err) {
    console.log(err);
  }

  handleMapReady() {
    const _this = this;
    PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION])
      .then(data => {
        // handle if user did not allow this
        console.log(data);
        Geolocation.watchPosition(
          (position) => {
            _this.gotNewPosition(position);
          },
          (error) => {
            // See error code charts below.
            _this.positionError(error);
          },
          { enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
            distanceFilter: 10,
            fastestInterval: 500,
            interval: 1000,
            showLocationDialog: true
          }
        );

      })
      .catch(err => console.log(err));
  }

  render() {
    const currentLocation = {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    }
    const camView = {
      center: {
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
      },
      pitch: 0,
      heading: 0,
      zoom: 15,
      altitude: ALTITUDE
    }
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          // region={this.state.region}
          camera={camView}
          ref={map => (this.map = map)}
          onLongPress={this.handleLongPress}
          onMapReady={this.handleMapReady.bind(this)}
        >
          <MapView.Marker
            coordinate={currentLocation}
            ref={liveMarker => (this.liveMarker = liveMarker)}
            title={"You are here"}
          >
            <View style={styles.radius}>
              <View style={styles.liveMarker} />
            </View>
          </MapView.Marker>
          {this.state.destianationSelected ?
            <MapView.Marker coordinate={this.state.destMarker}>
              <View style={styles.destMarker} />
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
  radius: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center"
  },
  liveMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#007AFF"
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
