import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public dbInstance!: SQLiteDBConnection;
  

  constructor() {}

  async initializeDatabase() {
    try {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      const db = await sqlite.createConnection('mismangas.db', false, 'no-encryption', 1);
      await db.open();
      this.dbInstance = db;
      console.log('Database initialized successfully');

      await this.createTables();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

// Crear tablas con los nuevos campos
  async createTables() {
    await this.dbInstance.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      usuario TEXT UNIQUE,
      nombre TEXT,
      apellido TEXT,
      email TEXT UNIQUE,
      password TEXT,
      nivel_educacion TEXT,
      fecha_nacimiento TEXT
    )`, []
    );
  }

  // Método para registrar un nuevo usuario
  async registerUser(usuario: string, nombre: string, apellido: string, email: string, password: string, nivel_educacion: string, fecha_nacimiento: string): Promise<void> {

}

  async validarUsuario (usuario: string, password: string): Promise<boolean> {
    const result = await this.dbInstance.executeSql(
      'SELECT * FROM users WHERE usuario = ? AND password = ?',
      [usuario, password]
    );
    return result.rows.length > 0;
  }

}
