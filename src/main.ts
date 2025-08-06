import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('NARA API')
    .setDescription(
      'La API del proyecto NARA ofrece herramientas para gestionar toda la operación logística de entrega de productos, independientemente de su tipo o destino. Esta plataforma proporciona a los administradores una trazabilidad precisa de cada pedido, asegurando la transparencia, eficiencia y control total del proceso logístico.'
    )
    .setVersion('1.0.0')
    .setTermsOfService('https://nara.example.com/terms')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Desarrollo Local')
    .addServer('https://api.nara.example.com', 'Servidor de Producción')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
