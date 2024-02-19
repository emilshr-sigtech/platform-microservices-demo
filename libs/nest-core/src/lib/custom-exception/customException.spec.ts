import { Exception } from '@nest-core';
import { HttpException } from '@nestjs/common';

describe('Test the CustomException class', () => {
  it('Should be an instance of HttpException', () => {
    expect(new Exception('Test', 400)).toBeInstanceOf(HttpException);
  });

  it('Should throw an error', () => {
    expect(() => {
      throw new Exception('Test', 200);
    }).toThrow();
  });

  // TODO - Add testing for alerting when functionality developed
});
