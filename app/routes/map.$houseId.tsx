import { useLoaderData } from '@remix-run/react'; 
import { useRef } from 'react';
import { getHouseViewForHouse } from '~/.server/convertUtils';
import { db } from '~/.server/db';
import HouseDetailView from '~/components/HouseDetailView';


export const loader = async ({ params }) => {
	
	let house = await db.house.findUnique({
		where: {
			id: params.houseId
		}
	});
	
	let view;
	if(house != null){
		view = await getHouseViewForHouse(house);
	}
	
	return JSON.stringify(view);
	
  };

export default function MapDetails() {
	let house  = JSON.parse(useLoaderData());
	
	return (
		<div>
			<HouseDetailView data={house}></HouseDetailView>
		</div>
	);
}