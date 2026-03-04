# PendingComplianceEvent

Compliance event in draft status awaiting approval

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**event_type** | [**EventType**](EventType.md) |  | [optional] [default to undefined]
**priority** | [**EventPriority**](EventPriority.md) |  | [optional] [default to undefined]
**jurisdiction** | [**Jurisdiction**](Jurisdiction.md) |  | [optional] [default to undefined]
**due_date** | **string** |  | [optional] [default to undefined]
**source** | [**EventSource**](EventSource.md) |  | [optional] [default to undefined]
**ai_session_id** | **string** |  | [optional] [default to undefined]
**created_by_name** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [optional] [default to undefined]
**days_until_due** | **number** |  | [optional] [default to undefined]
**is_overdue** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { PendingComplianceEvent } from './api';

const instance: PendingComplianceEvent = {
    id,
    title,
    description,
    event_type,
    priority,
    jurisdiction,
    due_date,
    source,
    ai_session_id,
    created_by_name,
    created_at,
    days_until_due,
    is_overdue,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
