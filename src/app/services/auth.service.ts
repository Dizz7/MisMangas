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
    // Datos básicos del usuario
    const usuarioData = values[0];

    // Obtener experiencia
    const experienciaResult = await this.dbInstance!.query(
      'SELECT * FROM experiencia WHERE user = ?',
      [user]
    );
    const experiencia = experienciaResult.values?.[0] ?? null;

    // Obtener certificaciones
    const certResult = await this.dbInstance!.query(
      'SELECT * FROM certificaciones WHERE user = ?',
      [user]
    );
    const certificaciones = certResult.values ?? [];

    // Agregar experiencia y certificaciones al objeto usuarioData
    usuarioData.experiencia = experiencia;
    usuarioData.certificaciones = certificaciones;

    // Guardar en localStorage
    localStorage.setItem('usuario', user);
    localStorage.setItem('usuario_data', JSON.stringify(usuarioData));

    await this.dbInstance!.run(
      `INSERT OR REPLACE INTO sesion_data (user_name, password, active)
       VALUES (?, ?, 1)`,
      [user, parseInt(password)]
    );
  }

  return loginExitoso;
}

// Método para revisar sesión activa
isLoggedIn(): boolean {
  return !!localStorage.getItem('usuario');

  
}

// Método para obtener el usuario activo
async getSesionActiva(): Promise<string | null> {
  const result = await this.dbInstance!.query(
    `SELECT user_name FROM sesion_data WHERE active = 1`
  );
  return result.values?.[0]?.user_name ?? null;
}

// Método para cerrar sesión
logout(): void {
  const user = localStorage.getItem('usuario');
  if (user && this.dbInstance) {
    this.dbInstance.run(
      `UPDATE sesion_data SET active = 0 WHERE user_name = ?`,
      [user]
    ).catch(error => console.error('Error al cerrar sesión:', error));
  }

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


// Método para actualizar datos de experiencia
async actualizarExperiencia(user: string, experiencia: any): Promise<boolean> {
  try {
    if (!this.dbInstance) {
      await this.initDB();
    }

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
    return true;
  } catch (error) {
    console.error('Error al actualizar experiencia:', error);
    return false;
  }
}

// Método para obtener los datos de experiencia

async obtenerExperiencia(user: string): Promise<any> {
  if (!this.dbInstance) {
    await this.initDB();
  }

  const result = await this.dbInstance!.query(
    'SELECT * FROM experiencia WHERE user = ?',
    [user]
  );

  const row = result.values?.[0];

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


// Método para actualizar datos de certificación
async agregarCertificacion(user: string, certificacion: any): Promise<boolean> {
  try {
    if (!this.dbInstance) {
      await this.initDB();
    }

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
    return true;
  } catch (error) {
    console.error('Error al agregar certificación:', error);
    return false;
  }
}

// Método para obtener certificación

async obtenerCertificacion(user: string): Promise<any> {
  if (!this.dbInstance) {
    await this.initDB();
  }

  const result = await this.dbInstance!.query(
    'SELECT * FROM certificaciones WHERE user = ?',
    [user]
  );

  const row = result.values?.[0];

  if (row) {
    return {
      nombre_certificado: row.nombre_certificado,
      fecha_obtencion: row.fecha_obtencion,
      certificado_vencimiento: row.certificado_vencimiento  === 1,
      fecha_vencimiento: row.fecha_vencimiento,
    };
  }

  return null;
}

}
