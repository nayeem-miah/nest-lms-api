import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = Number(process.env.PORT) || 5000;


  app.use(
    '/api/v1/payments/stripe/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  app.use(bodyParser.json());


  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      // 'https://your-frontend.vercel.app',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(PORT);

  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
//   process.exit(1);
// });

// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled Rejection:', error);
//   process.exit(1);
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT received, shutting down..');
//   process.exit(0);
// });


// deploy 
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
