import { HouseViewData } from "~/dataStructures/HouseViewData";
import { db } from "./db";
import { HouseHoldViewData } from "~/dataStructures/HouseHoldViewData";
import { House } from "@prisma/client";

export async function getHouseViewForHouse(house : House) : Promise<HouseViewData>{
	let houseView : HouseViewData;
	let houseHoldViews : HouseHoldViewData[] = [];

	let houseHolds = await db.houseHold.findMany({
		where: {
			houseId: house.id
		}
	});

	for(let houseHold of houseHolds){
		let interest = await db.houseHoldInterest.findUnique({
			where: {
				id: houseHold.houseHoldInterestId
			}
		});
		let consumption = await db.houseHoldConsumption.findUnique({
			where: {
				id: houseHold.houseHoldConsumptionId
			}
		});

		let comments = await db.comment.findMany({
			where: {
				houseHoldId: houseHold.id
			}
		});

		if(interest != null && consumption != null && comments != null){
			houseHoldViews.push(new HouseHoldViewData(houseHold, interest, consumption, comments, houseHold.heatingSystemAge));
		}
	}

	let solarPowerSystems = await db.solarPowerSystem.findMany({
		where: {
			houseId: house.id
		}
	});
	houseView = new HouseViewData(house, houseHoldViews, solarPowerSystems);
	return houseView;
}