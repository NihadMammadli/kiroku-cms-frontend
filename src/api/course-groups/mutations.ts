import { createMutation } from '../../config';
import api from '../../config/api';
import { CourseGroup, CourseGroupCreate, CourseGroupUpdate } from './types';

// API functions
const createCourseGroup = async (
  data: CourseGroupCreate
): Promise<CourseGroup> => {
  const response = await api.post('/course-groups/', data);
  return response.data;
};

const updateCourseGroup = async ({
  id,
  data,
}: {
  id: number;
  data: CourseGroupUpdate;
}): Promise<CourseGroup> => {
  const response = await api.put(`/course-groups/${id}/`, data);
  return response.data;
};

const partialUpdateCourseGroup = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<CourseGroupUpdate>;
}): Promise<CourseGroup> => {
  const response = await api.patch(`/course-groups/${id}/`, data);
  return response.data;
};

const deleteCourseGroup = async (id: number): Promise<void> => {
  await api.delete(`/course-groups/${id}/`);
};

// Mutation hooks
export const useCreateCourseGroupMutation = createMutation<
  CourseGroup,
  CourseGroupCreate
>({
  mutationFn: createCourseGroup,
  invalidateKeys: ['course-groups'],
  onSuccessMessage: 'Qrup uğurla yaradıldı!',
  onErrorMessage: 'Qrup yaratmaq alınmadı',
});

export const useUpdateCourseGroupMutation = createMutation<
  CourseGroup,
  { id: number; data: CourseGroupUpdate }
>({
  mutationFn: updateCourseGroup,
  invalidateKeys: ['course-groups'],
  onSuccessMessage: 'Qrup uğurla yeniləndi!',
  onErrorMessage: 'Qrup yeniləmək alınmadı',
});

export const usePartialUpdateCourseGroupMutation = createMutation<
  CourseGroup,
  { id: number; data: Partial<CourseGroupUpdate> }
>({
  mutationFn: partialUpdateCourseGroup,
  invalidateKeys: ['course-groups'],
  onSuccessMessage: 'Qrup uğurla yeniləndi!',
  onErrorMessage: 'Qrup yeniləmək alınmadı',
});

export const useDeleteCourseGroupMutation = createMutation<void, number>({
  mutationFn: deleteCourseGroup,
  invalidateKeys: ['course-groups'],
  onSuccessMessage: 'Qrup uğurla silindi!',
  onErrorMessage: 'Qrup silmək alınmadı',
});
