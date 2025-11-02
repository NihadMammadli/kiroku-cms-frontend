import { createQuery } from '../../config';
import api from '../../config/api';
import type { Attendance, AttendanceListParams } from './types';

// API functions
const fetchAttendances = async (
  params?: AttendanceListParams
): Promise<Attendance[]> => {
  const response = await api.get('/attendance/', { params });
  return response.data;
};

const fetchAttendance = async (id: number): Promise<Attendance> => {
  const response = await api.get(`/attendance/${id}/`);
  return response.data;
};

const fetchMyAttendance = async (): Promise<Attendance[]> => {
  const response = await api.get('/attendance/my_attendance/');
  return response.data;
};

const fetchAttendanceStatistics = async (
  courseGroupId?: number
): Promise<unknown> => {
  const response = await api.get('/attendance/statistics/', {
    params: { course_group: courseGroupId },
  });
  return response.data;
};

// Query hooks
export const useAttendanceListQuery = (params?: AttendanceListParams) => {
  return createQuery<Attendance[]>({
    queryKey: ['attendance', 'list', JSON.stringify(params)],
    queryFn: () => fetchAttendances(params),
  })();
};

export const useAttendanceQuery = (id: number) => {
  return createQuery<Attendance>({
    queryKey: ['attendance', 'detail', id],
    queryFn: () => fetchAttendance(id),
    options: {
      enabled: !!id,
    },
  })();
};

export const useMyAttendanceQuery = () => {
  return createQuery<Attendance[]>({
    queryKey: ['attendance', 'my-attendance'],
    queryFn: fetchMyAttendance,
  })();
};

export const useAttendanceStatisticsQuery = (courseGroupId?: number) => {
  return createQuery<unknown>({
    queryKey: ['attendance', 'statistics', courseGroupId],
    queryFn: () => fetchAttendanceStatistics(courseGroupId),
  })();
};
