const swaggerAutogen = require("swagger-autogen")();
const dotenv = require("dotenv");
dotenv.config();

const { PORT, HOST, ENV_MODE } = process.env;

dotenv.config();
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/*.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "EDS API",
    description: "Equipment Distribution System API documentation",
  },
  host: "localhost:5000",
  basePath: "/api/v1/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "User",
      description: "Operations related to user management",
    },
    {
      name: "EmployeeLaptop",
      description:
        "Operations related to laptop/equipment distribution management",
    },
  ],
  securityDefinitions: {
    api_key: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  definitions: {
    purchased_tokens: {},
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
