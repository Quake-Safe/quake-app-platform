import { Type, applyDecorators } from '@nestjs/common';
import { ApiResponseDto } from '../dtos/api-response-dto';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkResponseCommon = <TDataDto extends Type<unknown>>(
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
                $ref: getSchemaPath(dataDto),
              },
            },
          },
        ],
      },
    }),
  );
};
