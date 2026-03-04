# ComplianceEventCreate


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**event_type** | [**EventType**](EventType.md) |  | [default to undefined]
**priority** | [**EventPriority**](EventPriority.md) |  | [optional] [default to undefined]
**jurisdiction_id** | **number** |  | [default to undefined]
**due_date** | **string** |  | [default to undefined]
**reminder_date** | **string** |  | [optional] [default to undefined]
**event_data** | **{ [key: string]: any; }** |  | [optional] [default to undefined]
**related_tax_config_ids** | **Array&lt;number&gt;** | Array of tax config IDs to associate | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ComplianceEventCreate } from './api';

const instance: ComplianceEventCreate = {
    title,
    description,
    event_type,
    priority,
    jurisdiction_id,
    due_date,
    reminder_date,
    event_data,
    related_tax_config_ids,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
