import { SolarPowerSystem } from "@prisma/client";
import solarPowerSystemStyles from './SolarPowerSystemView.css'
import { FormType } from "./HouseDetailView";
import { useState } from "react";

function SolarPowerSystemView({data, houseId, editMode} : 
    {   data : SolarPowerSystem | undefined,
        houseId : string,
        editMode : boolean
    }
){

    if(data == undefined){
        return (<></>);
    }

    function getCheckbox(checked : boolean, readOnly : string){
        if ( checked) {
            return (
                <input type="checkbox" className={readOnly} name="installed" checked form="modifySolarpowerSystem"></input>
            )    
        }
        return (
            <input type="checkbox" className={readOnly} name="installed" form="modifySolarpowerSystem"></input>
        )            
    }

    function submitSolarUpdate(){
        var elem = document.getElementById('solarUpdateType');
        if(elem != null){
            elem.value = FormType.UpdateSolarPowerSystem;
            document.forms["modifySolarpowerSystem"].requestSubmit();
        } else {
            console.error("Cannot find element with id: solarUpdateType");
        }
        
    }

    function submitSolarDelete(){
        var elem = document.getElementById('solarUpdateType');
        if(elem != null){
            elem.value = FormType.RemoveSolarPowerSystem;
            document.forms["modifySolarpowerSystem"].requestSubmit();
        } else {
            console.error("Cannot find element with id: solarUpdateType");
        }
    }

    
    let readOnly = editMode ?  "" : "read-only";
    let hidden = editMode ? "" : "hidden";
    return (
        <div className="container">
            <table className='table'>
                <thead>
                    <tr>
                        <th scope="col-3">Verbrauch</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td scope="col-3">Installierte Leistung</td>
                        <td scope="col">
                            <input type="text" className={readOnly} name="installedPower" form="modifySolarpowerSystem" placeholder={data.installedPower.toString()}></input>
                        </td>
                        <td scope="col-1">kwp</td>
                    </tr>
                    <tr>
                        <td scope="col-3">Dachneigung</td>
                        <td scope="col">
                            <input type="text" className={readOnly}name="roofTilt" form="modifySolarpowerSystem" placeholder={data.roofTilt.toString()}></input>
                        </td>
                        <td scope="col-1">°</td>
                    </tr>
                    <tr>
                        <td scope="col-3">Dachneigung</td>
                        <td scope="col">
                            <input type="text" className={'col ' + readOnly} name="roofSize" form="modifySolarpowerSystem" placeholder={data.roofSize.toString()}></input>
                        </td>
                        <td scope="col-1">qm</td>
                    </tr>
                    <tr>
                        <td scope="col-3">Dachneigung</td>
                        <td scope="col">
                            <input type="text" className={readOnly} name="roofTilt" form="modifySolarpowerSystem" placeholder={data.roofTilt.toString()}></input>
                        </td>
                        <td scope="col-1">°</td>
                    </tr>
                    <tr>
                        <td scope="col-3">Ausrichtung</td>
                        <td scope="col">
                                <input type="text" className={readOnly} name="azimuth" form="modifySolarpowerSystem" placeholder={data.azimuth.toString()}></input> 
                        </td>
                        <td scope="col-1">°</td>
                    </tr>
                    <tr>
                        <td scope="col-3">Batterie Kapazität</td>
                        <td scope="col">
                            <input type="text" className={'col ' + readOnly} name="batteryCapacity" form="modifySolarpowerSystem" placeholder={data.batteryCapacity.toString()}></input>
                        </td>
                        <td scope="col-1">kwh</td>
                    </tr>
                    <tr>
                        <td scope="col-3">Installiert</td>
                        <td scope="col">
                            {getCheckbox(data.installed, readOnly) }
                        </td>
                    </tr>
                    
                </tbody>
            </table>
            <div className="row">
                <button className={"col btn btn-danger " + hidden} onClick={submitSolarDelete}>Löschen</button>
                <button className={"col btn btn-secondary " + hidden} onClick={submitSolarUpdate}>Update</button>
            </div>
        </div>
    )
    
}
export default SolarPowerSystemView;

export function links() {	
	return [{rel : 'stylesheet', href : solarPowerSystemStyles}];
}