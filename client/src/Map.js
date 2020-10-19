import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useLoadScript, Circle } from '@react-google-maps/api';
import './Map.css';
import locationsData from './locations.json';

const API_KEY = 'AIzaSyBb3mQQGDmzU6wjbbGRf7mBPJC9-JeHtkQ';
const libraries = ["places"];
const mapContainerStyle = {
    width: '100%',
    height: '100%'
};
const center = {
    lat: 31.5,
    lng: 35
};
const options = {
    style: [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        }]
}
const circleOptions = {
    strokeOpacity: 0.7,
    strokeWeight: 2,
    fillOpacity: 0.25,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1
  }
function Map() {

    const [locations,setLocations] = useState([...locationsData]);
    const [index,setIndex] = useState(0)
    const [marker,setMarker] = useState(null);
    const [distances,setDistances] = useState([]);
     

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: API_KEY,
        libraries: libraries
    });
    if(loadError) return "Error loading";
    if(!isLoaded) return "Loading maps";


    function handleClick(event) {
        if(marker === null) {
            const clickLocation = { 
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            const dis = distanceInKm(
                locations[index].loc.lat,
                locations[index].loc.lng,
                clickLocation.lat,
                clickLocation.lng);

            setDistances([...distances,{city: locations[index].name,distance: dis}]);
            setMarker(clickLocation);
        }
    }

    function nextCityMission() {
        if(marker) {
            if(index === 9){
                setIndex(0);
                setMarker(null);
                setDistances([]);
            } else {
                setMarker(null);
                setIndex(index+1);
            }
        }
    }

    return (
        <div className="Map">
            <div id="mainCon">
                <div id="mainTitle">Map It Out</div>

                <div id="mainDescription">
                    {`YOUR NEXT TARGET IS : `}<strong>{locations[index].name}</strong>
                </div>
                <div id="mainResult">
                    { 
                        marker != null &&
                        `KM FROM TARGET : ${distances[index].distance}`
                    }
                </div>
                <button id="nextButton"
                    className={index===9 && marker && 'gameOver'}
                    onClick={nextCityMission}
                    style={{display: !marker && 'none'}}
                >
                    {index === 9 && marker ? 'Start New Game' : 'Next'}
                </button>
            </div>
            <div id="tableScore">
                <div id="tableTitle">
                    <span>CITY</span>
                    <span>DISTANCE(KM)</span>
                </div>
                <div id="tableResults">
                {
                    distances.map((distance,i)=>{
                        console.log(distance)
                        return (
                            <div className="singleScore" id={i}
                                style={{
                                    color: 
                                        distance.distance<51 ? 
                                        'rgb(40, 116, 38)' : 
                                        distance.distance<101 ? 
                                        'rgb(161, 152, 16)' : 
                                        'rgb(100, 0, 0)'
                                }}>
                                <span>{distance.city}</span>
                                <span>{distance.distance}</span>
                            </div>
                        )
                    })
                }
                </div>
                <div id="tableTotalScore" className={index===9 && marker && 'gameOver'}>
                    <span>TOTAL SCORE :</span>
                    <span>{getTotalDistance(distances)}</span>
                </div>
            </div>
            <GoogleMap 
                mapContainerStyle={mapContainerStyle}
                zoom={8.5}
                center={center}
                options={options}
                onClick={(event)=>{handleClick(event)}}
            >
                {
                    marker != null &&
                    <Marker position={{lat: locations[index].loc.lat, lng: locations[index].loc.lng}}/>
                }
                {
                    marker != null && 
                    <Circle
                        center={{
                            lat: locations[index].loc.lat,
                            lng: locations[index].loc.lng
                        }}
                        options={{
                                circleOptions,
                                radius: distances[index].distance*1000,
                                strokeColor: distances[index].distance<51 ?
                                        '#427542' : distances[index].distance<101 ?
                                        '#9c9b3f' : '#8a4f4f',
                                fillColor: distances[index].distance<51 ?
                                        '#427542' : distances[index].distance<101 ?
                                        '#9c9b3f' : '#8a4f4f'
                                }}
                    />
                }
                {
                    marker != null &&
                    <Marker position={{lat: marker.lat, lng: marker.lng}}/>
                    
                }
            </GoogleMap>
        </div>
    )
}

export default Map


function distanceInKm(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return Math.round(12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
  }

function getTotalDistance(arr) {
    let totalDistance = 0 ;
    arr.forEach(({distance})=>{
        console.log(distance);
        totalDistance += distance ;
    })
    return totalDistance ;
}