import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Workspace } from '../models';
import { WorkspacesArgs } from '../dto/workspaces.input';

/**
 * @description - Get all workspaces that are either owned by,
 * or shared with the user
 *
 * @return { Workspace[] } - A list of paginated workspaces for the user
 */

@Injectable()
export class GetWorkspacesMethod {
  private params: WorkspacesArgs;

  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace
  ) {}

  public async execute(params: WorkspacesArgs): Promise<Workspace[]> {
    this.params = params;

    return await this.getWorkspaces();
  }

  private async getWorkspaces(): Promise<Workspace[]> {
    const offset = this.params.page * this.params.limit;

    const workspaces = await this.workspaceRepository.findAll({
      where: {
        [Op.or]: [
          // owner details should come from auth service.
          // We should not pass the userId as an arg.
          { ownerId: 'd04453c8-7cab-4a51-b5ac-1a7df109ed3b' },
          // TODO - Add or is shared, not just owner
        ],
      },
      limit: this.params.limit,
      offset,
      order: [[this.params.sort, this.params.order]],
    });

    return workspaces;
  }
}
