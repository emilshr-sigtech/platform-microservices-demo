import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length } from 'class-validator';

@InputType()
export class CreateWorkspaceInput {
  @Field({ nullable: true })
  @IsOptional()
  @Length(30, 255)
  description?: string;
}
