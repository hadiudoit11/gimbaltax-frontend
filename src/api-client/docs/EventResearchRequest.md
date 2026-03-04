# EventResearchRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**query** | **string** | Natural language description of compliance events needed | [default to undefined]
**jurisdiction_code** | **string** | Optional jurisdiction code filter | [optional] [default to undefined]
**event_type** | [**EventType**](EventType.md) |  | [optional] [default to undefined]
**date_range_start** | **string** | Optional start date for event search | [optional] [default to undefined]
**date_range_end** | **string** | Optional end date for event search | [optional] [default to undefined]

## Example

```typescript
import { EventResearchRequest } from './api';

const instance: EventResearchRequest = {
    query,
    jurisdiction_code,
    event_type,
    date_range_start,
    date_range_end,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
