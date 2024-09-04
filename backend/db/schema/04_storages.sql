DROP TABLE IF EXISTS storages CASCADE;

-- Create the storages table
CREATE TABLE storages (
    id SERIAL PRIMARY KEY NOT NULL,
    power_up_id INTEGER NOT NULL REFERENCES power_ups(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT TRUE
);
