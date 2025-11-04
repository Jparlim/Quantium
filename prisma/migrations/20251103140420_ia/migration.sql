/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contato]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nomeEmpresa]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[senha]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[CNPJ]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cliente_companyId_key" ON "Cliente"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_contato_key" ON "Cliente"("contato");

-- CreateIndex
CREATE UNIQUE INDEX "Company_nomeEmpresa_key" ON "Company"("nomeEmpresa");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_senha_key" ON "Company"("senha");

-- CreateIndex
CREATE UNIQUE INDEX "Company_CNPJ_key" ON "Company"("CNPJ");

-- CreateIndex
CREATE UNIQUE INDEX "Company_token_key" ON "Company"("token");
