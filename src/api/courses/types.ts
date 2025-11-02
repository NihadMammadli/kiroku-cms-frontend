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
  branch: number;
  branch_name: string;
  course_admin: number | null;
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
  branch: number;
  course_admin?: number | null;
}

export interface CourseUpdate {
  name?: string;
  code?: string;
  description?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  duration_hours?: number;
  branch?: number;
  course_admin?: number | null;
}

export interface CourseListParams {
  branch?: number;
  course_admin?: number;
  level?: CourseLevel;
  search?: string;
  status?: CourseStatus;
}
