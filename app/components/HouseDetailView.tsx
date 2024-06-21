import { House, SolarPowerSystem } from '@prisma/client';
import houseDetailViewStyles from './HouseDetailView.css';
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { HouseHoldViewData } from '~/dataStructures/HouseHoldViewData';
import SolarPowerSystemView from './SolarPowerSystemView'
import { useState } from 'react';
import HouseHoldDetailView from './HouseHoldDetailView';
import { District } from '~/context/serverModelContext';

function HouseDetailView({data, district} : {data : HouseViewData, district : District}){
	
	let houseView = new HouseViewData(data.house, data.houseHolds, data.solarPowerSystems);
	const [selectedHouseHold, setSelectedHouseHold] = useState<HouseHoldViewData |undefined> ();
	const [selectedSolorPowerSystem, setSelectedSolarPowerSystem] = useState<SolarPowerSystem | undefined> ();
	const [showSolarPowerSystems, setEditMode] = useState<Boolean>(false);

	const [editSolarPowerSystems, setEditSolarPowerSystems] = useState<boolean>(false);
	
	function selectHouseHold(houseHold: HouseHoldViewData) {
		setSelectedHouseHold(houseHold);
		
	}

	function selectSolarPowerSystem(solarPowerSystem: SolarPowerSystem) {
		setSelectedSolarPowerSystem(solarPowerSystem);
	}

	function toggleShowSolar(){
		setEditMode(!showSolarPowerSystems);
	}

	function toggleEditSolarPowerSystems(){
		setEditSolarPowerSystems(!editSolarPowerSystems);
	}

	function submitSolarAdd(){
        var elem = document.getElementById('solarUpdateType');
        if(elem != null){
            elem.value = FormType.AddSolorPowerSystem;
            document.forms["modifySolarpowerSystem"].requestSubmit();
        } else {
            console.error("Cannot find element with id: solarUpdateType");
        }
    }

	function submitHouseHoldAdd(){
        var elem = document.getElementById('houseHoldUpdateType');
        if(elem != null){
            elem.value = FormType.AddHouseHold;
            document.forms["addHouseHoldForm"].requestSubmit();
        } else {
            console.error("Cannot find element with id: solarUpdateType");
        }
    }
	
	houseView.calculateSums();

	let showSolar = showSolarPowerSystems ? "" : "hidden";
	let showHouseData = showSolarPowerSystems ? "hidden" : "";
	let currentSolarPowerSystem : string = "";

	return (
		<div id="mainDiv">
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
						<td scope="col-3">Heizbedarf ohne Holz</td>
						{houseView.sumHeatConsumption > 0}
						<td scope="col" className={houseView.heatConsumptionClass}>{houseView.sumGasConsumption*district.defaultValues.heatingLoss} kwh</td>
					</tr>
					<tr>
						<td scope="col-3">WW Energiebedarf</td>
						{houseView.sumHeatConsumption > 0}
						<td scope="col" className={houseView.heatConsumptionClass}>{houseView.sumGasConsumption*district.defaultValues.heatingLoss*district.defaultValues.hotWaterPercentage} kwh</td>
					</tr>
					<tr>
						<td scope="col-3">Heizbedarf Holz</td>
						{houseView.sumHeatConsumption > 0}
						<td scope="col" className={houseView.heatConsumptionClass}>{houseView.sumWoodConsumption} kwh</td>
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
					<div id="outerForm">
						<form method="post" id="addHouseHoldForm" action={`/map/${houseView.house.id}`}>
							<input name="houseId" type="hidden" value={houseView.house.id}/>
							<input name="formType" id="houseHoldUpdateType" type="hidden" value={FormType.AddHouseHold}/>
						</form>
					</div>
					<button className={"col btn btn-success"} onClick={submitHouseHoldAdd}>Hinzufügen</button>
				</table>
			</div>
			<div className={showSolar} id="showSolar">
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
				<div id="outerForm">
					<form method="post" id="modifySolarpowerSystem" action={`/map/${houseView.house.id}`}>
						<input name="solarId" type="hidden" value={selectedSolorPowerSystem?.id}/>
						<input name="houseId" type="hidden" value={houseView.house.id}/>
						<input name="formType" id="solarUpdateType" type="hidden" value={FormType.UpdateSolarPowerSystem}/>
					</form>
				</div>

				<table className='table table-hover'>
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Installierte Leistung</th>
						</tr>
					</thead>
					<tbody>
						{houseView.solarPowerSystems.map((solarPowerSystem, index) => {
							let highlightClass = "";
							if(solarPowerSystem.id === selectedSolorPowerSystem?.id){
								highlightClass = "table-active";
							}
							return (	
								<tr className={highlightClass} key={index} onClick={() => setSelectedSolarPowerSystem(solarPowerSystem)}>
									<th scope="row">{index + 1}</th>
									<td>{solarPowerSystem.installedPower}</td>
								</tr>
								);
							})
						}
					</tbody>
				</table>
				<div className="row">
					<div className="btn-group-toggle col" data-toggle="buttons">
						<label className="btn btn-secondary active">
							<input type="checkbox" autoComplete="off" onClick={toggleEditSolarPowerSystems} /> Edit
						</label>
					</div> 
					<button className={"col btn btn-success"} onClick={submitSolarAdd}>Hinzufügen</button>
				</div>
				
				<SolarPowerSystemView data={selectedSolorPowerSystem} houseId={houseView.house.id} editMode={editSolarPowerSystems}></SolarPowerSystemView>
					
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
	UpdateSolarPowerSystem = 0,
	AddSolorPowerSystem = 1,
	UpdateHouseHold = 2,
	RemoveSolarPowerSystem = 3,
	AddHouseHold
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