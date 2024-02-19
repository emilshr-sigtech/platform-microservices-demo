import { ValidationError } from '@nestjs/common';
import { Exception } from '../../custom-exception/customException';
import { ExceptionFactoryResponse } from './types';

/**
 * This is a factory function that transforms the way that ValidationErrors
 * are served to the client from the ValidationPipe. We hide some of the
 * validation requirements for each field to prevent ingenuine users gaining
 * visibility of the request schema for each endpoint.
 *
 * @param validationErrors - The validation errors from the ValidationPipe
 * @returns - A new Exception object with 400 status code
 */
export const GlobalExceptionFactory = (validationErrors: ValidationError[]) => {
  console.log(validationErrors);
  let returnObject: ExceptionFactoryResponse = {
    message: '',
    fields: []
  };

  /**
   * First check that the error is due to a field being present in the request
   * that is not permitted. To prevent unnecessary vulnerabilities being sent
   * in the request, we block undesirable fields via whitelist validation.
   */
  const whitelistErrors: ValidationError[] = validationErrors.filter(
    validationErrors => validationErrors?.constraints?.['whitelistValidation']
  );

  if (whitelistErrors.length > 0) {
    returnObject.message = 'One or more fields in the request are not permitted';
    returnObject.fields = whitelistErrors.map(error => error.property);
  } else {
    returnObject.message = 'One or more fields in the request are missing or invalid';
    returnObject.fields = validationErrors.map(error => error.property);
  }

  return new Exception(returnObject, 400);
};
