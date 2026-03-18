import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiLock, FiUnlock } from 'react-icons/fi';
import SimpleModal from '../../../components/AdminPanel/SimpleModal';

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #132E58;
  margin: 0;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $primary }) => ($primary ? '#132E58' : 'white')};
  color: ${({ $primary }) => ($primary ? 'white' : '#132E58')};
  border: 2px solid ${({ $primary }) => ($primary ? '#132E58' : '#e5e7eb')};
  
  &:hover {
    background: ${({ $primary }) => ($primary ? '#1a4a7a' : '#f9fafb')};
    border-color: ${({ $primary }) => ($primary ? '#1a4a7a' : '#132E58')};
    transform: translateY(-2px);
  }
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: #Fbbf24;
  }
`;

const CourseThumbnail = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #132E58 0%, #1a4a7a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
`;

const PremiumBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #Fbbf24;
  color: #132E58;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CourseTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #132E58;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  
  svg {
    color: #Fbbf24;
  }
  
  strong {
    color: #132E58;
    font-weight: 600;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const IconButton = styled.button<{ $danger?: boolean }>`
  flex: 1;
  padding: 0.625rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  background: ${({ $danger }) => ($danger ? '#fee2e2' : '#f3f4f6')};
  color: ${({ $danger }) => ($danger ? '#ef4444' : '#132E58')};
  
  &:hover {
    background: ${({ $danger }) => ($danger ? '#fecaca' : '#e5e7eb')};
  }
`;

const CoursesManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formLessons, setFormLessons] = useState('10');
  const [formDuration, setFormDuration] = useState('4 hours');
  const [formPremium, setFormPremium] = useState(false);

  const [courses, setCourses] = useState([
    {
      id: '1',
      title: 'Forex Trading Basics',
      lessons: 12,
      duration: '4 hours',
      premium: false,
      enrolled: 234,
    },
    {
      id: '2',
      title: 'Advanced Technical Analysis',
      lessons: 20,
      duration: '8 hours',
      premium: true,
      enrolled: 156,
    },
    {
      id: '3',
      title: 'Crypto Trading Mastery',
      lessons: 15,
      duration: '6 hours',
      premium: true,
      enrolled: 89,
    },
  ]);

  return (
    <Container>
      <Header>
        <Title>Courses Management</Title>
        <Button
          $primary
          onClick={() => {
            setModalMode('add');
            setSelectedCourseId(null);
            setFormTitle('');
            setFormLessons('10');
            setFormDuration('4 hours');
            setFormPremium(false);
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
          Create Course
        </Button>
      </Header>

      <CoursesGrid>
        {courses.map((course) => (
          <CourseCard key={course.id}>
            <CourseThumbnail>
              <FiBook />
              {course.premium && <PremiumBadge>Premium</PremiumBadge>}
            </CourseThumbnail>
            <CardContent>
              <CourseTitle>{course.title}</CourseTitle>
              <CourseInfo>
                <InfoItem>
                  <FiBook />
                  <span><strong>{course.lessons}</strong> Lessons</span>
                </InfoItem>
                <InfoItem>
                  <span>Duration: <strong>{course.duration}</strong></span>
                </InfoItem>
                <InfoItem>
                  <span>Enrolled: <strong>{course.enrolled}</strong> Students</span>
                </InfoItem>
              </CourseInfo>
              <ActionButtons>
                <IconButton
                  onClick={() => {
                    setModalMode('edit');
                    setSelectedCourseId(course.id);
                    setFormTitle(course.title);
                    setFormLessons(String(course.lessons));
                    setFormDuration(course.duration);
                    setFormPremium(!!course.premium);
                    setIsModalOpen(true);
                  }}
                >
                  <FiEdit2 />
                  Edit
                </IconButton>
                <IconButton
                  $danger
                  onClick={() => {
                    setModalMode('delete');
                    setSelectedCourseId(course.id);
                    setIsModalOpen(true);
                  }}
                >
                  <FiTrash2 />
                  Delete
                </IconButton>
              </ActionButtons>
            </CardContent>
          </CourseCard>
        ))}
      </CoursesGrid>

      <SimpleModal
        isOpen={isModalOpen}
        title={modalMode === 'add' ? 'Create Course' : modalMode === 'edit' ? 'Edit Course' : 'Delete Course'}
        onClose={() => setIsModalOpen(false)}
        footer={
          modalMode === 'delete' ? (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                $danger
                onClick={() => {
                  if (!selectedCourseId) return;
                  setCourses((prev) => prev.filter((c) => c.id !== selectedCourseId));
                  setIsModalOpen(false);
                }}
              >
                <FiTrash2 />
                Delete
              </IconButton>
            </>
          ) : (
            <>
              <IconButton onClick={() => setIsModalOpen(false)}>Cancel</IconButton>
              <IconButton
                onClick={() => {
                  const title = formTitle.trim();
                  if (!title) return;
                  const lessons = Number(formLessons) || 0;

                  if (modalMode === 'add') {
                    const id = String(Date.now());
                    setCourses((prev) => [
                      {
                        id,
                        title,
                        lessons,
                        duration: formDuration,
                        premium: formPremium,
                        enrolled: 0,
                      },
                      ...prev,
                    ]);
                  } else if (modalMode === 'edit' && selectedCourseId) {
                    setCourses((prev) =>
                      prev.map((c) =>
                        c.id === selectedCourseId
                          ? { ...c, title, lessons, duration: formDuration, premium: formPremium }
                          : c
                      )
                    );
                  }

                  setIsModalOpen(false);
                }}
              >
                <FiEdit2 />
                Save
              </IconButton>
            </>
          )
        }
      >
        {modalMode === 'delete' ? (
          <div style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>
            Are you sure you want to delete this course?
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Title</div>
              <input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Lessons</div>
              <input
                value={formLessons}
                onChange={(e) => setFormLessons(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label>
              <div style={{ fontWeight: 700, color: '#132E58', marginBottom: 6 }}>Duration</div>
              <input
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: 10, border: '2px solid #e5e7eb', outline: 'none' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={formPremium} onChange={(e) => setFormPremium(e.target.checked)} />
              <span style={{ fontWeight: 600, color: '#132E58' }}>Premium</span>
            </label>
          </div>
        )}
      </SimpleModal>
    </Container>
  );
};

export default CoursesManagement;
