import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Modal,
	Form,
	message,
	Spin,
	Alert,
	Tag,
	Space,
	DatePicker,
	Popconfirm,
} from "antd";
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { PageHeader, FilterPanel } from "../../components/custom";

// Configure dayjs plugins for Ant Design DatePicker
dayjs.extend(weekday);
dayjs.extend(localeData);
import { Table, Input, Button } from "../../components/restyled";
import {
	useAttendanceSessionsQuery,
	useCreateAttendanceSessionMutation,
	usePartialUpdateAttendanceSessionMutation,
	useDeleteAttendanceSessionMutation,
	type AttendanceSession,
	type AttendanceSessionCreate,
} from "../../api";
import styles from "./Attendance.module.css";

const AttendancePage = () => {
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	const [searchTerm, setSearchTerm] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [editingSession, setEditingSession] =
		useState<AttendanceSession | null>(null);
	const [form] = Form.useForm();

	// Queries and mutations
	const {
		data: sessions,
		isLoading,
		error,
	} = useAttendanceSessionsQuery({
		search: searchTerm || undefined,
	});

	const createMutation = useCreateAttendanceSessionMutation(messageApi);
	const updateMutation = usePartialUpdateAttendanceSessionMutation(messageApi);
	const deleteMutation = useDeleteAttendanceSessionMutation(messageApi);

	const handleCreate = () => {
		setEditingSession(null);
		form.resetFields();
		setModalVisible(true);
	};

	const handleEdit = (record: AttendanceSession) => {
		setEditingSession(record);
		form.setFieldsValue({
			...record,
			date: record.date ? dayjs(record.date) : null,
		});
		setModalVisible(true);
	};

	const handleView = (sessionId: number) => {
		navigate(`/attendance/session/${sessionId}`);
	};

	const handleDelete = (id: number) => {
		deleteMutation.mutate(id);
	};

	const handleModalOk = async () => {
		try {
			const values = await form.validateFields();
			const formData = {
				...values,
				date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
			};

			if (editingSession) {
				updateMutation.mutate(
					{
						id: editingSession.id,
						data: { notes: formData.notes, date: formData.date },
					},
					{
						onSuccess: () => {
							setModalVisible(false);
							form.resetFields();
						},
					},
				);
			} else {
				createMutation.mutate(formData as AttendanceSessionCreate, {
					onSuccess: () => {
						setModalVisible(false);
						form.resetFields();
					},
				});
			}
		} catch (error) {
			console.error("Validation failed:", error);
		}
	};

	const handleModalCancel = () => {
		setModalVisible(false);
		form.resetFields();
		setEditingSession(null);
	};

	const columns = [
		{
			title: "Kurs",
			dataIndex: "course_name",
			key: "course_name",
			sorter: (a: AttendanceSession, b: AttendanceSession) =>
				a.course_name.localeCompare(b.course_name),
		},
		{
			title: "Qrup",
			dataIndex: "course_group_name",
			key: "course_group_name",
		},
		{
			title: "Tarix",
			dataIndex: "date",
			key: "date",
			sorter: (a: AttendanceSession, b: AttendanceSession) =>
				new Date(a.date).getTime() - new Date(b.date).getTime(),
			render: (date: string) => dayjs(date).format("DD.MM.YYYY"),
		},
		{
			title: "Ümumi",
			dataIndex: "total_students",
			key: "total_students",
			render: (count: number) => <Tag>{count}</Tag>,
		},
		{
			title: "İştirak",
			dataIndex: "present_count",
			key: "present_count",
			render: (count: number) => <Tag color="success">{count}</Tag>,
		},
		{
			title: "Qalıb",
			dataIndex: "absent_count",
			key: "absent_count",
			render: (count: number) => <Tag color="error">{count}</Tag>,
		},
		{
			title: "Gecikmə",
			dataIndex: "late_count",
			key: "late_count",
			render: (count: number) => <Tag color="warning">{count}</Tag>,
		},
		{
			title: "Bağışlanıb",
			dataIndex: "excused_count",
			key: "excused_count",
			render: (count: number) => <Tag color="blue">{count}</Tag>,
		},
		{
			title: "Yaradıb",
			dataIndex: "created_by_name",
			key: "created_by_name",
		},
		{
			title: "Qeydlər",
			dataIndex: "notes",
			key: "notes",
			ellipsis: true,
			render: (notes: string | null) => notes || "-",
		},
		{
			title: "Əməliyyatlar",
			key: "actions",
			fixed: "right" as const,
			width: 150,
			render: (_: unknown, record: AttendanceSession) => (
				<Space>
					<Button
						type="link"
						icon={<EyeOutlined />}
						onClick={() => handleView(record.id)}
						size="small"
					/>
					<Button
						type="link"
						icon={<EditOutlined />}
						onClick={() => handleEdit(record)}
						size="small"
					/>
					<Popconfirm
						title="Sessiyonu silmək istədiyinizdən əminsiniz?"
						onConfirm={() => handleDelete(record.id)}
						okText="Bəli"
						cancelText="Xeyr"
					>
						<Button type="link" danger icon={<DeleteOutlined />} size="small" />
					</Popconfirm>
				</Space>
			),
		},
	];

	if (error) {
		return (
			<div className={styles.container}>
				<Alert
					message="Xəta"
					description="Davamiyyəti yükləmək mümkün olmadı"
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
				title="Davamiyyət Sessiyaları"
				actions={[
					{
						label: "Yeni Sessiya",
						icon: <PlusOutlined />,
						onClick: handleCreate,
						type: "primary",
					},
				]}
			/>

			<FilterPanel
				filters={{
					search: {
						type: "input",
						placeholder: "Qrup və ya kurs axtar...",
						value: searchTerm,
						onChange: (value) => setSearchTerm((value as string) || ""),
					},
				}}
			/>

			<div className={styles.tableContainer}>
				{isLoading ? (
					<div className={styles.loadingContainer}>
						<Spin size="large" tip="Yüklənir..." />
					</div>
				) : (
					<Table
						columns={columns}
						dataSource={sessions}
						rowKey="id"
						pagination={{
							pageSize: 10,
							showSizeChanger: true,
							showTotal: (total) => `Cəmi: ${total}`,
						}}
						scroll={{ x: 1400 }}
					/>
				)}
			</div>

			<Modal
				title={editingSession ? "Sessiyani Redaktə Et" : "Yeni Sessiya"}
				open={modalVisible}
				onOk={handleModalOk}
				onCancel={handleModalCancel}
				okText="Yadda saxla"
				cancelText="Ləğv et"
				confirmLoading={createMutation.isPending || updateMutation.isPending}
				width={600}
			>
				<Form form={form} layout="vertical" className={styles.form}>
					{!editingSession && (
						<Form.Item
							name="course_group"
							label="Qrup ID"
							rules={[{ required: true, message: "Qrup ID daxil edin" }]}
							tooltip="Qrup seçmək üçün qrup ID-ni daxil edin. Qrup məlumatlarını Qruplar səhifəsindən əldə edə bilərsiniz."
						>
							<Input type="number" placeholder="Qrup ID daxil edin" />
						</Form.Item>
					)}
					<Form.Item
						name="date"
						label="Tarix"
						rules={[{ required: true, message: "Tarix seçin" }]}
					>
						<DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
					</Form.Item>
					<Form.Item name="notes" label="Qeydlər">
						<Input.TextArea rows={3} placeholder="Sessiya üçün qeydlər" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default AttendancePage;
