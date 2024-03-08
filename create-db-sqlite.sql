--
-- File generated with SQLiteStudio v3.4.4 on 周五 3月 8 10:46:14 2024
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: Billings
CREATE TABLE Billings (
    BillingID INTEGER PRIMARY KEY AUTOINCREMENT,
    TenantID INTEGER,
    Amount DECIMAL,
    BillingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    DueDate DATETIME,
    Status TEXT,
    FOREIGN KEY(TenantID) REFERENCES Tenants(TenantID)
);

-- Table: Fields
CREATE TABLE Fields (
    FieldID INTEGER PRIMARY KEY AUTOINCREMENT,
    FormID INTEGER,
    Name TEXT NOT NULL,
    Type TEXT NOT NULL,
    Constraints TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy TEXT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY(FormID) REFERENCES Forms(FormID)
);

-- Table: FormData
CREATE TABLE FormData (
    EntryID INTEGER PRIMARY KEY AUTOINCREMENT,
    FormID INTEGER,
    Data TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    SubmittedBy TEXT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY(FormID) REFERENCES Forms(FormID)
);

-- Table: Forms
CREATE TABLE Forms (
    FormID INTEGER PRIMARY KEY AUTOINCREMENT,
    TenantID INTEGER,
    Name TEXT NOT NULL,
    Description TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy TEXT,
    IsDeleted BOOLEAN DEFAULT 0,
    FOREIGN KEY(TenantID) REFERENCES Tenants(TenantID)
);

-- Table: Plans
CREATE TABLE Plans (
    PlanID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    MaxUsers INTEGER,
    MaxForms INTEGER,
    MaxEntries INTEGER,
    Price DECIMAL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: TenantPlans
CREATE TABLE TenantPlans (
    TenantPlanID INTEGER PRIMARY KEY AUTOINCREMENT,
    TenantID INTEGER,
    PlanID INTEGER,
    StartDate DATETIME,
    EndDate DATETIME,
    IsActive BOOLEAN DEFAULT 1,
    FOREIGN KEY(TenantID) REFERENCES Tenants(TenantID),
    FOREIGN KEY(PlanID) REFERENCES Plans(PlanID)
);

-- Table: tenants
CREATE TABLE Tenants (
            TenantID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            CreatedBy TEXT,
            IsDeleted BOOLEAN DEFAULT 0
          , StripeCustomerId TEXT);

-- Table: UsageTracking
CREATE TABLE UsageTracking (
    UsageID INTEGER PRIMARY KEY AUTOINCREMENT,
    TenantID INTEGER,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    UserCount INTEGER,
    FormCount INTEGER,
    EntryCount INTEGER,
    FOREIGN KEY(TenantID) REFERENCES Tenants(TenantID)
);

-- Table: Users
CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    TenantID INTEGER,
    Username TEXT NOT NULL,
    Password TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy TEXT,
    IsDeleted BOOLEAN DEFAULT 0, Email TEXT,
    FOREIGN KEY(TenantID) REFERENCES Tenants(TenantID)
);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
