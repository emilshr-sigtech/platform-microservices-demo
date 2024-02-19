import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from '../models';

/**
 * @description - Get a specific workspace by its ID.
 * Retrieve a default subset of fields or receive
 * specific fields by passing in the fields query param.
 *
 * @returns { Workspace } - A workspace object
 */

@Injectable()
export class GetWorkspaceByIdMethod {
  private workspaceId: string;

  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace
  ) {}

  public async execute(workspaceId: string) {
    this.workspaceId = workspaceId;

    return await this.getWorkspaceById();
  }

  private async getWorkspaceById(): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: {
        id: this.workspaceId,
        ownerId: 'd04453c8-7cab-4a51-b5ac-1a7df109ed3b',
      },
    });

    return workspace;
  }
}
