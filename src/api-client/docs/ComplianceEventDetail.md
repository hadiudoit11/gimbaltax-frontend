# ComplianceEventDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **string** |  | [optional] [default to undefined]
**updated_at** | **string** |  | [optional] [default to undefined]
**id** | **number** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**event_type** | [**EventType**](EventType.md) |  | [optional] [default to undefined]
**priority** | [**EventPriority**](EventPriority.md) |  | [optional] [default to undefined]
**jurisdiction** | [**Jurisdiction**](Jurisdiction.md) |  | [optional] [default to undefined]
**jurisdiction_id** | **number** |  | [optional] [default to undefined]
**due_date** | **string** |  | [optional] [default to undefined]
**reminder_date** | **string** |  | [optional] [default to undefined]
**status** | [**EventStatus**](EventStatus.md) |  | [optional] [default to undefined]
**source** | [**EventSource**](EventSource.md) |  | [optional] [default to undefined]
**ai_session_id** | **string** | Session ID for AI-generated events | [optional] [default to undefined]
**ai_research_query** | **string** | Original query used for AI research | [optional] [default to undefined]
**event_data** | **{ [key: string]: any; }** | Additional structured data about the event | [optional] [default to undefined]
**related_tax_configs** | [**Array&lt;TaxConfig&gt;**](TaxConfig.md) |  | [optional] [readonly] [default to undefined]
**created_by_name** | **string** |  | [optional] [readonly] [default to undefined]
**updated_by_name** | **string** |  | [optional] [readonly] [default to undefined]
**approved_by_name** | **string** |  | [optional] [readonly] [default to undefined]
**approved_at** | **string** |  | [optional] [default to undefined]
**rejection_reason** | **string** |  | [optional] [default to undefined]
**days_until_due** | **number** | Number of days until due date | [optional] [readonly] [default to undefined]
**is_overdue** | **boolean** | Whether the event is overdue | [optional] [readonly] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**related_tax_config_ids** | **Array&lt;number&gt;** | Array of tax config IDs to associate | [optional] [default to undefined]

## Example

```typescript
import { ComplianceEventDetail } from './api';

const instance: ComplianceEventDetail = {
    created_at,
    updated_at,
    id,
    title,
    description,
    event_type,
    priority,
    jurisdiction,
    jurisdiction_id,
    due_date,
    reminder_date,
    status,
    source,
    ai_session_id,
    ai_research_query,
    event_data,
    related_tax_configs,
    created_by_name,
    updated_by_name,
    approved_by_name,
    approved_at,
    rejection_reason,
    days_until_due,
    is_overdue,
    notes,
    related_tax_config_ids,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
