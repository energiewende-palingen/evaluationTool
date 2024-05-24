import { HouseHold, HouseHoldConsumption, HouseHoldInterest } from "@prisma/client";

export class HouseHoldViewData{
	public houseHold : HouseHold;
	public interest : HouseHoldInterest;
	public consumption : HouseHoldConsumption;
	public comments : Comment[];

	constructor(houseHold : HouseHold, interest : HouseHoldInterest, consumption : HouseHoldConsumption, comments : Comment[], heatingAge : number){
		this.houseHold = houseHold;
		this.interest = interest;
		this.consumption = consumption;
		this.comments = comments;

	}

	public getHeatConsumptionForHouseHold() : number {
		let heatConsumption : number = 0;
		
		if(this.consumption.usesGasForHeat){
			
			heatConsumption = this.consumption.heatConsumptionGas? this.consumption.heatConsumptionGas : 0;
		}
		else if(this.consumption.usesOilForHeat){
			
			heatConsumption = this.consumption.heatConsumptionOil? this.consumption.heatConsumptionOil : 0;
		}
		else if(this.consumption.usesElectricityForHeat){
			
			heatConsumption = this.consumption.heatConsumptionElectricity? this.consumption.heatConsumptionElectricity : 0;
		}
		else if(this.consumption.usesWoodForHeat){
			heatConsumption = this.consumption.heatConsumptionWood? this.consumption.heatConsumptionWood : 0;
		}
		return heatConsumption;
	}

	public getHeatConsumptionPerQmForHouseHold() : number {
		var consumption = this.getHeatConsumptionForHouseHold();
		if(consumption == 0 || this.houseHold.heatedArea == null ||  this.houseHold.heatedArea == 0){
			return 130;
		}
		return consumption / this.houseHold.heatedArea;
	}

	public getHeatingType() : string{
		let heatingType = "Nicht bekannt";

		if(this.consumption.usesWoodForHeat){
			heatingType = 'Holz'
		}
		
		if(this.consumption.usesGasForHeat){
			heatingType = 'Gas'
		}
		else if(this.consumption.usesOilForHeat){
			heatingType = 'Öl'
		}
		else if(this.consumption.usesElectricityForHeat){
			heatingType = 'Strom'
		}

		return heatingType;
	}

	public getHeatKwhConsumption() : number{
		let heatConsumption = this.getHeatConsumptionForHouseHold();
		return  heatConsumption * this.consumption.convertToKwhFactor;
	}
}