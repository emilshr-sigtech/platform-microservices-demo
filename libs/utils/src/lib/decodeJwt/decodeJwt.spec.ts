import { decodeJwt } from './decodeJwt';

describe('Decode a JWT token and return user object', () => {
  it('should return a user object', async () => {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJmaXJzdE5hbWUiOiJFbGxpb3QiLCJsYXN0TmFtZSI6IkJhcnJvcyIsImVtYWlsQWRkcmVzcyI6ImVsbGlvdC5nbmVjY29Ac2lndGVjaC5jb20iLCJvcmdhbmlzYXRpb24iOiJTaWd0ZWNoIiwiaWF0IjoxNzAxODc5MTgzfQ.u3KN8z1ib3rhrA_dG3Lv6HwC96vWNoKJV2yaxNcfOvw';

    const expectedResult = {
      iat: 1701879183,
      id: '1234567890',
      firstName: 'Elliot',
      lastName: 'Barros',
      emailAddress: 'elliot.gnecco@sigtech.com',
      organisation: 'Sigtech'
    };

    expect(await decodeJwt(accessToken)).toEqual(expectedResult);
  });

  it('should return an invalid error as part of the decoded object is missing', async () => {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJmaXJzdE5hbWUiOiJFbGxpb3QiLCJsYXN0TmFtZSI6IkJhcnJvcyIsImVtYWlsQWRkcmVzcyI6ImVsbGlvdC5nbmVjY29Ac2lndGVjaC5jb20iLCJpYXQiOjE3MDE4ODA3ODF9.vEIs5TMDLTgDSfYcooHAT4LswaFTTsqStvvBeBcIwr0';

    expect(await decodeJwt(accessToken).catch(err => err)).toBe('Access token provided is invalid');
  });

  it('should return an invalid error as the token is expired', async () => {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJFbGxpb3QiLCJsYXN0TmFtZSI6IkJhcnJvcyIsImVtYWlsQWRkcmVzcyI6ImVsbGlvdC5nbmVjY29Ac2lndGVjaC5jb20iLCJvcmdhbmlzYXRpb24iOiJTaWd0ZWNoIiwiaWF0IjoxNzAxODc5MDYyLCJleHAiOjE3MDE4NzkwNjN9.3zJ4YlX8OrKwXwz6DIdTEZyQK8cNiTI-L0hxMuSIoac';

    expect(await decodeJwt(accessToken).catch(err => err)).toBe('Access token provided is expired');
  });

  it('should return an invalid error as the token is invalid', async () => {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJmaXJzdE5hbWUiOiJFbGxpb3QiLCJsYXN0TmFtZSI6IkJhcnJvcyIsImVtYWlsQWRkcmVzcyI6ImVsbGlvdC5nbmVjY29Ac2lndGVjaC5jb20iLCJvcmdhbmlzYXRpb24iOiJTaWd0ZWNoIiwiaWF0IjoxNzAxODgwODUwfQ.oeS2AWhjKAakR1FTxR6TdAb_RdLMzuVCqPvJjJ6i4Sc';

    expect(await decodeJwt(accessToken).catch(err => err)).toBe('Access token provided is invalid');
  });

  it('should return an invalid error as the token is not a JWT', async () => {
    const accessToken = 'Thisisnotajwttoken';

    expect(await decodeJwt(accessToken).catch(err => err)).toBe('Access token provided is invalid');
  });
});
