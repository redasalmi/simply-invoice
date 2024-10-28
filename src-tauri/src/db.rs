pub mod database {
    use tauri_plugin_sql::{Migration, MigrationKind};

    #[tauri::command]
    pub fn init_db(app_handle: tauri::AppHandle, db_path: String) {
        let migrations = vec![Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "
  CREATE TABLE IF NOT EXISTS companies (
    company_id VARCHAR(26) NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    address_id VARCHAR(26) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL,
    FOREIGN KEY (address_id) REFERENCES addresses (address_id)
  );
  
  CREATE INDEX companies_index ON companies (name, email);
  
  CREATE TABLE IF NOT EXISTS customers (
      customer_id VARCHAR(26) NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      address_id VARCHAR(26) NOT NULL,
      created_at DATE DEFAULT CURRENT_DATE NOT NULL,
      updated_at DATE DEFAULT CURRENT_DATE NOT NULL,
      FOREIGN KEY (address_id) REFERENCES addresses (address_id)
    );
    
  CREATE INDEX customers_index ON customers (name, email);
  
  CREATE TABLE IF NOT EXISTS services (
    service_id VARCHAR(26) NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    rate NUMERIC NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL
  );
  
  CREATE INDEX services_index ON services (name, rate);
  
  CREATE TABLE IF NOT EXISTS addresses (
    address_id VARCHAR(26) NOT NULL PRIMARY KEY,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT,
    country TEXT NOT NULL,
    province TEXT,
    zip TEXT,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL
  );
  
  CREATE INDEX addresses_index ON addresses (country, city);
  
  CREATE TABLE IF NOT EXISTS companies_custom_fields (
    company_custom_field_id VARCHAR(26) NOT NULL PRIMARY KEY,
    custom_field_index integer NOT NULL,
    label TEXT NOT NULL,
    content TEXT NOT NULL,
    company_id VARCHAR(26) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies (company_id)
  );
  
  CREATE TABLE IF NOT EXISTS customers_custom_fields (
    customer_custom_field_id VARCHAR(26) NOT NULL PRIMARY KEY,
    custom_field_index integer NOT NULL,
    label TEXT NOT NULL,
    content TEXT NOT NULL,
    customer_id VARCHAR(26) NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE NOT NULL,
    updated_at DATE DEFAULT CURRENT_DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
  );
  "
            .trim(),
            kind: MigrationKind::Up,
        }];

        let _ = app_handle.plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(&db_path, migrations)
                .build(),
        );
    }
}
