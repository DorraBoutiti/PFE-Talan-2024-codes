USE document_analyzer;

-- Table for storing extracted information from documents
CREATE TABLE information_extraites (
   id INT AUTO_INCREMENT PRIMARY KEY,
   id_document INT,
   nomChamp VARCHAR(100) NOT NULL,
   valeur VARCHAR(255) NOT NULL,
   FOREIGN KEY (id_document) REFERENCES document(id)
);
