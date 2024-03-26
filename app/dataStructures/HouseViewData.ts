import { House, SolarPowerSystem } from "@prisma/client";
import { HouseHoldViewData } from "./HouseHoldViewData";

export class HouseViewData{
	public house : House;
	public houseHolds : HouseHoldViewData[];
	public solarPowerSystems : SolarPowerSystem[];

	constructor(house : House, houseHolds : HouseHoldViewData[], solarPowerSystems : SolarPowerSystem[]){
		this.house = house;
		this.houseHolds = houseHolds;
		this.solarPowerSystems = solarPowerSystems;
	}
}