-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "HouseHold" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "houseId" TEXT NOT NULL,
    "name" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "tenant" BOOLEAN,
    "owner" BOOLEAN,
    "lessee" BOOLEAN,
    "houseHoldSize" INTEGER,
    "heatedArea" INTEGER,
    "heatingSystemAge" INTEGER,
    "houseHoldInterestId" TEXT NOT NULL,
    "houseHoldConsumptionId" TEXT NOT NULL,
    CONSTRAINT "HouseHold_houseHoldConsumptionId_fkey" FOREIGN KEY ("houseHoldConsumptionId") REFERENCES "HouseHoldConsumption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HouseHold_houseHoldInterestId_fkey" FOREIGN KEY ("houseHoldInterestId") REFERENCES "HouseHoldInterest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HouseHold_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HouseHoldConsumption" (
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
    "otherHeatingSystem" TEXT
);

-- CreateTable
CREATE TABLE "HouseHoldInterest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "overall" BOOLEAN NOT NULL DEFAULT false,
    "electricity" BOOLEAN NOT NULL DEFAULT false,
    "heat" BOOLEAN NOT NULL DEFAULT false,
    "participateInProduction" BOOLEAN NOT NULL DEFAULT false,
    "investInCompany" BOOLEAN NOT NULL DEFAULT false,
    "provideResources" BOOLEAN NOT NULL DEFAULT false,
    "undecided" BOOLEAN NOT NULL DEFAULT false,
    "noInterest" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "houseHoldId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    CONSTRAINT "Comment_houseHoldId_fkey" FOREIGN KEY ("houseHoldId") REFERENCES "HouseHold" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SolarPowerSystem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "houseId" TEXT NOT NULL,
    "installed" BOOLEAN NOT NULL,
    "azimuth" INTEGER NOT NULL,
    "roofTilt" INTEGER NOT NULL,
    "roofSize" INTEGER NOT NULL,
    "installedPower" INTEGER NOT NULL,
    "batteryCapacity" INTEGER NOT NULL,
    CONSTRAINT "SolarPowerSystem_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "House_street_houseNumber_postalCode_city_country_key" ON "House"("street", "houseNumber", "postalCode", "city", "country");

-- CreateIndex
CREATE UNIQUE INDEX "HouseHold_houseHoldInterestId_key" ON "HouseHold"("houseHoldInterestId");

-- CreateIndex
CREATE UNIQUE INDEX "HouseHold_houseHoldConsumptionId_key" ON "HouseHold"("houseHoldConsumptionId");
