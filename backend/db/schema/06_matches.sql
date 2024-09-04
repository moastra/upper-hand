-- Drop the table if it exists
DROP TABLE IF EXISTS matches CASCADE;

-- Create the matches table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY NOT NULL,
    winner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    loser_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rounds INTEGER NOT NULL,
    match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
