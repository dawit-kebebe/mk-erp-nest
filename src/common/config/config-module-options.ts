import { ConfigModuleOptions } from "@nestjs/config";
import { z as zod } from "zod";

export const configModuleOptions: ConfigModuleOptions<Record<string, any>> = {
    isGlobal: true,
    validate: (envVar) => zod.object({
        // Database Configuration
        DB_DBMS: zod.enum(['mysql', 'postgres', 'sqlite', 'mongodb', 'mssql', 'mariadb', 'cockroachdb', 'sap']), // Add other DBMS options as needed
        DB_HOST: zod.string().min(1, 'DB_HOST is required'),
        DB_PORT: zod.preprocess(
            (val) => parseInt(zod.string().parse(val), 10),
            zod.number().min(0).max(65535).default(3306)
        ),
        DB_USERNAME: zod.string().min(1, 'DB_USERNAME is required'),
        DB_PASSWORD: zod.string().optional().default(''), // Can be an empty string
        DB_DATABASE: zod.string().min(1, 'DB_DATABASE is required'),
        DB_SYNCHRONIZE: zod.preprocess(
            (val) => String(val).toLowerCase() === 'true', // Convert 'true'/'false' string to boolean
            zod.boolean().default(false)
        ),

        // Advanced Aurora Cloud Setup (Optional fields)
        DB_REGION: zod.string().optional(),
        DB_SECRET_ARN: zod.string().optional(),
        DB_RESOURCE_ARN: zod.string().optional(),

        // JWT Configuration
        JWT_SECRET: zod.string().min(32, 'JWT_SECRET must be at least 32 characters (or base64 32bit string)'), // Enforce min length for secret
        JWT_EXPIRES_IN: zod.preprocess(
            (val) => parseInt(zod.string().parse(val), 10),
            zod.number().positive('JWT_EXPIRES_IN must be a positive number').default(3600)
        ),

        // Root Tenant Configuration
        ROOT_TENANT: zod.string()
            .uuid("ROOT_TENANT is required and must be a valid UUID.")
            .default('f1c59dda-1957-42f3-b80a-0848dbc2050f'),

        //Super Admin Configuration
        SUPER_ADMIN_EMAIL: zod.string()
            .email("SUPER_ADMIN_EMAIL is required and must be a valid email address."),
        SUPER_ADMIN_PASSWORD: zod.string()
            .min(6, 'SUPER_ADMIN_PASSWORD is required and must be at least 6 characters.')
            .regex(/^[a-zA-Z0-9]+$/, 'SUPER_ADMIN_PASSWORD must be alphanumeric.'),

        // Application Port
        PORT: zod.preprocess(
            (val) => parseInt(zod.string().parse(val), 10),
            zod.number().min(0).max(65535).default(3000)
        ),

        // CORS Allowed Origins
        ALLOWED_ORIGINS: zod.string()
            .default('http://localhost:3000') // Default value as a string
            .transform((str) => str.split(',').map(s => s.trim())) // Convert comma-separated string to array of strings
            .pipe(zod.array(zod.string().url('Invalid URL in ALLOWED_ORIGINS')).min(1, 'ALLOWED_ORIGINS cannot be empty')), // Ensure it's an array of valid URLs
    }).parse(envVar)
}