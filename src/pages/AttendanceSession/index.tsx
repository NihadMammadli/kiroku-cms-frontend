import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Spin,
	Alert,
	Tag,
	Space,
	Button,
	Card,
	Descriptions,
	message,
} from "antd";
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { PageHeader } from "../../components/custom";
import { Table, Select } from "../../components/restyled";
import {
	useAttendanceSessionQuery,
	useBulkUpdateAttendanceMutation,
	type AttendanceStatus,
	type Attendance,
	type BulkAttendanceUpdate,
} from "../../api";
import styles from "./AttendanceSession.module.css";

const AttendanceSessionPage = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	const [localAttendance, setLocalAttendance] = useState<
		Record<number, { status: AttendanceStatus; notes?: string }>
	>({});
	const [hasChanges, setHasChanges] = useState(false);

	const {
		data: session,
		isLoading: sessionLoading,
		error: sessionError,
	} = useAttendanceSessionQuery(Number(sessionId));

	const bulkUpdateMutation = useBulkUpdateAttendanceMutation(messageApi);

	// Initialize local state when session data loads
	useEffect(() => {
		if (session?.attendance_records) {
			const initial: Record<
				number,
				{ status: AttendanceStatus; notes?: string }
			> = {};
			session.attendance_records.forEach((record) => {
				initial[record.id] = {
					status: record.status,
					notes: record.notes || undefined,
				};
			});
			setLocalAttendance(initial);
			setHasChanges(false);
		}
	}, [session]);

	const handleStatusChange = (
		attendanceId: number,
		status: AttendanceStatus,
	) => {
		setLocalAttendance((prev) => ({
			...prev,
			[attendanceId]: { ...prev[attendanceId], status },
		}));
		setHasChanges(true);
	};

	const handleSaveChanges = () => {
		const updates: BulkAttendanceUpdate[] = Object.entries(localAttendance).map(
			([id, data]) => ({
				attendance_id: Number(id),
				status: data.status,
				notes: data.notes || "",
			}),
		);

		bulkUpdateMutation.mutate(
			{
				sessionId: Number(sessionId),
				data: { updates },
			},
			{
				onSuccess: () => {
					setHasChanges(false);
				},
			},
		);
	};

	const statusOptions = [
		{ label: "İştirak edib", value: "PRESENT" },
		{ label: "Qalıb", value: "ABSENT" },
		{ label: "Gecikmə", value: "LATE" },
		{ label: "Bağışlanıb", value: "EXCUSED" },
	];

	const statusLabels: Record<AttendanceStatus, string> = {
		PRESENT: "İştirak edib",
		ABSENT: "Qalıb",
		LATE: "Gecikmə",
		EXCUSED: "Bağışlanıb",
	};

	const statusColors: Record<AttendanceStatus, string> = {
		PRESENT: "success",
		ABSENT: "error",
		LATE: "warning",
		EXCUSED: "blue",
	};

	const statusIcons: Record<AttendanceStatus, React.ReactNode> = {
		PRESENT: <CheckCircleOutlined />,
		ABSENT: <CloseCircleOutlined />,
		LATE: <ClockCircleOutlined />,
		EXCUSED: <ExclamationCircleOutlined />,
	};

	const columns = [
		{
			title: "Tələbə",
			dataIndex: "student_name",
			key: "student_name",
			sorter: (a: Attendance, b: Attendance) =>
				a.student_name.localeCompare(b.student_name),
		},
		{
			title: "Email",
			dataIndex: "student_email",
			key: "student_email",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (_: unknown, record: Attendance) => {
				const currentStatus =
					localAttendance[record.id]?.status || record.status;
				return (
					<Tag
						color={statusColors[currentStatus]}
						icon={statusIcons[currentStatus]}
					>
						{statusLabels[currentStatus]}
					</Tag>
				);
			},
		},
		{
			title: "Qeyd edən",
			dataIndex: "marked_by_name",
			key: "marked_by_name",
			render: (name: string | null) => name || "-",
		},
		{
			title: "Əməliyyatlar",
			key: "actions",
			width: 200,
			render: (_: unknown, record: Attendance) => (
				<Select
					value={localAttendance[record.id]?.status || record.status}
					onChange={(value) =>
						handleStatusChange(record.id, value as AttendanceStatus)
					}
					options={statusOptions}
					style={{ width: 150 }}
				/>
			),
		},
	];

	if (sessionLoading) {
		return (
			<div className={styles.container}>
				<div className={styles.loadingContainer}>
					<Spin size="large" />
				</div>
			</div>
		);
	}

	if (sessionError || !session) {
		return (
			<div className={styles.container}>
				<Alert
					message="Xəta"
					description="Sessiya məlumatlarını yükləmək mümkün olmadı"
					type="error"
					showIcon
				/>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			{contextHolder}
			<PageHeader
				title={`Davamiyyət Sessiyası - ${dayjs(session.date).format("DD.MM.YYYY")}`}
				subtitle={`${session.course_name} - ${session.course_group_name}`}
				actions={[
					{
						label: "Geri",
						icon: <ArrowLeftOutlined />,
						onClick: () => navigate(-1),
						type: "default",
					},
				]}
			/>

			<Card className={styles.sessionInfo}>
				<Descriptions title="Sessiya Məlumatları" column={2}>
					<Descriptions.Item label="Tarix">
						{dayjs(session.date).format("DD MMMM YYYY")}
					</Descriptions.Item>
					<Descriptions.Item label="Yaradıb">
						{session.created_by_name}
					</Descriptions.Item>
					<Descriptions.Item label="Ümumi Tələbələr">
						{session.total_students}
					</Descriptions.Item>
					<Descriptions.Item label="İştirak edib">
						<Tag color="success">{session.present_count}</Tag>
					</Descriptions.Item>
					<Descriptions.Item label="Qalıb">
						<Tag color="error">{session.absent_count}</Tag>
					</Descriptions.Item>
					<Descriptions.Item label="Gecikmə">
						<Tag color="warning">{session.late_count}</Tag>
					</Descriptions.Item>
					<Descriptions.Item label="Bağışlanıb">
						<Tag color="blue">{session.excused_count}</Tag>
					</Descriptions.Item>
					{session.notes && (
						<Descriptions.Item label="Qeydlər" span={2}>
							{session.notes}
						</Descriptions.Item>
					)}
				</Descriptions>

				{hasChanges && (
					<div className={styles.actions}>
						<Button
							type="primary"
							icon={<SaveOutlined />}
							onClick={handleSaveChanges}
							loading={bulkUpdateMutation.isPending}
						>
							Dəyişiklikləri Yadda Saxla
						</Button>
					</div>
				)}
			</Card>

			<Card className={styles.studentsCard}>
				<div className={styles.studentsHeader}>
					<h3>Tələbələr</h3>
					<Space>
						<Tag>Ümumi: {session.total_students}</Tag>
						<Tag color="green">İştirak edib: {session.present_count}</Tag>
						<Tag color="error">Qalıb: {session.absent_count}</Tag>
						<Tag color="warning">Gecikmə: {session.late_count}</Tag>
						<Tag color="blue">Bağışlanıb: {session.excused_count}</Tag>
					</Space>
				</div>
				<Table
					columns={columns}
					dataSource={session.attendance_records}
					rowKey="id"
					pagination={{
						pageSize: 20,
						showSizeChanger: true,
						showTotal: (total) => `Cəmi: ${total}`,
					}}
				/>
			</Card>
		</div>
	);
};

export default AttendanceSessionPage;
