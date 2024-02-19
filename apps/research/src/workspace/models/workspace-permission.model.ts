import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Workspace } from './workspace.model';
import { Field, ID } from '@nestjs/graphql';

export enum PermissionLevel {
  ADMIN = 'admin',
  VIEW = 'view',
  EDIT = 'edit',
}

@Table({
  underscored: true,
  modelName: 'WorkspacePermissions',
})
export class WorkspacePermission extends Model<
  InferAttributes<WorkspacePermission>,
  InferCreationAttributes<WorkspacePermission>
> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Field(() => ID)
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => Workspace)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare workspaceId: string;

  @BelongsTo(() => Workspace)
  declare workspace: NonAttribute<Workspace>;
  declare getWorkspace: BelongsToGetAssociationMixin<Workspace>;

  @Column({
    type: DataType.ENUM<PermissionLevel>,
    values: Object.values(PermissionLevel),
  })
  declare permissionLevel: PermissionLevel;
}
