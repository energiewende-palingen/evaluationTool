import { HouseHold, HouseHoldConsumption, HouseHoldInterest } from "@prisma/client";

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
}