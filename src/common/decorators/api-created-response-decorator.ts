import { Type, applyDecorators } from '@nestjs/common';
import { ApiResponseDto } from '../dtos/api-response-dto';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiCreatedResponseCommon = <TDataDto extends Type<unknown>>(
  dataDto: TDataDto,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataDto),
    ApiCreatedResponse({
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
