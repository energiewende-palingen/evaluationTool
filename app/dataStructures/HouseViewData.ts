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

	public heatConsumptionClass : string = "";
	public heatedAreaClass : string = "";
	public sumHeatedArea : number = 0;
	public sumHeatConsumption : number = 0;
	public sumElectricityConsumption : number = 0;
	

	constructor(house : House, houseHolds : HouseHoldViewData[], 
	solarPowerSystems : SolarPowerSystem[]){
		this.house = house;
		this.houseHolds = new Array();
		for(let houseHold of houseHolds){
			this.houseHolds.push(new HouseHoldViewData(houseHold.houseHold, houseHold.interest, houseHold.consumption, houseHold.comments));
		}
		this.solarPowerSystems = solarPowerSystems;
	}
	
	public getSolarPowerSum() : number {
		let solarkwP : number = 0;
		
		for(let solarPowerSystem of this.solarPowerSystems){
			solarkwP += solarPowerSystem.installedPower;
		}

		return solarkwP;
	}

	public getRoofSizeSum() : number {
		let roofSize : number = 0;

		for(let solarPowerSystem of this.solarPowerSystems){
			roofSize += solarPowerSystem.roofSize;
		}

		return roofSize;
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

	public calculateSums(){
		for(let houseHold of this.houseHolds){
			let heatConsumption = houseHold.getHeatConsumptionForHouseHoldInKwh();
			if(heatConsumption == 0){
				this.heatConsumptionClass = "table-danger";
				heatConsumption = 130 * ( houseHold.houseHold.heatedArea? houseHold.houseHold.heatedArea : 0 ) ;
			}
			this.sumHeatConsumption += heatConsumption;
			if(houseHold.houseHold.heatedArea == null || houseHold.houseHold.heatedArea == 0){
				this.heatedAreaClass = "table-danger";
				this.sumHeatedArea += 120;
			} else {
				this.sumHeatedArea += houseHold.houseHold.heatedArea;
			}
			this.sumElectricityConsumption += houseHold.consumption.electricityConsumption? houseHold.consumption.electricityConsumption : 0;
		}
		
	}

	public getHeatConsumptionPerQm(){
		return  Math.round(this.sumHeatConsumption / this.sumHeatedArea);
	}
}