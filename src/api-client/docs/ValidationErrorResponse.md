# ValidationErrorResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | **string** | General error message | [optional] [default to undefined]
**field_errors** | **{ [key: string]: Array&lt;string&gt;; }** | Field-specific validation errors | [optional] [default to undefined]
**non_field_errors** | **Array&lt;string&gt;** | General validation errors | [optional] [default to undefined]

## Example

```typescript
import { ValidationErrorResponse } from './api';

const instance: ValidationErrorResponse = {
    error,
    field_errors,
    non_field_errors,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
