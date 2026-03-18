import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ArrowRight from '../../assets/icons/arrow-narrow-circle-broken-up-right-svgrepo-com 1.svg';

const SectionWrapper = styled.section`
  background: #fafbfc;
  padding: 60px 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 40px 2rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 30px 1.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: #Fbbf24;
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 28px;
    margin-bottom: 1.5rem;
  }
`;

const SearchBar = styled.div`
  max-width: 600px;
  margin: 0 auto 3rem auto;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 2rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 20px 14px 50px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #132E58;
    box-shadow: 0 0 0 3px rgba(19, 46, 88, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  
  &::before {
    content: '🔍';
    font-size: 18px;
  }
`;

const CategoryGroup = styled.div`
  margin-bottom: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-bottom: 2.5rem;
  }
`;

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const GroupTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #132E58;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 20px;
  }
`;

const JoinButton = styled.button`
  background: #Fbbf24;
  color: #132E58;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  &:hover {
    background: #f4b400;
    transform: translateY(-2px);
  }
  
  img {
    width: 16px;
    height: 16px;
  }
`;

const ForumList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ForumCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #e0e0e0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const LastPoster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #132E58 0%, #0b1b38 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
`;

const PosterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PosterName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #132E58;
`;

const PostTime = styled.span`
  font-size: 12px;
  color: #999;
`;

const ChatIcon = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 32px;
  height: 32px;
  background: #f0f7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '💬';
    font-size: 16px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: static;
    margin-left: auto;
  }
`;

const CardContent = styled.div`
  margin-bottom: 1rem;
`;

const CardTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #132E58;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 16px;
  }
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
`;

const CardMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 13px;
  color: #999;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

interface ForumTopic {
  id: string;
  title: string;
  description: string;
  participants: string;
  replies: string;
  lastPoster: {
    name: string;
    time: string;
    avatar: string;
  };
}

interface CategoryData {
  title: string;
  topics: ForumTopic[];
}

const forumData: CategoryData[] = [
  {
    title: 'Take the Leap. See the Gain.',
    topics: [
      {
        id: '1',
        title: 'Beginners - What is Forex Trading?',
        description: 'A simple guide that explains currency trading, market basics, and how new traders can get started.',
        participants: '8M',
        replies: '1.2M',
        lastPoster: {
          name: 'John Doe',
          time: '2 hours ago',
          avatar: 'JD'
        }
      },
      {
        id: '2',
        title: 'Trading Performance Chat',
        description: 'Sync your account to review your performance, track your profits, and share your results when you want to.',
        participants: '2.1K',
        replies: '975',
        lastPoster: {
          name: 'Jane Smith',
          time: '5 hours ago',
          avatar: 'JS'
        }
      }
    ]
  },
  {
    title: 'Learn Today. Profit Tomorrow.',
    topics: [
      {
        id: '3',
        title: 'Premium Trading Discussion',
        description: 'Premium Trading Discussion is a space for serious traders to share insights, strategies, and market analysis for smarter trading decisions.',
        participants: '45',
        replies: '1.7K',
        lastPoster: {
          name: 'Mike Johnson',
          time: '1 day ago',
          avatar: 'MJ'
        }
      },
      {
        id: '4',
        title: 'Prop Firm Discussions',
        description: 'All about proprietary trading firms, compare funding programs, share your results, and learn how to secure funded accounts.',
        participants: '87',
        replies: '1.9K',
        lastPoster: {
          name: 'Sarah Williams',
          time: '3 days ago',
          avatar: 'SW'
        }
      }
    ]
  },
  {
    title: 'Trade Smart, Win Big.',
    topics: [
      {
        id: '5',
        title: 'Trading Education',
        description: 'Learn from others and post your own educational trading insights.',
        participants: '92',
        replies: '854',
        lastPoster: {
          name: 'David Brown',
          time: '4 hours ago',
          avatar: 'DB'
        }
      },
      {
        id: '6',
        title: 'User Threads',
        description: 'Create your own thread or trading journal and connect with other traders. Share insights, experiences, and ideas - this is your space to shine.',
        participants: '1.5K',
        replies: '2.7K',
        lastPoster: {
          name: 'Emily Davis',
          time: '6 hours ago',
          avatar: 'ED'
        }
      }
    ]
  },
  {
    title: 'Take Action. See Results.',
    topics: [
      {
        id: '7',
        title: 'Crypto Exchanges Chat',
        description: 'Talk platforms, fees, and features. Which crypto exchange reigns supreme? You decide!',
        participants: '1.7K',
        replies: '3.1K',
        lastPoster: {
          name: 'Chris Wilson',
          time: '1 hour ago',
          avatar: 'CW'
        }
      },
      {
        id: '8',
        title: 'XAUUSD Trading',
        description: 'XAUUSD (Gold) Chat is a thread for trading ideas, news, and analysis. Share charts, setups, and your market insights.',
        participants: '89',
        replies: '1.5K',
        lastPoster: {
          name: 'Alex Taylor',
          time: '2 days ago',
          avatar: 'AT'
        }
      }
    ]
  },
  {
    title: 'Step In Today. Lead Tomorrow.',
    topics: [
      {
        id: '9',
        title: 'Advanced Strategies',
        description: 'Discuss advanced trading strategies, risk management, and portfolio optimization techniques.',
        participants: '234',
        replies: '1.2K',
        lastPoster: {
          name: 'Robert Lee',
          time: '8 hours ago',
          avatar: 'RL'
        }
      },
      {
        id: '10',
        title: 'Market Analysis Hub',
        description: 'Share your market analysis, technical indicators, and trading setups with the community.',
        participants: '567',
        replies: '2.3K',
        lastPoster: {
          name: 'Lisa Anderson',
          time: '12 hours ago',
          avatar: 'LA'
        }
      }
    ]
  }
];

const ForumCategories: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleJoinClick = () => {
    navigate('/register');
  };

  const filteredData = forumData.map(category => ({
    ...category,
    topics: category.topics.filter(topic =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.topics.length > 0);

  return (
    <SectionWrapper>
      <ContentWrapper>
        <SectionTitle>Trader Community Forums</SectionTitle>
        
        <SearchBar>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search for a topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>

        {filteredData.map((category, categoryIndex) => (
          <CategoryGroup key={categoryIndex}>
            <GroupHeader>
              <GroupTitle>{category.title}</GroupTitle>
              <JoinButton onClick={handleJoinClick}>
                Join Now
                <img src={ArrowRight} alt="Arrow" />
              </JoinButton>
            </GroupHeader>
            <ForumList>
              {category.topics.map((topic) => (
                <ForumCard key={topic.id} onClick={() => navigate(`/forum/thread/${topic.id}`)}>
                  <CardHeader>
                    <LastPoster>
                      <Avatar>{topic.lastPoster.avatar}</Avatar>
                      <PosterInfo>
                        <PosterName>{topic.lastPoster.name}</PosterName>
                        <PostTime>{topic.lastPoster.time}</PostTime>
                      </PosterInfo>
                    </LastPoster>
                    <ChatIcon />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{topic.title}</CardTitle>
                    <CardDescription>{topic.description}</CardDescription>
                  </CardContent>
                  <CardMeta>
                    <MetaItem>
                      <span>{topic.participants} participants</span>
                    </MetaItem>
                    <MetaItem>
                      <span>{topic.replies} replies</span>
                    </MetaItem>
                  </CardMeta>
                </ForumCard>
              ))}
            </ForumList>
          </CategoryGroup>
        ))}
      </ContentWrapper>
    </SectionWrapper>
  );
};

export default ForumCategories;
