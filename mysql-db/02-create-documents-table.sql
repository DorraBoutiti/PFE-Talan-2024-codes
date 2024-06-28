USE document_analyzer;

CREATE TABLE document (
   id INT AUTO_INCREMENT PRIMARY KEY,
   nom VARCHAR(100) NOT NULL,
   type VARCHAR(100) NOT NULL,
   dateTelechargement DATETIME NOT NULL,
   file LONGBLOB NOT NULL,
   status VARCHAR(100) NOT NULL,
   id_candidat INT,
   FOREIGN KEY (id_candidat) REFERENCES candidat(id_candidat)
);