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
      version: "2.5",
    },
  },
  apis: ["./**/*.yml"],
});

export default swaggerDocs;
