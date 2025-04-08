CREATE TABLE expenses (
    "id" VARCHAR(255) PRIMARY KEY,
    "amount" NUMERIC(10, 2) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "categoryId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("userId") REFERENCES users (id),
    FOREIGN KEY ("categoryId") REFERENCES categories (id)
);