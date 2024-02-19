import { registerEnumType } from '@nestjs/graphql';

export enum WorkspaceSortableFields {
  NAME = 'name',
  DESCRIPTION = 'description',
  STATUS = 'status',
}

registerEnumType(WorkspaceSortableFields, {
  name: 'WorkspaceSortableFields',
});
