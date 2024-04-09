import { House, HouseHold, HouseHoldConsumption, HouseHoldInterest, SolarPowerSystem, User } from "@prisma/client";
import { db } from "./db";
import fs from 'fs';
import { HouseViewData } from "~/dataStructures/HouseViewData";
import { getHouseViewForHouse } from "./convertUtils";

export class ServerUtils {
	
	public houses : House[] = [];
	public houseHolds : HouseHold[] = [];
	public houseHoldInterests : HouseHoldInterest[] = [];
	public houseHoldConsumptions : HouseHoldConsumption[] = [];
	public comments : Comment[] = [];
	public solarPowerSystems : SolarPowerSystem[] = [];
	public users : User[] = [];

	public async createBackup(){
		let houses = await db.house.findMany(); 
		let houseViews : HouseViewData[] = [];
		for (let house of houses){
			let view = await getHouseViewForHouse(house);
			houseViews.push(view);
		}
		
		let users = await db.user.findMany();
		let backup = new BackupDB(houseViews, users);
		backup.storeToFile();
	}
	
	public async restoreDatabase(){
		var json = fs.readFileSync('backup.json', 'utf8');
		var backup = JSON.parse(json);
		let admin = backup.users[0];
		
		backup.users.forEach(async (user : User) => {
			await db.user.create({
				data: user
			});
		});

		backup.houses.forEach(async (house : HouseViewData) => {
			let solarPowerSystems = [];	
			house.solarPowerSystems.forEach(solarPowerSystem => {
				solarPowerSystems.push({
					installed : solarPowerSystem.installed,
					azimuth : solarPowerSystem.azimuth,
					roofTilt : solarPowerSystem.roofTilt,
					roofSize : solarPowerSystem.roofSize,
					installedPower : solarPowerSystem.installedPower,
					batteryCapacity : solarPowerSystem.batteryCapacity					
				});
			});

			let houseHolds = []; 
			house.houseHolds.forEach(houseHold  => {
				console.log("Check houseHold");
				let comments = [];
				houseHold.comments.forEach(comment => {
					comments.push({
						comment : comment.comment,
						createdBy : {
							connect : {
								id : comment.userId
							}
						}
					});
				});
				houseHolds.push({
					name : houseHold.houseHold.name,
					lastName : houseHold.houseHold.lastName,
					email : houseHold.houseHold.email,
					phone : houseHold.houseHold.phone,
					tenant : houseHold.houseHold.tenant,
					owner : houseHold.houseHold.owner,
					lessee : houseHold.houseHold.lessee,
					houseHoldSize : houseHold.houseHold.houseHoldSize,
					heatedArea : houseHold.houseHold.heatedArea,
					heatingSystemAge : houseHold.houseHold.heatingSystemAge,
					
					interest: {
						create : {
							overall : houseHold.interest.overall,
							electricity : houseHold.interest.electricity,
							heat : houseHold.interest.heat,
							participateInProduction : houseHold.interest.participateInProduction,
							investInCompany : houseHold.interest.investInCompany,
							provideResources : houseHold.interest.provideResources,
							undecided : houseHold.interest.undecided,
							noInterest : houseHold.interest.noInterest,
						}
					},
					
					consumption : {
						create : {
							electricityConsumption : houseHold.consumption.electricityConsumption,
							
							usesGasForHeat : houseHold.consumption.usesGasForHeat,
							heatConsumptionGas : houseHold.consumption.heatConsumptionGas,
							usesOilForHeat : houseHold.consumption.usesOilForHeat,
							heatConsumptionOil : houseHold.consumption.heatConsumptionOil,
							usesWoodForHeat : houseHold.consumption.usesWoodForHeat,
							heatConsumptionWood : houseHold.consumption.heatConsumptionWood,
							usesElectricityForHeat : false,
							heatConsumptionElectricity : 0,
							otherHeatingSystem : houseHold.consumption.otherHeatingSystem,
	
						}
					},
					comments : {
						create : comments
					}
				});
				console.log("Push houseHold");
			});
			
			console.log("## Create house");
			await db.house.create({
				data: {
					street: house.house.street,
					city: house.house.city,
					houseNumber: house.house.houseNumber,
					postalCode: house.house.postalCode,
					country: house.house.country,
					latitude: house.house.latitude,
					longitude: house.house.longitude,
					houseHolds: {
						create: houseHolds
					},
					solarPowerSystems: {
						create: solarPowerSystems
					},
				}
			});
		});
	}
}

export class BackupDB{
	
	houses : HouseViewData[];
	users : User[];

	constructor(houses : HouseViewData[], users : User[]){
		this.houses = houses;
		this.users = users;
	}

	public storeToFile() {
		fs.writeFileSync('backup.json', JSON.stringify(this));
	}
}