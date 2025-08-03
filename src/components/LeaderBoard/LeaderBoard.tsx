import {
    Container,
    SearchWrapper,
    SearchInput,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableData,
    UserInfo,
    Avatar,
    Username,
    Pagination,
    PageButton,
    AccountLink,
} from "./LeaderBoard.styled";


const data = [
    {
        id: 1,
        username: "Via",
        flag: "https://flagcdn.com/w40/mz.png",
        account: "Contest Account 352819",
        equity: "18,830.30",
        openProfit: "0.00",
        profitPercent: "2,117.90%",
        peakDrawdown: "83.20%",
        calculatedTrades: 28,
        excludedTrades: 0,
    },
    {
        id: 2,
        username: "Mohmi",
        flag: "https://flagcdn.com/w40/ae.png",
        account: "Contest Account 353810",
        equity: "20,230.30",
        openProfit: "17,222.20",
        profitPercent: "1,927.80%",
        peakDrawdown: "86.10%",
        calculatedTrades: 19,
        excludedTrades: 0,
    },
    // Add more rows as needed...
];




const Leaderboard = () => {
    return (
        <Container>
            <SearchWrapper>
                <SearchInput placeholder="Search" />
            </SearchWrapper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>#</TableHeader>
                        <TableHeader>User</TableHeader>
                        <TableHeader>Country</TableHeader>
                        <TableHeader>Account</TableHeader>
                        <TableHeader>Equity</TableHeader>
                        <TableHeader>Open Profit</TableHeader>
                        <TableHeader>Profit %</TableHeader>
                        <TableHeader>Peak Drawdown</TableHeader>
                        <TableHeader>Calculated Trades</TableHeader>
                        <TableHeader>Excluded Trades</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((user, index) => (
                        <TableRow key={user.id}>
                            <TableData>{index + 1}</TableData>
                            <TableData>
                                <UserInfo>
                                    <Avatar src={user.flag} alt="country flag" />
                                    <Username>{user.username}</Username>
                                </UserInfo>
                            </TableData>
                            <TableData>
                                <Avatar src={user.flag} alt="flag" />
                            </TableData>
                            <TableData>
                                <AccountLink>{user.account}</AccountLink>
                            </TableData>
                            <TableData>{user.equity}</TableData>
                            <TableData>{user.openProfit}</TableData>
                            <TableData>{user.profitPercent}</TableData>
                            <TableData>{user.peakDrawdown}</TableData>
                            <TableData>{user.calculatedTrades}</TableData>
                            <TableData>{user.excludedTrades}</TableData>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination>
                <PageButton>{'<'}</PageButton>
                <PageButton active>1</PageButton>
                <PageButton>2</PageButton>
                <PageButton>3</PageButton>
                <PageButton>...</PageButton>
                <PageButton>15</PageButton>
                <PageButton>{'>'}</PageButton>
            </Pagination>
        </Container>
    );
};

export default Leaderboard;
