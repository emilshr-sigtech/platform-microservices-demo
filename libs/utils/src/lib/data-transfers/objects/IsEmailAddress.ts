import { IsEmail, IsString } from 'class-validator';
import { IsEmailOptions } from 'validator/lib/isEmail';

interface CustomEmailOptions {
  isSigtech?: boolean;
}

export const IsEmailAddress = (options: CustomEmailOptions): PropertyDecorator => {
  let emailOptions: IsEmailOptions = {};

  const { isSigtech } = options;
  if (isSigtech) emailOptions.host_whitelist = ['sigtech.com', 'sigtech.io'];

  return IsEmail(emailOptions);
};
