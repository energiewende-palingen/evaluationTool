import { createContext } from "react";

export class ApiData
{
	public googleMapsApiKey: string;
	constructor(googleMapsApiKey: string) {
		this.googleMapsApiKey = googleMapsApiKey;
	}
	
}

export const ApiContext = createContext<ApiData>(new ApiData(""));