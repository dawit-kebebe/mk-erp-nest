import { ForbiddenException, HttpException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export const corsOptions = (configService: ConfigService) => {

    const allowedOrigins = configService.get<Array<string>>('ALLOWED_ORIGINS') //process.env.ALLOWED_ORIGINS?.split(',') || [];

    return {
        origin: (
            origin: string | undefined,
            callback: (p1: HttpException | null, p2?: boolean) => void,
        ) => {
            if (!origin || allowedOrigins?.find(or => or === origin) !== undefined) {
                callback(null, true);
            } else {
                callback(new ForbiddenException('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }
}