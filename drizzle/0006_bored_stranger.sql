CREATE TYPE "public"."league_status" AS ENUM('active', 'upcoming', 'disabled');--> statement-breakpoint
CREATE TABLE "fixture" (
	"id" text NOT NULL,
	"home" text NOT NULL,
	"away" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fixture_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "league" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"logo" text NOT NULL,
	"flag" text NOT NULL,
	"season" numeric NOT NULL,
	"status" "league_status" DEFAULT 'disabled',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "league_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "player" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"birthday" date NOT NULL,
	"nationality" text NOT NULL,
	"height" numeric NOT NULL,
	"weight" numeric NOT NULL,
	"injured" boolean NOT NULL,
	"profile_picture" text NOT NULL,
	"statistics_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "player_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "player_statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"team_id" text NOT NULL,
	"league_id" text NOT NULL,
	"games" jsonb DEFAULT '{"appearences":0,"lineups":0,"minutes":0,"number":null,"position":"undefined","rating":"0.0","captain":false}'::jsonb,
	"substitues" jsonb DEFAULT '{"in":0,"out":0,"bench":0}'::jsonb,
	"shots" jsonb DEFAULT '{"total":0,"on_target":0}'::jsonb,
	"goals" jsonb DEFAULT '{"total":0,"conceded":0,"assists":0,"saves":0}'::jsonb,
	"passes" jsonb DEFAULT '{"total":0,"key_assist":0,"accuracy":0}'::jsonb,
	"tackles" jsonb DEFAULT '{"total":0,"blocks":0,"interceptions":0}'::jsonb,
	"duels" jsonb DEFAULT '{"total":0,"won":0}'::jsonb,
	"dribbles" jsonb DEFAULT '{"attempts":0,"success":0,"past":null}'::jsonb,
	"fouls" jsonb DEFAULT '{"drawn":0,"committed":0}'::jsonb,
	"cards" jsonb DEFAULT '{"yellow":0,"yellowToRed":0,"red":0}'::jsonb,
	"penalty" jsonb DEFAULT '{"won":null,"committed":null,"scored":0,"missed":0,"saved":null}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"league_id" text,
	"name" text NOT NULL,
	"logo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "fixture" ADD CONSTRAINT "fixture_home_team_id_fk" FOREIGN KEY ("home") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fixture" ADD CONSTRAINT "fixture_away_team_id_fk" FOREIGN KEY ("away") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_user_id_player_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;