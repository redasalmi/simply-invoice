pub mod database {
    use std::fs;
    use tauri_plugin_sql::{Migration, MigrationKind};

    #[tauri::command]
    pub fn init_db(app_handle: tauri::AppHandle, db_path: String) {
        let create_initial_tables =
            fs::read_to_string("./src/migrations/01-create-initial-tables.sql")
                .expect("Should have been able to read the file");
        let create_initial_tables = Box::leak(create_initial_tables.into_boxed_str());

        let migrations = vec![Migration {
            version: 1,
            description: "create_initial_tables",
            kind: MigrationKind::Up,
            sql: create_initial_tables,
        }];

        let _ = app_handle.plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(&db_path, migrations)
                .build(),
        );
    }
}
