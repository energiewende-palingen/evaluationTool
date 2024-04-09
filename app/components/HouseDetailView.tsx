import { House, SolarPowerSystem } from '@prisma/client';
import houseDetailViewStyles from './HouseDetailView.css';
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { HouseHoldViewData } from '~/dataStructures/HouseHoldViewData';
import { useState } from 'react';


function HouseDetailView({data} : {data : HouseViewData}){
	const [selectedHouseHold, setSelectedHouseHold] = useState<HouseHoldViewData |undefined> ();
	const [selectedSolorPowerSystem, setSelectedSolarPowerSystem] = useState<SolarPowerSystem | undefined> ();
	
	function selectHouseHold(houseHold: HouseHoldViewData) {
		setSelectedHouseHold(houseHold);
		
	}

	function selectSolarPowerSystem(solarPowerSystem: SolarPowerSystem) {
		setSelectedSolarPowerSystem(solarPowerSystem);
	}
	
	let heatingType : string = 'Nicht bekannt';
	let heatConsumption : number = 0;
	let heatKwhConsumption : number = 0;
	let solarkwP : number = 0;
	let roofSize : number = 0;
	let heatConsumptionClass : string = "";
	let heatedAreaClass : string = "";
	let heatConsumptionPerQm : number = 0;
	let sumHeatedArea : number = 0;
	
	for(let solarPowerSystem of data.solarPowerSystems){
		solarkwP += solarPowerSystem.installedPower;
		roofSize += solarPowerSystem.roofSize;
	}
	
	let sumHeatConsumption : number = 0;
	let sumElectricityConsumption : number = 0;
	for(let houseHold of data.houseHolds){
		let heatConsumption = getHeatConsumptionForHouseHold(houseHold)* houseHold.consumption.convertToKwhFactor;
		if(heatConsumption == 0){
			heatConsumptionClass = "table-danger";
			heatConsumption = 130 * ( houseHold.houseHold.heatedArea? houseHold.houseHold.heatedArea : 0 ) ;
		}
		sumHeatConsumption += heatConsumption;
		if(houseHold.houseHold.heatedArea == null || houseHold.houseHold.heatedArea == 0){
			heatedAreaClass = "table-danger";
			sumHeatedArea += 120;
		} else {
			sumHeatedArea += houseHold.houseHold.heatedArea;
		}
		sumElectricityConsumption += houseHold.consumption.electricityConsumption? houseHold.consumption.electricityConsumption : 0;
	}
	heatConsumptionPerQm = Math.round(sumHeatConsumption / sumHeatedArea);

	if(selectedHouseHold != undefined){
		if(selectedHouseHold.consumption.usesWoodForHeat){
			heatingType = 'Holz'
		}
		
		if(selectedHouseHold.consumption.usesGasForHeat){
			heatingType = 'Gas'
		}
		else if(selectedHouseHold.consumption.usesOilForHeat){
			heatingType = 'Öl'
		}
		else if(selectedHouseHold.consumption.usesElectricityForHeat){
			heatingType = 'Strom'
		}
		heatConsumption = getHeatConsumptionForHouseHold(selectedHouseHold)
		heatKwhConsumption = heatConsumption * selectedHouseHold.consumption.convertToKwhFactor;
	}

	return (
		<div>
			<h1>{data.house.street}{data.house.houseNumber}</h1>
			<table className='table table-hover'>
				<tbody>
					<tr>
						<td scope="col-3">Stromverbrauch</td>
						<td scope="col">{sumElectricityConsumption} kwh</td>
					</tr>
					<tr>
						<td scope="col-3">Wärmeverbrauch</td>
						{sumHeatConsumption > 0}
						<td scope="col" className={heatConsumptionClass}>{sumHeatConsumption} kwh</td>
					</tr>
					<tr>
						<td scope="col-3">Energieklasse</td>
						{sumHeatConsumption > 0}
						<td scope="col" className={heatedAreaClass}>{heatConsumptionPerQm} kwh/qm </td>
					</tr>
					
				</tbody>
			</table>
			<h2>Haushalte</h2>
			<table className='table table-hover'>
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Vorname</th>
						<th scope="col">Nachname</th>
						<th scope="col">e-mail</th>
						<th scope="col">Produzieren</th>
						<th scope="col">Resourcen</th>
						<th scope="col">Strom</th>
						<th scope="col">Wärme</th>
						<th scope="col">Heizungsalter</th>
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
								<td>{houseHold.houseHold.email}</td>
								<td>{houseHold.interest.participateInProduction? "Ja" : "Nein"}</td>
								<td>{houseHold.interest.provideResources? "Ja" : "Nein"}</td>
								<td>{houseHold.interest.electricity? "Ja" : "Nein"}</td>
								<td>{houseHold.interest.heat? "Ja" : "Nein"}</td>
								<td>{houseHold.houseHold.heatingSystemAge}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<h2>Summierte Erzeugungs Kapazität</h2>
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
			<h2>Einzelne Solaranlagen</h2>
			
			<table className='table'>
				<thead>
					<tr>
						<th scope="col">Installierte kwP</th>
						<th scope="col">Dachfläche</th>
						<th scope="col">Dachneigung</th>
						<th scope="col">Dachausrichtung</th>
						<th scope="col">Batterie Kapazität</th>
						<th scope="col">Gebaut</th>
						
					</tr>
				</thead>
				<tbody>
				{data.solarPowerSystems.map((solarPowerSystem, index) => {
					let highlightClass = "";
					if(solarPowerSystem.id === selectedSolorPowerSystem?.id){
						highlightClass = "table-active";
					}
					return (
						
							<tr className={highlightClass} key={solarPowerSystem.id} onClick={() => selectSolarPowerSystem(solarPowerSystem)}>
								<td>{solarPowerSystem.installedPower} kWp</td>
								<td>{solarPowerSystem.roofSize} qm</td>
								<td>{solarPowerSystem.roofTilt} °</td>
								<td>{solarPowerSystem.azimuth} °</td>
								<td>{solarPowerSystem.batteryCapacity} kwh</td>
								<td>{solarPowerSystem.installed? "yes" : "no"}</td>
							</tr>
						);
					})
				}
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
								<td scope="col-3">Verbrauch</td>
								<td scope="col">{heatConsumption}</td>
							</tr>
							<tr>
								<td scope="col-3">Wärmebedarf</td>
								<td scope="col">{heatKwhConsumption} kwh</td>
							</tr>
							<tr>
								<td scope="col-3">Heizfläche</td>
								<td scope="col">{selectedHouseHold.houseHold.heatedArea} qm</td>
							</tr>
						</tbody>
					</table>
					
					
					<form method="post" action={`/map/${data.house.id}`}>
						<h2>Haushalt anpassen</h2>
						<label htmlFor="heatConsumption">Wärmebedarf</label>
						<input name="heatConsumption" type="text" />
						<label htmlFor="kwhConversion">KwH Umrechnung</label>
						<input name="kwhConversion" type="text" />
						<input name="houseHoldId" type="hidden" value={selectedHouseHold.houseHold.id}/>
						<input name="formType" type="hidden" value={FormType.UpdateHouseHold}/>
						<button type="submit" >Update</button>
					</form>
					</div>				
				: 
				<h2>Kein Haushalt ausgewählt</h2>
			}

			{selectedSolorPowerSystem != undefined ?
				<div>
					<h2>Solaranlage anpassen</h2>
					<form method="post" action={`/map/${data.house.id}`}>
						<div className="form-group">
							<label htmlFor="installedPower">Installierte Leistung</label>
							<input name="installedPower" className="form-control" type="text" placeholder={selectedSolorPowerSystem.installedPower.toString()} />
						</div>
						<div className="form-group">
							<label htmlFor="roofTilt">Dachneigung</label>
							<input name="roofTilt" className="form-control" type="text" placeholder={selectedSolorPowerSystem.roofTilt.toString()}/>
						</div>
						<div className="form-group">
							<label htmlFor="azimuth">Ausrichtung</label>
							<input name="azimuth" className="form-control" type="text" placeholder={selectedSolorPowerSystem.azimuth.toString()} />
						</div>
						<div className="form-group">
							<label htmlFor="roofSize">Dachfläche</label>
							<input name="roofSize" className="form-control" type="text" placeholder={selectedSolorPowerSystem.roofSize.toString()}/>
						</div>
						<div className="form-group">
							<label htmlFor="batteryCapacitiy">Batterie</label>	
							<input name="batteryCapacity" className="form-control" type="text" placeholder={selectedSolorPowerSystem.batteryCapacity.toString()}/>
						</div>
						<div className="form-group">
							<input name="installed" className="form-check-input" type="checkbox" placeholder={selectedSolorPowerSystem.installed?"on": "off"}/>
							<label htmlFor="installed" className="form-check-label">Installiert</label>
						</div>
						<input name="solarId" type="hidden" value={selectedSolorPowerSystem.id}/>
						<input name="formType" type="hidden" value={FormType.UpdateSolarPowerSystem}/>
						<button type="submit" >Update</button>
					</form>
				</div>
				: 
				<div>
					<h2>Solaranlage hinzufügen</h2>
					<form method="post" action={`/map/${data.house.id}`}>
						<div className="form-group">
							<label htmlFor="installedPower">Installierte Leistung</label>
							<input name="installedPower" className="form-control" type="text" />
						</div>
						<div className="form-group">
							<label htmlFor="roofTilt">Dachneigung</label>
							<input name="roofTilt" className="form-control" type="text" />
						</div>
						<div className="form-group">
							<label htmlFor="azimuth">Ausrichtung</label>
							<input name="azimuth" className="form-control" type="text" />
						</div>
						<div className="form-group">
							<label htmlFor="roofSize">Dachfläche</label>
							<input name="roofSize" className="form-control" type="text" />
						</div>
						<div className="form-group">
							<label htmlFor="batteryCapacitiy">Batterie</label>	
							<input name="batteryCapacity" className="form-control" type="text" />
						</div>
						<div className="form-group">
							<input name="installed" className="form-check-input" type="checkbox" />
							<label htmlFor="installed" className="form-check-label">Installiert</label>
						</div>
						<input name="houseId" type="hidden" value={data.house.id}/>
						<input name="formType" type="hidden" value={FormType.AddSolorPowerSystem}/>
						<button type="submit" >Hinzufügen</button>
					</form>
				</div>
			}
			
		</div>
		);
			
}

