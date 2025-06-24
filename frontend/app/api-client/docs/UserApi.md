# UserApi

All URIs are relative to *http://localhost:8000/api/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createUserUserPost**](#createuseruserpost) | **POST** /user | Create User|
|[**downloadByIdFileFidGet**](#downloadbyidfilefidget) | **GET** /file/{fid} | Download By Id|
|[**downloadByUserUserUidFileGet**](#downloadbyuseruseruidfileget) | **GET** /user/{uid}/file | Download By User|
|[**getOfferingsByUserUserUidOfferingsGet**](#getofferingsbyuseruseruidofferingsget) | **GET** /user/{uid}/offerings | Get Offerings By User|
|[**getQuestionByUserUserUidQuestionQidGet**](#getquestionbyuseruseruidquestionqidget) | **GET** /user/{uid}/question/{qid} | Get Question By User|
|[**getUserByIdUserUidGet**](#getuserbyiduseruidget) | **GET** /user/{uid} | Get User By Id|
|[**getUserinfoByFileFileFidUserdataGet**](#getuserinfobyfilefilefiduserdataget) | **GET** /file/{fid}/userdata | Get Userinfo By File|
|[**postQuestionByUserUserUidQuestionPost**](#postquestionbyuseruseruidquestionpost) | **POST** /user/{uid}/question | Post Question By User|
|[**updateUserUserUidPatch**](#updateuseruseruidpatch) | **PATCH** /user/{uid} | Update User|
|[**uploadFilePost**](#uploadfilepost) | **POST** /file | Upload|

# **createUserUserPost**
> User createUserUserPost(userBase)


### Example

```typescript
import {
    UserApi,
    Configuration,
    UserBase
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let userBase: UserBase; //

const { status, data } = await apiInstance.createUserUserPost(
    userBase
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userBase** | **UserBase**|  | |


### Return type

**User**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **downloadByIdFileFidGet**
> any downloadByIdFileFidGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let fid: string; // (default to undefined)

const { status, data } = await apiInstance.downloadByIdFileFidGet(
    fid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fid** | [**string**] |  | defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **downloadByUserUserUidFileGet**
> any downloadByUserUserUidFileGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let uid: string; // (default to undefined)

const { status, data } = await apiInstance.downloadByUserUserUidFileGet(
    uid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] |  | defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOfferingsByUserUserUidOfferingsGet**
> OfferingRequest getOfferingsByUserUserUidOfferingsGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let uid: string; // (default to undefined)

const { status, data } = await apiInstance.getOfferingsByUserUserUidOfferingsGet(
    uid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] |  | defaults to undefined|


### Return type

**OfferingRequest**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getQuestionByUserUserUidQuestionQidGet**
> string getQuestionByUserUserUidQuestionQidGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let uid: string; // (default to undefined)
let qid: number; // (default to undefined)

const { status, data } = await apiInstance.getQuestionByUserUserUidQuestionQidGet(
    uid,
    qid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] |  | defaults to undefined|
| **qid** | [**number**] |  | defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserByIdUserUidGet**
> User getUserByIdUserUidGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let uid: string; // (default to undefined)

const { status, data } = await apiInstance.getUserByIdUserUidGet(
    uid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uid** | [**string**] |  | defaults to undefined|


### Return type

**User**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserinfoByFileFileFidUserdataGet**
> UserBase getUserinfoByFileFileFidUserdataGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let fid: string; // (default to undefined)

const { status, data } = await apiInstance.getUserinfoByFileFileFidUserdataGet(
    fid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fid** | [**string**] |  | defaults to undefined|


### Return type

**UserBase**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **postQuestionByUserUserUidQuestionPost**
> any postQuestionByUserUserUidQuestionPost(question)


### Example

```typescript
import {
    UserApi,
    Configuration,
    Question
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let uid: string; // (default to undefined)
let question: Question; //

const { status, data } = await apiInstance.postQuestionByUserUserUidQuestionPost(
    uid,
    question
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **question** | **Question**|  | |
| **uid** | [**string**] |  | defaults to undefined|


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserUserUidPatch**
> User updateUserUserUidPatch(userUpdate)


### Example

```typescript
import {
    UserApi,
    Configuration,
    UserUpdate
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let uid: string; // (default to undefined)
let userUpdate: UserUpdate; //

const { status, data } = await apiInstance.updateUserUserUidPatch(
    uid,
    userUpdate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userUpdate** | **UserUpdate**|  | |
| **uid** | [**string**] |  | defaults to undefined|


### Return type

**User**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadFilePost**
> string uploadFilePost()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let file: File; // (default to undefined)

const { status, data } = await apiInstance.uploadFilePost(
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **file** | [**File**] |  | defaults to undefined|


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

