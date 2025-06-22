-- Insertar ciudadanos base
INSERT INTO CIUDADANO (ci, fecha_nac, nombre) VALUES ('11111111', '1990-01-01', 'Funcionario Uno');
INSERT INTO CIUDADANO (ci, fecha_nac, nombre) VALUES ('22222222', '1985-02-02', 'Policia Dos');
INSERT INTO CIUDADANO (ci, fecha_nac, nombre) VALUES ('33333333', '1970-03-03', 'Administrador Tres');
INSERT INTO CIUDADANO (ci, fecha_nac, nombre) VALUES ('44444444', '2000-04-04', 'Votante Cuatro');

--Insertar habilitado a votar
INSERT INTO HABILITADO_A_VOTAR (CI, CC, NUM_CIRCUITO) VALUES
('44444444', 'BGA 1231', '101');

-- Insertar funcionario asociado a un circuito existente
-- ⚠️ Reemplazá '101' por un num_circuito existente en tu tabla CIRCUITO
INSERT INTO FUNCIONARIO (ci, organismo_del_estado, num_circuito, rol)
VALUES ('11111111', 'Ministerio del Interior', 101, 'presidente');

-- Insertar policía
INSERT INTO POLICIA (ci, seccional, departamento)
VALUES ('22222222', 'Seccional 5', 'Montevideo');

-- Insertar partidos
INSERT INTO CIUDADANO (ci, fecha_nac, nombre) VALUES
('90000001', '1970-01-01', 'Presidente Partido A'),
('90000002', '1975-02-02', 'Vicepresidente Partido A'),
('90000003', '1980-03-03', 'Presidente Partido B'),
('90000004', '1985-04-04', 'Vicepresidente Partido B');

INSERT INTO PARTIDO (nombre, direccion, ci_presidente, ci_vicepresidente) VALUES
('Partido A', 'Calle 123, Montevideo', '90000001', '90000002'),
('Partido B', 'Avenida 456, Canelones', '90000003', '90000004');

-- Insertar listas
INSERT INTO LISTA (numero, nombre_partido) VALUES
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
