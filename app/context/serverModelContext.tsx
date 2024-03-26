import { House } from "@prisma/client";
import { createContext } from "react";


export class District {
	public houses : House[];

	constructor(houses : House[]) {
		this.houses = houses;
	}
}

export const DistrictContext = createContext<District>(new District(new Array<House>()));
