import jwt, { Secret } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_JWT: Secret,
      PORT: Number,
      CLOUDINARY_SECRET: string,
      CLOUDINARY_API: string,
      CLOUDNAME: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }