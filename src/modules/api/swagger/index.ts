import swaggerJSDoc from "swagger-jsdoc";

const swaggerDocs = swaggerJSDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "FruchtLabor TeamSpeak Api",
      contact: {
        name: 'Jondahl "Gamix" Rhenius',
        email: "jondahlrh@gmail.com",
      },
      version: "3.2.2",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./**/*.yml"],
});

export default swaggerDocs;
