# TaxCalculationsApi

All URIs are relative to *https://api.payrolltax.example.com/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**applicableTaxesGet**](#applicabletaxesget) | **GET** /applicable-taxes/ | Get applicable taxes|
|[**calculatePost**](#calculatepost) | **POST** /calculate/ | Calculate tax liabilities|

# **applicableTaxesGet**
> ApplicableTaxesResponse applicableTaxesGet()

Get all taxes applicable to a jurisdiction and date

### Example

```typescript
import {
    TaxCalculationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxCalculationsApi(configuration);

let jurisdictionCode: string; //Jurisdiction code (e.g., \"US-NY\") (default to undefined)
let asOfDate: string; //Date to check (YYYY-MM-DD, defaults to today) (optional) (default to undefined)
let category: TaxCategory; //Filter by tax category (optional) (default to undefined)

const { status, data } = await apiInstance.applicableTaxesGet(
    jurisdictionCode,
    asOfDate,
    category
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **jurisdictionCode** | [**string**] | Jurisdiction code (e.g., \&quot;US-NY\&quot;) | defaults to undefined|
| **asOfDate** | [**string**] | Date to check (YYYY-MM-DD, defaults to today) | (optional) defaults to undefined|
| **category** | **TaxCategory** | Filter by tax category | (optional) defaults to undefined|


### Return type

**ApplicableTaxesResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Applicable taxes |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **calculatePost**
> TaxCalculationResponse calculatePost(taxCalculationRequest)

Calculate payroll tax liabilities for an employee

### Example

```typescript
import {
    TaxCalculationsApi,
    Configuration,
    TaxCalculationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxCalculationsApi(configuration);

let taxCalculationRequest: TaxCalculationRequest; //

const { status, data } = await apiInstance.calculatePost(
    taxCalculationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taxCalculationRequest** | **TaxCalculationRequest**|  | |


### Return type

**TaxCalculationResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tax calculation results |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

