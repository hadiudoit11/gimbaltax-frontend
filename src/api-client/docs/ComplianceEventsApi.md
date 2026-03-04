# ComplianceEventsApi

All URIs are relative to *https://api.payrolltax.example.com/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**complianceEventsGet**](#complianceeventsget) | **GET** /compliance-events/ | List compliance events|
|[**complianceEventsIdDelete**](#complianceeventsiddelete) | **DELETE** /compliance-events/{id}/ | Delete compliance event|
|[**complianceEventsIdGet**](#complianceeventsidget) | **GET** /compliance-events/{id}/ | Get compliance event details|
|[**complianceEventsIdPut**](#complianceeventsidput) | **PUT** /compliance-events/{id}/ | Update compliance event|
|[**complianceEventsPendingGet**](#complianceeventspendingget) | **GET** /compliance-events/pending/ | List pending compliance events|
|[**complianceEventsPost**](#complianceeventspost) | **POST** /compliance-events/ | Create compliance event|
|[**complianceEventsUpcomingGet**](#complianceeventsupcomingget) | **GET** /compliance-events/upcoming/ | List upcoming compliance events|

# **complianceEventsGet**
> PaginatedComplianceEvents complianceEventsGet()

Get paginated list of compliance events with filtering and search

### Example

```typescript
import {
    ComplianceEventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ComplianceEventsApi(configuration);

let page: number; //Page number for pagination (optional) (default to 1)
let pageSize: number; //Number of items per page (optional) (default to 20)
let eventType: EventType; //Filter by event type (optional) (default to undefined)
let priority: EventPriority; //Filter by priority level (optional) (default to undefined)
let status: EventStatus; //Filter by status (optional) (default to undefined)
let jurisdiction: number; //Filter by jurisdiction ID (optional) (default to undefined)
let source: EventSource; //Filter by event source (optional) (default to undefined)
let search: string; //Search by title and description (optional) (default to undefined)

const { status, data } = await apiInstance.complianceEventsGet(
    page,
    pageSize,
    eventType,
    priority,
    status,
    jurisdiction,
    source,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **pageSize** | [**number**] | Number of items per page | (optional) defaults to 20|
| **eventType** | **EventType** | Filter by event type | (optional) defaults to undefined|
| **priority** | **EventPriority** | Filter by priority level | (optional) defaults to undefined|
| **status** | **EventStatus** | Filter by status | (optional) defaults to undefined|
| **jurisdiction** | [**number**] | Filter by jurisdiction ID | (optional) defaults to undefined|
| **source** | **EventSource** | Filter by event source | (optional) defaults to undefined|
| **search** | [**string**] | Search by title and description | (optional) defaults to undefined|


### Return type

**PaginatedComplianceEvents**

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

# **complianceEventsIdDelete**
> complianceEventsIdDelete()

Delete a compliance event

### Example

```typescript
import {
    ComplianceEventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ComplianceEventsApi(configuration);

let id: number; //Compliance event ID (default to undefined)

const { status, data } = await apiInstance.complianceEventsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Compliance event ID | defaults to undefined|


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
|**204** | Compliance event deleted successfully |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **complianceEventsIdGet**
> ComplianceEventDetail complianceEventsIdGet()

Retrieve detailed information about a specific compliance event

### Example

```typescript
import {
    ComplianceEventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ComplianceEventsApi(configuration);

let id: number; //Compliance event ID (default to undefined)

const { status, data } = await apiInstance.complianceEventsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Compliance event ID | defaults to undefined|


### Return type

**ComplianceEventDetail**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Compliance event details |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **complianceEventsIdPut**
> ComplianceEvent complianceEventsIdPut(complianceEventUpdate)

Update an existing compliance event

### Example

```typescript
import {
    ComplianceEventsApi,
    Configuration,
    ComplianceEventUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new ComplianceEventsApi(configuration);

let id: number; //Compliance event ID (default to undefined)
let complianceEventUpdate: ComplianceEventUpdate; //

const { status, data } = await apiInstance.complianceEventsIdPut(
    id,
    complianceEventUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **complianceEventUpdate** | **ComplianceEventUpdate**|  | |
| **id** | [**number**] | Compliance event ID | defaults to undefined|


### Return type

**ComplianceEvent**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Compliance event updated successfully |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **complianceEventsPendingGet**
> PaginatedPendingComplianceEvents complianceEventsPendingGet()

Get compliance events in draft status awaiting approval.  **Primary Endpoint**: Use this to get AI-generated events needing approval. Events persist in database until approved/rejected.  **Parameters**: - `ai_generated=true` - Filter to only AI-generated events 

### Example

```typescript
import {
    ComplianceEventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ComplianceEventsApi(configuration);

let page: number; //Page number for pagination (optional) (default to 1)
let pageSize: number; //Number of items per page (optional) (default to 20)
let aiGenerated: boolean; //Filter to only AI-generated events (optional) (default to undefined)

const { status, data } = await apiInstance.complianceEventsPendingGet(
    page,
    pageSize,
    aiGenerated
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **pageSize** | [**number**] | Number of items per page | (optional) defaults to 20|
| **aiGenerated** | [**boolean**] | Filter to only AI-generated events | (optional) defaults to undefined|


### Return type

**PaginatedPendingComplianceEvents**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Pending compliance events |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **complianceEventsPost**
> ComplianceEvent complianceEventsPost(complianceEventCreate)

Create a new compliance event manually

### Example

```typescript
import {
    ComplianceEventsApi,
    Configuration,
    ComplianceEventCreate
} from './api';

const configuration = new Configuration();
const apiInstance = new ComplianceEventsApi(configuration);

let complianceEventCreate: ComplianceEventCreate; //

const { status, data } = await apiInstance.complianceEventsPost(
    complianceEventCreate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **complianceEventCreate** | **ComplianceEventCreate**|  | |


### Return type

**ComplianceEvent**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Compliance event created successfully |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **complianceEventsUpcomingGet**
> PaginatedComplianceEvents complianceEventsUpcomingGet()

Get events due within specified timeframe

### Example

```typescript
import {
    ComplianceEventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ComplianceEventsApi(configuration);

let page: number; //Page number for pagination (optional) (default to 1)
let pageSize: number; //Number of items per page (optional) (default to 20)
let days: number; //Number of days to look ahead (default 30) (optional) (default to 30)

const { status, data } = await apiInstance.complianceEventsUpcomingGet(
    page,
    pageSize,
    days
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number for pagination | (optional) defaults to 1|
| **pageSize** | [**number**] | Number of items per page | (optional) defaults to 20|
| **days** | [**number**] | Number of days to look ahead (default 30) | (optional) defaults to 30|


### Return type

**PaginatedComplianceEvents**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Upcoming compliance events |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

