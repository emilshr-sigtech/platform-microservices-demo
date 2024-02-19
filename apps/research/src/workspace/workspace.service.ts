import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from './models/workspace.model';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { WorkspacesArgs } from './dto/workspaces.input';
import { Op } from 'sequelize';
import { GetWorkspacesMethod } from './methods/get-workspaces.method';
import { CountWorkspacesMethod } from './methods/count-workspaces.method';
import { GetWorkspaceByIdMethod } from './methods/get-workspace-by-id.method';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace)
    private readonly getWorkspacesMethod: GetWorkspacesMethod,
    private readonly countWorkspacesMethod: CountWorkspacesMethod,
    private readonly getWorkspaceByIdMethod: GetWorkspaceByIdMethod
  ) {}

  async create(data: CreateWorkspaceInput): Promise<Workspace> {
    return {} as any;
  }

  async count(): Promise<number> {
    return this.countWorkspacesMethod.execute();
  }

  async getAll(workspacesArgs: WorkspacesArgs): Promise<Workspace[]> {
    return this.getWorkspacesMethod.execute(workspacesArgs);
  }

  async getById(workspaceId: string): Promise<Workspace> {
    return this.getWorkspaceByIdMethod.execute(workspaceId);
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}
