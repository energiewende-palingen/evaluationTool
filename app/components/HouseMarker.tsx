import { Marker } from '@react-google-maps/api';
import houseMarkerStyles from './HouseMarker.css';
import { House } from '@prisma/client';
import { useState } from 'react';
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { FilterData } from '~/context/serverModelContext';

export class HouseDetails{
	public lat: number;
	public lng: number;

	constructor(lat: number, lng: number){
		this.lat = lat;
		this.lng = lng;
	}
}

function HouseMarker({viewData: view, onClick, filter} : {viewData : HouseViewData, onClick: (view: HouseViewData)=>void, filter: FilterData}) {
	let iconUrl: string= '/house.png';
	var view = new HouseViewData(view.house, view.houseHolds, view.solarPowerSystems);
	view.houseHolds.forEach(houseHold => {
		
		if(houseHold.interest?.noInterest){
			view.interest.noInterest = view.interest.noInterest && true;
		}
		if(houseHold.interest?.undecided){
			view.interest.undecided = view.interest.undecided || true;
		} 
		if(houseHold.interest?.participateInProduction || houseHold.interest?.provideResources){
			view.interest.participateInProduction = view.interest.participateInProduction || true;
		} 
		
		if(houseHold.interest?.electricity){
			view.interest.receiveElectricity = view.interest.receiveElectricity || true;
		} 
		if(houseHold.interest?.heat){
			view.interest.receiveHeat = view.interest.receiveHeat || true;
		}
	});


	if(view.interest.noInterest){	
		iconUrl = '/houseRed.png';
	}
	else if(view.interest.undecided){
		iconUrl = '/houseYellow.png';
	}
	else if(view.interest.participateInProduction || view.interest.provideResources){
		iconUrl = '/houseGreen.png';
	}
	else if(view.interest.receiveElectricity){
		iconUrl = '/houseBlue.png';
	}
	else if(view.interest.receiveHeat){
		iconUrl = '/housePurple.png';
	}
	else{
		iconUrl = '/house.png';
	}

	if(filter.filterHeatingAge){
		iconUrl = '/house.png';
		if(view.houseHolds.length > 0){
			iconUrl = '/houseGrey.png';
		}
		if(view.interest.receiveHeat || view.interest.undecided){
			iconUrl = '/houseGreen.png';
			
			if(filter.filterHeatingAge){
				if(view.getOldestHeatingAge() >= 5){
					iconUrl = '/housePurple.png';
				}
				if(view.getOldestHeatingAge() >= 10){
					iconUrl = '/houseBlue.png';
				}
				if(view.getOldestHeatingAge() >= 15){
					iconUrl = '/houseYellow.png';
				}
				if(view.getOldestHeatingAge() >= 20){
					iconUrl = '/houseRed.png';
				}
			} 
		}
	} 
	
	if(filter.filterHeatConsumption){
		iconUrl = '/house.png';
		if(view.houseHolds.length > 0){
			
			iconUrl = '/houseGrey.png';
			if(view.interest.receiveHeat || view.interest.undecided){
				if(view.getMaxHeatConsumption() >= 20000){
					iconUrl = '/houseRed.png';
				}
				else if(view.getMaxHeatConsumption() >= 15000){
					iconUrl = '/houseYellow.png';
				}
				else if(view.getMaxHeatConsumption() >= 10000){
					iconUrl = '/housePurple.png';
				}
				else if(view.getMaxHeatConsumption() >= 5000){
					iconUrl = '/houseBlue.png';
				}
				else if(view.getMaxHeatConsumption() >= 0){
					iconUrl = '/houseGreen.png';
				}
			}
			
		}
		
		
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

export default HouseMarker;

export function links() {	
	return [{rel : 'stylesheet', href : houseMarkerStyles}];
}