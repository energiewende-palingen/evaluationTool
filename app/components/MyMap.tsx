import myMapStyles from './MyMap.css';
import React, { useContext, useState } from 'react'
import { ApiContext } from '~/context/apiContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { DistrictContext } from '~/context/serverModelContext';
import { House } from '@prisma/client';

export class HouseDetails{
	public lat: number;
	public lng: number;

	constructor(lat: number, lng: number){
		this.lat = lat;
		this.lng = lng;
	}
}
  
function MyMap() {
	
	let defaultHouse = new HouseDetails(53.852961395165615, 10.803171416966505);
	const [mapState, setMapState] = useState({activeHouse: defaultHouse , zoom: 18});
	
	const containerStyle = {
		height: '100vh'
	};
	
	let key = useContext(ApiContext).googleMapsApiKey;
	const { isLoaded } = useJsApiLoader({
		
		id: 'google-map-script',
		googleMapsApiKey: key
	});

	let houses = useContext(DistrictContext).houses;
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
					center={{lat: mapState.activeHouse.lat, lng: mapState.activeHouse.lng}}
					zoom={mapState.zoom}
					onLoad={onLoad}
					onUnmount={onUnmount}
				>
					{ 
					
					}
					<></>
					{houses.length ? (
						houses.map((house : House) => {
							let iconUrl: string= '/house.png';
							return <Marker key={house.id} 
								position={{lat: house.latitude, lng: house.longitude}}
								icon={{
									url: iconUrl,
									anchor: new google.maps.Point(25, 25),
									scaledSize: new google.maps.Size(50, 50)
								}}
								onClick={() => onMarkerClick(house)}
							/>
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
