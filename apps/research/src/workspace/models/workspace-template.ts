import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  underscored: true,
  modelName: 'WorkspaceTemplate',
})
export class WorkspaceTemplate extends Model<
  InferAttributes<WorkspaceTemplate>,
  InferCreationAttributes<WorkspaceTemplate>
> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING,
  })
  declare description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
  declare fileList: string[];

  @Column({
    type: DataType.STRING,
  })
  declare filesS3Bucket: string;

  @Column({
    type: DataType.STRING,
  })
  declare filesS3Path: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;
}
