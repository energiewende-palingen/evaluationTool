-- CreateTable
CREATE TABLE "SelectionSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "setId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HousesInSelectionSets" (
    "houseId" TEXT NOT NULL,
    "selectionId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("houseId", "selectionId"),
    CONSTRAINT "HousesInSelectionSets_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HousesInSelectionSets_selectionId_fkey" FOREIGN KEY ("selectionId") REFERENCES "SelectionSet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
