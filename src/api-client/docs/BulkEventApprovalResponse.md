# BulkEventApprovalResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**approved_count** | **number** |  | [optional] [default to undefined]
**error_count** | **number** |  | [optional] [default to undefined]
**approved_events** | [**Array&lt;BulkEventApprovalResponseApprovedEventsInner&gt;**](BulkEventApprovalResponseApprovedEventsInner.md) |  | [optional] [default to undefined]
**errors** | [**Array&lt;BulkEventApprovalResponseErrorsInner&gt;**](BulkEventApprovalResponseErrorsInner.md) |  | [optional] [default to undefined]

## Example

```typescript
import { BulkEventApprovalResponse } from './api';

const instance: BulkEventApprovalResponse = {
    approved_count,
    error_count,
    approved_events,
    errors,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
