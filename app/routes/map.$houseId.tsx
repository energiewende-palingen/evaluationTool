import { ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react'; 
import { useRef, useState } from 'react';
import { getHouseViewForHouse } from '~/.server/convertUtils';
import { db } from '~/.server/db';
import HouseDetailView, { FormType } from '~/components/HouseDetailView';
import { HouseHoldViewData } from '~/dataStructures/HouseHoldViewData';
import { HouseViewData } from '~/dataStructures/HouseViewData';


export const loader = async ({ params }) => {
	
	let house = await db.house.findUnique({
		where: {
			id: params.houseId
		}
	});
	
	let view;
	if(house != null){
		view = await getHouseViewForHouse(house);
	}
	
	return JSON.stringify(view);
	
  };

export async function action({request,}: ActionFunctionArgs) {
	console.log("action houseHold");
	const formData = await request.formData();
	var data = Object.fromEntries(formData);
	console.log(data);
	let formType = parseInt(data["formType"] as string) ;
	switch(formType){
		case FormType.UpdateSolarPowerSystem:
			console.log("update solar power system");
			await handleUpdateSolorPowerSystem(formData);
			break;
		case FormType.UpdateHouseHold:
			console.log("update house hold");
			await handleUpdateHouseHold(formData);
			break;
		case FormType.AddSolorPowerSystem:
			console.log("add solar power system");
			await addSolorPowerSystem(formData);
			break;
		default:
			console.log("no form type for: " + formType);
	
	}
	
	
	
	return null;
}



export default function MapDetails() {
	let house : HouseViewData = JSON.parse(useLoaderData());
	

	return (
		<div>
			<HouseDetailView data={house}></HouseDetailView>
			
		</div>
	);
}

async function handleUpdateHouseHold(formData: FormData) {
	var data = Object.fromEntries(formData);
	let heatConsumption : number = parseInt(data['heatConsumption'] as string);
	let houseHoldId : string = data['houseHoldId'] as string;
	console.log(`selected houseHold: ${houseHoldId}`);
	var dbHouseHold = await db.houseHold.findUnique({
		where: {
			id: houseHoldId
		}
	});
	
	if(dbHouseHold != null){
		console.log("household matches");
		var dbConsumption = await db.houseHoldConsumption.findUnique({
			where: {
				id: dbHouseHold.houseHoldConsumptionId
			}
		});

		if(houseHoldId != undefined && heatConsumption != undefined){
			console.log("household & consumption matches");
			if(dbConsumption != null && dbConsumption.usesGasForHeat){
				console.log("uses gas");
				const updated = await db.houseHoldConsumption.update({
					where: {
						id: dbHouseHold.houseHoldConsumptionId
					},
					data: {
						heatConsumptionGas: heatConsumption,
						heatConsumptionWood : heatConsumption
					}
				});
				console.log("updated" + updated.heatConsumptionGas);
			}
		}
		
	}
}
async function handleUpdateSolorPowerSystem(formData: FormData) {
	var data = Object.fromEntries(formData);
	let installedPower : number = parseInt(data['installedPower'] as string);
	let roofSize : number = parseInt(data['roofSize'] as string) ;
	let azimuth : number = parseInt(data['azimuth'] as string);
	let roofTilt : number = parseInt(data['roofTilt'] as string);
	let batteryCapacity : number = parseInt(data['batteryCapacity'] as string);
	let installed : boolean = data['installed'] == 'true';

	

	let solarId : string = data['solarId'] as string;
	console.log(`selected houseHold: ${solarId}`);
	var dbSolarPowerSystem = await db.solarPowerSystem.findUnique({
		where: {
			id: solarId
		}
	});

	if(dbSolarPowerSystem != null){
		installedPower = isNaN(installedPower) ? dbSolarPowerSystem.installedPower : installedPower;
		roofSize = isNaN(roofSize) ? dbSolarPowerSystem.roofSize : roofSize;
		azimuth = isNaN(azimuth) ? dbSolarPowerSystem.azimuth : azimuth;
		roofTilt = isNaN(roofTilt) ? dbSolarPowerSystem.roofTilt : roofTilt;
		batteryCapacity = isNaN(batteryCapacity) ? dbSolarPowerSystem.batteryCapacity : batteryCapacity;
		installed = installed == undefined ? dbSolarPowerSystem.installed : installed;
		
		
		if(solarId != undefined && installedPower != undefined){
			console.log("solar & power matches");
			const updated = await db.solarPowerSystem.update({
				where: {
					id: dbSolarPowerSystem.id
				},
				data: {
					installedPower: installedPower,
					roofSize: roofSize,
					azimuth: azimuth, 
					roofTilt: roofTilt,
					batteryCapacity: batteryCapacity,
					installed : installed,
			
				}
			});
			console.log("updated" + updated.installedPower);
		}
	}
}

function addSolorPowerSystem(formData: FormData) {
	var formObject = Object.fromEntries(formData);
	let houseId : string = formObject['houseId'] as string;

	db.solarPowerSystem.create({
		data: {
			installedPower: 0,
			roofSize: 0,
			azimuth: 0, 
			roofTilt: 0,
			batteryCapacity: 0,
			installed : false,
			houseId: houseId
		}
	});
}

