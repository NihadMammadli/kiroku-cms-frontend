import { createQuery } from '../../config';
import api from '../../config/api';
import { CourseGroup, CourseGroupListParams } from './types';

// API functions
const fetchCourseGroups = async (
  params?: CourseGroupListParams
): Promise<CourseGroup[]> => {
  const response = await api.get('/course-groups/', { params });
  return response.data;
};

const fetchCourseGroup = async (id: number): Promise<CourseGroup> => {
  const response = await api.get(`/course-groups/${id}/`);
  return response.data;
};

const fetchCourseGroupAvailability = async (id: number): Promise<any> => {
  const response = await api.get(`/course-groups/${id}/availability/`);
  return response.data;
};

const fetchCourseGroupSchedule = async (id: number): Promise<any> => {
  const response = await api.get(`/course-groups/${id}/schedule/`);
  return response.data;
};

const fetchCourseGroupStudents = async (id: number): Promise<any[]> => {
  const response = await api.get(`/course-groups/${id}/students/`);
  return response.data;
};

// Query hooks
export const useCourseGroupsQuery = (params?: CourseGroupListParams) => {
  return createQuery<CourseGroup[]>({
    queryKey: ['course-groups', 'list', params],
    queryFn: () => fetchCourseGroups(params),
  })();
};

export const useCourseGroupQuery = (id: number) => {
  return createQuery<CourseGroup>({
    queryKey: ['course-groups', 'detail', id],
    queryFn: () => fetchCourseGroup(id),
    options: {
      enabled: !!id,
    },
  })();
};

export const useCourseGroupAvailabilityQuery = (id: number) => {
  return createQuery<any>({
    queryKey: ['course-groups', 'availability', id],
    queryFn: () => fetchCourseGroupAvailability(id),
    options: {
      enabled: !!id,
    },
  })();
};

export const useCourseGroupScheduleQuery = (id: number) => {
  return createQuery<any>({
    queryKey: ['course-groups', 'schedule', id],
    queryFn: () => fetchCourseGroupSchedule(id),
    options: {
      enabled: !!id,
    },
  })();
};

export const useCourseGroupStudentsQuery = (id: number) => {
  return createQuery<any[]>({
    queryKey: ['course-groups', 'students', id],
    queryFn: () => fetchCourseGroupStudents(id),
    options: {
      enabled: !!id,
    },
  })();
};
