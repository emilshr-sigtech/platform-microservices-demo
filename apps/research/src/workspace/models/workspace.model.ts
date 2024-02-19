import {
  CreationOptional,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';

import { WorkspacePermission } from './workspace-permission.model';

@Table({
  underscored: true,
  modelName: 'Workspaces',
})
@ObjectType({ description: 'Workspace' })
export class Workspace extends Model<
  InferAttributes<Workspace>,
  InferCreationAttributes<Workspace>
> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  @Field((type) => ID)
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING,
  })
  @Field({ nullable: false })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Field({ nullable: false })
  declare name: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Field({ nullable: false })
  declare originalTemplate: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Field({ nullable: false })
  declare giteaRepositoryUrl: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Field({ nullable: false })
  declare ownerId: string;

  @HasMany(() => WorkspacePermission)
  declare permissions: NonAttribute<WorkspacePermission[]>;
  declare getPermissions: HasManyGetAssociationsMixin<WorkspacePermission>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Field({ nullable: false })
  declare status: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Field({ nullable: false })
  declare createdBy: string;
}
