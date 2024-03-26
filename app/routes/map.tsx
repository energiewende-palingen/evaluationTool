import { Outlet } from '@remix-run/react';
import MyMap, {links as myMapLinks} from '~/components/MyMap';
import { useLoaderData } from '@remix-run/react'; 
import { District, DistrictContext } from '~/context/serverModelContext';
import { ApiContext, ApiData } from '~/context/apiContext';
import { db } from '~/.server/db';
import { HouseViewData } from '~/dataStructures/HouseViewData';
import { getHouseViewForHouse } from '~/.server/convertUtils';

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

export default function ShowMap() {
	
	const data = JSON.parse(useLoaderData());
	console.log(data);
	const apiData = new ApiData(data.googleApiKey);
	const district = new District(data.houses);
	return (
	<main>
		<ApiContext.Provider value={apiData}>
			<DistrictContext.Provider value={district}>
					<div className="row">
						<div className="col"><MyMap /></div>
						<div className="col"><Outlet /></div>
					</div>
			</DistrictContext.Provider>
		</ApiContext.Provider>
	</main>
	);
}



export function links() {
	return [
		...myMapLinks(),
	];
}

