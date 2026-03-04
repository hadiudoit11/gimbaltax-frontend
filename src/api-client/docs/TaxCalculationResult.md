# TaxCalculationResult


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tax_id** | **string** |  | [optional] [default to undefined]
**employee_liability** | **number** |  | [optional] [default to undefined]
**employer_liability** | **number** |  | [optional] [default to undefined]
**calculation_details** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**wage_base_used** | **number** |  | [optional] [default to undefined]
**warnings** | **Array&lt;string&gt;** |  | [optional] [default to undefined]

## Example

```typescript
import { TaxCalculationResult } from './api';

const instance: TaxCalculationResult = {
    tax_id,
    employee_liability,
    employer_liability,
    calculation_details,
    wage_base_used,
    warnings,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
