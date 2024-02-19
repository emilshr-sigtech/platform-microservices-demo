import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Workspace } from './models/workspace.model';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Query(() => Workspace)
  async workspace(@Args('id') id: string): Promise<Workspace> {
    const recipe = await this.workspaceService.findOneById(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    return recipe;
  }

  @Mutation(() => Workspace)
  async createWorkspace(
    @Args('createWorkspaceData') createWorkspaceData: CreateWorkspaceInput
  ): Promise<Workspace> {
    const recipe = await this.workspaceService.create(createWorkspaceData);
    return recipe;
  }

  @Mutation(() => Boolean)
  async removeWorkspace(@Args('id') id: string) {
    return this.workspaceService.remove(id);
  }
}