export enum FormType{
	UpdateSolarPowerSystem,
	AddSolorPowerSystem,
	UpdateHouseHold

}

function getHeatConsumptionPerQmForHouseHold(houseHold : HouseHoldViewData) : number {
	var consumption = getHeatConsumptionForHouseHold(houseHold);
	if(consumption == 0 || houseHold.houseHold.heatedArea == null ||  houseHold.houseHold.heatedArea == 0){
		return 130;
	}
	return consumption / houseHold.houseHold.heatedArea;
}
function getHeatConsumptionForHouseHold(houseHold : HouseHoldViewData) : number {
	let heatConsumption : number = 0;
	
	if(houseHold.consumption.usesGasForHeat){
		
		heatConsumption = houseHold.consumption.heatConsumptionGas? houseHold.consumption.heatConsumptionGas : 0;
	}
	else if(houseHold.consumption.usesOilForHeat){
		
		heatConsumption = houseHold.consumption.heatConsumptionOil? houseHold.consumption.heatConsumptionOil : 0;
	}
	else if(houseHold.consumption.usesElectricityForHeat){
		
		heatConsumption = houseHold.consumption.heatConsumptionElectricity? houseHold.consumption.heatConsumptionElectricity : 0;
	}
	else if(houseHold.consumption.usesWoodForHeat){
		heatConsumption = houseHold.consumption.heatConsumptionWood? houseHold.consumption.heatConsumptionWood : 0;
	}
	return heatConsumption;
}
export default HouseDetailView;

export function links() {	
	return [{rel : 'stylesheet', href : houseDetailViewStyles}];
}