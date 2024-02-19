import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DirectiveLocation, GraphQLDirective } from 'graphql';

import { WorkspaceModule } from './workspace/workspace.module';
import { CustomWrapperModule } from './utils/custom-wrapper.module';
import { envValidation } from './utils/validation/env.validation';

@Module({
  imports: [
    CustomWrapperModule.forRoot(envValidation),
    WorkspaceModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
  ],
})
export class AppModule {}
