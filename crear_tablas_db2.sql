-- Tabla ZONA
CREATE TABLE ZONA (
  id INT NOT NULL PRIMARY KEY,
  municipio VARCHAR(100),
  ciudad VARCHAR(100),
  departamento VARCHAR(100),
  paraje VARCHAR(100)
);

-- Tabla ESTABLECIMIENTO
CREATE TABLE ESTABLECIMIENTO (
  id INT NOT NULL PRIMARY KEY,
  id_zona INT,
  direccion VARCHAR(200),
  tipo VARCHAR(50),
  FOREIGN KEY (id_zona) REFERENCES ZONA(id)
);

-- Tabla CIRCUITO
CREATE TABLE CIRCUITO (
  num_circuito INT NOT NULL PRIMARY KEY,
  id_establecimiento INT,
  FOREIGN KEY (id_establecimiento) REFERENCES ESTABLECIMIENTO(id)
);

-- Tabla CIUDADANO
CREATE TABLE CIUDADANO (
  ci CHAR(8) NOT NULL PRIMARY KEY,
  fecha_nac DATE,
  nombre VARCHAR(100)
);

-- Tabla HABILITADO_A_VOTAR
CREATE TABLE HABILITADO_A_VOTAR (
  ci CHAR(8) NOT NULL,
  cc CHAR(8),
  num_circuito INT NOT NULL,
  PRIMARY KEY (ci, num_circuito),
  FOREIGN KEY (ci) REFERENCES CIUDADANO(ci),
  FOREIGN KEY (num_circuito) REFERENCES CIRCUITO(num_circuito)
);

-- Tabla POLICIA
CREATE TABLE POLICIA (
  ci CHAR(8) NOT NULL PRIMARY KEY,
  seccional VARCHAR(100),
  departamento VARCHAR(100),
  FOREIGN KEY (ci) REFERENCES CIUDADANO(ci)
);

-- Tabla FUNCIONARIO
CREATE TABLE FUNCIONARIO (
  ci CHAR(8) NOT NULL PRIMARY KEY,
  organismo_del_estado VARCHAR(100),
  num_circuito INT,
  rol VARCHAR(100),
  FOREIGN KEY (ci) REFERENCES CIUDADANO(ci),
  FOREIGN KEY (num_circuito) REFERENCES CIRCUITO(num_circuito)
);

-- Tabla CANDIDATO
CREATE TABLE CANDIDATO (
  ci CHAR(8) NOT NULL PRIMARY KEY,
  FOREIGN KEY (ci) REFERENCES CIUDADANO(ci)
);

-- Tabla PARTIDO
CREATE TABLE PARTIDO (
  nombre VARCHAR(100) NOT NULL PRIMARY KEY,
  direccion VARCHAR(200),
  ci_presidente CHAR(8),
  ci_vicepresidente CHAR(8),
  FOREIGN KEY (ci_presidente) REFERENCES CIUDADANO(ci),
  FOREIGN KEY (ci_vicepresidente) REFERENCES CIUDADANO(ci)
);

-- Tabla LISTA
CREATE TABLE LISTA (
  numero INT NOT NULL PRIMARY KEY,
  nombre_partido VARCHAR(100),
  FOREIGN KEY (nombre_partido) REFERENCES PARTIDO(nombre)
);

-- Tabla ELECCION
CREATE TABLE ELECCION (
  id_eleccion INT NOT NULL PRIMARY KEY,
  fecha_realizacion DATE,
  tipo_eleccion VARCHAR(100)
);

-- Tabla VOTO
CREATE TABLE VOTO (
  numero_voto INT NOT NULL PRIMARY KEY,
  fecha DATE,
  hora TIME,
  condicion VARCHAR(50),
  esObservado BOOLEAN,
  id_eleccion INT,
  num_circuito INT,
  numero_lista INT,
  FOREIGN KEY (id_eleccion) REFERENCES ELECCION(id_eleccion),
  FOREIGN KEY (num_circuito) REFERENCES CIRCUITO(num_circuito),
  FOREIGN KEY (numero_lista) REFERENCES LISTA(numero)
);

-- Tabla PERTENECE_A_LISTA
CREATE TABLE PERTENECE_A_LISTA (
  ci_candidato CHAR(8) NOT NULL,
  numero_lista INT NOT NULL,
  organo_del_estado VARCHAR(100) NOT NULL,
  orden_en_la_lista INT,
  PRIMARY KEY (ci_candidato, numero_lista, organo_del_estado),
  FOREIGN KEY (ci_candidato) REFERENCES CANDIDATO(ci),
  FOREIGN KEY (numero_lista) REFERENCES LISTA(numero)
);

-- Tabla TRABAJA_EN_ELECCION
CREATE TABLE TRABAJA_EN_ELECCION (
  ci_funcionario CHAR(8) NOT NULL,
  id_eleccion INT NOT NULL,
  PRIMARY KEY (ci_funcionario, id_eleccion),
  FOREIGN KEY (ci_funcionario) REFERENCES FUNCIONARIO(ci),
  FOREIGN KEY (id_eleccion) REFERENCES ELECCION(id_eleccion)
);

--Tabla USUARIO
CREATE TABLE USUARIO (
  username VARCHAR(50) PRIMARY KEY,
  password_hash VARCHAR(100),
  ci CHAR(8),
  rol VARCHAR(20),
  FOREIGN KEY (ci) REFERENCES CIUDADANO(ci)
);
