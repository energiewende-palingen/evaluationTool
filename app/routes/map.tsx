import { Outlet } from '@remix-run/react';
import MyMap, {links as myMapLinks} from '~/components/MyMap';
import { useLoaderData } from '@remix-run/react'; 
import { District, DistrictContext } from '~/context/serverModelContext';
import { ApiContext, ApiData } from '~/context/apiContext';
import { db } from '~/.server/db';
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { getHouseViewForHouse } from '~/.server/convertUtils';
import { useState } from 'react';
import { ServerUtils } from '~/.server/ServerUtils';
import { ActionFunctionArgs } from '@remix-run/node';

export async function loader({params}) {
	let houses = await db.house.findMany();
	let houseViews : HouseViewData[] = [];
	
	for(let house of houses){
		let houseView = await getHouseViewForHouse(house);
		
		if(houseView != undefined){
			houseViews.push(houseView);
		}	
	}
	return JSON.stringify({
		googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
		houses : houseViews,
	});
}

export async function action({request,}: ActionFunctionArgs) {
	const formData = await request.formData();
	let type = formData.get("formType");
	if(type == "BackupDB"){
		let serverUtils = new ServerUtils();
		serverUtils.createBackup();
	}
	if(type == "RestoreDB"){
		let serverUtils = new ServerUtils();
		await serverUtils.restoreDatabase();
	}

	return null;
	
}

export default function ShowMap() {
	
	const data = JSON.parse(useLoaderData());
	const [district, setDistrict] = useState<District> (new District(data.houses));
	const [reload, setReload] = useState(false);
	const apiData = new ApiData(data.googleApiKey);
	
	function setHeatConsumptionFilter(): void {
		resetAllFilter();
		district.filter.filterHeatConsumption=true;
		setDistrict(district); 
		setReload(!reload);
	}

	function setHeatingAgeFilter(): void {
		resetAllFilter();
		district.filter.filterHeatingAge=true;
		setDistrict(district); 
		setReload(!reload);
	}

	function resetAllFilter(): void {
		district.filter.filterHeatConsumption=false;
		district.filter.filterHeatingAge=false;
		setDistrict(district); 
		setReload(!reload);
	}
	return (
	<main>
		<ApiContext.Provider value={apiData}>
			
				<div className="row">
					<div className="col"><MyMap district={district}/></div>
					<div className="col"><Outlet /></div>
				</div>
				<div>
					<button onClick={resetAllFilter}>Alle</button>
					<button onClick={setHeatingAgeFilter}>Heizungs Alter</button>
					<button onClick={setHeatConsumptionFilter}>Wärmebedarf</button>
				</div>
				<div>
				<form method="post" action={`/map/`}>
					<input type="hidden" name="formType" value="BackupDB"/>
					<button type="submit" >Backup DB</button>
				</form>
				<form method="post" action={`/map/`}>
					<input type="hidden" name="formType" value="RestoreDB"/>
					<button type="submit" >Restore DB</button>
				</form>
				</div>
			
		</ApiContext.Provider>
	</main>
	);
}



export function links() {
	return [
		...myMapLinks(),
	];
}

