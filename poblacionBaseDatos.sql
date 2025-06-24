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

INSERT INTO CANDIDATO (ci) VALUES
(90000001),
(90000002),
(90000003),
(90000004);

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

-- Insertar datos en la tabla ZONA
INSERT INTO ZONA (ID, MUNICIPIO, CIUDAD, DEPARTAMENTO, PARAJE) VALUES
(1, 'A', 'Montevideo', 'Montevideo', 'Centro'),
(2, 'Atlantida', 'Las Piedras', 'Canelones', 'Barrio Sur'),
(3, 'Pan de Azúcar', 'Punta del Este', 'Maldonado', 'La Barra'),
(4, 'Nueva Helvecia', 'Colonia del Sacramento', 'Colonia', 'Barrio Histórico');

INSERT INTO ESTABLECIMIENTO (ID, ID_ZONA, DIRECCION, TIPO) VALUES
-- Establecimientos en Montevideo (ID_ZONA = 1)
(1, 1, 'Av. 18 de Julio 1968', 'Liceo'),
(2, 1, 'Av. Libertador 1550', 'Universidad'),
(3, 1, 'Bulevar Artigas 1239', 'Escuela'),

-- Establecimientos en Canelones - Las Piedras (ID_ZONA = 2)
(4, 2, 'Calle Artigas 456', 'Liceo'),
(5, 2, 'Av. Batlle y Ordóñez 123', 'Escuela'),

-- Establecimientos en Maldonado - Punta del Este (ID_ZONA = 3)
(6, 3, 'Calle 20 esq. 19', 'Instituto'),
(7, 3, 'Rambla de los Argentinos 234', 'Liceo'),

-- Establecimientos en Colonia del Sacramento (ID_ZONA = 4)
(8, 4, 'Calle del Comercio 567', 'Escuela'),
(9, 4, 'Plaza Mayor 89', 'Instituto'),
(10, 4, 'Av. General Flores 321', 'Universidad');

INSERT INTO CIRCUITO (NUM_CIRCUITO, ID_ESTABLECIMIENTO) VALUES
-- Circuitos en establecimientos de Montevideo
(101, 1),  -- Circuito 101 en Liceo de Av. 18 de Julio
(102, 1),  -- Circuito 102 en el mismo Liceo
(103, 1),  -- Circuito 103 en el mismo Liceo (3 circuitos en total)
(104, 2),  -- Circuito 104 en Universidad de Av. Libertador
(105, 2),  -- Circuito 105 en la misma Universidad
(106, 3),  -- Circuito 106 en Escuela de Bulevar Artigas

-- Circuitos en establecimientos de Canelones
(201, 4),  -- Circuito 201 en Liceo de Las Piedras
(202, 4),  -- Circuito 202 en el mismo Liceo
(203, 5),  -- Circuito 203 en Escuela de Las Piedras
(204, 5),  -- Circuito 204 en la misma Escuela

-- Circuitos en establecimientos de Maldonado
(301, 6),  -- Circuito 301 en Instituto de Punta del Este
(302, 6),  -- Circuito 302 en el mismo Instituto
(303, 7),  -- Circuito 303 en Liceo de Punta del Este

-- Circuitos en establecimientos de Colonia
(401, 8),  -- Circuito 401 en Escuela de Colonia
(402, 9),  -- Circuito 402 en Instituto de Colonia
(403, 9),  -- Circuito 403 en el mismo Instituto
(404, 10), -- Circuito 404 en Universidad de Colonia
(405, 10); -- Circuito 405 en la misma Universidad

INSERT INTO ELECCION (ID_ELECCION, FECHA_REALIZACION, TIPO_ELECCION) VALUES
-- Elecciones Nacionales
(1, DATE('2024-10-27'), 'Elecciones Nacionales'),
(2, DATE('2019-10-27'), 'Elecciones Nacionales'),
(3, DATE('2014-10-26'), 'Elecciones Nacionales'),

-- Elecciones Departamentales
(4, DATE('2025-05-11'), 'Elecciones Departamentales'),
(5, DATE('2020-05-10'), 'Elecciones Departamentales'),
(6, DATE('2015-05-10'), 'Elecciones Departamentales'),

-- Elecciones Internas
(7, DATE('2024-06-30'), 'Elecciones Internas'),
(8, DATE('2019-06-30'), 'Elecciones Internas'),
(9, DATE('2018-04-29'), 'Elecciones Internas'),

-- Plebiscitos
(10, DATE('2022-03-27'), 'Plebiscito'),
(11, DATE('2019-10-27'), 'Plebiscito'),
(12, DATE('2014-10-26'), 'Plebiscito'),

-- Referéndums
(13, DATE('2023-10-15'), 'Referendum'),
(14, DATE('2009-12-13'), 'Referendum');

