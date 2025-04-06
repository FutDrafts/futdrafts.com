CREATE TYPE "public"."fantasy_status" AS ENUM('pending', 'active', 'ended', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."venue_surface" AS ENUM('artificial turf');--> statement-breakpoint
CREATE TABLE "fantasy" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"league_id" text NOT NULL,
	"score_rules_id" text NOT NULL,
	"status" "fantasy_status" DEFAULT 'pending' NOT NULL,
	"minimum_player" integer DEFAULT 2 NOT NULL,
	"maximum_player" integer DEFAULT 8 NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fantasy_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "score_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"goals" integer,
	"own_goal" integer,
	"clean_sheet" integer,
	"penalty_save" integer,
	"penalty_miss" integer,
	"yellow_card" integer,
	"red_card" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
	CONSTRAINT "venue_name_unique" UNIQUE("name"),
	CONSTRAINT "venue_address_unique" UNIQUE("address")
);
--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "featured_image" SET DEFAULT 'https://4z1m6cqolm.ufs.sh/f/e50LOf69dOrq8oaYBbjfANBJDxULOQeVPkXYuvlmMWnc6C3t';--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "venue_id" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "founded" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "is_national" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "fantasy" ADD CONSTRAINT "fantasy_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fantasy" ADD CONSTRAINT "fantasy_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fantasy" ADD CONSTRAINT "fantasy_score_rules_id_score_rules_id_fk" FOREIGN KEY ("score_rules_id") REFERENCES "public"."score_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" DROP COLUMN "statistics_id";--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_code_unique" UNIQUE("code");