# TaxCalculationRequestEmployeeData


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**employee_id** | **string** |  | [optional] [default to undefined]
**wages** | **number** | Current period wages | [default to undefined]
**ytd_wages** | [**TaxCalculationRequestEmployeeDataYtdWages**](TaxCalculationRequestEmployeeDataYtdWages.md) |  | [optional] [default to undefined]
**resident_state** | **string** |  | [optional] [default to undefined]
**resident_locality** | **string** |  | [optional] [default to undefined]
**work_state** | **string** |  | [optional] [default to undefined]
**work_locality** | **string** |  | [optional] [default to undefined]
**exemptions** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { TaxCalculationRequestEmployeeData } from './api';

const instance: TaxCalculationRequestEmployeeData = {
    employee_id,
    wages,
    ytd_wages,
    resident_state,
    resident_locality,
    work_state,
    work_locality,
    exemptions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
