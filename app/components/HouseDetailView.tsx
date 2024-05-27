import { House, SolarPowerSystem } from '@prisma/client';
import houseDetailViewStyles from './HouseDetailView.css';
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { HouseHoldViewData } from '~/dataStructures/HouseHoldViewData';
import SolarPowerSystemView from './SolarPowerSystemView'
import { useState } from 'react';
import HouseHoldDetailView from './HouseHoldDetailView';


function HouseDetailView({data} : {data : HouseViewData}){
	
	let houseView = new HouseViewData(data.house, data.houseHolds, data.solarPowerSystems);
	const [selectedHouseHold, setSelectedHouseHold] = useState<HouseHoldViewData |undefined> ();
	const [selectedSolorPowerSystem, setSelectedSolarPowerSystem] = useState<SolarPowerSystem | undefined> ();
	const [showSolarPowerSystems, setEditMode] = useState<Boolean>(false);
	
	function selectHouseHold(houseHold: HouseHoldViewData) {
		setSelectedHouseHold(houseHold);
		
	}

	function selectSolarPowerSystem(solarPowerSystem: SolarPowerSystem) {
		setSelectedSolarPowerSystem(solarPowerSystem);
	}

	function toggleShowSolar(){
		setEditMode(!showSolarPowerSystems);
	}
	
	houseView.calculateSums();

	let showSolar = showSolarPowerSystems ? "" : "hidden";
	let showHouseData = showSolarPowerSystems ? "hidden" : "";

	return (
		<div>
			<h1>{houseView.house.street}{houseView.house.houseNumber}</h1>
			<div className="btn-group-toggle" data-toggle="buttons">
                <label className="btn btn-secondary active">
                    <input type="checkbox" autoComplete="off" onClick={toggleShowSolar} /> Zeige Solaranlagen
                </label>
            </div>    
			<table className={'table table-hover ' + showHouseData}>
				<tbody>
					<tr>
						<td scope="col-3">Stromverbrauch</td>
						<td scope="col">{houseView.sumElectricityConsumption} kwh</td>
					</tr>
					<tr>
						<td scope="col-3">Wärmeverbrauch</td>
						{houseView.sumHeatConsumption > 0}
						<td scope="col" className={houseView.heatConsumptionClass}>{houseView.sumHeatConsumption} kwh</td>
					</tr>
					<tr>
						<td scope="col-3">Energieklasse</td>
						{houseView.sumHeatConsumption > 0}
						<td scope="col" className={houseView.heatedAreaClass}>{houseView.getHeatConsumptionPerQm()} kwh/qm </td>
					</tr>
					
				</tbody>
			</table>
			<div className={showHouseData}>
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
						{houseView.houseHolds.map((houseHold, index) => {
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
			</div>
			<div className={showSolar}>
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
							<td scope="col">{houseView.getSolarPowerSum()} kWp</td>
						</tr>
						<tr >
							<td scope="col-3">Fläche:</td>
							<td scope="col">{houseView.getRoofSizeSum()} qm</td>
						</tr>
						<tr >
							<td scope="col-3">Installiert:</td>
							<td scope="col">{houseView.solarPowerSystems[0].installed? "Ja" : "Nein"} </td>
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
					{houseView.solarPowerSystems.map((solarPowerSystem, index) => {
						let highlightClass = "";
						if(solarPowerSystem.id === selectedSolorPowerSystem?.id){
							highlightClass = "table-active";
						}
						return (
							
								<SolarPowerSystemView data={solarPowerSystem} onClick={selectSolarPowerSystem} highlightClass={highlightClass} houseId={houseView.house.id}></SolarPowerSystemView>
							);
						})
					}
					</tbody>
				</table>
			</div>
			<div className={showHouseData}>
				{selectedHouseHold != undefined ? 
					<HouseHoldDetailView selectedHouseHold={selectedHouseHold} houseView={houseView}></HouseHoldDetailView>			
					: 
					<h2>Kein Haushalt ausgewählt</h2>
				}
			</div>
			
			
		</div>
		);
			
}

export enum FormType{
	UpdateSolarPowerSystem,
	AddSolorPowerSystem,
	UpdateHouseHold
}

export enum HeatingType{
	Gas,
	Öl,
	Holz,
	Andere
}


export default HouseDetailView;

export function links() {	
	return [{rel : 'stylesheet', href : houseDetailViewStyles}];
}