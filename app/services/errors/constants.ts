// Add your custom app related error codes here. A recommended format
// for error codes is as follows:
//
// `ErrorCode.ScopedAreaOfCode.ErrorName = ErrorCodeAsNumber`
//
// This method enables you to scope errors to specific areas of
// the app and provide a custom error code that can be shown
// to users and/or in your server debug logs.
export const ErrorCode = {
  Auth: {
    SignatureNotProvided: 1020,
    InvalidSignature: 1021,
    ExpiredPasswordChangeRequest: 1022,
    UsedPasswordChangeRequest: 1023,
  },
} as const;
