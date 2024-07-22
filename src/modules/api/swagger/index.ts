import swaggerJSDoc from "swagger-jsdoc";

const SWAGGER_YML_PATH =
  process.env.NODE_ENV === "development"
    ? "src/modules/api/swagger/*.yml"
    : "build/modules/api/swagger/*.yml";

const swaggerDocs = swaggerJSDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "FruchtLabor TeamSpeak Api",
      contact: {
        name: 'Jondahl "Gamix" Rhenius',
        email: "jondahlrh@gmail.com",
      },
      version: "3.4.1",
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
  apis: [SWAGGER_YML_PATH],
});

export default swaggerDocs;
