-- Insertar ciudadanos
INSERT INTO CIUDADANO (CI, FECHA_NAC, NOMBRE) VALUES
('11111111', '1990-01-01', 'Funcionario Uno'),
('22222222', '1985-02-02', 'Policía Dos'),
('33333333', '1970-03-03', 'Administrador Tres'),
('44444444', '2000-04-04', 'Votante Cuatro'),
('90000001', '1970-01-01', 'Presidente Partido A'),
('90000002', '1975-02-02', 'Vicepresidente Partido A'),
('90000003', '1980-03-03', 'Presidente Partido B'),
('90000004', '1985-04-04', 'Vicepresidente Partido B');

-- Insertar candidatos
INSERT INTO CANDIDATO (CI) VALUES
('90000001'),
('90000002'),
('90000003'),
('90000004');

-- Insertar partidos
INSERT INTO PARTIDO (NOMBRE, DIRECCION, CI_PRESIDENTE, CI_VICEPRESIDENTE) VALUES
('Partido A', 'Calle 123, Montevideo', '90000001', '90000002'),
('Partido B', 'Av. 456, Canelones', '90000003', '90000004');

-- Insertar listas
INSERT INTO LISTA (NUMERO, NOMBRE_PARTIDO) VALUES
(1001, 'Partido A'),
(1002, 'Partido A'),
(2001, 'Partido B'),
(2002, 'Partido B');

-- Insertar usuarios
-- Contraseñas: todos = "1234" (hash generados con bcrypt)

-- Hash generado de "1234" con bcrypt (10 salt rounds)
INSERT INTO USUARIO (username, password_hash, ci, rol) VALUES
('funcionario1', '$2b$10$Iy/JoYyxqGQ7ee73Z6B6sePMRxw0Knq1nZBriE70n/kznvtE7Eyyu', '11111111', 'FUNCIONARIO'),
('policia1',     '$2b$10$Iy/JoYyxqGQ7ee73Z6B6sePMRxw0Knq1nZBriE70n/kznvtE7Eyyu', '22222222', 'POLICIA'),
('admin1',       '$2b$10$Iy/JoYyxqGQ7ee73Z6B6sePMRxw0Knq1nZBriE70n/kznvtE7Eyyu', '33333333', 'ADMIN'),
('ciudadano1',   '$2b$10$Iy/JoYyxqGQ7ee73Z6B6sePMRxw0Knq1nZBriE70n/kznvtE7Eyyu', '44444444', 'CIUDADANO');

-- Insertar zonas
INSERT INTO ZONA (ID, MUNICIPIO, CIUDAD, DEPARTAMENTO, PARAJE) VALUES
(1, 'Municipio A', 'Montevideo', 'Montevideo', 'Centro'),
(2, 'Atlantida', 'Las Piedras', 'Canelones', 'Barrio Sur');

-- Insertar establecimientos
INSERT INTO ESTABLECIMIENTO (ID, ID_ZONA, DIRECCION, TIPO) VALUES
(1, 1, 'Av. 18 de Julio 1968', 'Liceo'),
(2, 2, 'Calle Artigas 456', 'Escuela');

-- Insertar circuitos
INSERT INTO CIRCUITO (NUM_CIRCUITO, ID_ESTABLECIMIENTO, CERRADO) VALUES
(101, 1, 0),
(102, 1, 0),
(201, 2, 0);

-- Insertar elecciones
INSERT INTO ELECCION (ID_ELECCION, FECHA_REALIZACION, TIPO_ELECCION) VALUES
(1, '2024-10-27', 'Elecciones Nacionales'),
(2, '2025-05-11', 'Elecciones Departamentales');

-- Insertar pertenencia a lista
INSERT INTO PERTENECE_A_LISTA (CI_CANDIDATO, NUMERO_LISTA, ORGANO_DEL_ESTADO, ORDEN_EN_LA_LISTA) VALUES
('90000001', 1001, 'PODER EJECUTIVO', 1),
('90000002', 1002, 'PODER EJECUTIVO', 1),
('90000003', 2001, 'PODER EJECUTIVO', 1),
('90000004', 2002, 'PODER EJECUTIVO', 1);

-- Insertar habilitados a votar
INSERT INTO HABILITADO_A_VOTAR (CI, CC, NUM_CIRCUITO) VALUES
('44444444', 'BGA12312', 101);

-- Insertar funcionario
INSERT INTO FUNCIONARIO (CI, ORGANISMO_DEL_ESTADO, NUM_CIRCUITO, ROL) VALUES
('11111111', 'Ministerio del Interior', 101, 'presidente');

-- Insertar policía
INSERT INTO POLICIA (CI, SECCIONAL, DEPARTAMENTO) VALUES
('22222222', 'Seccional 5', 'Montevideo');

-- Asignar funcionario a todas las elecciones
INSERT INTO TRABAJA_EN_ELECCION (CI_FUNCIONARIO, ID_ELECCION)
SELECT '11111111', ID_ELECCION FROM ELECCION;

-- Insertar votos
INSERT INTO VOTO (ID_ELECCION, NUMERO_LISTA, NUM_CIRCUITO, CONDICION, ESOBSERVADO) VALUES
-- Elección 1
(1, 1001, 101, 'VALIDO', 0),
(1, 1002, 101, 'VALIDO', 0),
(1, 2001, 102, 'VALIDO', 1),
(1, NULL, 101, 'ANULADO', 0),
(1, NULL, 102, 'BLANCO', 0),

-- Elección 2
(2, 1001, 201, 'VALIDO', 0),
(2, 2001, 201, 'VALIDO', 1),
(2, NULL, 201, 'BLANCO', 0),
(2, NULL, 201, 'ANULADO', 0);