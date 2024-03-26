import { House } from '@prisma/client';
import houseDetailViewStyles from './HouseDetailView.css';
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { HouseHoldViewData } from '~/dataStructures/HouseHoldViewData';
import { useState } from 'react';


function HouseDetailView({data} : {data : HouseViewData}){
	const [selectedHouseHold, setSelectedHouseHold] = useState<HouseHoldViewData |undefined> ();
	
	function selectHouseHold(houseHold: HouseHoldViewData) {
		setSelectedHouseHold(houseHold);
	}
	
	let heatingType : string = 'Nicht bekannt';
	let heatConsumption : number | null = 0;
	let solarkwP : number = 0;
	let roofSize : number = 0;
	
	for(let solarPowerSystem of data.solarPowerSystems){
		solarkwP += solarPowerSystem.installedPower;
		roofSize += solarPowerSystem.roofSize;
	}

	if(selectedHouseHold != undefined){
		if(selectedHouseHold.consumption.usesWoodForHeat){
			heatingType = 'Holz'
			heatConsumption = selectedHouseHold.consumption.heatConsumptionWood;
		}
		
		if(selectedHouseHold.consumption.usesGasForHeat){
			heatingType = 'Gas'
			heatConsumption = selectedHouseHold.consumption.heatConsumptionGas;
		}
		if(selectedHouseHold.consumption.usesOilForHeat){
			heatingType = 'Öl'
			heatConsumption = selectedHouseHold.consumption.heatConsumptionOil;
		}
		if(selectedHouseHold.consumption.usesElectricityForHeat){
			heatingType = 'Strom'
			heatConsumption = selectedHouseHold.consumption.heatConsumptionElectricity;
		}
	}

	return (
		<div>
			<h1>{data.house.street}{data.house.houseNumber}</h1>
			<h2>Haushalte</h2>
			<table className='table table-hover'>
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Vorname</th>
						<th scope="col">Nachname</th>
						<th scope="col">Produzieren</th>
						<th scope="col">Resourcen</th>
						<th scope="col">Strom</th>
						<th scope="col">Wärme</th>
					</tr>
				</thead>
				<tbody>
					{data.houseHolds.map((houseHold, index) => {
						let highlightClass = "";
						if(houseHold.houseHold.id === selectedHouseHold?.houseHold.id){
							highlightClass = "table-active";
						}
						return (
							<tr className={highlightClass} key={houseHold.houseHold.id} onClick={() => selectHouseHold(houseHold)}>
								<th scope="row">{index + 1}</th>
								<td>{houseHold.houseHold.name}</td>
								<td>{houseHold.houseHold.lastName}</td>
								<td>{houseHold.interest.participateInProduction? "Ja" : "Nein"}</td>
								<td>{houseHold.interest.provideResources? "Ja" : "Nein"}</td>
								<td>{houseHold.interest.electricity? "Ja" : "Nein"}</td>
								<td>{houseHold.interest.heat? "Ja" : "Nein"}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<table className='table'>
				<thead>
					<tr>
						<th scope="col-3">Mögliche Erzeugung</th>
						<th scope="col"></th>
					</tr>
				</thead>
				<tbody>
					<tr >
						<td scope="col-3">Leistung:</td>
						<td scope="col">{solarkwP} kWp</td>
					</tr>
					<tr >
						<td scope="col-3">Fläche:</td>
						<td scope="col">{roofSize} qm</td>
					</tr>
					<tr >
						<td scope="col-3">Installiert:</td>
						<td scope="col">{data.solarPowerSystems[0].installed? "Ja" : "Nein"} </td>
					</tr>
					
				</tbody>
			</table>
			{selectedHouseHold != undefined ? 
				<div>
					<h2>Ausgewählter Haushalt:</h2>
					<table className='table'>
						<thead>
							<tr>
								<th scope="col-3">Verbrauch</th>
								<th scope="col"></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td scope="col-3">Stromverbrauch</td>
								<td scope="col">{selectedHouseHold.consumption.electricityConsumption}</td>
							</tr>
							<tr>
								<td scope="col-3">Heizungsart</td>
								<td scope="col">{heatingType}</td>
							</tr>
							<tr>
								<td scope="col-3">Wärmebedarf</td>
								<td scope="col">{heatConsumption}</td>
							</tr>
						</tbody>
					</table>
				</div>				
				: 
				<h2>Kein Haushalt ausgewählt</h2>
			}
			
		</div>
		);
			
}

export default HouseDetailView;

export function links() {	
	return [{rel : 'stylesheet', href : houseDetailViewStyles}];
}