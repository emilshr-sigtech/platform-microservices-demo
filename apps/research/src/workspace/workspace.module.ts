import { Module } from '@nestjs/common';
import { WorkspaceResolver } from './workspace.resolver';
import { WorkspaceService } from './workspace.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Workspace } from './models/workspace.model';

@Module({
  imports: [SequelizeModule.forFeature([Workspace])],
  providers: [WorkspaceResolver, WorkspaceService],
})
export class WorkspaceModule {}
