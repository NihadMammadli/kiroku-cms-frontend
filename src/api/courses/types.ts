export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  level: CourseLevel;
  status: CourseStatus;
  duration_hours: number;
  groups_count: string;
  created_at: string;
  updated_at: string;
}

export interface CourseCreate {
  name: string;
  code: string;
  description: string;
  level: CourseLevel;
  status?: CourseStatus;
  duration_hours: number;
}

export interface CourseUpdate {
  name?: string;
  code?: string;
  description?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  duration_hours?: number;
}

export interface CourseListParams {
  level?: CourseLevel;
  search?: string;
  status?: CourseStatus;
}
