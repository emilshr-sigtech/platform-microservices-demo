import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Workspace } from '../models';
import { WorkspacesArgs } from '../dto/workspaces.input';

/**
 * @description - Get all workspaces that are either owned by,
 * or shared with the user
 *
 * @return { number } - Total number of workspaces for the user
 */

@Injectable()
export class CountWorkspacesMethod {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace
  ) {}

  public async execute(): Promise<number> {
    return await this.countWorkspaces();
  }

  private async countWorkspaces(): Promise<number> {
    const workspacesCount = await this.workspaceRepository.count({
      where: {
        [Op.or]: [
          // owner details should come from auth/guard service.
          // We should not pass the userId as an arg.
          { ownerId: 'd04453c8-7cab-4a51-b5ac-1a7df109ed3b' },
          // TODO - Add or is shared, not just owner
        ],
      },
    });

    return workspacesCount;
  }
}
