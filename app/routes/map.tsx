import { Outlet } from '@remix-run/react';
import MyMap, {links as myMapLinks} from '~/components/MyMap';
import { useLoaderData } from '@remix-run/react'; 
import { ServerContext } from '~/context/serverModelContext';
import { ApiContext, ApiData } from '~/context/apiContext';

export async function loader({params}) {
	
	return process.env.GOOGLE_MAPS_API_KEY ;
}

export default function ShowMap() {
	//const serverData = JSON.parse(useLoaderData());
	let data : string = useLoaderData();
	const apiData = new ApiData(data);
	const serverData = {};
	return (
	<main>
		<ApiContext.Provider value={apiData}>
			<ServerContext.Provider value={serverData}>
				<MyMap />
			</ServerContext.Provider>
		</ApiContext.Provider>
	</main>
	);
}

export function links() {
	return [
		...myMapLinks(),
	];
}

