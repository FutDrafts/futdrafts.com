CREATE TYPE "public"."venue_surface" AS ENUM('artificial turf');--> statement-breakpoint
CREATE TABLE "venue" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"capacity" integer DEFAULT 0 NOT NULL,
	"surface" "venue_surface" DEFAULT 'artificial turf' NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "venue_id_unique" UNIQUE("id"),
	CONSTRAINT "venue_name_unique" UNIQUE("name"),
	CONSTRAINT "venue_address_unique" UNIQUE("address")
);
--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "featured_image" SET DEFAULT 'https://4z1m6cqolm.ufs.sh/f/e50LOf69dOrq8oaYBbjfANBJDxULOQeVPkXYuvlmMWnc6C3t';--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "venue_id" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "founded" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "is_national" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "statistics_id";--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_code_unique" UNIQUE("code");