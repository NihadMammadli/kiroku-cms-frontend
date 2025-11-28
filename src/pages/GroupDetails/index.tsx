import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, Spin, Alert, Card, Descriptions, Tag, Progress, Row, Col, Statistic } from "antd";
import {
	ArrowLeftOutlined,
	CheckSquareOutlined,
	BookOutlined,
	TrophyOutlined,
	TeamOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../components/custom";
import { useCourseGroupQuery } from "../../api";
import GroupAttendance from "./GroupAttendance.tsx";
import GroupSyllabus from "./GroupSyllabus.tsx";
import GroupGrades from "./GroupGrades.tsx";
import styles from "./GroupDetails.module.css";
import dayjs from "dayjs";

const GroupDetails: React.FC = () => {
	const { groupId } = useParams<{ groupId: string }>();
	const navigate = useNavigate();

	const {
		data: group,
		isLoading,
		error,
	} = useCourseGroupQuery(Number(groupId));

	if (isLoading) {
		return (
			<div className={styles.container}>
				<div className={styles.loadingContainer}>
					<Spin size="large" tip="Yüklənir..." />
				</div>
			</div>
		);
	}

	if (error || !group) {
		return (
			<div className={styles.container}>
				<Alert
					message="Xəta"
					description="Qrup məlumatlarını yükləmək mümkün olmadı"
					type="error"
					showIcon
				/>
			</div>
		);
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "ACTIVE":
				return "success";
			case "UPCOMING":
				return "processing";
			case "COMPLETED":
				return "default";
			case "CANCELLED":
				return "error";
			default:
				return "default";
		}
	};

	const tabItems = [
		{
			key: "attendance",
			label: (
				<span>
					<CheckSquareOutlined />
					Davamiyyət
				</span>
			),
			children: <GroupAttendance groupId={Number(groupId)} />,
		},
		{
			key: "syllabus",
			label: (
				<span>
					<BookOutlined />
					Sillabus
				</span>
			),
			children: <GroupSyllabus groupId={Number(groupId)} />,
		},
		{
			key: "grades",
			label: (
				<span>
					<TrophyOutlined />
					Qiymətlər
				</span>
			),
			children: <GroupGrades groupId={Number(groupId)} />,
		},
	];

	return (
		<div className={styles.container}>
			<PageHeader
				title={group.name}
				subtitle={group.code}
				actions={[
					{
						label: "Geri",
						icon: <ArrowLeftOutlined />,
						onClick: () => navigate(-1),
						type: "default",
					},
				]}
				extra={[
					<Tag key="status" color={getStatusColor(group.status)} style={{ fontSize: "14px", padding: "4px 10px" }}>
						{group.status}
					</Tag>
				]}
			/>

			<div className={styles.content}>
				<Card className={styles.detailsCard} bordered={false} style={{ marginBottom: 24 }}>
					<Row gutter={[24, 24]}>
						<Col span={24} md={16}>
							<Descriptions title="Qrup Məlumatları" column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
								<Descriptions.Item label="Kurs">{group.course_name}</Descriptions.Item>
								<Descriptions.Item label="Filial">{group.branch_name}</Descriptions.Item>
								<Descriptions.Item label="Müəllim">
									{group.teacher?.map(t => t.full_name).join(", ") || "-"}
								</Descriptions.Item>
								<Descriptions.Item label="Cədvəl">{group.schedule_display}</Descriptions.Item>
								<Descriptions.Item label="Başlama tarixi">
									{dayjs(group.start_date).format("DD.MM.YYYY")}
								</Descriptions.Item>
								<Descriptions.Item label="Bitmə tarixi">
									{dayjs(group.end_date).format("DD.MM.YYYY")}
								</Descriptions.Item>
								<Descriptions.Item label="Aylıq ödəniş">{group.monthly_price} AZN</Descriptions.Item>
							</Descriptions>
						</Col>
						<Col span={24} md={8}>
							<Card type="inner" title="Tələbə Sayı" size="small">
								<Row gutter={16} align="middle">
									<Col span={12}>
										<Statistic
											title="Qeydiyyatdan keçən"
											value={group.enrolled_count}
											suffix={`/ ${group.max_students}`}
											prefix={<TeamOutlined />}
										/>
									</Col>
									<Col span={12}>
										<Progress
											type="circle"
											percent={Math.round((group.enrolled_count / group.max_students) * 100)}
											width={80}
											status={group.is_full ? "exception" : "active"}
										/>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
				</Card>

				<Card bordered={false}>
					<Tabs items={tabItems} defaultActiveKey="attendance" />
				</Card>
			</div>
		</div>
	);
};

export default GroupDetails;
