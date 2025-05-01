CREATE TYPE "public"."h2h_match_status" AS ENUM('scheduled', 'in-progress', 'completed');--> statement-breakpoint
CREATE TABLE "h2h_match" (
	"id" text PRIMARY KEY NOT NULL,
	"fantasy_league_id" text NOT NULL,
	"home_participant_id" text NOT NULL,
	"away_participant_id" text NOT NULL,
	"week_number" integer NOT NULL,
	"match_number" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"home_points" integer DEFAULT 0 NOT NULL,
	"away_points" integer DEFAULT 0 NOT NULL,
	"status" "h2h_match_status" DEFAULT 'scheduled' NOT NULL,
	"winner_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
