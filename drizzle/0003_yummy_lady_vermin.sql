-- Custom SQL migration file, put your code below! --

-- Migration to add a trigger that updates fantasy league draft status when pickNumber reaches limit
-- This trigger will update the draftStatus to 'finished' when pickNumber exceeds total picks

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION finish_draft_when_picks_complete()
RETURNS TRIGGER AS $$
DECLARE
    total_picks INTEGER;
    filled_picks INTEGER;
BEGIN
    -- Count the total number of possible picks for this fantasy league
    SELECT COUNT(*) INTO total_picks
    FROM "drafts_picks"
    WHERE "fantasy_league_id" = NEW."id";
    
    -- Count the number of picks that have been actually made (not null)
    SELECT COUNT(*) INTO filled_picks
    FROM "drafts_picks"
    WHERE "fantasy_league_id" = NEW."id"
    AND "player_id" IS NOT NULL;
    
    -- Update draft status to 'finished' when all picks are made
    IF filled_picks = total_picks 
       AND filled_picks > 0 
       AND NEW."draft_status"::text != 'finished' THEN
        NEW."draft_status" = 'finished'::draft_status;
    -- Ensure draft stays in progress if not all picks are filled
    ELSIF NEW."draft_status"::text != 'started' 
          AND filled_picks < total_picks THEN
        NEW."draft_status" = 'started'::draft_status;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger
DROP TRIGGER IF EXISTS auto_finish_draft_trigger ON "fantasy_leagues";

-- Create trigger
CREATE TRIGGER auto_finish_draft_trigger
    BEFORE UPDATE ON "fantasy_leagues"
    FOR EACH ROW
    EXECUTE FUNCTION finish_draft_when_picks_complete();

-- Add trigger documentation
COMMENT ON TRIGGER auto_finish_draft_trigger ON "fantasy_leagues" 
IS 'Automatically manages draft status based on pick completion:
   - Sets status to finished when all picks are filled
   - Maintains in_progress status while picks are incomplete';

