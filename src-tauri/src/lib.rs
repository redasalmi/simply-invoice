mod db;

pub use crate::db::database;

pub fn init_db(app_handle: tauri::AppHandle, db_path: String) {
    database::init_db(app_handle, db_path);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_devtools::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![init_db])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
