import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://localhost:27017/site_equipment_ledger'),
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger('Database');

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      await this.connection.asPromise();
      this.logger.log('MongoDB connected successfully');
    } catch (error) {
      const err = error as Error;
      this.logger.error(`MongoDB connection failed: ${err.message}`);
    }
  }
}
