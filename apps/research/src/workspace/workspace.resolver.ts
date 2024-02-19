import { Workspace } from './models/workspace.model';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceInput } from './dto/create-workspace.input';
import { NotFoundException } from '@nestjs/common';
import { WorkspacesArgs } from './dto/workspaces.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Query(() => Workspace)
  async workspace(@Args('id') id: string): Promise<Workspace> {
    return this.workspaceService.getById(id);
  }

  @Query(() => Number, { name: 'workspaceCount' })
  async count(): Promise<number> {
    const workspacesCount = await this.workspaceService.count();
    return workspacesCount;
  }

  @Query(() => [Workspace])
  async workspaces(
    @Args() workspacesArgs: WorkspacesArgs
  ): Promise<Workspace[]> {
    return this.workspaceService.getAll(workspacesArgs);
  }

  @Mutation(() => Workspace)
  async createWorkspace(
    @Args('createWorkspaceInput') createWorkspaceData: CreateWorkspaceInput
  ): Promise<Workspace> {
    return this.workspaceService.create(createWorkspaceData);
  }

  @Mutation(() => Boolean)
  async removeWorkspace(@Args('id') workspaceId: string) {
    return this.workspaceService.remove(workspaceId);
  }
}
