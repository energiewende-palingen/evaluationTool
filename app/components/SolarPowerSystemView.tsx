import { SolarPowerSystem } from "@prisma/client";
import solarPowerSystemStyles from './SolarPowerSystemView.css'
import { FormType } from "./HouseDetailView";

function SolarPowerSystemView({data, onClick, highlightClass, houseId} : 
    {   data : SolarPowerSystem,
        onClick: (view: SolarPowerSystem)=>void,
        highlightClass : string,
        houseId : string
    }
){

    let editMode = false;
    let addMode = false;
    if(addMode){
        <div>
        <h2>Solaranlage hinzufügen</h2>
        <form method="post" action={`/map/${houseId}`}>
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
            <input name="houseId" type="hidden" value={houseId}/>
            <input name="formType" type="hidden" value={FormType.AddSolorPowerSystem}/>
            <button type="submit" >Hinzufügen</button>
        </form>
    </div>

    } else if(editMode){
        <div>
            <h2>Solaranlage anpassen</h2>
            <form method="post" action={`/map/${houseId}`}>
                <div className="form-group">
                    <label htmlFor="installedPower">Installierte Leistung</label>
                    <input name="installedPower" className="form-control" type="text" placeholder={data.installedPower.toString()} />
                </div>
                <div className="form-group">
                    <label htmlFor="roofTilt">Dachneigung</label>
                    <input name="roofTilt" className="form-control" type="text" placeholder={data.roofTilt.toString()}/>
                </div>
                <div className="form-group">
                    <label htmlFor="azimuth">Ausrichtung</label>
                    <input name="azimuth" className="form-control" type="text" placeholder={data.azimuth.toString()} />
                </div>
                <div className="form-group">
                    <label htmlFor="roofSize">Dachfläche</label>
                    <input name="roofSize" className="form-control" type="text" placeholder={data.roofSize.toString()}/>
                </div>
                <div className="form-group">
                    <label htmlFor="batteryCapacitiy">Batterie</label>	
                    <input name="batteryCapacity" className="form-control" type="text" placeholder={data.batteryCapacity.toString()}/>
                </div>
                <div className="form-group">
                    <input name="installed" className="form-check-input" type="checkbox" placeholder={data.installed?"on": "off"}/>
                    <label htmlFor="installed" className="form-check-label">Installiert</label>
                </div>
                <input name="solarId" type="hidden" value={data.id}/>
                <input name="formType" type="hidden" value={FormType.UpdateSolarPowerSystem}/>
                <button type="submit" >Update</button>
            </form>
        </div>
    } else {
        {
            return (
                    <tr className={highlightClass} key={data.id} onClick={() => onClick(data)}>
                            <td>{data.installedPower} kWp</td>
                            <td>{data.roofSize} qm</td>
                            <td>{data.roofTilt} °</td>
                            <td>{data.azimuth} °</td>
                            <td>{data.batteryCapacity} kwh</td>
                            <td>{data.installed? "yes" : "no"}</td>
                    </tr>
            )
        }
    }
}
export default SolarPowerSystemView;

export function links() {	
	return [{rel : 'stylesheet', href : solarPowerSystemStyles}];
}