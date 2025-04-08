CREATE TYPE "public"."fantasy_status" AS ENUM('pending', 'active', 'ended', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."fixture_status" AS ENUM('upcoming', 'in_progress', 'finished', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."league_status" AS ENUM('active', 'upcoming', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('sent', 'delivered', 'read');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'system', 'notification');--> statement-breakpoint
CREATE TYPE "public"."participant_role" AS ENUM('owner', 'admin', 'player');--> statement-breakpoint
CREATE TYPE "public"."participant_status" AS ENUM('pending', 'active', 'banned');--> statement-breakpoint
CREATE TYPE "public"."post_category" AS ENUM('transfers', 'match-reports', 'analysis', 'interviews', 'news');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."report_category" AS ENUM('harassment', 'spam', 'inappropriate_behavior', 'hate_speech', 'cheating', 'impersonation', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."venue_surface" AS ENUM('artificial turf');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "changelog" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"version" text,
	"date" timestamp DEFAULT now() NOT NULL,
	"important" boolean DEFAULT false,
	"published" boolean DEFAULT false,
	"author_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_message" (
	"id" text PRIMARY KEY NOT NULL,
	"league_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"content" text NOT NULL,
	"type" "message_type" DEFAULT 'text' NOT NULL,
	"status" "message_status" DEFAULT 'sent' NOT NULL,
	"reply_to_id" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" json NOT NULL,
	"updated_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fantasy" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"league_id" text NOT NULL,
	"score_rules_id" text NOT NULL,
	"status" "fantasy_status" DEFAULT 'pending' NOT NULL,
	"slug" text NOT NULL,
	"join_code" text NOT NULL,
	"minimum_player" integer DEFAULT 2 NOT NULL,
	"maximum_player" integer DEFAULT 8 NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"description" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"draft_start" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fantasy_name_unique" UNIQUE("name"),
	CONSTRAINT "fantasy_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "fantasy_participant" (
	"id" text PRIMARY KEY NOT NULL,
	"fantasy_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "participant_role" DEFAULT 'player' NOT NULL,
	"status" "participant_status" DEFAULT 'pending' NOT NULL,
	"team_name" text,
	"points" integer DEFAULT 0,
	"rank" integer,
	"last_active" timestamp,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fixture" (
	"id" text PRIMARY KEY NOT NULL,
	"matchday" timestamp NOT NULL,
	"halftime" timestamp NOT NULL,
	"venue_id" text NOT NULL,
	"league_id" text NOT NULL,
	"home_team_id" text NOT NULL,
	"away_team_id" text NOT NULL,
	"score" jsonb DEFAULT '{"home":0,"away":0}'::jsonb,
	"status" "fixture_status" DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fixture_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" timestamp NOT NULL
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
	"statistics_id" uuid NOT NULL,
	"profile_picture" text NOT NULL,
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
CREATE TABLE "post" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"category" "post_category" NOT NULL,
	"featured_image" text DEFAULT 'https://4z1m6cqolm.ufs.sh/f/e50LOf69dOrq8oaYBbjfANBJDxULOQeVPkXYuvlmMWnc6C3t',
	"author_id" text NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" text PRIMARY KEY NOT NULL,
	"reported_user_id" text NOT NULL,
	"reported_by_user_id" text NOT NULL,
	"reason" text NOT NULL,
	"category" "report_category" NOT NULL,
	"details" text,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"resolved_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"report_id" text NOT NULL,
	"admin_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"league_id" text,
	"venue_id" text,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"logo" text NOT NULL,
	"founded" numeric NOT NULL,
	"is_national" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_id_unique" UNIQUE("id"),
	CONSTRAINT "team_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false NOT NULL,
	"ban_reason" text,
	"ban_expires" timestamp,
	"username" text,
	"display_username" text,
	"last_login" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
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
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "waitlist_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"notified" boolean DEFAULT false NOT NULL,
	"signup_date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "changelog" ADD CONSTRAINT "changelog_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_league_id_fantasy_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."fantasy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "config" ADD CONSTRAINT "config_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fantasy" ADD CONSTRAINT "fantasy_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fantasy" ADD CONSTRAINT "fantasy_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fantasy" ADD CONSTRAINT "fantasy_score_rules_id_score_rules_id_fk" FOREIGN KEY ("score_rules_id") REFERENCES "public"."score_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fantasy_participant" ADD CONSTRAINT "fantasy_participant_fantasy_id_fantasy_id_fk" FOREIGN KEY ("fantasy_id") REFERENCES "public"."fantasy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fantasy_participant" ADD CONSTRAINT "fantasy_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_user_id_player_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_statistics" ADD CONSTRAINT "player_statistics_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_comment" ADD CONSTRAINT "report_comment_report_id_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."report"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_comment" ADD CONSTRAINT "report_comment_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;