import houseHoldViewDataStyles from './HouseHoldDetailView.css'
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { HouseHoldViewData } from "~/dataStructures/HouseHoldViewData";
import { FormType } from './HouseDetailView';
import { useState } from 'react';

function HouseHoldDetailView({selectedHouseHold, houseView} : 
    {   
        selectedHouseHold : HouseHoldViewData,
        houseView : HouseViewData
    }
){
    function toggleEditMode(){
        setEditMode(!edit)
    }

    const [edit, setEditMode] = useState<Boolean>(false);
    let readOnly = edit ?  "" : "read-only";
    let editModeClass = edit ? "active" : "";
    let hidden = edit ? "" : "hidden";
    
    let hiddenOil = ""; 
    let hiddenWood = "";
    let hiddenElectritcity = "";
    let hiddenGas = "";

    if(selectedHouseHold != null){
        hiddenWood = selectedHouseHold.consumption.heatConsumptionWood != null && selectedHouseHold.consumption.heatConsumptionWood> 0 ? "" : hidden;
        hiddenOil = selectedHouseHold.consumption.heatConsumptionOil != null &&  selectedHouseHold.consumption.heatConsumptionOil> 0 ? "": hidden;
        hiddenElectritcity = selectedHouseHold.consumption.heatConsumptionElectricity != null &&  selectedHouseHold.consumption.heatConsumptionElectricity> 0 ? "" : hidden;
        hiddenGas = selectedHouseHold.consumption.heatConsumptionGas != null &&  selectedHouseHold.consumption.heatConsumptionGas> 0 ? "" : hidden;
    }
    
    return (
        <div>
            <h2>Ausgewählter Haushalt:</h2>

            <div className="btn-group-toggle" data-toggle="buttons">
                <label className="btn btn-secondary active">
                    <input type="checkbox" autoComplete="off" onClick={toggleEditMode} className={editModeClass}/> Edit
                </label>
            </div>    
            
            
            <form method="post" action={`/map/${houseView.house.id}`} id="modifyHouseHold">
                <input name="formType" type="hidden" value={FormType.UpdateHouseHold}/>
                <input name="houseHoldId" type="hidden" value={selectedHouseHold.houseHold.id}/>
            </form>

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
                        <td scope="col"><input type="text" className={readOnly} name="electricityConsumption" form="modifyHouseHold" placeholder={selectedHouseHold.consumption.electricityConsumption?.toString()}></input> </td>
                    </tr>
                    
                    <tr className={hiddenGas}>
                        <td scope="col-3">Gas Verbrauch</td>
                        <td scope="col">
                            <input type="text" name="heatConsumptionGas" className={readOnly} form="modifyHouseHold" placeholder={selectedHouseHold.getGasConsumptionForHouseHold().toString()}></input>
                         </td>
                    </tr>
                    <tr className={hiddenOil}>
                        <td scope="col-3">Öl Verbrauch</td>
                        <td scope="col">
                            <input type="text" name="heatConsumptionOil" className={readOnly} form="modifyHouseHold" placeholder={selectedHouseHold.getOilConsumptionForHouseHold().toString()}></input>
                         </td>
                    </tr>
                    <tr className={hiddenOil}>
                        <td scope="col-3" >kwH Conversion Öl</td>
                        <td scope="col">
                            <input type="text" name="kwHConversionOil" className={readOnly} form="modifyHouseHold" placeholder={selectedHouseHold.consumption.convertToKwhOilFactor.toString()}></input>
                         </td>
                    </tr>
                    <tr className={hiddenWood}>
                        <td scope="col-3">Holz Verbrauch</td>
                        <td scope="col">
                            <input type="text" name="heatConsumptionWood" className={readOnly} form="modifyHouseHold" placeholder={selectedHouseHold.getWoodConsumptionForHouseHold().toString()}></input>
                         </td>
                    </tr>
                    <tr className={hiddenWood}>
                        <td scope="col-3">kwH Conversion Holz</td>
                        <td scope="col">
                            <input type="text" name="kwHConversionWood" className={readOnly} form="modifyHouseHold" placeholder={selectedHouseHold.consumption.convertToKwhWoodFactor.toString()}></input>
                         </td>
                    </tr>
                    <tr className={hiddenElectritcity}>
                        <td scope="col-3">Heiz Strom Verbrauch</td>
                        <td scope="col">
                            <input type="text" name="heatConsumptionElectrictiy" className={readOnly} form="modifyHouseHold" placeholder={selectedHouseHold.getHeatElectricityConsumptionForHouseHold().toString()}></input>
                         </td>
                    </tr>
                    <tr className={hiddenElectritcity}>
                        <td scope="col-3">kwH Conversion Strom</td>
                        <td scope="col">
                            <input type="text" name="kwHConversionElectricity" className={readOnly} form="modifyHouseHold" placeholder={selectedHouseHold.consumption.convertToKwhWoodFactor.toString()}></input>
                         </td>
                    </tr>
                    <tr>
                        <td scope="col-3">Wärmebedarf</td>
                        <td scope="col">
                            {selectedHouseHold.getHeatConsumptionForHouseHoldInKwh().toString()}
                         </td>
                    </tr>
                    <tr>
                        <td scope="col-3">Heizfläche</td>
                        <td scope="col">
                            <input type="text" name="heatingArea" className={readOnly} form="modifyHouseHold" placeholder={selectedHouseHold.houseHold.heatedArea?.toString()}></input>
                         </td>
                    </tr>
                    
                </tbody>
            </table>
            <button type="submit" form="modifyHouseHold" className={hidden}>Update</button>

        </div>	
    );
}
export default HouseHoldDetailView;

export function links() {	
	return [{rel : 'stylesheet', href : houseHoldViewDataStyles}];
}