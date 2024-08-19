import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCoverImage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.cover_image || null;
  },
);
