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
    await this.initDB();

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
  const loginExitoso = values.length > 0;

  if (loginExitoso) {
    // Guarda al usuario como sesión activa
    localStorage.setItem('usuario', user);
  }

  return loginExitoso;
}

// Método para revisar sesión activa
isLoggedIn(): boolean {
  return !!localStorage.getItem('usuario');
}

// Método para cerrar sesión
logout(): void {
  localStorage.removeItem('usuario');
}

// Verificar si un usuario existe
async verificarUsuario(nombre: string): Promise<boolean> {
  if (!this.dbInstance) {
    await this.initDB();
  }

  const result = await this.dbInstance!.query(
    'SELECT * FROM usuarios WHERE user = ?',
    [nombre]
  );

  return !!(result.values && result.values.length > 0);
}

// Actualizar la contraseña de un usuario
async actualizarContrasena(nombre: string, nuevaPass: string): Promise<boolean> {
  if (!this.dbInstance) {
    await this.initDB();
  }

  try {
    await this.dbInstance!.run(
      'UPDATE usuarios SET password = ? WHERE user = ?',
      [nuevaPass, nombre]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    return false;
  }
}

async actualizarPerfil(user: string, datos: any): Promise<boolean> {
  try {
    if (!this.dbInstance) {
      await this.initDB();
    }
    await this.dbInstance!.run(
      `UPDATE usuarios SET 
         password = ?, nombre = ?, apellido = ?, email = ?, nacimiento = ?, educacion = ?
       WHERE user = ?`,
      [
        datos.password,
        datos.nombre,
        datos.apellido,
        datos.email,
        datos.nacimiento,
        datos.educacion,
        user
      ]
    );
    return true;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return false;
  }
}

}