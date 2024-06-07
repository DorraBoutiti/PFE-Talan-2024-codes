// material-ui
//import { Typography } from '@mui/material';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import './embed.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| PROD PAGE ||============================== //

const Prod = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch user profile to check department
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                const depList = ['RH','PRODUCTION'];
                if (!depList.includes(data.dep)) {
                    
                    navigate('/dep/dep-unauthorized');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                alert('Error fetching user profile.');
                navigate('/dep/dep-unauthorized');
            }
        };

        if (token) {
            fetchUserProfile();
        } else {
            
            navigate('/dep/dep-unauthorized');
        }
    }, [navigate]);

    return (
        <MainCard title="Sample Card">
            <iframe
                title="Prod"
                width="1100"
                height="800"
                src="https://app.powerbi.com/reportEmbed?reportId=f51426e2-e08d-4325-9a74-a83eb60dfc91&autoAuth=true&ctid=6f07f79b-03b1-44e1-b221-7fa1001b22ac"
                frameBorder="0"
                allowFullScreen="true"
            ></iframe>
            <PowerBIEmbed
                embedConfig={{
                    type: 'report', // Supported types: report, dashboard, tile, visual, qna, paginated report and create
                    id: 'c8b3e3ff-e7f5-4be0-a8a1-80d5151a9cda',
                    embedUrl:
                        'https://app.powerbi.com/reportEmbed?reportId=c8b3e3ff-e7f5-4be0-a8a1-80d5151a9cda&groupId=23dcb2d4-8166-4227-92ca-5318b44f3283&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLU5PUlRILUVVUk9QRS1ILVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d',
                    accessToken:
                        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNmYwN2Y3OWItMDNiMS00NGUxLWIyMjEtN2ZhMTAwMWIyMmFjLyIsImlhdCI6MTcxNTMzODMzMiwibmJmIjoxNzE1MzM4MzMyLCJleHAiOjE3MTUzNDIzODksImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84V0FBQUFETG45ZStRem1QZWc3bm5sVDFoTC9iOVpvSkF2VFAzWXJzdGVGZWU5ekt3YzJWK09wbzlWWjRNOWtpbUppQXlVNEJkVzNnRG5DdkNpY1ZnVFRYN0JzbGp5UnlWMjB0WUFYd3VyUEtMSnJCcz0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJCUkFISU0iLCJnaXZlbl9uYW1lIjoiVEFXRklLIiwiaXBhZGRyIjoiMTk2LjE3OS4yMTcuMTMwIiwibmFtZSI6IlRBV0ZJSyBCUkFISU0iLCJvaWQiOiIwMWM0ZmZhMy02MDE2LTRlNjctOWQ0Mi00OTExZTBhODY0OTEiLCJwdWlkIjoiMTAwMzIwMDM0QjY0RkE2NiIsInJoIjoiMC5BWG9BbV9jSGI3RUQ0VVN5SVgtaEFCc2lyQWtBQUFBQUFBQUF3QUFBQUFBQUFBQjZBSUEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiUHVmdG5nam40c2Y0M1o2Slo0MTBjUEJ0SHI1VkFCTmlxZ0ttbDEza3RwRSIsInRpZCI6IjZmMDdmNzliLTAzYjEtNDRlMS1iMjIxLTdmYTEwMDFiMjJhYyIsInVuaXF1ZV9uYW1lIjoidGF3ZmlrLmJyYWhpbUB0YWxhbi5jb20iLCJ1cG4iOiJ0YXdmaWsuYnJhaGltQHRhbGFuLmNvbSIsInV0aSI6IlpaN0Q5a004dFV1MDB6TjVUaTJEQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.dCRSVFwG4a0d_qRtxHaRT714Sip4XQuKFRYxtUj6khi2D3HZdRce5XTMX6H9xzB1QTWYp0-kaCoTyp1IzIBbTmIfVXgRde-oqYqUynKjNctA1B-OYLmcV7E1kHCtEgmmtkslghYt57XygPBr0OPRL7spQhXEAznxg0ZaE9-LAxTOYiGsUd0rJwstGFH6zNob3tqOxqeuSoD5Cxi8nIF8fyaYZv_lDe9weuE1_yr9TL2QLFFP5LlH7lVzCUjihF532o2l15qaOI0RVCndrGU01-YEIM9Jt2M8_iI1TnE_2IYMJTIdAuPlX6N6VXXZBBme0otlmwibbI726zwuRFtWcg',
                    tokenType: models.TokenType.Aad, // Use models.TokenType.Aad or .Embed for AAD tokens or Embed tokens
                    settings: {
                        panes: {
                            filters: {
                                expanded: true,
                                visible: false
                            }
                        },
                        navContentPaneEnabled: false,
                        background: models.BackgroundType.Default
                    }
                }}
                eventHandlers={
                    new Map([
                        ['loaded', function () { console.log('Report loaded'); }],
                        ['rendered', function () { console.log('Report rendered'); }],
                        ['error', function (event) { console.log(event.detail); }],
                        ['visualClicked', () => console.log('visual clicked')],
                        ['pageChanged', (event) => console.log(event)],
                    ])
                }
                cssClassName={"Embed"}
                getEmbeddedComponent={(embeddedReport) => {
                    window.report = embeddedReport;
                }}
            />
        </MainCard>
    );
};

export default Prod;
