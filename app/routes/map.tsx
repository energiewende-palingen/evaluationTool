import { Outlet } from '@remix-run/react';
import MyMap, {links as myMapLinks} from '~/components/MyMap';
import { useLoaderData } from '@remix-run/react'; 
import { District, DistrictContext } from '~/context/serverModelContext';
import { ApiContext, ApiData } from '~/context/apiContext';
import { db } from '~/.server/db';

export async function loader({params}) {
	let houses = await db.house.findMany();
	
	return JSON.stringify({
		googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
		houses : houses,
	});
}

export default function ShowMap() {
	
	const data = JSON.parse(useLoaderData());
	
	const apiData = new ApiData(data.googleApiKey);
	const district = new District(data.houses);
	return (
	<main>
		<ApiContext.Provider value={apiData}>
			<DistrictContext.Provider value={district}>
				<MyMap />
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

