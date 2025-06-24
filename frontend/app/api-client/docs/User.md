# User


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**uuid** | **string** |  | [optional] [default to undefined]
**name_first** | **string** |  | [default to undefined]
**name_second** | **string** |  | [default to undefined]
**file_id** | **string** |  | [optional] [default to undefined]
**openai_file_id** | **string** |  | [optional] [default to undefined]
**level** | [**UserLevel**](UserLevel.md) |  | [optional] [default to undefined]
**personality** | [**Personality**](Personality.md) |  | [optional] [default to undefined]
**questions** | [**Array&lt;Question&gt;**](Question.md) |  | [optional] [default to undefined]

## Example

```typescript
import { User } from './api';

const instance: User = {
    uuid,
    name_first,
    name_second,
    file_id,
    openai_file_id,
    level,
    personality,
    questions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
