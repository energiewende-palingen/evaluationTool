import houseHoldViewDataStyles from './HouseHoldDetailView.css'
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { HouseHoldViewData } from "~/dataStructures/HouseHoldViewData";
import { FormType } from './HouseDetailView';

function HouseHoldDetailView({selectedHouseHold, houseView} : 
    {   
        selectedHouseHold : HouseHoldViewData,
        houseView : HouseViewData
    }
){
    return (
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
								<td scope="col">{selectedHouseHold.getHeatingType()}</td>
							</tr>
							<tr>
								<td scope="col-3">Verbrauch</td>
								<td scope="col">{selectedHouseHold.getHeatConsumptionForHouseHold()}</td>
							</tr>
							<tr>
								<td scope="col-3">Wärmebedarf</td>
								<td scope="col">{selectedHouseHold.getHeatKwhConsumption()} kwh</td>
							</tr>
							<tr>
								<td scope="col-3">Heizfläche</td>
								<td scope="col">{selectedHouseHold.houseHold.heatedArea} qm</td>
							</tr>
						</tbody>
					</table>
					
					
					<form method="post" action={`/map/${houseView.house.id}`}>
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
    );
}
export default HouseHoldDetailView;

export function links() {	
	return [{rel : 'stylesheet', href : houseHoldViewDataStyles}];
}