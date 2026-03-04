# TaxCalculationResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**results** | [**Array&lt;TaxCalculationResult&gt;**](TaxCalculationResult.md) |  | [optional] [default to undefined]
**total_employee_liability** | **number** |  | [optional] [default to undefined]
**total_employer_liability** | **number** |  | [optional] [default to undefined]
**calculated_at** | **string** |  | [optional] [default to undefined]
**jurisdiction_code** | **string** |  | [optional] [default to undefined]
**applicable_taxes_count** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { TaxCalculationResponse } from './api';

const instance: TaxCalculationResponse = {
    results,
    total_employee_liability,
    total_employer_liability,
    calculated_at,
    jurisdiction_code,
    applicable_taxes_count,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
