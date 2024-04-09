import { House, SolarPowerSystem } from "@prisma/client";
import { HouseHoldViewData } from "./HouseHoldViewData";

export class Interest{
	
	public noInterest: boolean = false;
	public undecided: boolean = false;
	public provideResources: boolean = false;
	public participateInProduction: boolean = false;
	public invest : boolean = false;
	public receiveHeat: boolean = false;
	public receiveElectricity: boolean = false;
}
export class HouseViewData{
	public house : House;
	public houseHolds : HouseHoldViewData[];
	public solarPowerSystems : SolarPowerSystem[];
	public interest : Interest = new Interest();

	constructor(house : House, houseHolds : HouseHoldViewData[], solarPowerSystems : SolarPowerSystem[]){
		this.house = house;
		this.houseHolds = houseHolds;
		this.solarPowerSystems = solarPowerSystems;
	}

	public getOldestHeatingAge() : number{
		let oldestHeatingAge = 0;
		this.houseHolds.forEach(houseHold => {
			let age = houseHold.houseHold.heatingSystemAge;
			if( age != null &&  age > oldestHeatingAge){
				oldestHeatingAge = age;
			}
		});
		return oldestHeatingAge;
	}

	public getMaxHeatConsumption() : number{
		let maxHeatConsumption = 0;
		this.houseHolds.forEach(houseHold => {
			if(houseHold.consumption.usesGasForHeat){
				if(houseHold.consumption.heatConsumptionGas != null && houseHold.consumption.heatConsumptionGas > maxHeatConsumption){
					maxHeatConsumption = houseHold.consumption.heatConsumptionGas;
				}	
			}
		});
		return maxHeatConsumption;
	}
}