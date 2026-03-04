# TaxPayload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tax_id** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**category** | [**TaxCategory**](TaxCategory.md) |  | [default to undefined]
**sub_category** | **string** |  | [optional] [default to undefined]
**authority** | **string** |  | [optional] [default to undefined]
**jurisdiction** | [**TaxPayloadJurisdiction**](TaxPayloadJurisdiction.md) |  | [default to undefined]
**collected_from** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**remitted_by** | **string** |  | [optional] [default to RemittedByEnum_Employer]
**wage_base** | [**WageBase**](WageBase.md) |  | [optional] [default to undefined]
**calculation** | [**Calculation**](Calculation.md) |  | [default to undefined]
**remittance** | [**TaxPayloadRemittance**](TaxPayloadRemittance.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TaxPayload } from './api';

const instance: TaxPayload = {
    tax_id,
    name,
    category,
    sub_category,
    authority,
    jurisdiction,
    collected_from,
    remitted_by,
    wage_base,
    calculation,
    remittance,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
