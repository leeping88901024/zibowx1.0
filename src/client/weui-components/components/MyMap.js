import React from 'react';
//import {Map, Marker, NavigationControl, InfoWindow, } from 'react-bmap';
import Map from '../components/Map';
import MyDrivingRoute from '../components/DrivingRoute';
import NavigationControl from '../components/NavigationControl';

class MyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location_id: this.props.match.params.location_id,
            // 目标采血点信息
            location: [],
            
            // 本地位置
            // 经度
            lng: 102.8295470000,
            // 纬度
            lat: 24.8911570000,

        }
        this.success = this.success.bind(this);

    }

    componentDidMount() {
        // 目标采血点
        const url = '/db/location?location_id=' + this.state.location_id;
        fetch(
            url,
            {
                method: 'get',
                headers: {
                    accept: 'application/json'
                }
            }
        ).then(res => res.json())
         .then(json => {
            // console.log(json);
            this.setState({ location: json.rows[0] });
            // console.log(this.state.location);
         }); 

         // 起点
        const options = {
			enableHighAccuracy: true,
			timeout: 50000,
			maximumAge: 0,
		}

        navigator.geolocation.getCurrentPosition(this.success, this.error, options)


    }

    success(pos) {
        let crd = pos.coords;
        this.setState({ lat: crd.latitude });
        this.setState({ lng: crd.longitude });
        // console.log(this.state.lat);
        // console.log(this.state.lng);

    }

    error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    render() {
        const zibo = {
            lat: 36.8190520000,
            lng: 118.0400540000
        }
        const yunshida = {
            lat: 24.8674350000,
            lng: 102.8597470000
        }
        return (
            <div>
                <Map center={{lng: 116.402544, lat: 39.928216}} zoom="20"> 
                    <NavigationControl />
                    <MyDrivingRoute start={{lat: this.state.lat,lng: this.state.lng}} end={{lat: this.state.location[6],lng: this.state.location[5]}}/>
                    {/* <MyDrivingRoute start={{lat: yunshida.lat, lng: yunshida.lng}} end={{lat: zibo.lat, lng: zibo.lng}}/> */}     
                </Map>
            </div>
        )
    }
}

export default MyMap;
