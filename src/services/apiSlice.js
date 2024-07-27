
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: (builder) => ({
    getCache: builder.query({
      query: (key) => `/cache/${key}`,
    }),
    setCache: builder.mutation({
      query: (data) => ({
        
        url: '/cache',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetCacheQuery, useSetCacheMutation } = apiSlice;
