import { HouseHold, HouseHoldConsumption, HouseHoldInterest } from "@prisma/client";
import { getValidNumber } from "~/utils/utils";

export class HouseHoldViewData{
	public houseHold : HouseHold;
	public interest : HouseHoldInterest;
	public consumption : HouseHoldConsumption;
	public comments : Comment[];

	constructor(houseHold : HouseHold, interest : HouseHoldInterest, consumption : HouseHoldConsumption, comments : Comment[]){
		this.houseHold = houseHold;
		this.interest = interest;
		this.consumption = consumption;
		this.comments = comments;

	}

	public getGasConsumptionForHouseHold() : number{
		return this.consumption.heatConsumptionGas == null ? 0 : this.consumption.heatConsumptionGas;
	}

	public getWoodConsumptionForHouseHold() : number{
		return this.consumption.heatConsumptionWood == null ? 0 : this.consumption.heatConsumptionWood;
	}

	public getOilConsumptionForHouseHold() : number {
		return this.consumption.heatConsumptionOil == null ? 0 : this.consumption.heatConsumptionOil;
	}

	public getHeatElectricityConsumptionForHouseHold() : number {
		return this.consumption.heatConsumptionElectricity == null ? 0 : this.consumption.heatConsumptionElectricity;
	}

	public getHeatConsumptionForHouseHoldInKwh() : number {
		let heatConsumption : number = 0;
		
		heatConsumption += getValidNumber(this.consumption.heatConsumptionGas);
		
		heatConsumption += getValidNumber(this.consumption.heatConsumptionOil) * this.consumption.convertToKwhOilFactor;
			
		heatConsumption += getValidNumber(this.consumption.heatConsumptionElectricity) * this.consumption.convertToKwhElectricityFactor;
		
		heatConsumption += getValidNumber(this.consumption.heatConsumptionWood) * this.consumption.convertToKwhWoodFactor;

		return heatConsumption;
	}

	public getHeatConsumptionPerQmForHouseHold() : number {
		var consumption = this.getHeatConsumptionForHouseHoldInKwh();
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
}