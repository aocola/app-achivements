// response.dto.ts
import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T> {
  constructor(
    public readonly status: boolean,
    public readonly message: string,
    public readonly data?: T,
    public readonly error?: string,
    public readonly httpStatus: number = HttpStatus.OK,
  ) {}

  static success<T>(data: T, message: string = 'Operation successful', httpStatus: number = HttpStatus.OK): ResponseDto<T> {
    return new ResponseDto<T>(true, message, data, undefined, httpStatus);
  }

  static error<T>(error: string, message: string = 'Operation failed', httpStatus: number = HttpStatus.BAD_REQUEST): ResponseDto<T> {
    return new ResponseDto<T>(false, message, undefined, error, httpStatus);
  }
}