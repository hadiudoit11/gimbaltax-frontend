# PayloadValidationResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**is_valid** | **boolean** |  | [optional] [default to undefined]
**errors** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**warnings** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**suggested_fixes** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**detected_schema_version** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { PayloadValidationResponse } from './api';

const instance: PayloadValidationResponse = {
    is_valid,
    errors,
    warnings,
    suggested_fixes,
    detected_schema_version,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
