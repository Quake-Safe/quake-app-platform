import { Type, applyDecorators } from '@nestjs/common';
import { ApiResponseDto } from '../dtos/api-response-dto';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkArrayResponseCommon = <TDataDto extends Type<unknown>>(
  dataDto: TDataDto,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
};
