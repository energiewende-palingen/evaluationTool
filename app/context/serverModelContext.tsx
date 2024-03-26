import { createContext } from "react";
import { HouseViewData } from "~/dataStructures/HouseViewData";


export class District {
	public houses : HouseViewData[];

	constructor(houses : HouseViewData[]) {
		this.houses = houses;
	}
}

export const DistrictContext = createContext<District>(new District(new Array<HouseViewData>()));
