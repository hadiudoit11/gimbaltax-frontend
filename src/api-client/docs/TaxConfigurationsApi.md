# TaxConfigurationsApi

All URIs are relative to *https://api.payrolltax.example.com/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**taxConfigsGet**](#taxconfigsget) | **GET** /tax-configs/ | List tax configurations|
|[**taxConfigsIdDelete**](#taxconfigsiddelete) | **DELETE** /tax-configs/{id}/ | Delete tax configuration|
|[**taxConfigsIdGet**](#taxconfigsidget) | **GET** /tax-configs/{id}/ | Get tax configuration details|
|[**taxConfigsIdPut**](#taxconfigsidput) | **PUT** /tax-configs/{id}/ | Update tax configuration|
|[**taxConfigsPendingGet**](#taxconfigspendingget) | **GET** /tax-configs/pending/ | List pending tax configurations|
|[**taxConfigsPost**](#taxconfigspost) | **POST** /tax-configs/ | Create tax configuration|

# **taxConfigsGet**
> PaginatedTaxConfigs taxConfigsGet()

Get paginated list of tax configurations with advanced filtering

### Example

```typescript
import {
    TaxConfigurationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxConfigurationsApi(configuration);

let page: number; //Page number for pagination (optional) (default to 1)
let pageSize: number; //Number of items per page (optional) (default to 20)
let jurisdiction: string; //Filter by jurisdiction ID (optional) (default to undefined)
let category: TaxCategory; //Filter by tax category (optional) (default to undefined)
let status: TaxConfigStatus; //Filter by status (optional) (default to undefined)
let effectiveFrom: string; //Filter by effective date (YYYY-MM-DD) (optional) (default to undefined)
let search: string; //Search by tax_id, name, or authority (optional) (default to undefined)

const { status, data } = await apiInstance.taxConfigsGet(
    page,
    pageSize,
    jurisdiction,
    category,
    status,
    effectiveFrom,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **pageSize** | [**number**] | Number of items per page | (optional) defaults to 20|
| **jurisdiction** | [**string**] | Filter by jurisdiction ID | (optional) defaults to undefined|
| **category** | **TaxCategory** | Filter by tax category | (optional) defaults to undefined|
| **status** | **TaxConfigStatus** | Filter by status | (optional) defaults to undefined|
| **effectiveFrom** | [**string**] | Filter by effective date (YYYY-MM-DD) | (optional) defaults to undefined|
| **search** | [**string**] | Search by tax_id, name, or authority | (optional) defaults to undefined|


### Return type

**PaginatedTaxConfigs**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **taxConfigsIdDelete**
> taxConfigsIdDelete()

Delete a tax configuration (soft delete)

### Example

```typescript
import {
    TaxConfigurationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxConfigurationsApi(configuration);

let id: string; //Tax configuration ID (default to undefined)

const { status, data } = await apiInstance.taxConfigsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Tax configuration ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Tax configuration deleted successfully |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **taxConfigsIdGet**
> TaxConfigDetail taxConfigsIdGet()

Retrieve detailed information about a specific tax configuration

### Example

```typescript
import {
    TaxConfigurationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxConfigurationsApi(configuration);

let id: string; //Tax configuration ID (default to undefined)

const { status, data } = await apiInstance.taxConfigsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Tax configuration ID | defaults to undefined|


### Return type

**TaxConfigDetail**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tax configuration details |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **taxConfigsIdPut**
> TaxConfig taxConfigsIdPut(taxConfigUpdate)

Update an existing tax configuration

### Example

```typescript
import {
    TaxConfigurationsApi,
    Configuration,
    TaxConfigUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxConfigurationsApi(configuration);

let id: string; //Tax configuration ID (default to undefined)
let taxConfigUpdate: TaxConfigUpdate; //

const { status, data } = await apiInstance.taxConfigsIdPut(
    id,
    taxConfigUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taxConfigUpdate** | **TaxConfigUpdate**|  | |
| **id** | [**string**] | Tax configuration ID | defaults to undefined|


### Return type

**TaxConfig**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tax configuration updated successfully |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **taxConfigsPendingGet**
> PaginatedPendingTaxConfigs taxConfigsPendingGet()

Get tax configurations awaiting review (draft status).  **Primary Endpoint**: This is the recommended endpoint for frontends  to get pending configurations for approval workflow. It queries the  database directly and shows all draft configs regardless of which  agent session created them.  **Workflow**: Use the `id` field from results with approval endpoints: - `POST /agents/approve/{config_id}/` - `POST /agents/reject/{config_id}/` - `POST /agents/approve-batch/`  **Persistence**: Results persist in database until approved/rejected. 

### Example

```typescript
import {
    TaxConfigurationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxConfigurationsApi(configuration);

let page: number; //Page number for pagination (optional) (default to 1)
let pageSize: number; //Number of items per page (optional) (default to 20)
let createdBy: string; //Filter by creator user ID (optional) (default to undefined)

const { status, data } = await apiInstance.taxConfigsPendingGet(
    page,
    pageSize,
    createdBy
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **pageSize** | [**number**] | Number of items per page | (optional) defaults to 20|
| **createdBy** | [**string**] | Filter by creator user ID | (optional) defaults to undefined|


### Return type

**PaginatedPendingTaxConfigs**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Pending tax configurations from database |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **taxConfigsPost**
> TaxConfig taxConfigsPost(taxConfigCreate)

Create a new tax configuration

### Example

```typescript
import {
    TaxConfigurationsApi,
    Configuration,
    TaxConfigCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new TaxConfigurationsApi(configuration);

let taxConfigCreate: TaxConfigCreate; //

const { status, data } = await apiInstance.taxConfigsPost(
    taxConfigCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taxConfigCreate** | **TaxConfigCreate**|  | |


### Return type

**TaxConfig**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Tax configuration created successfully |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

