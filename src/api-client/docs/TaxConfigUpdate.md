# TaxConfigUpdate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [optional] [default to undefined]
**category** | [**TaxCategory**](TaxCategory.md) |  | [optional] [default to undefined]
**sub_category** | **string** |  | [optional] [default to undefined]
**authority** | **string** |  | [optional] [default to undefined]
**effective_to** | **string** |  | [optional] [default to undefined]
**status** | [**TaxConfigStatus**](TaxConfigStatus.md) |  | [optional] [default to undefined]
**payload** | [**TaxPayload**](TaxPayload.md) |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { TaxConfigUpdate } from './api';

const instance: TaxConfigUpdate = {
    name,
    category,
    sub_category,
    authority,
    effective_to,
    status,
    payload,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
