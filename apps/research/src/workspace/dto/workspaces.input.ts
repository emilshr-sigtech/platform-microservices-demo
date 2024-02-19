import { SortOrder } from '@common';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  Allow,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { WorkspaceSortableFields } from '../types/workspace-sortable-fields';

@ArgsType()
export class WorkspacesArgs {
  @Field(() => WorkspaceSortableFields)
  @IsEnum(WorkspaceSortableFields)
  @IsOptional()
  @IsString()
  readonly sort = 'name';

  @Field(() => SortOrder)
  @IsEnum(SortOrder)
  @IsOptional()
  @IsString()
  readonly order = 'asc';

  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly page = 0;

  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  readonly limit = 20;
}
