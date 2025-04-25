ALTER TABLE "chat_message" DROP COLUMN "reply_to_id";

-- Migration to add a trigger that updates fantasy league draft status when pickNumber reaches limit
-- This trigger will update the draftStatus to 'finished' when pickNumber exceeds total picks

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION finish_draft_when_picks_complete()
RETURNS TRIGGER AS $$
DECLARE
    total_picks INTEGER;
BEGIN
    -- Count the number of picks for this fantasy league
    SELECT COUNT(*) INTO total_picks
    FROM "drafts_picks"
    WHERE "fantasy_league_id" = NEW."id";
    
    -- If pickNumber is greater than total picks, update draftStatus to 'finished'
    IF NEW."pick_number" > total_picks AND NEW."draft_status" != 'finished' THEN
        NEW."draft_status" = 'finished';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it already exists to avoid errors on migration reruns
DROP TRIGGER IF EXISTS auto_finish_draft_trigger ON "fantasy";

-- Create a trigger that fires before update on the fantasy table
CREATE TRIGGER auto_finish_draft_trigger
BEFORE UPDATE ON "fantasy"
FOR EACH ROW
EXECUTE FUNCTION finish_draft_when_picks_complete();

-- Add a comment explaining the trigger's purpose
COMMENT ON TRIGGER auto_finish_draft_trigger ON "fantasy" IS 'Automatically updates draftStatus to finished when pickNumber exceeds total picks'; 