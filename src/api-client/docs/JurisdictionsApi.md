# JurisdictionsApi

All URIs are relative to *https://api.payrolltax.example.com/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**jurisdictionsGet**](#jurisdictionsget) | **GET** /jurisdictions/ | List jurisdictions|
|[**jurisdictionsIdGet**](#jurisdictionsidget) | **GET** /jurisdictions/{id}/ | Get jurisdiction details|
|[**jurisdictionsIdPut**](#jurisdictionsidput) | **PUT** /jurisdictions/{id}/ | Update jurisdiction|
|[**jurisdictionsPost**](#jurisdictionspost) | **POST** /jurisdictions/ | Create jurisdiction|

# **jurisdictionsGet**
> PaginatedJurisdictions jurisdictionsGet()

Get paginated list of tax jurisdictions with optional filtering

### Example

```typescript
import {
    JurisdictionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JurisdictionsApi(configuration);

let page: number; //Page number for pagination (optional) (default to 1)
let pageSize: number; //Number of items per page (optional) (default to 20)
let jurisdictionType: JurisdictionType; //Filter by jurisdiction type (optional) (default to undefined)
let isActive: boolean; //Filter by active status (optional) (default to undefined)
let parent: string; //Filter by parent jurisdiction ID (optional) (default to undefined)
let search: string; //Search by code or name (optional) (default to undefined)

const { status, data } = await apiInstance.jurisdictionsGet(
    page,
    pageSize,
    jurisdictionType,
    isActive,
    parent,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **pageSize** | [**number**] | Number of items per page | (optional) defaults to 20|
| **jurisdictionType** | **JurisdictionType** | Filter by jurisdiction type | (optional) defaults to undefined|
| **isActive** | [**boolean**] | Filter by active status | (optional) defaults to undefined|
| **parent** | [**string**] | Filter by parent jurisdiction ID | (optional) defaults to undefined|
| **search** | [**string**] | Search by code or name | (optional) defaults to undefined|


### Return type

**PaginatedJurisdictions**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful response |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |
|**401** | Authentication required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **jurisdictionsIdGet**
> JurisdictionDetail jurisdictionsIdGet()

Retrieve detailed information about a specific jurisdiction

### Example

```typescript
import {
    JurisdictionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new JurisdictionsApi(configuration);

let id: string; //Jurisdiction ID (default to undefined)

const { status, data } = await apiInstance.jurisdictionsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Jurisdiction ID | defaults to undefined|


### Return type

**JurisdictionDetail**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Jurisdiction details |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **jurisdictionsIdPut**
> Jurisdiction jurisdictionsIdPut(jurisdictionUpdate)

Update an existing jurisdiction

### Example

```typescript
import {
    JurisdictionsApi,
    Configuration,
    JurisdictionUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new JurisdictionsApi(configuration);

let id: string; //Jurisdiction ID (default to undefined)
let jurisdictionUpdate: JurisdictionUpdate; //

const { status, data } = await apiInstance.jurisdictionsIdPut(
    id,
    jurisdictionUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **jurisdictionUpdate** | **JurisdictionUpdate**|  | |
| **id** | [**string**] | Jurisdiction ID | defaults to undefined|


### Return type

**Jurisdiction**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Jurisdiction updated successfully |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **jurisdictionsPost**
> Jurisdiction jurisdictionsPost(jurisdictionCreate)

Create a new tax jurisdiction

### Example

```typescript
import {
    JurisdictionsApi,
    Configuration,
    JurisdictionCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new JurisdictionsApi(configuration);

let jurisdictionCreate: JurisdictionCreate; //

const { status, data } = await apiInstance.jurisdictionsPost(
    jurisdictionCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **jurisdictionCreate** | **JurisdictionCreate**|  | |


### Return type

**Jurisdiction**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Jurisdiction created successfully |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |
|**401** | Authentication required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

