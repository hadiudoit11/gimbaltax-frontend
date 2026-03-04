# ComplianceEventUpdate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**event_type** | [**EventType**](EventType.md) |  | [optional] [default to undefined]
**priority** | [**EventPriority**](EventPriority.md) |  | [optional] [default to undefined]
**due_date** | **string** |  | [optional] [default to undefined]
**reminder_date** | **string** |  | [optional] [default to undefined]
**event_data** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**related_tax_config_ids** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ComplianceEventUpdate } from './api';

const instance: ComplianceEventUpdate = {
    title,
    description,
    event_type,
    priority,
    due_date,
    reminder_date,
    event_data,
    related_tax_config_ids,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
