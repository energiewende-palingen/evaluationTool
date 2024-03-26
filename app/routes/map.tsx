import { Outlet } from '@remix-run/react';
import MyMap, {links as myMapLinks} from '~/components/MyMap';
import { useLoaderData } from '@remix-run/react'; 
import { ServerContext } from '~/context/serverModelContext';
import { ApiContext, ApiData } from '~/context/apiContext';
import { db } from '~/.server/db';

export async function loader({params}) {
	let users = await db.user.findMany();
	console.log(users);
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

