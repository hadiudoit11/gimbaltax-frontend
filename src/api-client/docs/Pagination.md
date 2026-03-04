# Pagination


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **number** | Total number of items | [optional] [default to undefined]
**next** | **string** | URL for next page | [optional] [default to undefined]
**previous** | **string** | URL for previous page | [optional] [default to undefined]
**page** | **number** | Current page number | [optional] [default to undefined]
**page_size** | **number** | Items per page | [optional] [default to undefined]
**total_pages** | **number** | Total number of pages | [optional] [default to undefined]

## Example

```typescript
import { Pagination } from './api';

const instance: Pagination = {
    count,
    next,
    previous,
    page,
    page_size,
    total_pages,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
