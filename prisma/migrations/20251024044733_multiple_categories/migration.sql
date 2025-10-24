-- CreateTable
CREATE TABLE "ListItemCategory" (
    "listItemId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ListItemCategory_pkey" PRIMARY KEY ("listItemId","categoryId")
);

-- CreateIndex
CREATE INDEX "ListItemCategory_listItemId_idx" ON "ListItemCategory"("listItemId");

-- CreateIndex
CREATE INDEX "ListItemCategory_categoryId_idx" ON "ListItemCategory"("categoryId");

-- Migrate existing data from ListItem.categoryId to ListItemCategory
INSERT INTO "ListItemCategory" ("listItemId", "categoryId")
SELECT "id", "categoryId"
FROM "ListItem"
WHERE "categoryId" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT IF EXISTS "ListItem_categoryId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "ListItem_categoryId_idx";

-- AlterTable
ALTER TABLE "ListItem" DROP COLUMN "categoryId";

-- AddForeignKey
ALTER TABLE "ListItemCategory" ADD CONSTRAINT "ListItemCategory_listItemId_fkey" FOREIGN KEY ("listItemId") REFERENCES "ListItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListItemCategory" ADD CONSTRAINT "ListItemCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

