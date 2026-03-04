# Calculation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**method** | [**CalculationMethod**](CalculationMethod.md) |  | [default to undefined]
**percentage** | **number** | Extracted numeric percentage rate (e.g., 2.1 from \&quot;2.1% to 9.9%\&quot;) | [optional] [default to undefined]
**rate_description** | **string** | Original complex rate description from agent when rate is variable or complex. Examples: \&quot;Experience-rated: 2.1% to 9.9%\&quot;, \&quot;0.055% for payroll &gt; $312,500\&quot;  | [optional] [default to undefined]
**flat_amount** | **number** |  | [optional] [default to undefined]
**period** | **string** |  | [optional] [default to undefined]
**brackets** | [**Array&lt;TaxBracket&gt;**](TaxBracket.md) |  | [optional] [default to undefined]
**external_reference** | [**CalculationExternalReference**](CalculationExternalReference.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Calculation } from './api';

const instance: Calculation = {
    method,
    percentage,
    rate_description,
    flat_amount,
    period,
    brackets,
    external_reference,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
