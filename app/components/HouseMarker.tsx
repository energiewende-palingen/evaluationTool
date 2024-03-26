import { Marker } from '@react-google-maps/api';
import houseMarkerStyles from './HouseMarker.css';
import { House } from '@prisma/client';
import { useState } from 'react';

export class HouseDetails{
	public lat: number;
	public lng: number;

	constructor(lat: number, lng: number){
		this.lat = lat;
		this.lng = lng;
	}
}

function HouseMarker({house } : {house : House}) {
	
	let defaultHouse = new HouseDetails(53.852961395165615, 10.803171416966505);
	const [mapState, setMapState] = useState({activeHouse: house , zoom: 18});
	
	const onMarkerClick = (house : House) => {
		setMapState({activeHouse: house , zoom: 18});
	  }
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
}

export default HouseMarker;

export function links() {	
	return [{rel : 'stylesheet', href : houseMarkerStyles}];
}