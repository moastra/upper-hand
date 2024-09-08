DROP TABLE IF EXISTS power_ups CASCADE;

-- Create the power_ups table
CREATE TABLE power_ups (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    effect VARCHAR(255),
    value INTEGER
);