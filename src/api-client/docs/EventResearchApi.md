# EventResearchApi

All URIs are relative to *https://api.payrolltax.example.com/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**eventsResearchPost**](#eventsresearchpost) | **POST** /events/research/ | Start compliance event research|
|[**eventsResearchResultsSessionIdGet**](#eventsresearchresultssessionidget) | **GET** /events/research-results/{session_id}/ | Get event research results|

# **eventsResearchPost**
> EventResearchSessionResponse eventsResearchPost(eventResearchRequest)

Initiate AI-powered compliance event research with natural language query.  **Database Persistence**: Creates ComplianceEvent records with `status=\'draft\'`  that require approval/rejection workflow.  **AI Research Workflow**:  1. Returns session_id immediately (202 response) 2. AI agent processes query to identify compliance events 3. Creates draft ComplianceEvent records in database 4. Use `/events/research-results/{session_id}/` for final results 5. Use `/compliance-events/pending/` to view all pending events 6. Approve/reject events using event approval endpoints 

### Example

```typescript
import {
    EventResearchApi,
    Configuration,
    EventResearchRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EventResearchApi(configuration);

let eventResearchRequest: EventResearchRequest; //

const { status, data } = await apiInstance.eventsResearchPost(
    eventResearchRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventResearchRequest** | **EventResearchRequest**|  | |


### Return type

**EventResearchSessionResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**202** | Event research session started |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsResearchResultsSessionIdGet**
> EventResearchResult eventsResearchResultsSessionIdGet()

Retrieve final results from completed event research session

### Example

```typescript
import {
    EventResearchApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventResearchApi(configuration);

let sessionId: string; //Event research session ID (default to undefined)

const { status, data } = await apiInstance.eventsResearchResultsSessionIdGet(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] | Event research session ID | defaults to undefined|


### Return type

**EventResearchResult**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event research results |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

