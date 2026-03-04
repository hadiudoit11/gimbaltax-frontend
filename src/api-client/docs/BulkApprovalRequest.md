# BulkApprovalRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**config_ids** | **Array&lt;string&gt;** | Array of tax configuration IDs to approve | [default to undefined]
**effective_date** | **string** | When the taxes should become effective | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { BulkApprovalRequest } from './api';

const instance: BulkApprovalRequest = {
    config_ids,
    effective_date,
    notes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
