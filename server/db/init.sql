CREATE TABLE app_user (
    id              serial          PRIMARY KEY,
    email           varchar(50)     NOT NULL UNIQUE,
    password        varchar(60)     NOT NULL,
    signup_date     timestamptz     NOT NULL DEFAULT NOW(),
    verified        boolean         NOT NULL,
    verified_date   timestamptz
);

-- For express-session's connect-pg-simple
CREATE TABLE session (
    sid         varchar         PRIMARY KEY,
    sess        json            NOT NULL,
	expire      timestamp(6)    NOT NULL
);

-- Outer most encapsulator
CREATE TABLE project (
    id              serial          PRIMARY KEY,
    user_id         int             NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    name            varchar(50),
    description     varchar(1000)
);

-- Holds transaction_events
CREATE TABLE plan (
    id              serial          PRIMARY KEY,
    project_id      int             NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    name            varchar(50),
    description     varchar(1000)
);

-- Deltas are performed on accounts
CREATE TABLE account (
    id              serial          PRIMARY KEY,
    project_id      int             NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    name            varchar(50),
    description     varchar(1000)
);

-- Holds deltas to be performed at certain times
CREATE TABLE transaction_event (
    id              serial          PRIMARY KEY,
    plan_id         int             NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    name            varchar(50)     NOT NULL,
    description     varchar(1000),
    start_date      date            NOT NULL,
    frequency       varchar(15)     NOT NULL
);

-- A flux of fund
CREATE TABLE delta (
    id              serial          PRIMARY KEY,
    transaction_id  int             NOT NULL REFERENCES transaction_event(id) ON DELETE CASCADE,
    account_id      int             NOT NULL REFERENCES account(id), -- ON DELETE CASCADE,
    name            varchar(50),
    description     varchar(1000),
    value           numeric(15, 2)  NOT NULL
);

-- The backend application db user
CREATE ROLE fundflux_app WITH LOGIN PASSWORD :pw;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO fundflux_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO fundflux_app;