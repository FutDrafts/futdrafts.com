ALTER TYPE "public"."venue_surface" ADD VALUE 'grass';--> statement-breakpoint
CREATE TABLE "fixture_events" (
	"id" text PRIMARY KEY NOT NULL,
	"elapsedTime" timestamp,
	"extraTime" timestamp,
	"type" text,
	"detail" text,
	"comments" text,
	"teamId" text,
	"playerId" text,
	"assistPlayerId" text,
	"fixtureId" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fixture" RENAME COLUMN "matchday" TO "matchDay";--> statement-breakpoint
ALTER TABLE "fixture" RENAME COLUMN "halftime" TO "secondHalf";--> statement-breakpoint
ALTER TABLE "fixture" RENAME COLUMN "venue_id" TO "venueId";--> statement-breakpoint
ALTER TABLE "fixture" RENAME COLUMN "league_id" TO "leagueId";--> statement-breakpoint
ALTER TABLE "fixture" RENAME COLUMN "home_team_id" TO "homeTeamId";--> statement-breakpoint
ALTER TABLE "fixture" RENAME COLUMN "away_team_id" TO "awayTeamId";--> statement-breakpoint
ALTER TABLE "waitlist_users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fixture" ADD COLUMN "referee" text;--> statement-breakpoint
ALTER TABLE "fixture" ADD COLUMN "timezone" text DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE "fixture" ADD COLUMN "firstHalf" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "venue" DROP COLUMN "team_id";