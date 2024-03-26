import myMapStyles from './MyMap.css';
import React, { useContext, useState } from 'react'
import { ApiContext } from '~/context/apiContext';
import { GoogleMap, useJsApiLoader, Marker, MapContext } from '@react-google-maps/api';
import { DistrictContext } from '~/context/serverModelContext';
import HouseMarker from './HouseMarker';
import { Outlet, useNavigate } from '@remix-run/react';
import { HouseViewData } from '~/dataStructures/HouseViewData';


  
function MyMap() {
	const navigate = useNavigate();
	let houses = useContext(DistrictContext).houses;
	console.log(`houses: ${houses.length}`);
	const [mapState, setMapState] = useState({activeHouse: houses[0] , zoom: 18});

	const onMarkerClick = (data : HouseViewData) => {
		setMapState({activeHouse: data , zoom: 18});
		navigate('/map/'+data.house.id);
	}

	const containerStyle = {
		height: '100vh'
	};
	
	let key = useContext(ApiContext).googleMapsApiKey;
	const { isLoaded } = useJsApiLoader({
		
		id: 'google-map-script',
		googleMapsApiKey: key
	});

	
  const onLoad = React.useCallback(function callback(map) {

  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    
  }, [])

  console.log(`active house: ${mapState.activeHouse.house.latitude} ${mapState.activeHouse.house.longitude}`);
  
  return isLoaded ? (
	
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={{lat: mapState.activeHouse.house.latitude, lng: mapState.activeHouse.house.longitude}}
					zoom={mapState.zoom}
					onLoad={onLoad}
					onUnmount={onUnmount}
				>
					{ 
					
					}
					<></>
					{houses.length ? (
						houses.map((viewData : HouseViewData) => {
							return <HouseMarker view={viewData} onClick={onMarkerClick}></HouseMarker> 
						})): <></>
					}
				</GoogleMap>
			
  ) : <></>
}

export default MyMap;

export function links() {	
	return [{rel : 'stylesheet', href : myMapStyles}];
}

