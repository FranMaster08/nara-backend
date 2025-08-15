import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TraceIdInterceptor } from './shared/interceptors/trace-id.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (por si usas Swagger desde otro origen o proxy)
  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new TraceIdInterceptor());

  // --- Swagger ---
  const config = new DocumentBuilder()
    .setTitle('NARA API')
    .setDescription('...')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Desarrollo Local')
    .addServer('https://api.nara.example.com', 'Servidor de Producción')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'bearer', // 👈 mismo nombre que @ApiBearerAuth('bearer')
    )
    .addSecurityRequirements('bearer') // 👈 aplica por defecto a todos
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // recuerda el token
    },
  });
  // 👈 Elimina la SEGUNDA llamada a setup; dejaba la UI sin options

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();