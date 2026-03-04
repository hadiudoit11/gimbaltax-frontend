# EventApprovalApi

All URIs are relative to *https://api.payrolltax.example.com/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**eventsApproveBatchPost**](#eventsapprovebatchpost) | **POST** /events/approve-batch/ | Bulk approve compliance events|
|[**eventsApproveEventIdPost**](#eventsapproveeventidpost) | **POST** /events/approve/{event_id}/ | Approve compliance event|
|[**eventsRejectEventIdPost**](#eventsrejecteventidpost) | **POST** /events/reject/{event_id}/ | Reject compliance event|

# **eventsApproveBatchPost**
> BulkEventApprovalResponse eventsApproveBatchPost(bulkEventApprovalRequest)

Approve multiple pending compliance events at once

### Example

```typescript
import {
    EventApprovalApi,
    Configuration,
    BulkEventApprovalRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EventApprovalApi(configuration);

let bulkEventApprovalRequest: BulkEventApprovalRequest; //

const { status, data } = await apiInstance.eventsApproveBatchPost(
    bulkEventApprovalRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bulkEventApprovalRequest** | **BulkEventApprovalRequest**|  | |


### Return type

**BulkEventApprovalResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Bulk approval completed |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsApproveEventIdPost**
> ComplianceEvent eventsApproveEventIdPost()

Approve a draft compliance event (changes status from draft to approved)

### Example

```typescript
import {
    EventApprovalApi,
    Configuration,
    EventApprovalRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EventApprovalApi(configuration);

let eventId: number; //Compliance event ID to approve (default to undefined)
let eventApprovalRequest: EventApprovalRequest; // (optional)

const { status, data } = await apiInstance.eventsApproveEventIdPost(
    eventId,
    eventApprovalRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventApprovalRequest** | **EventApprovalRequest**|  | |
| **eventId** | [**number**] | Compliance event ID to approve | defaults to undefined|


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
|**200** | Compliance event approved successfully |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsRejectEventIdPost**
> ComplianceEvent eventsRejectEventIdPost(eventRejectionRequest)

Reject a draft compliance event (changes status from draft to rejected)

### Example

```typescript
import {
    EventApprovalApi,
    Configuration,
    EventRejectionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EventApprovalApi(configuration);

let eventId: number; //Compliance event ID to reject (default to undefined)
let eventRejectionRequest: EventRejectionRequest; //

const { status, data } = await apiInstance.eventsRejectEventIdPost(
    eventId,
    eventRejectionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventRejectionRequest** | **EventRejectionRequest**|  | |
| **eventId** | [**number**] | Compliance event ID to reject | defaults to undefined|


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
|**200** | Compliance event rejected successfully |  -  |
|**400** | Bad request - validation errors or malformed request |  -  |
|**404** | Resource not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

