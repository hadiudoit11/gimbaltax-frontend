# TaxConfigCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tax_id** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**category** | [**TaxCategory**](TaxCategory.md) |  | [default to undefined]
**sub_category** | **string** |  | [optional] [default to undefined]
**authority** | **string** |  | [optional] [default to undefined]
**jurisdiction** | **string** | Jurisdiction ID | [default to undefined]
**effective_from** | **string** |  | [default to undefined]
**effective_to** | **string** |  | [optional] [default to undefined]
**status** | [**TaxConfigStatus**](TaxConfigStatus.md) |  | [optional] [default to undefined]
**payload** | [**TaxPayload**](TaxPayload.md) |  | [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { TaxConfigCreate } from './api';

const instance: TaxConfigCreate = {
    tax_id,
    name,
    category,
    sub_category,
    authority,
    jurisdiction,
    effective_from,
    effective_to,
    status,
    payload,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
