import { createContext } from "react";
import { HouseViewData } from "~/dataStructures/HouseViewData";


export class FilterData{
	public filterHeatingAge: boolean = false;
	public filterHeatConsumption: boolean = false;
}

export class District {
	public houses : HouseViewData[];
	public filter: FilterData;

	constructor(houses : HouseViewData[]) {
		this.houses = houses;
		this.filter = new FilterData();
	}
}

export const DistrictContext = createContext<District>(new District(new Array<HouseViewData>()));
