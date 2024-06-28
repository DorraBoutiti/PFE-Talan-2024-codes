describe('FastAPI Endpoints', () => {
  it('Visits the root URL', () => {
    cy.visit('/');
    cy.contains('hello', 'world');
  });

  it('Converts an image to base64', () => {
    cy.fixture('test_image.jpg').then((fileContent) => {
      cy.request({
        method: 'POST',
        url: '/image-to-base64',
        body: fileContent,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('base64');
      });
    });
  });

  it('Detects file type', () => {
    cy.fixture('test_pdf.pdf').then((fileContent) => {
      cy.request({
        method: 'POST',
        url: '/detect-file-type',
        body: fileContent,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('file_type');
      });
    });
  });

  it('Converts a PDF to images', () => {
    cy.fixture('test_pdf.pdf').then((fileContent) => {
      cy.request({
        method: 'POST',
        url: '/pdf-to-images',
        body: fileContent,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('images');
      });
    });
  });

  it('Converts a DOCX to images', () => {
    cy.fixture('test_docx.docx').then((fileContent) => {
      cy.request({
        method: 'POST',
        url: '/docx-to-images',
        body: fileContent,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('images');
      });
    });
  });

  it('Converts a file to base64', () => {
    cy.fixture('test_image.jpg').then((fileContent) => {
      cy.request({
        method: 'POST',
        url: '/file-to-base64',
        body: fileContent,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('images');
      });
    });
  });
});
