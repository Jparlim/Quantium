-- CreateTable
CREATE TABLE "DataClientChosen" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "number" INTEGER NOT NULL,
    "dataTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schema" JSONB NOT NULL,

    CONSTRAINT "DataClientChosen_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DataClientChosen_number_key" ON "DataClientChosen"("number");
