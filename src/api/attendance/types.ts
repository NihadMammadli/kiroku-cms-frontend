export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface Attendance {
  id: number;
  student: number;
  student_name: string;
  course_group: number;
  course_group_name: string;
  course_name: string;
  date: string;
  status: AttendanceStatus;
  marked_by: number | null;
  marked_by_name: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceCreate {
  student: number;
  course_group: number;
  date: string;
  status?: AttendanceStatus;
  notes?: string | null;
}

export interface AttendanceUpdate {
  student?: number;
  course_group?: number;
  date?: string;
  status?: AttendanceStatus;
  notes?: string | null;
}

export interface BulkAttendanceCreate {
  course_group: number;
  date: string;
  attendances: Array<{
    student: number;
    status: AttendanceStatus;
    notes?: string;
  }>;
}

export interface AttendanceListParams {
  course_group?: number;
  date?: string;
  marked_by?: number;
  search?: string;
  status?: AttendanceStatus;
  student?: number;
}
