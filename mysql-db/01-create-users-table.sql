USE document_analyzer;

CREATE TABLE candidat (
   id_candidat INT AUTO_INCREMENT PRIMARY KEY,
   full_name VARCHAR(50) NOT NULL,   
   email VARCHAR(100) NOT NULL
);
