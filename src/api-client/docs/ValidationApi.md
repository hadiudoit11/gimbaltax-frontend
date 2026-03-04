# ValidationApi

All URIs are relative to *https://api.payrolltax.example.com/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**validatePayloadPost**](#validatepayloadpost) | **POST** /validate-payload/ | Validate tax payload|

# **validatePayloadPost**
> PayloadValidationResponse validatePayloadPost(payloadValidationRequest)

Validate a tax configuration payload against the schema

### Example

```typescript
import {
    ValidationApi,
    Configuration,
    PayloadValidationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ValidationApi(configuration);

let payloadValidationRequest: PayloadValidationRequest; //

const { status, data } = await apiInstance.validatePayloadPost(
    payloadValidationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **payloadValidationRequest** | **PayloadValidationRequest**|  | |


### Return type

**PayloadValidationResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Validation results |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

