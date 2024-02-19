import { Injectable } from '@nestjs/common';
import { Workspace } from './models/workspace.model';
import { CreateWorkspaceInput } from './dto/create-workspace.input';

@Injectable()
export class WorkspaceService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create(data: CreateWorkspaceInput): Promise<Workspace> {
    return {} as any;
  }

  async findOneById(id: string): Promise<Workspace> {
    return {} as any;
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}
