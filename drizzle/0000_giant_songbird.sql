CREATE TABLE "edges" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"target" text NOT NULL,
	"type" text
);
--> statement-breakpoint
CREATE TABLE "promo_nodes" (
	"id" text PRIMARY KEY NOT NULL,
	"node" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "song_nodes" (
	"id" text PRIMARY KEY NOT NULL,
	"node" jsonb NOT NULL
);
