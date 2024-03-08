-- \i C:/cygwin64/home/frank/gpts4leads/create-db-postgre.sql
BEGIN;

-- Table: Tenants
CREATE TABLE "Tenants" (
    "TenantID" SERIAL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,
    "IsDeleted" BOOLEAN DEFAULT FALSE,
    "StripeCustomerId" TEXT
);

-- Table: Plans
CREATE TABLE "Plans" (
    "PlanID" SERIAL PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "MaxUsers" INTEGER,
    "MaxForms" INTEGER,
    "MaxEntries" INTEGER,
    "Price" DECIMAL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Forms
CREATE TABLE "Forms" (
    "FormID" SERIAL PRIMARY KEY,
    "TenantID" INTEGER,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,
    "IsDeleted" BOOLEAN DEFAULT FALSE,
    FOREIGN KEY("TenantID") REFERENCES "Tenants"("TenantID")
);

-- Table: Fields
CREATE TABLE "Fields" (
    "FieldID" SERIAL PRIMARY KEY,
    "FormID" INTEGER,
    "Name" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Constraints" TEXT,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,
    "IsDeleted" BOOLEAN DEFAULT FALSE,
    FOREIGN KEY("FormID") REFERENCES "Forms"("FormID")
);

-- Table: FormData
CREATE TABLE "FormData" (
    "EntryID" SERIAL PRIMARY KEY,
    "FormID" INTEGER,
    "Data" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "SubmittedBy" TEXT,
    "IsDeleted" BOOLEAN DEFAULT FALSE,
    FOREIGN KEY("FormID") REFERENCES "Forms"("FormID")
);

-- Table: Users
CREATE TABLE "Users" (
    "UserID" SERIAL PRIMARY KEY,
    "TenantID" INTEGER,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,
    "IsDeleted" BOOLEAN DEFAULT FALSE, 
    "Email" TEXT,
    FOREIGN KEY("TenantID") REFERENCES "Tenants"("TenantID")
);

-- Table: TenantPlans
CREATE TABLE "TenantPlans" (
    "TenantPlanID" SERIAL PRIMARY KEY,
    "TenantID" INTEGER,
    "PlanID" INTEGER,
    "StartDate" TIMESTAMP,
    "EndDate" TIMESTAMP,
    "IsActive" BOOLEAN DEFAULT TRUE,
    FOREIGN KEY("TenantID") REFERENCES "Tenants"("TenantID"),
    FOREIGN KEY("PlanID") REFERENCES "Plans"("PlanID")
);

-- Table: Billings
CREATE TABLE "Billings" (
    "BillingID" SERIAL PRIMARY KEY,
    "TenantID" INTEGER,
    "Amount" DECIMAL,
    "BillingDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "DueDate" TIMESTAMP,
    "Status" TEXT,
    FOREIGN KEY("TenantID") REFERENCES "Tenants"("TenantID")
);

-- Table: UsageTracking
CREATE TABLE "UsageTracking" (
    "UsageID" SERIAL PRIMARY KEY,
    "TenantID" INTEGER,
    "Date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UserCount" INTEGER,
    "FormCount" INTEGER,
    "EntryCount" INTEGER,
    FOREIGN KEY("TenantID") REFERENCES "Tenants"("TenantID")
);

COMMIT;
