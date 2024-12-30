pub mod database {
    use tauri_plugin_sql::{Migration, MigrationKind};

    #[tauri::command]
    pub fn init_db(app_handle: tauri::AppHandle, db_path: String) {
        let migrations = vec![Migration {
            version: 1,
            description: "create_initial_tables",
            kind: MigrationKind::Up,
            sql: "
  CREATE TABLE IF NOT EXISTS addresses (
    address_id VARCHAR(26) NOT NULL PRIMARY KEY,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT,
    country TEXT NOT NULL,
    province TEXT,
    zip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME
  );

  CREATE INDEX addresses_index ON addresses (country, city);

  CREATE TABLE IF NOT EXISTS companies (
    company_id VARCHAR(26) NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    additional_information JSON,
    address_id VARCHAR(26) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (address_id) REFERENCES addresses (address_id) ON DELETE CASCADE
  );
  
  CREATE INDEX companies_index ON companies (name, email);
  
  CREATE TABLE IF NOT EXISTS customers (
      customer_id VARCHAR(26) NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      additional_information JSON,
      address_id VARCHAR(26) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at DATETIME,
      FOREIGN KEY (address_id) REFERENCES addresses (address_id) ON DELETE CASCADE
    );
    
  CREATE INDEX customers_index ON customers (name, email);
  
  CREATE TABLE IF NOT EXISTS services (
    service_id VARCHAR(26) NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    rate NUMERIC NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME
  );
  
  CREATE INDEX services_index ON services (name, rate);

  CREATE TABLE IF NOT EXISTS taxes (
    tax_id VARCHAR(26) NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    rate NUMERIC NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME
  );
  
  CREATE INDEX taxes_index ON taxes (name, rate);
  "
            .trim(),
        }];

        let _ = app_handle.plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(&db_path, migrations)
                .build(),
        );
    }
}
