import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Instancia de SQLiteConnection
  private sqlite: SQLiteConnection;
  private dbInstance: SQLiteDBConnection | undefined;
  

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }
  // Inicializar la conexión a la base de datos
  async initDB() {
    if (!this.dbInstance) {
      const db = await this.sqlite.createConnection('mismangas.db', false, 'no-encryption', 1, false);
      await db.open();
      this.dbInstance = db;
      await this.createTables(); // Crear tablas al inicializar la base de datos
    }
  }

  // Crear tablas necesarias
  async createTables() {
    if (!this.dbInstance) {
      throw new Error('La base de datos no fue inicializada correctamente.');
    }
    await this.dbInstance.execute(
      `CREATE TABLE IF NOT EXISTS usuarios (
      user TEXT PRIMARY KEY,
      nombre TEXT,
      apellido TEXT,
      email TEXT,
      password TEXT,
      educacion TEXT,
      nacimiento TEXT
    )`,
    );
  }

  // Método para registrar un nuevo usuario
  async registerUser(user: string, nombre: string, apellido: string, email: string, password: string, educacion: string, nacimiento: string): Promise<void> {
    await this.initDB(); // 👈 Asegúrate de llamar esto antes de usar dbInstance

    if (!this.dbInstance) {
      throw new Error('La base de datos no fue inicializada correctamente.');
    }

    await this.dbInstance.run(
      `INSERT INTO usuarios (user, nombre, apellido, email, password, educacion, nacimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user, nombre, apellido, email, password, educacion, nacimiento]
    );
  }

//  Método para login de usuario
async loginUsuario(user: string, password: string): Promise<boolean> {
  if (!this.dbInstance) {
    await this.initDB();
  }
  const result = await this.dbInstance!.query(
    'SELECT * FROM usuarios WHERE user = ? AND password = ?',
    [user, password]
  );

  const values = result.values ?? [];
  return values.length > 0;
}
}