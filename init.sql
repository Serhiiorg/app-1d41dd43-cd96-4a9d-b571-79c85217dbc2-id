
        CREATE TABLE users
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    

        CREATE TABLE plants
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    

        CREATE TABLE diseases
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    

        CREATE TABLE symptoms
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    

        CREATE TABLE diagnoses
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    

        CREATE TABLE treatments
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    

        CREATE TABLE user_plants
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    

        CREATE TABLE images
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    

        CREATE TABLE plant_diseases
        (
          ID UUID DEFAULT UUID_GENERATE_V4()::UUID NOT NULL,
          value jsonb NOT NULL,
          PRIMARY KEY(ID)
        );
    