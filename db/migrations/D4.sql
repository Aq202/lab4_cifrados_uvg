-- Eliminar la restricción UNIQUE anterior sobre file_name
ALTER TABLE files DROP CONSTRAINT unique_file_name;

-- Agregar nueva restricción UNIQUE compuesta
ALTER TABLE files ADD CONSTRAINT unique_user_file_name UNIQUE (file_name, user_id);

-- Agregar clave foránea
ALTER TABLE files ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id) REFERENCES user(id);

-- Modificar tipo de content
ALTER TABLE files
MODIFY COLUMN content LONGTEXT NOT NULL;