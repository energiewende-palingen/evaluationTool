import { SolarPowerSystem } from "@prisma/client";
import filterViewStyles from './FilterView.css'

function FilterView({resetAllFilter, setHeatingAgeFilter, setHeatConsumptionFilter} : 
    {   
        resetAllFilter: ()=>void,
        setHeatingAgeFilter: ()=>void,
        setHeatConsumptionFilter: ()=>void
    }
){
    
    return(
        <div>
            <div>
                <button className="btn btn-light" onClick={resetAllFilter}>Alle</button>
                <button className="btn btn-light" onClick={setHeatingAgeFilter}>Heizungs Alter</button>
                <button className="btn btn-light" onClick={setHeatConsumptionFilter}>Wärmebedarf</button>
			</div>
            <div>
                <form method="post" action={`/map/`} className="hidden">
                    <input type="hidden" name="formType" value="BackupDB"/>
                    <button type="submit" >Backup DB</button>
                </form>
                <form method="post" action={`/map/`} className="hidden">
                    <input type="hidden" name="formType" value="RestoreDB"/>
                    <button type="submit" >Restore DB</button>
                </form>
			</div>
        </div>
    );
}
export default FilterView;

export function links() {	
	return [{rel : 'stylesheet', href : filterViewStyles}];
}