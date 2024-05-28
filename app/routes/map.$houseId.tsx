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
	
	let view = null;
	if(house != null){
		view = await getHouseViewForHouse(house);
	}
	
	return JSON.stringify(view);
	
  };

export async function action({request,}: ActionFunctionArgs) {
	
	const formData = await request.formData();
	var data = Object.fromEntries(formData);
	var formTypeString =data["formType"] as string
	let formType = parseInt(formTypeString);
	switch(formType){
		case FormType.UpdateSolarPowerSystem:
			console.log("update solar power system");
			await handleUpdateSolorPowerSystem(formData);
			break;
		case FormType.UpdateHouseHold:
			await handleUpdateHouseHold(formData);
			console.log("update house hold");
			break;
		case FormType.AddSolorPowerSystem:
			console.log("add solar power system");
			await addSolarPowerSystem(formData);
			break;
		case FormType.RemoveSolarPowerSystem: 
			console.log("remove solar power system");
			await removeSolarPowerSystem(formData);
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
	let heatConsumptionGas : number | null = parseInt(data['heatConsumptionGas'] as string);
	let heatConsumptionOil : number | null = parseInt(data['heatConsumptionOil'] as string);
	let heatConsumptionWood : number |null = parseInt(data['heatConsumptionWood'] as string);
	let heatConsumptionElectricity : number | null = parseInt(data['heatConsumptionElectricity'] as string);
	let conversionFactorOil : number | null= parseFloat(data['kwHConversionOil'] as string);
	let conversionFactorWood : number | null= parseFloat(data['kwHConversionWood'] as string);
	let conversionFactorElectrictity : number | null= parseFloat(data['kwHConversionElectricity'] as string);
	let heatingArea : number | null = parseInt(data['heatingArea'] as string);
	let electricityConsumption : number | null = parseInt(data['electricityConsumption'] as string);


	let houseHoldId : string = data['houseHoldId'] as string;
	console.log(`selected houseHold: ${houseHoldId}`);
	var dbHouseHold = await db.houseHold.findUnique({
		where: {
			id: houseHoldId
		}
	});

	
	
	if(dbHouseHold != null){
		
		heatingArea = isNaN(heatingArea) ? dbHouseHold?.heatedArea : heatingArea;

		await db.houseHold.update({
			where: {
				id: houseHoldId
			},
			data: {
				heatedArea: heatingArea,
			}
		});

		var dbConsumption = await db.houseHoldConsumption.findUnique({
			where: {
				id: dbHouseHold.houseHoldConsumptionId
			}
		});

		if(houseHoldId != undefined){
			
			
			if(dbConsumption != null ){
				electricityConsumption = isNaN(electricityConsumption)  ? dbConsumption.electricityConsumption : electricityConsumption;
				heatConsumptionGas = isNaN(heatConsumptionGas) ? dbConsumption.heatConsumptionGas : heatConsumptionGas;
				heatConsumptionOil = isNaN(heatConsumptionOil) ? dbConsumption.heatConsumptionOil : heatConsumptionOil;
				heatConsumptionWood = isNaN(heatConsumptionWood) ? dbConsumption.heatConsumptionWood : heatConsumptionWood;
				heatConsumptionElectricity = isNaN(heatConsumptionElectricity) ? dbConsumption.heatConsumptionElectricity : heatConsumptionElectricity;
				conversionFactorElectrictity = isNaN(conversionFactorElectrictity) ? dbConsumption.convertToKwhElectricityFactor : conversionFactorElectrictity;
				conversionFactorWood = isNaN(conversionFactorWood) ? dbConsumption.convertToKwhWoodFactor : conversionFactorWood;
				conversionFactorOil = isNaN(conversionFactorOil) ? dbConsumption.convertToKwhOilFactor : conversionFactorOil;
				

				let dataContent = {
					electricityConsumption: electricityConsumption,
					heatConsumptionElectricity: heatConsumptionElectricity,
					heatConsumptionGas: heatConsumptionGas,
					heatConsumptionOil: heatConsumptionOil,
					heatConsumptionWood: heatConsumptionWood,
					convertToKwhElectricityFactor : conversionFactorElectrictity,
					convertToKwhWoodFactor : conversionFactorWood,
					convertToKwhOilFactor : conversionFactorOil
				};

				console.log("Update Consumption: " + dataContent.toString());
				await db.houseHoldConsumption.update({
					where: {
						id: dbHouseHold.houseHoldConsumptionId
					},
					data: dataContent
				});
			}
		}
		
	}
}

async function removeSolarPowerSystem(formData : FormData){
	var data = Object.fromEntries(formData);
	let solarId : string = data['solarId'] as string;
	await db.solarPowerSystem.delete(
		{
			where: {
				id: solarId
			}
		}
	);
}

async function handleUpdateSolorPowerSystem(formData: FormData) {
	var data = Object.fromEntries(formData);
	let installedPower : number = parseInt(data['installedPower'] as string);
	let roofSize : number = parseInt(data['roofSize'] as string) ;
	let azimuth : number = parseInt(data['azimuth'] as string);
	let roofTilt : number = parseInt(data['roofTilt'] as string);
	let batteryCapacity : number = parseInt(data['batteryCapacity'] as string);
	console.log("Installed: " + data['installed']);
	let installed : boolean = data['installed'] == 'on';

	let solarId : string = data['solarId'] as string;
	
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

async function addSolarPowerSystem(formData: FormData) {
	var formObject = Object.fromEntries(formData);
	let houseId : string = formObject['houseId'] as string;
	console.log("Add solar for house: " + houseId);
	await db.solarPowerSystem.create({
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

