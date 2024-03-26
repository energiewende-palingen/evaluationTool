import myMapStyles from './MyMap.css';
import React, { useContext, useState } from 'react'
import { ApiContext } from '~/context/apiContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { DistrictContext } from '~/context/serverModelContext';
import { House } from '@prisma/client';
import HouseMarker from './HouseMarker';


  
function MyMap() {
	let houses = useContext(DistrictContext).houses;
	const [mapState, setMapState] = useState({activeHouse: houses[0] , zoom: 18});

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

  
  return isLoaded ? (
	<div className="container">
		<div className="row">
			<div className="col-9">
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={{lat: mapState.activeHouse.latitude, lng: mapState.activeHouse.longitude}}
					zoom={mapState.zoom}
					onLoad={onLoad}
					onUnmount={onUnmount}
				>
					{ 
					
					}
					<></>
					{houses.length ? (
						houses.map((house : House) => {
							return <HouseMarker house={house}></HouseMarker> 
						})): <></>
					}
				</GoogleMap>
			</div>
		</div>	
	</div>
  ) : <></>
}

export default MyMap;

export function links() {	
	return [{rel : 'stylesheet', href : myMapStyles}];
}
