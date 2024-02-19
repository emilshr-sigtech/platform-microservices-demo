import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import path = require('path');
import { CustomSequelizeModule } from './database/sequelize.config';

@Module({})
export class CustomWrapperModule {
  public static forRoot<T>(
    envValidationSchema?: Joi.ObjectSchema<T>
  ): DynamicModule {
    return {
      module: CustomWrapperModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: [path.join(__dirname, '../../..', '/**.*env')],
          isGlobal: true,
          validationSchema: envValidationSchema,
        }),
        CustomSequelizeModule,
      ],
      controllers: [],
      providers: [],
    };
  }
}
