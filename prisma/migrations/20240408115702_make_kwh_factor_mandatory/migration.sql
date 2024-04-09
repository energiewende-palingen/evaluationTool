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
    "convertToKwhFactor" REAL NOT NULL DEFAULT 1.0
);
INSERT INTO "new_HouseHoldConsumption" ("convertToKwhFactor", "electricityConsumption", "heatConsumptionElectricity", "heatConsumptionGas", "heatConsumptionOil", "heatConsumptionWood", "id", "otherHeatingSystem", "usesElectricityForHeat", "usesGasForHeat", "usesOilForHeat", "usesWoodForHeat") SELECT coalesce("convertToKwhFactor", 1.0) AS "convertToKwhFactor", "electricityConsumption", "heatConsumptionElectricity", "heatConsumptionGas", "heatConsumptionOil", "heatConsumptionWood", "id", "otherHeatingSystem", "usesElectricityForHeat", "usesGasForHeat", "usesOilForHeat", "usesWoodForHeat" FROM "HouseHoldConsumption";
DROP TABLE "HouseHoldConsumption";
ALTER TABLE "new_HouseHoldConsumption" RENAME TO "HouseHoldConsumption";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
