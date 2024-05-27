/*
  Warnings:

  - You are about to drop the column `convertToKwhFactor` on the `HouseHoldConsumption` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HouseHoldConsumption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "electricityConsumption" INTEGER,
    "usesGasForHeat" BOOLEAN,
    "usesWoodForHeat" BOOLEAN,
    "usesOilForHeat" BOOLEAN,
    "usesElectricityForHeat" BOOLEAN,
    "heatConsumptionGas" INTEGER,
    "heatConsumptionWood" INTEGER,
    "heatConsumptionOil" INTEGER,
    "heatConsumptionElectricity" INTEGER,
    "otherHeatingSystem" TEXT,
    "convertToKwhWoodFactor" REAL NOT NULL DEFAULT 1.0,
    "convertToKwhOilFactor" REAL NOT NULL DEFAULT 1.0,
    "convertToKwhElectricityFactor" REAL NOT NULL DEFAULT 1.0
);
INSERT INTO "new_HouseHoldConsumption" ("electricityConsumption", "heatConsumptionElectricity", "heatConsumptionGas", "heatConsumptionOil", "heatConsumptionWood", "id", "otherHeatingSystem", "usesElectricityForHeat", "usesGasForHeat", "usesOilForHeat", "usesWoodForHeat") SELECT "electricityConsumption", "heatConsumptionElectricity", "heatConsumptionGas", "heatConsumptionOil", "heatConsumptionWood", "id", "otherHeatingSystem", "usesElectricityForHeat", "usesGasForHeat", "usesOilForHeat", "usesWoodForHeat" FROM "HouseHoldConsumption";
DROP TABLE "HouseHoldConsumption";
ALTER TABLE "new_HouseHoldConsumption" RENAME TO "HouseHoldConsumption";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
