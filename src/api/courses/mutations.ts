import { createMutation } from '../../config';
import api from '../../config/api';
import type { Course, CourseCreate, CourseUpdate } from './types';

// API functions
const createCourse = async (data: CourseCreate): Promise<Course> => {
  const response = await api.post('/courses/', data);
  return response.data;
};

const updateCourse = async ({
  id,
  data,
}: {
  id: number;
  data: CourseUpdate;
}): Promise<Course> => {
  const response = await api.put(`/courses/${id}/`, data);
  return response.data;
};

const partialUpdateCourse = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<CourseUpdate>;
}): Promise<Course> => {
  const response = await api.patch(`/courses/${id}/`, data);
  return response.data;
};

const deleteCourse = async (id: number): Promise<void> => {
  await api.delete(`/courses/${id}/`);
};

// Mutation hooks
export const useCreateCourseMutation = createMutation<Course, CourseCreate>({
  mutationFn: createCourse,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Kurs uğurla yaradıldı!',
  onErrorMessage: 'Kurs yaratmaq alınmadı',
});

export const useUpdateCourseMutation = createMutation<
  Course,
  { id: number; data: CourseUpdate }
>({
  mutationFn: updateCourse,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Kurs uğurla yeniləndi!',
  onErrorMessage: 'Kurs yeniləmək alınmadı',
});

export const usePartialUpdateCourseMutation = createMutation<
  Course,
  { id: number; data: Partial<CourseUpdate> }
>({
  mutationFn: partialUpdateCourse,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Kurs uğurla yeniləndi!',
  onErrorMessage: 'Kurs yeniləmək alınmadı',
});

export const useDeleteCourseMutation = createMutation<void, number>({
  mutationFn: deleteCourse,
  invalidateKeys: ['courses'],
  onSuccessMessage: 'Kurs uğurla silindi!',
  onErrorMessage: 'Kurs silmək alınmadı',
});
