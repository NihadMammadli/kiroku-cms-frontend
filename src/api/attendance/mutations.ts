import { createMutation } from '../../config';
import api from '../../config/api';
import type {
  Attendance,
  AttendanceCreate,
  AttendanceUpdate,
  BulkAttendanceCreate,
} from './types';

// API functions
const createAttendance = async (
  data: AttendanceCreate
): Promise<Attendance> => {
  const response = await api.post('/attendance/', data);
  return response.data;
};

const updateAttendance = async ({
  id,
  data,
}: {
  id: number;
  data: AttendanceUpdate;
}): Promise<Attendance> => {
  const response = await api.put(`/attendance/${id}/`, data);
  return response.data;
};

const partialUpdateAttendance = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<AttendanceUpdate>;
}): Promise<Attendance> => {
  const response = await api.patch(`/attendance/${id}/`, data);
  return response.data;
};

const deleteAttendance = async (id: number): Promise<void> => {
  await api.delete(`/attendance/${id}/`);
};

const markBulkAttendance = async (
  data: BulkAttendanceCreate
): Promise<unknown> => {
  const response = await api.post('/attendance/mark_bulk/', data);
  return response.data;
};

// Mutation hooks
export const useCreateAttendanceMutation = createMutation<
  Attendance,
  AttendanceCreate
>({
  mutationFn: createAttendance,
  invalidateKeys: ['attendance'],
  onSuccessMessage: 'Davamiyyət uğurla qeyd edildi!',
  onErrorMessage: 'Davamiyyət qeyd etmək alınmadı',
});

export const useUpdateAttendanceMutation = createMutation<
  Attendance,
  { id: number; data: AttendanceUpdate }
>({
  mutationFn: updateAttendance,
  invalidateKeys: ['attendance'],
  onSuccessMessage: 'Davamiyyət uğurla yeniləndi!',
  onErrorMessage: 'Davamiyyət yeniləmək alınmadı',
});

export const usePartialUpdateAttendanceMutation = createMutation<
  Attendance,
  { id: number; data: Partial<AttendanceUpdate> }
>({
  mutationFn: partialUpdateAttendance,
  invalidateKeys: ['attendance'],
  onSuccessMessage: 'Davamiyyət uğurla yeniləndi!',
  onErrorMessage: 'Davamiyyət yeniləmək alınmadı',
});

export const useDeleteAttendanceMutation = createMutation<void, number>({
  mutationFn: deleteAttendance,
  invalidateKeys: ['attendance'],
  onSuccessMessage: 'Davamiyyət uğurla silindi!',
  onErrorMessage: 'Davamiyyət silmək alınmadı',
});

export const useMarkBulkAttendanceMutation = createMutation<
  unknown,
  BulkAttendanceCreate
>({
  mutationFn: markBulkAttendance,
  invalidateKeys: ['attendance'],
  onSuccessMessage: 'Davamiyyət uğurla kütləvi qeyd edildi!',
  onErrorMessage: 'Kütləvi davamiyyət qeyd etmək alınmadı',
});
