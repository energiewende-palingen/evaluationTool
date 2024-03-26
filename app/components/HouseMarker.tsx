import { Marker } from '@react-google-maps/api';
import houseMarkerStyles from './HouseMarker.css';
import { House } from '@prisma/client';
import { useState } from 'react';
import { HouseViewData } from '~/dataStructures/HouseViewData';

export class HouseDetails{
	public lat: number;
	public lng: number;

	constructor(lat: number, lng: number){
		this.lat = lat;
		this.lng = lng;
	}
}

function HouseMarker({view, onClick} : {view : HouseViewData, onClick: (view: HouseViewData)=>void}) {
	let iconUrl: string= '/house.png';
	let houseState : Interest = Interest.NotSet;
	view.houseHolds.forEach(houseHold => {
		if(houseHold.interest?.noInterest){
			houseState = Interest.NoInterest;
		}
		else if(houseHold.interest?.undecided){
			houseState = Interest.Undecided;
		} else if(houseHold.interest?.participateInProduction || houseHold.interest?.provideResources){
			houseState = Interest.ProvideResources;
		} else if(houseHold.interest?.electricity){
			houseState = Interest.ReceiveElectricity;
		} else if(houseHold.interest?.heat){
			houseState = Interest.ReceiveHeat;
		}
	});
	switch(houseState as Interest){
		case Interest.NoInterest:
			iconUrl = '/houseRed.png';
			break;
		case Interest.Undecided:
			iconUrl = '/houseYellow.png';
			break;
		case Interest.ProvideResources:
			iconUrl = '/houseGreen.png';
			break;
		case Interest.ReceiveElectricity:
			iconUrl = '/houseBlue.png';
			break;
		case Interest.ReceiveHeat:
			iconUrl = '/housePurple.png';
			break;
		case Interest.NotSet: 
			iconUrl = '/house.png';
			break;
	}
	
	return <Marker key={view.house.id} 
				position={{lat: view.house.latitude, lng: view.house.longitude}}
				icon={{
					url: iconUrl,
					anchor: new google.maps.Point(25, 25),
					scaledSize: new google.maps.Size(50, 50)
				}}
				onClick={() => onClick(view)}
			/>
}

enum Interest {
	NotSet,
	NoInterest,
	Undecided,
	ParticipateInProduction,
	ProvideResources,
	ReceiveElectricity,
	ReceiveHeat
}

export default HouseMarker;

export function links() {	
	return [{rel : 'stylesheet', href : houseMarkerStyles}];
}