import { createContext } from "react";
import { HouseViewData } from "~/dataStructures/HouseViewData";


export class FilterData{
	public filterHeatingAge: boolean = false;
	public filterHeatConsumption: boolean = false;
}

export class DefaultValueData{
	public heatingLoss: number = 0;
	public hotWaterPercentage: number = 0;
}

export class District {
	public houses : HouseViewData[];
	public filter: FilterData;
	public defaultValues : DefaultValueData;

	constructor(houses : HouseViewData[]) {
		this.houses = houses;
		this.filter = new FilterData();
		this.defaultValues = new DefaultValueData();
	}
}

export const DistrictContext = createContext<District>(new District(new Array<HouseViewData>()));
