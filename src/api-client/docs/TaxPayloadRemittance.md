# TaxPayloadRemittance

Filing and remittance requirements

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**form_name** | **string** | Official form name or number for filing | [optional] [default to undefined]
**filing_frequency** | **string** | Normalized filing frequency. Complex descriptions are simplified to: - quarterly: Most common, includes \&quot;Quarterly (&lt; $300 per quarter)...\&quot;  - monthly: Regular monthly filing - weekly: Weekly filing requirements - annually: Annual filing - as_needed: Variable or conditional filing  | [optional] [default to undefined]

## Example

```typescript
import { TaxPayloadRemittance } from './api';

const instance: TaxPayloadRemittance = {
    form_name,
    filing_frequency,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