INSERT INTO PERTENECE_A_LISTA (CI_CANDIDATO, NUMERO_LISTA, ORGANO_DEL_ESTADO,ORDEN_EN_LA_LISTA) VALUES
(90000001, 1001, 'poder ejecutivo', 1),
(90000002, 1002, 'poder ejecutivo', 1),
(90000003, 2001, 'poder ejecutivo', 1),
(90000004, 2002, 'poder ejecutivo', 1);


INSERT INTO TRABAJA_EN_ELECCION (CI_FUNCIONARIO, ID_ELECCION)
SELECT
    11111111 AS CI_FUNCIONARIO,
    E.ID_ELECCION
FROM ELECCION E
WHERE E.TIPO_ELECCION IN (
    'Elecciones Nacionales',
    'Elecciones Departamentales',
    'Elecciones Internas',
    'Plebiscito',
    'Referendum'
);

INSERT INTO VOTO (NUMERO_VOTO, FECHA, HORA, CONDICION, ESOBSERVADO, ID_ELECCION, NUM_CIRCUITO, NUMERO_LISTA)
VALUES
-- Elección Nacional 2024-10-27 (ID_ELECCION = 1)
(1, '2024-10-27', '08:30:00', 'VALIDO', FALSE, 1, 101, 1001),
(2, '2024-10-27', '08:45:00', 'VALIDO', FALSE, 1, 101, 1002),
(3, '2024-10-27', '09:15:00', 'VALIDO', FALSE, 1, 102, 2001),
(4, '2024-10-27', '09:30:00', 'VALIDO', TRUE, 1, 102, 1001),
(5, '2024-10-27', '10:00:00', 'VALIDO', FALSE, 1, 103, 2002),
(6, '2024-10-27', '10:15:00', 'ANULADO', FALSE, 1, 103, NULL),
(7, '2024-10-27', '10:45:00', 'VALIDO', FALSE, 1, 104, 1001),
(8, '2024-10-27', '11:00:00', 'VALIDO', FALSE, 1, 104, 2001),

-- Elección Nacional 2019-10-27 (ID_ELECCION = 2)
(9, '2019-10-27', '08:00:00', 'VALIDO', FALSE, 2, 201, 1002),
(10, '2019-10-27', '08:30:00', 'VALIDO', FALSE, 2, 201, 1001),
(11, '2019-10-27', '09:00:00', 'VALIDO', FALSE, 2, 202, 2002),
(12, '2019-10-27', '09:30:00', 'VALIDO', TRUE, 2, 202, 1001),
(13, '2019-10-27', '10:00:00', 'VALIDO', FALSE, 2, 203, 2001),

-- Elección Departamental 2025-05-11 (ID_ELECCION = 4)
(14, '2025-05-11', '09:00:00', 'VALIDO', FALSE, 4, 301, 1001),
(15, '2025-05-11', '09:15:00', 'VALIDO', FALSE, 4, 301, 1002),
(16, '2025-05-11', '09:45:00', 'VALIDO', FALSE, 4, 302, 2001),
(17, '2025-05-11', '10:00:00', 'ANULADO', FALSE, 4, 302, NULL),
(18, '2025-05-11', '10:30:00', 'VALIDO', FALSE, 4, 303, 2002),

-- Elección Interna 2024-06-30 (ID_ELECCION = 7)
(19, '2024-06-30', '08:30:00', 'VALIDO', FALSE, 7, 401, 1001),
(20, '2024-06-30', '08:45:00', 'VALIDO', FALSE, 7, 401, 1002),
(21, '2024-06-30', '09:15:00', 'VALIDO', TRUE, 7, 402, 2001),
(22, '2024-06-30', '09:30:00', 'VALIDO', FALSE, 7, 402, 2002),

-- Plebiscito 2022-03-27 (ID_ELECCION = 10)
(23, '2022-03-27', '10:00:00', 'VALIDO', FALSE, 10, 105, 1001),
(24, '2022-03-27', '10:15:00', 'VALIDO', FALSE, 10, 105, 1002),
(25, '2022-03-27', '10:45:00', 'VALIDO', FALSE, 10, 106, 2001),
(26, '2022-03-27', '11:00:00', 'ANULADO', FALSE, 10, 106, NULL),

-- Referéndum 2023-10-15 (ID_ELECCION = 13)
(27, '2023-10-15', '08:00:00', 'VALIDO', FALSE, 13, 204, 1001),
(28, '2023-10-15', '08:30:00', 'VALIDO', TRUE, 13, 204, 1002),
(29, '2023-10-15', '09:00:00', 'VALIDO', FALSE, 13, 204, 2001),
(30, '2023-10-15', '09:30:00', 'VALIDO', FALSE, 13, 204, 2002);