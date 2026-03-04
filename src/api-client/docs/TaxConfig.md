# TaxConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**id** | **string** |  | [optional] [default to undefined]
**tax_id** | **string** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**category** | [**TaxCategory**](TaxCategory.md) |  | [optional] [default to undefined]
**sub_category** | **string** |  | [optional] [default to undefined]
**authority** | **string** |  | [optional] [default to undefined]
**jurisdiction** | [**Jurisdiction**](Jurisdiction.md) |  | [optional] [default to undefined]
**effective_from** | **string** |  | [optional] [default to undefined]
**effective_to** | **string** |  | [optional] [default to undefined]
**status** | [**TaxConfigStatus**](TaxConfigStatus.md) |  | [optional] [default to undefined]
**schema_version** | **number** |  | [optional] [default to undefined]
**payload** | [**TaxPayload**](TaxPayload.md) |  | [optional] [default to undefined]
**created_by** | [**User**](User.md) |  | [optional] [default to undefined]
**updated_by** | [**User**](User.md) |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { TaxConfig } from './api';

const instance: TaxConfig = {
    created_at,
    updated_at,
    id,
    tax_id,
    name,
    category,
    sub_category,
    authority,
    jurisdiction,
    effective_from,
    effective_to,
    status,
    schema_version,
    payload,
    created_by,
    updated_by,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
