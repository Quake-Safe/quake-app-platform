import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiPaginatedResponseDto } from '../dtos/api-paginated-response-dto';

export const ApiOkPaginatedResponseCommon = <TDataDto extends Type<unknown>>(
  dataDto: TDataDto,
) => {
  return applyDecorators(
    ApiExtraModels(ApiPaginatedResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiPaginatedResponseDto) },
          {
            allOf: [
              {
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  },
                  meta: {
                    type: 'object',
                    properties: {
                      total: { type: 'number' },
                      lastPage: { type: 'number' },
                      currentPage: { type: 'number' },
                      perPage: { type: 'number' },
                      prev: { type: 'number', nullable: true },
                      next: { type: 'number', nullable: true },
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    }),
  );
};
