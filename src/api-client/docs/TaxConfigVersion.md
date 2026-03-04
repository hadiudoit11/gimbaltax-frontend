# TaxConfigVersion


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**version_number** | **number** |  | [optional] [default to undefined]
**payload_snapshot** | [**TaxPayload**](TaxPayload.md) |  | [optional] [default to undefined]
**change_reason** | **string** |  | [optional] [default to undefined]
**created_by** | [**User**](User.md) |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { TaxConfigVersion } from './api';

const instance: TaxConfigVersion = {
    id,
    version_number,
    payload_snapshot,
    change_reason,
    created_by,
    created_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
