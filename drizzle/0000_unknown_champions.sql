CREATE TABLE "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"signedUpAt" timestamp DEFAULT now()
);
