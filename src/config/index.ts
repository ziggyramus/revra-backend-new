// src/config/index.ts

interface Config {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  paystackSecretKey: string;
  allowedOrigins: string[];
  corsEnabled: boolean;
  logLevel: string;
  requestTimeout: number;
}

const config: Config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI || "",
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || "",
  allowedOrigins: process.env.CORS_ORIGINS?.split(",").map(o => o.trim()) || [],
  corsEnabled: process.env.CORS_ENABLED !== "false",
  logLevel: process.env.LOG_LEVEL || "info",
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || "30000", 10),
};

// Validate critical configs
const validateConfig = (): void => {
  if (!config.mongodbUri) {
    throw new Error("MONGODB_URI is required");
  }
  if (!config.paystackSecretKey && config.nodeEnv === "production") {
    throw new Error("PAYSTACK_SECRET_KEY is required in production");
  }
  if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}`);
  }
};

validateConfig();

export default config;