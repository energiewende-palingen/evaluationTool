import { HouseHold, HouseHoldConsumption, HouseHoldInterest } from "@prisma/client";

export class HouseHoldViewData{
	public houseHold : HouseHold;
	public interest : HouseHoldInterest;
	public consumption : HouseHoldConsumption;
	public comments : Comment[];
	public heatingAge : number;

	constructor(houseHold : HouseHold, interest : HouseHoldInterest, consumption : HouseHoldConsumption, comments : Comment[], heatingAge : number){
		this.houseHold = houseHold;
		this.interest = interest;
		this.consumption = consumption;
		this.comments = comments;
		this.heatingAge = heatingAge;
	}
}