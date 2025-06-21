import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sqlite: SQLiteConnection;
  private dbInstance: SQLiteDBConnection | undefined;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDB() {
    const isConnected = await this.sqlite.isConnection('mismangas.db', false);
    if (!this.dbInstance || !isConnected) {
      const db = await this.sqlite.createConnection('mismangas.db', false, 'no-encryption', 1, false);
      await db.open();
      this.dbInstance = db;
      await this.createTables();
    }
  }

  async cerrarConexion(): Promise<void> {
    const isConnected = await this.sqlite.isConnection('mismangas.db', false);
    if (this.dbInstance && isConnected) {
      await this.sqlite.closeConnection('mismangas.db', false);
      this.dbInstance = undefined;
    }
  }

  async createTables() {
    if (!this.dbInstance) throw new Error('La base de datos no fue inicializada correctamente.');

    await this.dbInstance.execute(
      `CREATE TABLE IF NOT EXISTS usuarios (
        user TEXT PRIMARY KEY,
        nombre TEXT,
        apellido TEXT,
        email TEXT,
        password TEXT,
        educacion TEXT,
        nacimiento TEXT
      )`
    );

    await this.dbInstance.execute(
      `CREATE TABLE IF NOT EXISTS sesion_data (
        user_name TEXT(8) PRIMARY KEY NOT NULL,
        password INTEGER NOT NULL,
        active INTEGER NOT NULL,
        FOREIGN KEY (user_name) REFERENCES usuarios(user) ON DELETE CASCADE
      )`
    );

    await this.dbInstance.execute(
      `CREATE TABLE IF NOT EXISTS experiencia (
        user TEXT PRIMARY KEY NOT NULL,
        empresa TEXT,
        trabaja_actualmente INTEGER,
        anio_inicio INTEGER,
        anio_termino INTEGER,
        cargo TEXT,
        FOREIGN KEY (user) REFERENCES usuarios(user) ON DELETE CASCADE
      )`
    );

    await this.dbInstance.execute(
      `CREATE TABLE IF NOT EXISTS certificaciones (
        id_certificado INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT NOT NULL,
        nombre_certificado TEXT,
        fecha_obtencion TEXT,
        certificado_vencimiento INTEGER,
        fecha_vencimiento TEXT,
        FOREIGN KEY (user) REFERENCES usuarios(user) ON DELETE CASCADE
      )`
    );

    await this.dbInstance.execute(
      `CREATE TABLE IF NOT EXISTS fotoPerfil (
        user TEXT PRIMARY KEY,
        URI TEXT,
        FOREIGN KEY (user) REFERENCES usuarios(user) ON DELETE CASCADE
      )`
    );
  }

  async registerUser(user: string, nombre: string, apellido: string, email: string, password: string, educacion: string, nacimiento: string): Promise<void> {
    await this.initDB();
    if (!this.dbInstance) throw new Error('La base de datos no fue inicializada correctamente.');

    await this.dbInstance.run(
      `INSERT INTO usuarios (user, nombre, apellido, email, password, educacion, nacimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user, nombre, apellido, email, password, educacion, nacimiento]
    );

    await this.cerrarConexion();
  }

  async loginUsuario(user: string, password: string): Promise<boolean> {
    await this.initDB();
    const result = await this.dbInstance!.query(
      'SELECT * FROM usuarios WHERE user = ? AND password = ?',
      [user, password]
    );

    const values = result.values ?? [];
    const loginExitoso = values.length > 0;

    if (loginExitoso) {
      const usuarioData = values[0];

      const experienciaResult = await this.dbInstance!.query(
        'SELECT * FROM experiencia WHERE user = ?',
        [user]
      );
      usuarioData.experiencia = experienciaResult.values?.[0] ?? null;

      const certResult = await this.dbInstance!.query(
        'SELECT * FROM certificaciones WHERE user = ?',
        [user]
      );
      usuarioData.certificaciones = certResult.values ?? [];

      const fotoPerfilResult = await this.dbInstance!.query(
        'SELECT URI FROM fotoPerfil WHERE user = ?',
        [user]
      );
      usuarioData.fotoPerfil = fotoPerfilResult.values?.[0]?.URI ?? null;

      localStorage.setItem('usuario', user);
      localStorage.setItem('usuario_data', JSON.stringify(usuarioData));
      localStorage.setItem('session', 'active');

      await this.dbInstance!.run(
        `INSERT OR REPLACE INTO sesion_data (user_name, password, active)
         VALUES (?, ?, 1)`,
        [user, parseInt(password)]
      );
    }

    await this.cerrarConexion();
    return loginExitoso;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  async getSesionActiva(): Promise<string | null> {
    await this.initDB();
    const result = await this.dbInstance!.query(
      `SELECT user_name FROM sesion_data WHERE active = 1`
    );
    return result.values?.[0]?.user_name ?? null;
  }

  async logout(): Promise<void> {
    const user = localStorage.getItem('usuario');
    await this.initDB();
    if (user) {
      try {
        await this.dbInstance!.run(
          `UPDATE sesion_data SET active = 0 WHERE user_name = ?`,
          [user]
        );
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
    await this.cerrarConexion();
    localStorage.removeItem('usuario');
    localStorage.removeItem('session');
  }

  async verificarUsuario(nombre: string): Promise<boolean> {
    await this.initDB();
    const result = await this.dbInstance!.query(
      'SELECT * FROM usuarios WHERE user = ?',
      [nombre]
    );
    return !!(result.values && result.values.length > 0);
  }

  async actualizarContrasena(nombre: string, nuevaPass: string): Promise<boolean> {
    await this.initDB();
    try {
      await this.dbInstance!.run(
        'UPDATE usuarios SET password = ? WHERE user = ?',
        [nuevaPass, nombre]
      );
      await this.cerrarConexion();
      return true;
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      return false;
    }
  }

  async actualizarPerfil(user: string, datos: any): Promise<boolean> {
    try {
      await this.initDB();
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
      await this.cerrarConexion();
      return true;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return false;
    }
  }

  async actualizarExperiencia(user: string, experiencia: any): Promise<boolean> {
    try {
      await this.initDB();
      await this.dbInstance!.run(
        `INSERT OR REPLACE INTO experiencia (user, empresa, trabaja_actualmente, anio_inicio, anio_termino, cargo)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user,
          experiencia.empresa,
          experiencia.trabaja_actualmente,
          experiencia.anio_inicio,
          experiencia.anio_termino,
          experiencia.cargo
        ]
      );
      await this.cerrarConexion();
      return true;
    } catch (error) {
      console.error('Error al actualizar experiencia:', error);
      return false;
    }
  }

  async obtenerExperiencia(user: string): Promise<any> {
    await this.initDB();
    const result = await this.dbInstance!.query(
      'SELECT * FROM experiencia WHERE user = ?',
      [user]
    );
    const row = result.values?.[0];
    await this.cerrarConexion();

    if (row) {
      return {
        empresa: row.empresa,
        trabaja_actualmente: row.trabaja_actualmente === 1,
        anio_inicio: row.anio_inicio,
        anio_termino: row.anio_termino,
        cargo: row.cargo
      };
    }

    return null;
  }

  async agregarCertificacion(user: string, certificacion: any): Promise<boolean> {
    try {
      await this.initDB();
      await this.dbInstance!.run(
        `INSERT INTO certificaciones (user, nombre_certificado, fecha_obtencion, certificado_vencimiento, fecha_vencimiento)
         VALUES (?, ?, ?, ?, ?)`,
        [
          user,
          certificacion.nombre_certificado,
          certificacion.fecha_obtencion,
          certificacion.certificado_vencimiento,
          certificacion.fecha_vencimiento
        ]
      );
      await this.cerrarConexion();
      return true;
    } catch (error) {
      console.error('Error al agregar certificación:', error);
      return false;
    }
  }

  async actualizarFotoPerfil(user: string, uri: string): Promise<boolean> {
    try {
      await this.initDB();
      await this.dbInstance!.run(
        `INSERT OR REPLACE INTO fotoPerfil (user, URI) VALUES (?, ?)`,
        [user, uri]
      );
      await this.cerrarConexion();
      return true;
    } catch (error) {
      console.error('Error al actualizar foto de perfil:', error);
      return false;
    }
  }

  async obtenerFotoPerfil(user: string): Promise<string | null> {
    await this.initDB();
    const result = await this.dbInstance!.query(
      'SELECT URI FROM fotoPerfil WHERE user = ?',
      [user]
    );
    await this.cerrarConexion();
    const row = result.values?.[0];
    return row ? row.URI : null;
  }

  async obtenerCertificacion(user: string): Promise<any> {
    await this.initDB();
    const result = await this.dbInstance!.query(
      'SELECT * FROM certificaciones WHERE user = ?',
      [user]
    );
    await this.cerrarConexion();
    const row = result.values?.[0];

    if (row) {
      return {
        nombre_certificado: row.nombre_certificado,
        fecha_obtencion: row.fecha_obtencion,
        certificado_vencimiento: row.certificado_vencimiento === 1,
        fecha_vencimiento: row.fecha_vencimiento,
      };
    }

    return null;
  }
}