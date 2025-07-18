export const validationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // << this is crucial
    transformOptions: {
      enableImplicitConversion: true,
    }
}