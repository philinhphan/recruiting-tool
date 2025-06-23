import axios from 'axios'
import { User, UserBase, UserUpdate, Job, JobBase, Question } from '@/types'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// User API
export const userApi = {
  create: (user: UserBase): Promise<User> =>
    api.post('/user', user).then(res => res.data),
  
  getById: (userId: string): Promise<User> =>
    api.get(`/user/${userId}`).then(res => res.data),
  
  update: (userId: string, data: UserUpdate): Promise<User> =>
    api.patch(`/user/${userId}`, data).then(res => res.data),
  
  getAll: (): Promise<User[]> =>
    api.get('/user').then(res => res.data),
  
  downloadFile: (userId: string): Promise<Blob> =>
    api.get(`/user/${userId}/file`, { responseType: 'blob' }).then(res => res.data),
  
  getQuestion: (userId: string, questionId: number = 0): Promise<string> =>
    api.get(`/user/${userId}/question/${questionId}`).then(res => res.data),
  
  postQuestion: (userId: string, question: Question): Promise<User> =>
    api.post(`/user/${userId}/question`, question).then(res => res.data),
}

// File API
export const fileApi = {
  upload: (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data)
  },
  
  getUserInfo: (fileId: string): Promise<UserBase> =>
    api.get(`/file/${fileId}/userdata`).then(res => res.data),
  
  download: (fileId: string): Promise<Blob> =>
    api.get(`/file/${fileId}`, { responseType: 'blob' }).then(res => res.data),
}

// Job API
export const jobApi = {
  getAll: (): Promise<Job[]> =>
    api.get('/job').then(res => res.data),
  
  create: (job: JobBase): Promise<string> =>
    api.post('/job', job).then(res => res.data),
}

export default api 