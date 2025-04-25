ALTER TABLE "fantasy" ALTER COLUMN "draft_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fantasy" ALTER COLUMN "draft_status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."draft_status";--> statement-breakpoint
CREATE TYPE "public"."draft_status" AS ENUM('pending', 'in-progress', 'finished');--> statement-breakpoint
ALTER TABLE "fantasy" ALTER COLUMN "draft_status" SET DEFAULT 'pending'::"public"."draft_status";--> statement-breakpoint
ALTER TABLE "fantasy" ALTER COLUMN "draft_status" SET DATA TYPE "public"."draft_status" USING "draft_status"::"public"."draft_status";