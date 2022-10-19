import { Secret } from "jsonwebtoken";

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        SECRET_JWT: Secret | undefined
        PORT: Number;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}